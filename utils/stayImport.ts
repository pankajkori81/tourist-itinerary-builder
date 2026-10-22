// utils/stayImport.ts   (NEW FILE)
import * as XLSX from 'xlsx';
import type { StayData, KeyAmenity } from '@/utils/srmStorage';

/* ------------------------------------------------------------------ */
/* 1. TYPES                                                            */
/* ------------------------------------------------------------------ */
export type StayField =
  | 'name' | 'category' | 'type' | 'address' | 'city'
  | 'stateProvince' | 'country' | 'zipPostal' | 'phone' | 'rating'
  | 'reviewRating' | 'description' | 'amenities';

// Manual column overrides from the preview modal. Key = normalized header text.
export type Overrides = Record<string, StayField | 'ignore'>;

export interface ParsedStayRow {
  sheet: string;
  rowNumber: number;            // Excel row number of the hotel row
  data: Omit<StayData, 'id' | '_id' | 'stayId' | 'createdAt' | 'updatedAt'>;
  warnings: string[];           // imported anyway
  errors: string[];             // row will be skipped
}

export interface StayImportResult {
  layout: 'flat' | 'block';     // flat = one header; block = header repeats per hotel
  sheetsRead: string[];
  mappedColumns: { header: string; field: StayField }[];
  ignoredColumns: string[];
  rows: ParsedStayRow[];
  fatal?: string;               // set when no header row could be found at all
}

/* ------------------------------------------------------------------ */
/* 2. ALIAS DICTIONARY - add new spellings here, nothing else changes  */
/*    (keys are lowercase, letters/digits only)                        */
/*    NOTE: do NOT add plain 'hotel' - it is a common cell VALUE       */
/* ------------------------------------------------------------------ */
const ALIASES: Record<StayField, string[]> = {
  name:          ['propertyname', 'hotelname', 'name', 'property', 'stayname', 'accommodationname'],
  category:      ['category', 'propertytype', 'accommodationtype'],
  type:          ['classtype', 'class', 'tier', 'segment'],
  address:       ['streetaddress', 'address', 'addressline1', 'street'],
  city:          ['city', 'town', 'cityname'],
  stateProvince: ['stateprovince', 'state', 'province', 'region'],
  country:       ['country', 'countryname', 'nation'],
  zipPostal:     ['zippostal', 'zip', 'zipcode', 'postal', 'postalcode', 'postcode', 'pincode'],
  phone:         ['phone', 'phonenumber', 'telephone', 'tel', 'contactnumber'],
  rating:        ['starrating', 'stars', 'star', 'rating', 'starclass'],       // STAR rating
  reviewRating:  ['reviewrating', 'guestrating', 'guestscore', 'reviewscore', 'userrating'],
  description:   ['propertyoverview', 'overview', 'description', 'about'],
  amenities:     ['amenities', 'keyamenities', 'keyamenity', 'amenity'],
};

export const STAY_FIELDS = Object.keys(ALIASES) as StayField[];

const EXACT = new Map<string, StayField>();
STAY_FIELDS.forEach(f => ALIASES[f].forEach(a => EXACT.set(a, f)));

/* ------------------------------------------------------------------ */
/* 3. SMALL HELPERS                                                    */
/* ------------------------------------------------------------------ */
// const norm = (v: unknown) => String(v ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

