// utils/activityImport.ts   (NEW FILE - use THIS version, not the earlier one)
import * as XLSX from 'xlsx';
import type { AttractionData } from '@/utils/srmStorage';

/* ---------- 1. FIELDS + HEADER ALIASES (add new spellings here only) ---------- */
export type ActivityField =
  | 'activityId' | 'name' | 'type' | 'city' | 'country' | 'suggestedSlot'
  | 'startTime' | 'duration' | 'pickupLocation' | 'description';

// Manual column choices from the preview modal. Key = normalized header text.
export type Overrides = Record<string, ActivityField | 'ignore'>;

// keys are lowercase letters/digits only: "Activity_ID" and "Activity ID" both become "activityid"
const ALIASES: Record<ActivityField, string[]> = {
  activityId:     ['activityid', 'id', 'activitycode', 'code', 'actid'],
  name:           ['activityname', 'name', 'activity', 'tourname', 'title'],
  type:           ['type', 'activitytype', 'category'],
  city:           ['city', 'town', 'cityname'],
  country:        ['country', 'countryname'],
  suggestedSlot:  ['timeslot', 'slot', 'suggestedslot', 'daypart'],
  startTime:      ['starttime', 'start', 'time'],
  duration:       ['duration', 'length'],
  pickupLocation: ['pickuplocation', 'pickup', 'pickuppoint', 'meetingpoint'],
  description:    ['description', 'overview', 'details', 'about'],
};
export const ACTIVITY_FIELDS = Object.keys(ALIASES) as ActivityField[];

const EXACT = new Map<string, ActivityField>();
ACTIVITY_FIELDS.forEach(f => ALIASES[f].forEach(a => EXACT.set(a, f)));

/* ---------- 2. TYPES ---------- */
export type ActivityRowData = Record<Exclude<ActivityField, 'activityId'>, string>;

export interface ParsedActivityRow {
  rowNumber: number;       // Excel row number
  fileId: string;          // cleaned Activity ID from the file ('' = none)
  data: ActivityRowData;   // '' = cell empty / not usable
  warnings: string[];
  errors: string[];        // row is skipped
}
export interface ActivityImportResult {
  rows: ParsedActivityRow[];
  mappedColumns: { header: string; field: ActivityField }[];
  ignoredColumns: string[];   // e.g. old "Rating" / "Reviews Count" columns
  fatal?: string;
}

