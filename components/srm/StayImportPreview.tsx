// components/srm/StayImportPreview.tsx   (NEW FILE)
"use client";

import React, { useMemo, useState } from 'react';
import { X, AlertTriangle, CheckCircle2, XCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import { STAY_FIELDS, norm, stayKey } from '@/utils/stayImport';
import type { StayField, StayImportResult, ParsedStayRow } from '@/utils/stayImport';

export type DuplicateMode = 'skip' | 'update';

const FIELD_LABELS: Record<StayField, string> = {
  name: 'Property Name', category: 'Category', type: 'Class Type', address: 'Street Address', city: 'City', stateProvince: 'State / Province',
  country: 'Country', zipPostal: 'Zip / Postal', phone: 'Phone', rating: 'Star Rating',
  reviewRating: 'Review Rating', description: 'Property Overview', amenities: 'Key Amenities',
};

interface Props {
  fileName: string;
  result: StayImportResult;
  duplicateKeys: Set<string>;                       // name|city keys already in the database
  isBusy: boolean;                                  // true while the file is being re-parsed
  progress: { done: number; total: number } | null; // set while saving
  onRemap: (headerKey: string, field: StayField | 'ignore') => void;
  onConfirm: (rows: ParsedStayRow[], mode: DuplicateMode) => void;
  onCancel: () => void;
}

export default function StayImportPreview({
  fileName, result, duplicateKeys, isBusy, progress, onRemap, onConfirm, onCancel,
}: Props) {
  const [mode, setMode] = useState<DuplicateMode>('skip');
  const saving = progress !== null;

  // Annotate each row: valid? already in DB?
  const rows = useMemo(() => result.rows.map(r => ({
    row: r,
    valid: r.errors.length === 0,
    exists: duplicateKeys.has(stayKey(r.data.name, r.data.city)),
  })), [result.rows, duplicateKeys]);

  const validRows = rows.filter(r => r.valid);
  const dupCount = validRows.filter(r => r.exists).length;
  const errorCount = rows.length - validRows.length;
  const warnCount = validRows.filter(r => r.row.warnings.length > 0).length;
  const willImport = mode === 'skip' ? validRows.length - dupCount : validRows.length;

  // Every file column + where it currently maps. Ignored columns start as 'ignore'.
  const columns = [
    ...result.mappedColumns.map(c => ({ header: c.header, value: c.field as StayField | 'ignore' })),
    ...result.ignoredColumns.map(h => ({ header: h, value: 'ignore' as StayField | 'ignore' })),
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileSpreadsheet className="text-purple-700 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-800">Import Preview</h2>
              <p className="text-xs text-gray-500 truncate">
                {fileName} · layout: <b>{result.layout === 'block' ? 'repeated blocks' : 'flat table'}</b>
                {' '}· sheets: {result.sheetsRead.join(', ')}
              </p>
            </div>
          </div>
          <button onClick={onCancel} disabled={saving} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-5">

          {result.fatal ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm font-medium">
              {result.fatal}
            </div>
          ) : (
            <>
              {/* SUMMARY */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-white border rounded-lg p-3"><div className="text-2xl font-bold text-green-600">{validRows.length}</div><div className="text-xs text-gray-500">Valid rows</div></div>
                <div className="bg-white border rounded-lg p-3"><div className="text-2xl font-bold text-amber-500">{warnCount}</div><div className="text-xs text-gray-500">With warnings</div></div>
                <div className="bg-white border rounded-lg p-3"><div className="text-2xl font-bold text-red-600">{errorCount}</div><div className="text-xs text-gray-500">Will be skipped</div></div>
                <div className="bg-white border rounded-lg p-3"><div className="text-2xl font-bold text-purple-600">{dupCount}</div><div className="text-xs text-gray-500">Already exist</div></div>
              </div>

              {/* COLUMN MAPPING */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-3">
                  Column mapping {isBusy && <Loader2 size={12} className="inline animate-spin ml-1" />}
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                  {columns.map(c => (
                    <div key={c.header} className="flex items-center gap-2 text-xs">
                      <span className="flex-1 truncate font-medium text-gray-700" title={c.header}>{c.header}</span>
                      <span className="text-gray-400">→</span>
                      <select
                        value={c.value}
                        disabled={isBusy || saving}
                        onChange={e => onRemap(norm(c.header), e.target.value as StayField | 'ignore')}
                        className={`p-1 border rounded text-xs outline-none ${c.value === 'ignore' ? 'text-gray-400 border-gray-200' : 'border-purple-300 text-purple-800 font-bold'}`}
                      >
                        <option value="ignore">Ignore</option>
                        {STAY_FIELDS.map(f => <option key={f} value={f}>{FIELD_LABELS[f]}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* DUPLICATE MODE */}
              {dupCount > 0 && (
                <div className="bg-white border rounded-lg p-4 text-sm flex items-center gap-6">
                  <span className="font-bold text-gray-700">{dupCount} hotel(s) already exist (same name + city):</span>
                  <label className="flex items-center gap-2"><input type="radio" checked={mode === 'skip'} onChange={() => setMode('skip')} /> Skip them</label>
                  <label className="flex items-center gap-2"><input type="radio" checked={mode === 'update'} onChange={() => setMode('update')} /> Update them (keeps images &amp; rooms)</label>
                </div>
              )}

              {/* ROW TABLE */}
              <div className="bg-white border rounded-lg overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-[10px]">
                    <tr>
                      <th className="p-2 w-8"></th><th className="p-2 text-left">Row</th><th className="p-2 text-left">Property</th>
                      <th className="p-2 text-left">City</th><th className="p-2 text-left">Country</th>
                      <th className="p-2">Stars</th><th className="p-2">Review</th><th className="p-2">Amenities</th>
                      <th className="p-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ row, valid, exists }, i) => (
                      <tr key={i} className={`border-t ${!valid ? 'bg-red-50' : ''}`}>
                        <td className="p-2">
                          {!valid ? <XCircle size={14} className="text-red-500" />
                            : row.warnings.length ? <AlertTriangle size={14} className="text-amber-500" />
                            : <CheckCircle2 size={14} className="text-green-500" />}
                        </td>
                        <td className="p-2 text-gray-500">{row.rowNumber}</td>
                        <td className="p-2 font-bold text-gray-800">{row.data.name || '—'}</td>
                        <td className="p-2">{row.data.city || '—'}</td>
                        <td className="p-2">{row.data.country}</td>
                        <td className="p-2 text-center">{row.data.rating || '—'}</td>
                        <td className="p-2 text-center">{row.data.reviewRating ?? '—'}</td>
                        <td className="p-2 text-center">{row.data.keyAmenities?.length ?? 0}</td>
                        <td className="p-2 text-gray-600">
                          {exists && <span className="mr-2 px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">exists</span>}
                          {[...row.errors, ...row.warnings].join(' · ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 flex-1 mr-6">
            {saving && (
              <div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div className="h-full bg-purple-600 transition-all" style={{ width: `${(progress!.done / Math.max(progress!.total, 1)) * 100}%` }} />
                </div>
                <span>Saving {progress!.done} / {progress!.total}...</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} disabled={saving} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg disabled:opacity-50">Cancel</button>
            <button
              onClick={() => onConfirm(validRows.map(r => r.row), mode)}
              disabled={saving || isBusy || willImport === 0 || !!result.fatal}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md disabled:opacity-50"
            >
              Import {willImport} hotel{willImport === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}