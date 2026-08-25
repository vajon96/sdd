import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Printer,
  ChevronRight,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Check
} from 'lucide-react';
import { Certificate, Cadet, RankHistoryEntry, CadetRank } from '../types';
import { deleteCertificate, getRankHistory } from '../data/storage';

interface CertificatesViewProps {
  certificates: Certificate[];
  cadets: Cadet[];
  onOpenIssueModal: () => void;
  onOpenPromotionModal: () => void;
  onRefresh: () => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
  onVerifyInDesk?: (certNo: string) => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({
  certificates,
  cadets,
  onOpenIssueModal,
  onOpenPromotionModal,
  onRefresh,
  isAdmin,
  onRequireAdmin,
  onVerifyInDesk
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'certificates' | 'ranks'>('certificates');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const rankHistories = getRankHistory();

  const filteredCerts = certificates.filter(
    (c) =>
      !searchQuery ||
      c.certificateNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cadetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, certNo: string) => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    if (window.confirm(`Revoke and delete certificate ${certNo}?`)) {
      deleteCertificate(id);
      onRefresh();
    }
  };

  const copyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Honours, Awards & Rank Progression</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Institutional Certificates & Ranks Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Issue cryptographically authenticated merit certificates and record official military rank promotions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              if (!isAdmin) onRequireAdmin();
              else onOpenPromotionModal();
            }}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Record Rank Promotion</span>
          </button>

          <button
            onClick={() => {
              if (!isAdmin) onRequireAdmin();
              else onOpenIssueModal();
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20 border border-amber-300/40 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Issue New Certificate</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'certificates'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Issued Certificates ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ranks')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'ranks'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Rank Elevation History ({rankHistories.length})</span>
        </button>
      </div>

      {/* Certificate Cards List */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certificates by Cadet Name, Certificate No, Type..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-amber-400/40 transition-all space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>{cert.certificateNo}</span>
                      </div>
                      <h3 className="font-bold text-white text-base mt-2">{cert.title}</h3>
                      <p className="text-xs text-white/50">{cert.type}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs">
                      {cert.grade || 'Passed'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                    <div className="flex justify-between text-white/60">
                      <span>Awardee Cadet:</span>
                      <span className="text-white font-semibold">{cert.cadetName} ({cert.cadetNo})</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Batch:</span>
                      <span className="text-white">Batch {cert.batch || '2025'}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Issue Date:</span>
                      <span className="text-white font-mono">{cert.issueDate}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Authority:</span>
                      <span className="text-white">{cert.issuingOrganization}</span>
                    </div>
                  </div>

                  {cert.description && (
                    <p className="text-xs text-slate-300 italic line-clamp-2">
                      "{cert.description}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[10px] text-emerald-400/80 truncate max-w-[150px]">
                      {cert.verificationHash}
                    </span>
                    <button
                      onClick={() => copyHash(cert.verificationHash, cert.id)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60"
                      title="Copy cryptographic hash"
                    >
                      {copiedId === cert.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {onVerifyInDesk && (
                      <button
                        onClick={() => onVerifyInDesk(cert.certificateNo)}
                        className="px-3 py-1 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-semibold text-[11px]"
                      >
                        Verify Desk
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(cert.id, cert.certificateNo)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Revoke Certificate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCerts.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
              <Award className="w-10 h-10 text-white/20 mx-auto" />
              <h4 className="text-base font-bold text-white">No Certificates Found</h4>
              <p className="text-xs text-white/50">Issue a new certificate or adjust your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Ranks Elevation History */}
      {activeTab === 'ranks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rankHistories.map((rh) => (
            <div
              key={rh.id}
              className="p-5 rounded-3xl bg-slate-900/90 border border-amber-400/30 space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-amber-300 font-bold">{rh.orderRef}</span>
                <span className="text-[11px] text-white/50 font-mono">{rh.promotionDate}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-white/40 block text-[10px]">Cadet No: {rh.cadetNo}</span>
                  <span className="text-white font-medium">{rh.previousRank}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-amber-400 block text-[10px] font-bold">PROMOTED RANK</span>
                  <span className="text-amber-300 font-bold">{rh.newRank}</span>
                </div>
              </div>

              <div className="text-xs text-white/60 space-y-0.5">
                <div><strong className="text-white">Promoted By:</strong> {rh.promotedBy}</div>
                {rh.remarks && <div><strong className="text-white">Citation:</strong> {rh.remarks}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
