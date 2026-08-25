import React, { useState } from 'react';
import { Shield, Award, Calendar, FileText, CheckCircle2, X, ChevronRight } from 'lucide-react';
import { Cadet, CadetRank, RankHistoryEntry } from '../types';

interface RankPromotionModalProps {
  cadets: Cadet[];
  isOpen: boolean;
  onClose: () => void;
  onPromote: (
    cadetId: string,
    newRank: CadetRank,
    orderRef: string,
    promotedBy: string,
    promotionDate: string,
    remarks?: string
  ) => void;
}

const AVAILABLE_RANKS: CadetRank[] = [
  'Cadet',
  'Lance Corporal',
  'Corporal',
  'Sergeant',
  'Cadet Sergeant',
  'Cadet Under Officer (CUO)',
  'Senior Under Officer (SUO)',
  'Professor Under Officer (PUO)'
];

export const RankPromotionModal: React.FC<RankPromotionModalProps> = ({
  cadets,
  isOpen,
  onClose,
  onPromote
}) => {
  const [selectedCadetId, setSelectedCadetId] = useState<string>(cadets[0]?.id || '');
  const selectedCadet = cadets.find((c) => c.id === selectedCadetId);

  const [newRank, setNewRank] = useState<CadetRank>('Lance Corporal');
  const [orderRef, setOrderRef] = useState<string>(
    `ORDER/HQ-5BNCC/${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [promotedBy, setPromotedBy] = useState<string>('PUO Ujjwal Kanti Deb');
  const [promotionDate, setPromotionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState<string>('Promoted on merit for superior drill instruction and leadership.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCadetId) return;

    onPromote(selectedCadetId, newRank, orderRef, promotedBy, promotionDate, remarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Rank Progression & Promotion Order</h2>
              <p className="text-xs text-white/50">Official BNCC Platoon Command Log</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs sm:text-sm">
          {/* Select Cadet */}
          <div className="space-y-1.5">
            <label className="text-white/70 font-semibold block text-xs uppercase tracking-wider">
              Select Cadet to Promote:
            </label>
            <select
              value={selectedCadetId}
              onChange={(e) => setSelectedCadetId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:outline-none focus:border-amber-400"
            >
              {cadets.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.fullName} ({c.cadetNo}) — Current Rank: {c.rank} (Batch {c.batch})
                </option>
              ))}
            </select>
          </div>

          {/* Current vs New Rank preview */}
          {selectedCadet && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/40 block">CURRENT RANK</span>
                <span className="font-bold text-slate-300">{selectedCadet.rank}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] text-amber-400 block">NEW PROMOTED RANK</span>
                <span className="font-bold text-amber-300">{newRank}</span>
              </div>
            </div>
          )}

          {/* New Rank Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold block text-xs">New Target Rank:</label>
              <select
                value={newRank}
                onChange={(e) => setNewRank(e.target.value as CadetRank)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
              >
                {AVAILABLE_RANKS.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold block text-xs">Promotion Date:</label>
              <input
                type="date"
                value={promotionDate}
                onChange={(e) => setPromotionDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Order Ref & Authorizing Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold block text-xs">Command Order Ref No:</label>
              <input
                type="text"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                placeholder="e.g. ORDER/HQ-5BNCC/2026-10"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white font-mono focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-semibold block text-xs">Authorizing Officer:</label>
              <input
                type="text"
                value={promotedBy}
                onChange={(e) => setPromotedBy(e.target.value)}
                placeholder="e.g. PUO Ujjwal Kanti Deb"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="text-white/70 font-semibold block text-xs">Citation / Commendation Remarks:</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Provide reason for rank elevation..."
              className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20"
            >
              Execute Promotion Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
