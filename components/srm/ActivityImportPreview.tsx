// components/srm/ActivityImportPreview.tsx   (NEW FILE)
"use client";

import React, { useMemo, useState } from 'react';
import { X, AlertTriangle, CheckCircle2, XCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import { ACTIVITY_FIELDS, norm, planActivityImport } from '@/utils/activityImport';
import type { ActivityField, ActivityImportResult, PlanTask } from '@/utils/activityImport';
import type { AttractionData } from '@/utils/srmStorage';

const FIELD_LABELS: Record<ActivityField, string> = {
  activityId: 'Activity ID', name: 'Activity Name', type: 'Type', city: 'City', country: 'Country',
  suggestedSlot: 'Time Slot', startTime: 'Start Time', duration: 'Duration',
  pickupLocation: 'Pickup Location', description: 'Description',
};

interface Props {
  fileName: string;
  result: ActivityImportResult;
  existing: AttractionData[];                        // activities already in the database
  isBusy: boolean;                                   // true while the file is being re-parsed
  progress: { done: number; total: number } | null;  // set while saving
  onRemap: (headerKey: string, field: ActivityField | 'ignore') => void;
  onConfirm: (tasks: PlanTask[]) => void;
  onCancel: () => void;
}

export default function ActivityImportPreview({
  fileName, result, existing, isBusy, progress, onRemap, onConfirm, onCancel,
}: Props) {
  const [updateExisting, setUpdateExisting] = useState(true);
  const saving = progress !== null;

  // Same decision logic the save uses: create / update / skip per row
  const plan = useMemo(() => planActivityImport(result.rows, existing), [result.rows, existing]);

  const rows = useMemo(() => {
    const taskByRow = new Map(plan.tasks.map(t => [t.row.rowNumber, t]));
    const issueByRow = new Map(plan.issues.map(i => [i.rowNumber, i]));
    return result.rows.map(r => ({ row: r, task: taskByRow.get(r.rowNumber), issue: issueByRow.get(r.rowNumber) }));
  }, [result.rows, plan]);

  const newCount = plan.tasks.filter(t => t.action === 'create').length;
  const updateCount = plan.tasks.length - newCount;
  const warnCount = rows.filter(r => r.task && r.row.warnings.length > 0).length;
  const tasksToImport = plan.tasks.filter(t => updateExisting || t.action === 'create');

  const columns = [
    ...result.mappedColumns.map(c => ({ header: c.header, value: c.field as ActivityField | 'ignore' })),
    ...result.ignoredColumns.map(h => ({ header: h, value: 'ignore' as ActivityField | 'ignore' })),
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileSpreadsheet className="text-blue-700 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-800">Import Preview: Activities</h2>
              <p className="text-xs text-gray-500 truncate">{fileName}</p>
            </div>
          </div>
          <button onClick={onCancel} disabled={saving} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 disabled:opacity-50"><X size={20} /></button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-5">
          {result.fatal ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm font-medium">{result.fatal}</div>
          ) : (
            <>
              {/* SUMMARY */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-white border rounded-lg p-3"><div className="text-2xl font-bold text-green-600">{newCount}</div><div className="text-xs text-gray-500">New</div></div>
                <div className="bg-white border rounded-lg p-3"><div className="text-2xl font-bold text-blue-600">{updateCount}</div><div className="text-xs text-gray-500">Already exist (update)</div></div>
                <div className="bg-white border rounded-lg p-3"><div className="text-2xl font-bold text-amber-500">{warnCount}</div><div className="text-xs text-gray-500">With warnings</div></div>
                <div className="bg-white border rounded-lg p-3"><div className="text-2xl font-bold text-red-600">{plan.issues.length}</div><div className="text-xs text-gray-500">Will be skipped</div></div>
              </div>

              {/* COLUMN MAPPING */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-3">Column mapping {isBusy && <Loader2 size={12} className="inline animate-spin ml-1" />}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                  {columns.map(c => (
                    <div key={c.header} className="flex items-center gap-2 text-xs">
                      <span className="flex-1 truncate font-medium text-gray-700" title={c.header}>{c.header}</span>
                      <span className="text-gray-400">→</span>
                      <select
                        value={c.value}
                        disabled={isBusy || saving}
                        onChange={e => onRemap(norm(c.header), e.target.value as ActivityField | 'ignore')}
                        className={`p-1 border rounded text-xs outline-none ${c.value === 'ignore' ? 'text-gray-400 border-gray-200' : 'border-blue-300 text-blue-800 font-bold'}`}
                      >
                        <option value="ignore">Ignore</option>
                        {ACTIVITY_FIELDS.map(f => <option key={f} value={f}>{FIELD_LABELS[f]}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* UPDATE OPTION */}
              {updateCount > 0 && (
                <div className="bg-white border rounded-lg p-4 text-sm flex items-center gap-3">
                  <input id="upd" type="checkbox" checked={updateExisting} onChange={e => setUpdateExisting(e.target.checked)} />
                  <label htmlFor="upd" className="font-medium text-gray-700">
                    Update the {updateCount} activities that already exist (matched by Activity ID, or name + city). Empty cells never erase stored data.
                  </label>
                </div>
              )}

              {/* ROW TABLE */}
              <div className="bg-white border rounded-lg overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-[10px]">
                    <tr>
                      <th className="p-2 w-8"></th><th className="p-2 text-left">Row</th><th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">Activity</th><th className="p-2 text-left">City</th><th className="p-2 text-left">Country</th>
                      <th className="p-2 text-left">Action</th><th className="p-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ row, task, issue }, i) => (
                      <tr key={i} className={`border-t ${issue ? 'bg-red-50' : ''}`}>
                        <td className="p-2">
                          {issue ? <XCircle size={14} className="text-red-500" />
                            : row.warnings.length ? <AlertTriangle size={14} className="text-amber-500" />
                            : <CheckCircle2 size={14} className="text-green-500" />}
                        </td>
                        <td className="p-2 text-gray-500">{row.rowNumber}</td>
                        <td className="p-2 font-mono">{row.fileId || <span className="text-gray-400">auto</span>}</td>
                        <td className="p-2 font-bold text-gray-800">{row.data.name || '—'}</td>
                        <td className="p-2">{row.data.city || '—'}</td>
                        <td className="p-2">{row.data.country || '—'}</td>
                        <td className="p-2">
                          {issue ? <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">skipped</span>
                            : task?.action === 'update' ? <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">update</span>
                            : <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-bold">new</span>}
                        </td>
                        <td className="p-2 text-gray-600">{[...(issue?.messages ?? []), ...row.warnings].join(' · ')}</td>
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
                  <div className="h-full bg-blue-600 transition-all" style={{ width: `${(progress!.done / Math.max(progress!.total, 1)) * 100}%` }} />
                </div>
                <span>Saving {progress!.done} / {progress!.total}...</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} disabled={saving} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg disabled:opacity-50">Cancel</button>
            <button
              onClick={() => onConfirm(tasksToImport)}
              disabled={saving || isBusy || tasksToImport.length === 0 || !!result.fatal}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md disabled:opacity-50"
            >
              Import {tasksToImport.length} {tasksToImport.length === 1 ? 'activity' : 'activities'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}