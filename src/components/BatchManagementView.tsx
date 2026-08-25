import React from 'react';
import { Layers, Users, Award, Shield, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { Cadet, BatchYear } from '../types';

interface BatchManagementViewProps {
  cadets: Cadet[];
  onSelectBatchAndFilter: (batch: string) => void;
  onViewCadet: (cadet: Cadet) => void;
}

export const BatchManagementView: React.FC<BatchManagementViewProps> = ({
  cadets,
  onSelectBatchAndFilter,
  onViewCadet
}) => {
  const batchList: {
    year: BatchYear;
    title: string;
    description: string;
    theme: string;
    borderColor: string;
  }[] = [
    {
      year: '2023',
      title: 'Senior Batch (2023)',
      description: 'Senior Cadets, Cadet Under Officers (CUO), and Sergeants leading platoon drills.',
      theme: 'from-amber-500/20 to-orange-500/10',
      borderColor: 'border-amber-500/30'
    },
    {
      year: '2024',
      title: 'Regimental Batch (2024)',
      description: 'Experienced Corporals and Lance Corporals trained in BMTC, weapon handling, and camps.',
      theme: 'from-blue-500/20 to-indigo-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      year: '2025',
      title: 'Active Inflow Batch (2025)',
      description: 'First year HSC & Degree cadets active in weekly drill formations and civil defense.',
      theme: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30'
    },
    {
      year: '2026',
      title: 'Probationary Batch (2026)',
      description: 'Newly enrolled recruit cadets undergoing introductory military discipline.',
      theme: 'from-purple-500/20 to-pink-500/10',
      borderColor: 'border-purple-500/30'
    }
  ];

  return (
    <div id="batch-management-view" className="space-y-6">
      {/* View Header */}
      <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Squadron & Batch Architecture</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Batch Hierarchy</h1>
          <p className="text-xs text-white/50 mt-1">
            Categorized rosters spanning senior leadership to prospective cadet recruits.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="font-mono font-bold text-amber-400">{cadets.length}</span> Total Cadets Enrolled Across All 4 Batches
        </div>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {batchList.map((b) => {
          const batchCadets = cadets.filter((c) => c.batch === b.year);
          const activeCount = batchCadets.filter((c) => c.status === 'Active').length;
          const maleCount = batchCadets.filter((c) => c.gender === 'Male').length;
          const femaleCount = batchCadets.filter((c) => c.gender === 'Female').length;
          const seniorCadet = batchCadets[0];

          return (
            <div
              key={b.year}
              className={`p-6 rounded-2xl bg-gradient-to-br ${b.theme} backdrop-blur-xl border ${b.borderColor} flex flex-col justify-between space-y-5 transition-all hover:scale-[1.01]`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-lg font-mono font-bold text-sm bg-black/40 text-amber-300 border border-white/10">
                    BATCH {b.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {activeCount} Active
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">{b.title}</h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">{b.description}</p>

                {/* Batch Metrics Matrix */}
                <div className="grid grid-cols-3 gap-2.5 my-4">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-center">
                    <span className="text-[10px] text-white/40 block uppercase">Total Cadets</span>
                    <span className="text-xl font-extrabold text-white">{batchCadets.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-center">
                    <span className="text-[10px] text-white/40 block uppercase">Male</span>
                    <span className="text-xl font-extrabold text-blue-400">{maleCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-center">
                    <span className="text-[10px] text-white/40 block uppercase">Female</span>
                    <span className="text-xl font-extrabold text-purple-400">{femaleCount}</span>
                  </div>
                </div>

                {/* Sample Senior Cadets Preview */}
                {seniorCadet && (
                  <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={seniorCadet.photoUrl}
                        alt={seniorCadet.fullName}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                      />
                      <div>
                        <span className="font-bold text-white block">{seniorCadet.fullName}</span>
                        <span className="text-white/50 text-[10px] font-mono">
                          {seniorCadet.rank} · No: {seniorCadet.cadetNo}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onViewCadet(seniorCadet)}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold"
                    >
                      Dossier
                    </button>
                  </div>
                )}
              </div>

              {/* View full roster for this batch */}
              <button
                onClick={() => onSelectBatchAndFilter(b.year)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Filter & View Batch {b.year} Roster ({batchCadets.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