export const norm = (v: unknown) => String(v ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');


// Repairs text like "Ã\u008ele-de-France" -> "Île-de-France"
function fixEncoding(s: string) {
  if (!/[ÃÂ]/.test(s)) return s;
  try { return decodeURIComponent(escape(s)); } catch { return s; }
}
const clean = (v: unknown) => fixEncoding(String(v ?? '').trim());

const toNum = (v: unknown): number | undefined => {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
};

// "switzerland" -> "Switzerland", keeps short acronyms (UK, USA, UAE)
const capWords = (s: string) =>
  s.split(/\s+/).filter(Boolean).map(w =>
    w.length <= 3 && w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  ).join(' ');

// Used by the page to detect duplicates (same name + same city)
export const stayKey = (name: string, city: string) => `${norm(name)}|${norm(city)}`;

// "Lakefront Centre, Inseliquai 12, 6005 Luzern, Switzerland" -> { city:'Luzern', country:'Switzerland' }
function guessFromAddress(address: string): { city?: string; country?: string } {
  const parts = address.split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length < 3) return {};
  const last = parts[parts.length - 1];
  const hasCountry = !/\d/.test(last);
  const cityRaw = parts[parts.length - (hasCountry ? 2 : 1)];
  return {
    country: hasCountry ? last : undefined,
    city: cityRaw.replace(/^\d[\d\s-]*/, '').trim() || undefined, // strip leading postal code
  };
}

/* ------------------------------------------------------------------ */
/* 4. HEADER-ROW DETECTION                                             */
/* ------------------------------------------------------------------ */
interface HeaderInfo {
  fieldCol: Partial<Record<StayField, number>>;
  detailsCol: number;                                  // column holding amenity "Details", or -1
  mapped: { header: string; field: StayField }[];
  ignored: string[];
}

function detectHeader(row: any[], overrides: Overrides): HeaderInfo | null {
  const cells = row.map(c => ({ text: String(c ?? '').trim(), n: norm(c) }));

  const exactField = (n: string): StayField | undefined => {
    const o = overrides[n];
    if (o === 'ignore') return undefined;
    return (o as StayField | undefined) ?? EXACT.get(n);
  };

  // A row is a header only if it has "name" + at least 2 more known columns.
  // This is what safely skips title banners and data rows.
  const hits = cells.filter(c => c.n && exactField(c.n));
  if (hits.length < 3 || !hits.some(c => exactField(c.n) === 'name')) return null;

  const fieldCol: HeaderInfo['fieldCol'] = {};
  const mapped: HeaderInfo['mapped'] = [];
  const ignored: string[] = [];
  const claimed = new Set<number>();

  // Pass 1: exact matches first so a fuzzy match can never steal a field
  cells.forEach((c, idx) => {
    const f = c.n ? exactField(c.n) : undefined;
    if (f && fieldCol[f] === undefined) { fieldCol[f] = idx; claimed.add(idx); mapped.push({ header: c.text, field: f }); }
  });

  // Pass 2: fuzzy ("Hotel Star Rating" contains "starrating") for leftovers
  cells.forEach((c, idx) => {
    if (!c.n || claimed.has(idx)) return;
    if (overrides[c.n] !== 'ignore') {
      let best: StayField | null = null, bestLen = 0;
      for (const f of STAY_FIELDS) for (const a of ALIASES[f]) {
        if (a.length >= 5 && c.n.includes(a) && a.length > bestLen) { best = f; bestLen = a.length; }
      }
      if (best && fieldCol[best] === undefined) {
        fieldCol[best] = idx; claimed.add(idx); mapped.push({ header: c.text, field: best }); return;
      }
    }
    ignored.push(c.text);
  });

  // "Amenities" is usually merged over two columns: [Key Amenity | Details]
  let detailsCol = -1;
  const a = fieldCol.amenities;
  if (a !== undefined) {
    const next = a + 1;
    const nextHeader = cells[next]?.n ?? '';
    if (!claimed.has(next) && (nextHeader === '' || nextHeader === 'details')) detailsCol = next;
  }
  return { fieldCol, detailsCol, mapped, ignored };
}

/* ------------------------------------------------------------------ */
/* 5. RAW RECORD -> CLEAN ROW                                          */
/* ------------------------------------------------------------------ */
interface RawRecord {
  sheet: string;
  rowNumber: number;
  v: Partial<Record<StayField, string>>;
  amenities: KeyAmenity[];
}