/* ---------- 3. HELPERS ---------- */
export const norm = (v: unknown) => String(v ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
const clean = (v: unknown) => String(v ?? '').trim();
const capWords = (s: string) =>
  s.split(/\s+/).filter(Boolean).map(w =>
    w.length <= 3 && w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  ).join(' ');

// Must match ACTIVITY_ID_PREFIX in app/lib/activityId.ts (that file is server-only, so it is repeated here)
const ID_PREFIX = 'Act_';
const ID_FORMAT = /^act_(\d+)$/i;

// "act_1" -> "Act_0001". Anything else (e.g. "Acti_0003") is reported as invalid.
function canonicalId(raw: string): { id: string; valid: boolean } {
  const s = raw.trim();
  if (!s) return { id: '', valid: true };
  const m = ID_FORMAT.exec(s);
  if (!m) return { id: s, valid: false };
  return { id: `${ID_PREFIX}${String(parseInt(m[1], 10)).padStart(4, '0')}`, valid: true };
}

// "10:00", "9:30", "9.30", "9:30 PM" -> "HH:mm", or null when not understood
function normTime(raw: string): string | null {
  const m = /^(\d{1,2})[:.](\d{2})(?::\d{2})?\s*(am|pm)?$/i.exec(raw.trim());
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3]?.toLowerCase();
  if (ap === 'pm' && h < 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

const TYPES = ['Monument', 'Attraction', 'Museum', 'Adventure', 'Show', 'None'];

/* ---------- 4. HEADER ROW DETECTION ---------- */
interface HeaderInfo {
  fieldCol: Partial<Record<ActivityField, number>>;
  mapped: { header: string; field: ActivityField }[];
  ignored: string[];
}

// A header row = has "name" + at least 2 more known columns (title banners / data rows never match)
function detectHeader(row: any[], overrides: Overrides): HeaderInfo | null {
  const fieldCol: HeaderInfo['fieldCol'] = {};
  const mapped: HeaderInfo['mapped'] = [];
  const ignored: string[] = [];
  row.forEach((cell, idx) => {
    const text = clean(cell);
    if (!text) return;
    const n = norm(text);
    const o = overrides[n];
    const f = o === 'ignore' ? undefined : (o ?? EXACT.get(n));
    if (f && fieldCol[f] === undefined) { fieldCol[f] = idx; mapped.push({ header: text, field: f }); }
    else ignored.push(text);
  });
  if (fieldCol.name === undefined || mapped.length < 3) return null;
  return { fieldCol, mapped, ignored };
}

/* ---------- 5. ONE ROW -> CLEAN ROW ---------- */
function buildRow(get: (f: ActivityField) => string, rowNumber: number, seenIds: Map<string, number>): ParsedActivityRow {
  const warnings: string[] = [];
  const errors: string[] = [];

  const name = get('name');
  const city = get('city');
  const country = capWords(get('country'));
  if (!name) errors.push('Missing activity name');
  if (!city) errors.push('Missing city');
  if (!country) errors.push('Missing country');

  // Activity ID
  // const idRaw = get('activityId');
  // const { id, valid } = canonicalId(idRaw);
  // if (idRaw && !valid) {
  //   errors.push(`Invalid Activity ID "${idRaw}" - expected a format like Act_0001 (fix it, or leave it blank to auto-generate)`);
  // } else if (id) {
  //   const first = seenIds.get(id.toLowerCase());
  //   if (first !== undefined) errors.push(`Duplicate Activity ID ${id} (already used on row ${first})`);
  //   else seenIds.set(id.toLowerCase(), rowNumber);
  // }

  // Activity ID
  const idRaw = get('activityId');
  const { id, valid } = canonicalId(idRaw);
  
  // 🌟 FIX 4: Require Activity ID in Excel Import
  if (!idRaw || idRaw.trim() === '') {
    errors.push('Missing Activity ID - a unique ID is now strictly required.');
  } else if (!valid) {
    errors.push(`Invalid Activity ID "${idRaw}" - expected a format like Act_0001`);
  } else if (id) {
    const first = seenIds.get(id.toLowerCase());
    if (first !== undefined) errors.push(`Duplicate Activity ID ${id} (already used on row ${first})`);
    else seenIds.set(id.toLowerCase(), rowNumber);
  }


  // Type: known value, or empty (empty = keep stored value / default to None when creating)
  const typeRaw = get('type');
  const typeMatch = TYPES.find(t => t.toLowerCase() === typeRaw.toLowerCase());
  if (typeRaw && !typeMatch) warnings.push(`Unknown type "${typeRaw}" - ignored`);

  // Start time
  let startTime = get('startTime');
  if (startTime) {
    const t = normTime(startTime);
    if (t) startTime = t;
    else { warnings.push(`Start time "${startTime}" not understood - ignored`); startTime = ''; }
  }

  return {
    rowNumber, fileId: valid ? id : '', warnings, errors,
    data: {
      name, city, country,
      type: typeMatch ?? '',
      suggestedSlot: get('suggestedSlot'),
      startTime,
      duration: get('duration'),
      pickupLocation: get('pickupLocation'),
      description: get('description'),
    },
  };
}

/* ---------- 6. READ THE FILE ---------- */
export async function parseActivityFile(file: File, overrides: Overrides = {}): Promise<ActivityImportResult> {
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });   // array buffer keeps accents intact
  const rows: ParsedActivityRow[] = [];
  const mapped = new Map<string, { header: string; field: ActivityField }>();
  const ignored = new Set<string>();
  const seenIds = new Map<string, number>();
  let foundHeader = false;

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    if (!ws || !ws['!ref']) continue;
    const offset = XLSX.utils.decode_range(ws['!ref']).s.r;            // so row numbers match Excel
    const grid = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '', raw: false, blankrows: true });

    let header: HeaderInfo | null = null;
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      const found = detectHeader(row, overrides);
      if (found) {
        header = found; foundHeader = true;
        found.mapped.forEach(m => mapped.set(norm(m.header), m));
        found.ignored.forEach(x => ignored.add(x));
        continue;
      }
      if (!header || row.every(c => clean(c) === '')) continue;
      const h = header;
      const get = (f: ActivityField) => (h.fieldCol[f] !== undefined ? clean(row[h.fieldCol[f]!]) : '');
      rows.push(buildRow(get, offset + i + 1, seenIds));
    }
  }

  if (!foundHeader) {
    return { rows: [], mappedColumns: [], ignoredColumns: [],
      fatal: 'No header row found. The file needs "Activity Name" plus at least two more known columns (City, Country, Type...).' };
  }
  return { rows, mappedColumns: [...mapped.values()], ignoredColumns: [...ignored] };
}

