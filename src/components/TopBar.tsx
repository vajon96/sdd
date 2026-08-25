import React from 'react';
import { Search, Plus, ShieldCheck, ShieldAlert, Download, Menu, Bell, Filter } from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddCadet: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenMobileSidebar: () => void;
  onOpenExportModal: () => void;
  selectedBatch: string | null;
  onClearBatchFilter: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddCadet,
  isAdmin,
  onToggleAdmin,
  onOpenMobileSidebar,
  onOpenExportModal,
  selectedBatch,
  onClearBatchFilter
}) => {
  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-30 bg-slate-950/70 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          id="mobile-menu-toggle-button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Instant Search Box */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Quick search by Name, Cadet No, Rank, Blood..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full bg-white/[0.04] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/60 focus:bg-white/[0.07] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Active Batch Indicator Badge if filtered */}
        {selectedBatch && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs">
            <span className="font-semibold">Batch: {selectedBatch}</span>
            <button
              onClick={onClearBatchFilter}
              className="ml-1 text-amber-300/60 hover:text-amber-300 text-sm font-bold"
              title="Clear batch filter"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick Batch/Export button */}
        <button
          id="topbar-export-button"
          onClick={onOpenExportModal}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/80 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-white/60" />
          <span>Export / Backup</span>
        </button>

        {/* Admin status pill */}
        <button
          id="topbar-admin-pill"
          onClick={onToggleAdmin}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
            isAdmin
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
          }`}
        >
          {isAdmin ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className="hidden md:inline">{isAdmin ? 'Admin ON' : 'Admin PIN'}</span>
        </button>

        {/* Add Cadet Primary Action Button */}
        <button
          id="topbar-add-cadet-button"
          onClick={onOpenAddCadet}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-400/20 border border-amber-300/40 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Cadet</span>
        </button>
      </div>
    </header>
  );
};