// const AMENITY_SUBHEADERS = ['keyamenity', 'keyamenities', 'amenity', 'amenities'];

// function collectAmenity(row: any[], h: HeaderInfo, target: RawRecord, isRecordRow: boolean) {
//   const a = h.fieldCol.amenities;
//   if (a === undefined) return;
//   const key = clean(row[a]);
//   const details = h.detailsCol >= 0 ? clean(row[h.detailsCol]) : '';
//   if (!key) return;
//   // Skips the "Key Amenity | Details" sub-header line that sits beside the hotel row
//   if (AMENITY_SUBHEADERS.includes(norm(key)) && (!details || norm(details) === 'details')) return;
//   // Flat export style: "GYM, Pool, WiFi" in one cell -> three amenities
//   if (isRecordRow && !details && key.includes(',')) {
//     key.split(',').map(k => k.trim()).filter(Boolean).forEach(k => target.amenities.push({ key: k }));
//     return;
//   }
//   target.amenities.push({ key, details: details || undefined });
// }




// ── (1) KEPT AS BEFORE ────────────────────────────────────────────────
// Header words that mark the "Key Amenity | Details" sub-header line
const AMENITY_SUBHEADERS = ['keyamenity', 'keyamenities', 'amenity', 'amenities'];

// ── (2) NEW HELPER ────────────────────────────────────────────────────
// Reads ONE cell that holds several amenities.
//   "Wi-Fi: Free Wi-Fi\nParking: Garage available" -> 2 amenities with details (our export format)
//   "GYM, Pool, WiFi"                             -> 3 amenities, key only (older flat files)
//   "Sauna"                                       -> 1 amenity, key only
function splitAmenityCell(raw: string): KeyAmenity[] {
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const out: KeyAmenity[] = [];
  for (const line of lines) {
    const idx = line.indexOf(': ');
    if (idx > 0) {
      // "Key: Details" line
      out.push({ key: line.slice(0, idx).trim(), details: line.slice(idx + 2).trim() || undefined });
    } else if (lines.length === 1 && line.includes(',')) {
      // single line with commas -> separate key-only amenities
      line.split(',').map(k => k.trim()).filter(Boolean).forEach(k => out.push({ key: k }));
    } else {
      out.push({ key: line });
    }
  }
  return out;
}

// ── (3) REPLACED FUNCTION ─────────────────────────────────────────────
// Called once for the hotel row and once for every extra row below it.
function collectAmenity(row: any[], h: HeaderInfo, target: RawRecord, isRecordRow: boolean) {
  const a = h.fieldCol.amenities;
  if (a === undefined) return;                       // file has no amenities column at all
  const key = clean(row[a]);
  const details = h.detailsCol >= 0 ? clean(row[h.detailsCol]) : '';
  if (!key) return;

  // Skip the "Key Amenity | Details" sub-header line that sits beside the hotel row
  if (AMENITY_SUBHEADERS.includes(norm(key)) && (!details || norm(details) === 'details')) return;

  // Block layout (CH41 style): key in one column, details in the next column -> one amenity
  if (details) {
    target.amenities.push({ key, details });
    return;
  }

  // Flat layout: everything is in ONE cell on the hotel row
  // ("Key: Details" lines from our export, or "GYM, Pool, WiFi")
  if (isRecordRow) {
    target.amenities.push(...splitAmenityCell(key));
    return;
  }

  // Extra row that has a key but no details
  target.amenities.push({ key });
}

