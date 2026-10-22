// utils/mealImport.ts
import * as XLSX from 'xlsx';
import type { MealData } from '@/utils/srmStorage';

export type MealField = 'restaurantName' | 'cuisine' | 'city' | 'country' | 'address' | 'description';

export type Overrides = Record<string, MealField | 'ignore'>;

const ALIASES: Record<MealField, string[]> = {
  restaurantName: ['restaurantname', 'restaurant', 'name', 'property', 'mealname'],
  cuisine:        ['cuisine', 'cuisinetype', 'food', 'foodtype'],
  city:           ['city', 'town', 'location'],
  country:        ['country', 'nation'],
  address:        ['address', 'fulladdress', 'street'],
  description:    ['description', 'about', 'overview', 'details'],
};

export const MEAL_FIELDS = Object.keys(ALIASES) as MealField[];

const EXACT = new Map<string, MealField>();
MEAL_FIELDS.forEach(f => ALIASES[f].forEach(a => EXACT.set(a, f)));

export type MealRowData = Record<MealField, string>;

export interface ParsedMealRow {
  rowNumber: number;
  data: MealRowData;
  warnings: string[];
  errors: string[];
}

export interface MealImportResult {
  rows: ParsedMealRow[];
  mappedColumns: { header: string; field: MealField }[];
  ignoredColumns: string[];
  fatal?: string;
}

export const norm = (v: unknown) => String(v ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
const clean = (v: unknown) => String(v ?? '').trim();
const capWords = (s: string) =>
  s.split(/\s+/).filter(Boolean).map(w =>
    w.length <= 3 && w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  ).join(' ');

interface HeaderInfo {
  fieldCol: Partial<Record<MealField, number>>;
  mapped: { header: string; field: MealField }[];
  ignored: string[];
}

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
  if (fieldCol.restaurantName === undefined || mapped.length < 2) return null;
  return { fieldCol, mapped, ignored };
}

function buildRow(get: (f: MealField) => string, rowNumber: number): ParsedMealRow {
  const warnings: string[] = [];
  const errors: string[] = [];

  const restaurantName = get('restaurantName');
  const city = get('city');
  const country = capWords(get('country'));

  if (!restaurantName) errors.push('Missing restaurant name');
  if (!city) errors.push('Missing city');
  if (!country) errors.push('Missing country');

  return {
    rowNumber, warnings, errors,
    data: {
      restaurantName, city, country,
      cuisine: get('cuisine') || 'Multi-Cuisine',
      address: get('address'),
      description: get('description'),
    },
  };
}

export async function parseMealFile(file: File, overrides: Overrides = {}): Promise<MealImportResult> {
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const rows: ParsedMealRow[] = [];
  const mapped = new Map<string, { header: string; field: MealField }>();
  const ignored = new Set<string>();
  let foundHeader = false;

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    if (!ws || !ws['!ref']) continue;
    const offset = XLSX.utils.decode_range(ws['!ref']).s.r;
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
      const get = (f: MealField) => (h.fieldCol[f] !== undefined ? clean(row[h.fieldCol[f]!]) : '');
      rows.push(buildRow(get, offset + i + 1));
    }
  }

  if (!foundHeader) {
    return { rows: [], mappedColumns: [], ignoredColumns: [],
      fatal: 'No header row found. The file needs "Restaurant Name" plus at least one more known column (City, Country...).' };
  }
  return { rows, mappedColumns: [...mapped.values()], ignoredColumns: [...ignored] };
}

export interface PlanTask { row: ParsedMealRow; action: 'create' | 'update'; existing?: MealData }
export interface PlanIssue { rowNumber: number; name: string; messages: string[] }
export interface PlanResult { tasks: PlanTask[]; issues: PlanIssue[] }

const nameCityKey = (name: string, city: string) => `${norm(name)}|${norm(city)}`;

export function planMealImport(rows: ParsedMealRow[], existing: MealData[]): PlanResult {
  const byKey = new Map<string, MealData>();
  existing.forEach(m => byKey.set(nameCityKey(m.restaurantName, m.city), m));

  const tasks: PlanTask[] = [];
  const issues: PlanIssue[] = [];
  const touched = new Set<string>();
  const newKeys = new Set<string>();

  for (const row of rows) {
    const bad = (...messages: string[]) => issues.push({ rowNumber: row.rowNumber, name: row.data.restaurantName, messages });
    if (row.errors.length) { bad(...row.errors); continue; }

    const k = nameCityKey(row.data.restaurantName, row.data.city);
    const match = byKey.get(k);

    if (match) {
      const mid = match._id || match.id || '';
      if (touched.has(mid)) { bad('This restaurant appears twice in the file'); continue; }
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

export function buildMealPayload(task: PlanTask): any {
  const filled: Record<string, string> = {};
  (Object.keys(task.row.data) as (keyof MealRowData)[]).forEach(k => {
    if (task.row.data[k] !== '') filled[k] = task.row.data[k];
  });

  if (task.action === 'update') {
    const merged: any = { ...task.existing, ...filled };
    if (!merged.linkedSupplierId) delete merged.linkedSupplierId;
    return merged;
  }

  return {
    type: 'Standard', images: [], status: 'Active',
    ...filled,
  };
}