/* ---------- 7. DECIDE: create / update / skip ---------- */
export interface PlanTask { row: ParsedActivityRow; action: 'create' | 'update'; existing?: AttractionData }
export interface PlanIssue { rowNumber: number; name: string; messages: string[] }
export interface PlanResult { tasks: PlanTask[]; issues: PlanIssue[] }

const nameCityKey = (name: string, city: string) => `${norm(name)}|${norm(city)}`;

export function planActivityImport(rows: ParsedActivityRow[], existing: AttractionData[]): PlanResult {
  const byId = new Map<string, AttractionData>();
  const byKey = new Map<string, AttractionData>();
  existing.forEach(a => {
    if (a.activityId) byId.set(a.activityId.toLowerCase(), a);
    byKey.set(nameCityKey(a.name, a.city), a);
  });

  const tasks: PlanTask[] = [];
  const issues: PlanIssue[] = [];
  const touched = new Set<string>();   // existing activities already updated by an earlier row
  const newKeys = new Set<string>();   // name+city already queued for creation

  for (const row of rows) {
    const bad = (...messages: string[]) => issues.push({ rowNumber: row.rowNumber, name: row.data.name, messages });
    if (row.errors.length) { bad(...row.errors); continue; }

    const k = nameCityKey(row.data.name, row.data.city);
    let match: AttractionData | undefined;

    if (row.fileId) {
      match = byId.get(row.fileId.toLowerCase());
      if (match && norm(match.city) !== norm(row.data.city)) {
        bad(`${row.fileId} already belongs to "${match.name}" (${match.city}) in the system`); continue;
      }
      if (!match && byKey.has(k)) {
        const c = byKey.get(k)!;
        bad(`Same name + city already exists as ${c.activityId || 'an activity without an ID'} - use that ID or leave the ID blank`); continue;
      }
    } else {
      match = byKey.get(k);   // no ID in the file: fall back to name + city
    }

    if (match) {
      const mid = match.activityId || match._id || '';
      if (touched.has(mid)) { bad('This activity appears twice in the file'); continue; }
      touched.add(mid);
      tasks.push({ row, action: 'update', existing: match });
    } else {
      if (newKeys.has(k)) { bad('Same name + city appears twice in the file'); continue; }
      newKeys.add(k);
      tasks.push({ row, action: 'create' });
    }
  }
  return { tasks, issues };
}

/* ---------- 8. BUILD WHAT GETS SAVED ---------- */
export function buildActivityPayload(task: PlanTask): any {
  // keep only cells that had a value, so empty cells never blank stored data
  const filled: Record<string, string> = {};
  (Object.keys(task.row.data) as (keyof ActivityRowData)[]).forEach(k => {
    if (task.row.data[k] !== '') filled[k] = task.row.data[k];
  });

  if (task.action === 'update') {
    const merged: any = { ...task.existing, ...filled };   // image, supplier, status, guide flag stay untouched
    if (!merged.linkedSupplierId) delete merged.linkedSupplierId;   // empty ObjectId breaks Mongoose
    return merged;                                          // the server ignores activityId on updates
  }

  return {
    type: 'None', suggestedSlot: 'Morning', startTime: '09:00', duration: '2 Hours',
    pickupLocation: '', description: '',
    ...filled,
    ...(task.row.fileId ? { activityId: task.row.fileId } : {}),   // no ID -> the server generates Act_####
    status: 'Active', imageUrl: '', isGuideRequired: false,
  };
}

/* ---------- 9. RUN SAVES WITH LIMITED PARALLELISM ---------- */
export async function runPool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) { const item = items[i++]; await worker(item); }
    })
  );
}