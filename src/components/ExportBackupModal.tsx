import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  RefreshCw,
  Printer,
  FileJson,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Cadet } from '../types';

interface ExportBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => boolean;
  onExportCSV: () => void;
  onResetSeedData: () => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
  cadetsCount: number;
}

export const ExportBackupModal: React.FC<ExportBackupModalProps> = ({
  isOpen,
  onClose,
  onExportJSON,
  onImportJSON,
  onExportCSV,
  onResetSeedData,
  isAdmin,
  onRequireAdmin,
  cadetsCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        if (content) {
          const success = onImportJSON(content);
          if (success) {
            setImportStatus('Backup data successfully imported and synced!');
            setTimeout(() => {
              setImportStatus(null);
              onClose();
            }, 1800);
          } else {
            setImportStatus('Failed to parse backup JSON file format.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="max-w-lg w-full p-6 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl space-y-5 text-white">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Database Backup & Export Center</h3>
            <p className="text-xs text-white/50">{cadetsCount} records currently active in database</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Export JSON */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-white">
                <FileJson className="w-4 h-4 text-amber-400" />
                <span>Full JSON Backup</span>
              </div>
              <p className="text-[11px] text-white/50 mt-1">
                Exports all cadet dossiers, attendance history, and events in a single JSON file.
              </p>
            </div>
            <button
              onClick={onExportJSON}
              className="w-full py-2 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .JSON</span>
            </button>
          </div>

          {/* Export CSV */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-white">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Spreadsheet (CSV)</span>
              </div>
              <p className="text-[11px] text-white/50 mt-1">
                Standard tabular format compatible with Microsoft Excel, Google Sheets, and LibreOffice.
              </p>
            </div>
            <button
              onClick={onExportCSV}
              className="w-full py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .CSV</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-white">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Restore Backup</span>
              </div>
              <p className="text-[11px] text-white/50 mt-1">
                Upload a previously exported JSON backup file to restore all cadets.
              </p>
            </div>
            <button
              onClick={() => {
                if (isAdmin) {
                  fileInputRef.current?.click();
                } else {
                  onRequireAdmin();
                }
              }}
              className="w-full py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select File</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Print View */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-white">
                <Printer className="w-4 h-4 text-purple-400" />
                <span>Print Official Master Roll</span>
              </div>
              <p className="text-[11px] text-white/50 mt-1">
                Opens the browser print dialog formatted for clean institutional paper report.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="w-full py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dialog</span>
            </button>
          </div>
        </div>

        {/* Reset to Factory / Seed Data */}
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Reset database back to initial BNCC cadets (2023-2026)?</span>
          </div>
          <button
            onClick={() => {
              if (isAdmin) {
                if (confirm('Are you sure you want to reset all data back to original seed records?')) {
                  onResetSeedData();
                  onClose();
                }
              } else {
                onRequireAdmin();
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold shrink-0"
          >
            Reset Seed Data
          </button>
        </div>
      </div>
    </div>
  );
};