function finalize(raw: RawRecord): ParsedStayRow {
  const warnings: string[] = [];
  const errors: string[] = [];

  const name = clean(raw.v.name);
  const address = clean(raw.v.address);
  let city = clean(raw.v.city);
  let country = capWords(clean(raw.v.country));

  // Fill gaps from the address instead of failing the row
  if ((!city || !country) && address) {
    const g = guessFromAddress(address);
    if (!city && g.city) { city = g.city; warnings.push(`City taken from address: ${g.city}`); }
    if (!country && g.country) { country = capWords(g.country); warnings.push(`Country taken from address: ${country}`); }
  }

  if (!name) errors.push('Missing property name');
  if (!city) errors.push('Missing city (and could not be read from the address)');
  if (!country) { country = 'Uncategorized'; warnings.push('No country found - filed under "Uncategorized"'); }

  const star = toNum(raw.v.rating);
  const review = toNum(raw.v.reviewRating);
  if (star === undefined) warnings.push('No star rating - set to 0');
  if (star !== undefined && star > 5) warnings.push(`Star rating ${star} is above 5 - check the column mapping`);

  const overview = clean(raw.v.description);

  return {
    sheet: raw.sheet,
    rowNumber: raw.rowNumber,
    warnings,
    errors,
    data: {
      name,
      category: capWords(clean(raw.v.category)) || 'Hotel',
      type: capWords(clean(raw.v.type)) || 'Premium',
      city,
      country,
      address,
      rating: star ?? 0,
      reviewRating: review,
      description: overview,
      propertyOverview: overview,
      stateProvince: clean(raw.v.stateProvince),
      zipPostal: clean(raw.v.zipPostal),
      phone: clean(raw.v.phone),
      keyAmenities: raw.amenities.length ? raw.amenities : undefined,
      images: [],
      roomCategories: [],
      status: 'Active',
    },
  };
}

/* ------------------------------------------------------------------ */
/* 6. MAIN ENTRY POINT                                                 */
/* ------------------------------------------------------------------ */
export async function parseStayFile(file: File, overrides: Overrides = {}): Promise<StayImportResult> {
  // arrayBuffer + type:'array' keeps accents intact (readAsBinaryString did not)
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });

  const rows: ParsedStayRow[] = [];
  const mapped = new Map<string, { header: string; field: StayField }>();
  const ignored = new Set<string>();
  let headerCount = 0;

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    if (!ws || !ws['!ref']) continue;

    const rowOffset = XLSX.utils.decode_range(ws['!ref']).s.r; // so row numbers match Excel
    const grid = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '', raw: false, blankrows: true });

    let header: HeaderInfo | null = null;
    let current: RawRecord | null = null;
    const flush = () => { if (current) rows.push(finalize(current)); current = null; };

    grid.forEach((row, i) => {
      const found = detectHeader(row, overrides);
      if (found) {                                   // new header row (banner rows never get here)
        flush();
        header = found;
        headerCount++;
        found.mapped.forEach(m => mapped.set(norm(m.header), m));
        found.ignored.forEach(x => ignored.add(x));
        return;
      }
      if (!header || row.every(c => String(c ?? '').trim() === '')) return;

      const h: HeaderInfo = header;
      const get = (f: StayField) => (h.fieldCol[f] !== undefined ? clean(row[h.fieldCol[f]!]) : '');

      if (get('name')) {                             // a row with a name = a new hotel
        flush();
        current = { sheet: sheetName, rowNumber: rowOffset + i + 1, v: {}, amenities: [] };
        STAY_FIELDS.forEach(f => { if (f !== 'amenities') current!.v[f] = get(f); });
        collectAmenity(row, h, current, true);
      } else if (current) {                          // no name = extra amenity line of the last hotel
        collectAmenity(row, h, current, false);
      }
    });
    flush();
  }

  if (headerCount === 0) {
    return { layout: 'flat', sheetsRead: wb.SheetNames, mappedColumns: [], ignoredColumns: [], rows: [],
      fatal: 'No header row found. The file needs at least "Property Name" plus two more known columns (City, Country, Address...).' };
  }

  return {
    layout: headerCount > 1 ? 'block' : 'flat',
    sheetsRead: wb.SheetNames,
    mappedColumns: [...mapped.values()],
    ignoredColumns: [...ignored],
    rows,
  };
}



