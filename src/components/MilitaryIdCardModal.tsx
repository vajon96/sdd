import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Shield,
  QrCode,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Cadet } from '../types';

interface MilitaryIdCardModalProps {
  cadet: Cadet | null;
  allCadets: Cadet[];
  onClose: () => void;
}

export const MilitaryIdCardModal: React.FC<MilitaryIdCardModalProps> = ({
  cadet,
  allCadets,
  onClose
}) => {
  const [selectedCadet, setSelectedCadet] = useState<Cadet | null>(cadet);
  const [cardSide, setCardSide] = useState<'both' | 'front' | 'back'>('both');

  if (!selectedCadet) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="military-id-card-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="military-id-card-container"
        className="w-full max-w-3xl bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white my-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
              ★
            </div>
            <div>
              <h2 className="text-base font-bold text-white">BNCC Official Identity Card Generator</h2>
              <p className="text-xs text-white/50">High-resolution standard military format</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Cadet Selector */}
            <select
              value={selectedCadet.id}
              onChange={(e) => {
                const found = allCadets.find((c) => c.id === e.target.value);
                if (found) setSelectedCadet(found);
              }}
              className="hidden sm:block px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {allCadets.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.cadetNo} - {c.fullName} ({c.batch})
                </option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print ID Card</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/[0.01] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white/50">Display:</span>
            <button
              onClick={() => setCardSide('both')}
              className={`px-3 py-1 rounded-lg font-semibold ${
                cardSide === 'both' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'text-white/60'
              }`}
            >
              Both Sides
            </button>
            <button
              onClick={() => setCardSide('front')}
              className={`px-3 py-1 rounded-lg font-semibold ${
                cardSide === 'front' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'text-white/60'
              }`}
            >
              Front Only
            </button>
            <button
              onClick={() => setCardSide('back')}
              className={`px-3 py-1 rounded-lg font-semibold ${
                cardSide === 'back' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'text-white/60'
              }`}
            >
              Back Only
            </button>
          </div>

          <span className="text-white/40 font-mono text-[11px]">3.375" × 2.125" CR80 Standard</span>
        </div>

        {/* Printable Cards Area */}
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-center gap-6 overflow-y-auto bg-slate-950/60 print:p-0">
          {/* FRONT OF CARD */}
          {(cardSide === 'both' || cardSide === 'front') && (
            <div
              id="bncc-id-card-front"
              className="w-[330px] sm:w-[350px] h-[215px] sm:h-[225px] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-400/60 p-4 shadow-2xl relative flex flex-col justify-between overflow-hidden text-white select-none"
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1)'
              }}
            >
              {/* Background Watermark */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <Shield className="w-44 h-44 text-amber-400" />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-amber-400/30 pb-2 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 text-xs font-black">
                    ★
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-300 leading-tight">
                      Bangladesh National Cadet Corps
                    </h3>
                    <p className="text-[8.5px] font-semibold text-white/70 uppercase tracking-tight">
                      Karnafuli Regiment · 15 BNCC Battalion
                    </p>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-400 text-slate-950">
                  {selectedCadet.batch}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex items-center gap-3.5 z-10 my-auto">
                <div className="relative shrink-0">
                  <img
                    src={selectedCadet.photoUrl}
                    alt={selectedCadet.fullName}
                    referrerPolicy="no-referrer"
                    className="w-16 h-20 rounded-lg object-cover border border-amber-400/50 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded font-mono text-[8px] font-bold bg-red-600 text-white">
                    {selectedCadet.bloodGroup}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-0.5 text-[10px]">
                  <div className="font-extrabold text-white text-xs truncate uppercase tracking-tight">
                    {selectedCadet.fullName}
                  </div>
                  <div className="text-amber-300 font-mono font-bold">
                    CADET NO: {selectedCadet.cadetNo}
                  </div>
                  <div className="text-white/80">
                    <span className="text-white/50">Rank:</span> {selectedCadet.rank}
                  </div>
                  <div className="text-white/80 truncate">
                    <span className="text-white/50">Platoon:</span> {selectedCadet.platoon || 'City College'}
                  </div>
                  <div className="text-white/80 truncate">
                    <span className="text-white/50">Institution:</span> {selectedCadet.institution}
                  </div>
                </div>
              </div>

              {/* Card Footer with Hologram & Issue Authority */}
              <div className="flex items-center justify-between pt-1.5 border-t border-white/10 z-10 text-[8px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 via-pink-400 to-cyan-400 animate-pulse opacity-80" />
                  <span className="text-white/60 font-mono">SECURE BNCC ID</span>
                </div>
                <div className="text-right">
                  <span className="font-serif italic text-amber-300/90 block -mb-0.5">Adjutant Sign</span>
                  <span className="text-[7.5px] text-white/50">Issuing Authority</span>
                </div>
              </div>
            </div>
          )}

          {/* BACK OF CARD */}
          {(cardSide === 'both' || cardSide === 'back') && (
            <div
              id="bncc-id-card-back"
              className="w-[330px] sm:w-[350px] h-[215px] sm:h-[225px] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 border-white/20 p-4 shadow-2xl relative flex flex-col justify-between overflow-hidden text-white select-none"
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)'
              }}
            >
              {/* Top Magnetic / Header Bar */}
              <div className="bg-white/10 -mx-4 -mt-4 px-4 py-1.5 text-center text-[8.5px] font-bold text-amber-300 uppercase tracking-wider border-b border-white/10">
                Institutional Emergency & Verification Data
              </div>

              {/* Data Rows */}
              <div className="space-y-1 text-[9.5px] my-auto">
                <div className="flex justify-between border-b border-white/5 pb-0.5">
                  <span className="text-white/50">Father's Name:</span>
                  <span className="font-semibold text-white truncate max-w-[170px]">
                    {selectedCadet.fatherName || 'On Record'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-0.5">
                  <span className="text-white/50">Emergency Contact:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {selectedCadet.guardianMobile || selectedCadet.mobile || '018XXXXXXXX'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-0.5">
                  <span className="text-white/50">Date of Birth:</span>
                  <span className="font-mono text-white">{selectedCadet.dob || '01/01/2006'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-0.5">
                  <span className="text-white/50">District:</span>
                  <span className="text-white">{selectedCadet.district || "Cox's Bazar"}</span>
                </div>
              </div>

              {/* QR Code & Terms */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
                <div className="text-[7.5px] text-white/50 max-w-[190px] leading-tight">
                  Property of Bangladesh National Cadet Corps. If found, please return to Cox's Bazar City College BNCC Platoon Office.
                </div>

                <div className="w-11 h-11 bg-white p-0.5 rounded flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" />
                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" />
                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" />
                    <rect x="40" y="40" width="20" height="20" />
                    <rect x="45" y="15" width="10" height="10" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50 bg-white/[0.01]">
          <span>Format: Vector SVG + Direct Print Compatible</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
