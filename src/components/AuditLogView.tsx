import React, { useState } from 'react';
import { ShieldCheck, History, UserCheck, Award, FileText, Trash2, ArrowUpRight, Search, RefreshCw } from 'lucide-react';
import { AuditLog, RankHistoryEntry, Certificate } from '../types';
import { getAuditLogs, getRankHistory, getCertificates } from '../data/storage';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(getAuditLogs());
  const [rankHistory, setRankHistory] = useState<RankHistoryEntry[]>(getRankHistory());
  const [certs, setCerts] = useState<Certificate[]>(getCertificates());
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'promotions' | 'certs'>('audit');
  const [filterQuery, setFilterQuery] = useState<string>('');

  const refreshData = () => {
    setLogs(getAuditLogs());
    setRankHistory(getRankHistory());
    setCerts(getCertificates());
  };

  const filteredLogs = logs.filter(
    (l) =>
      !filterQuery ||
      l.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.adminName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.target.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <History className="w-3.5 h-3.5" />
            <span>Cryptographic Trail & Action History</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Institutional Audit Trail & Command Logs
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Immutable log of user authentications, rank elevations, certificate issuances, and cadet roster modifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Refresh Stream</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'audit'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <History className="w-4 h-4" />
          <span>System Actions ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('promotions')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'promotions'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Rank Promotion Orders ({rankHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('certs')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'certs'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Registered Certificates ({certs.length})</span>
        </button>
      </div>

      {/* Content Area */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter audit entries by action, officer, or details..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-400/15 border border-amber-400/30 text-amber-300 uppercase">
                      {log.action}
                    </span>
                    <span className="font-bold text-white">{log.adminName}</span>
                    <span className="text-white/40 font-mono text-[11px]">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-xs mt-1">{log.target}</p>
                </div>

                {log.ipAddress && (
                  <div className="font-mono text-[10px] text-white/40 bg-white/5 px-2.5 py-1 rounded-lg">
                    IP: {log.ipAddress}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'promotions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rankHistory.map((rh) => (
            <div
              key={rh.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-amber-400/30 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs text-amber-300 font-bold">{rh.orderRef}</div>
                <span className="text-[11px] text-white/50">{rh.promotionDate}</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-xs">
                  <span className="text-white/40 block text-[10px]">Cadet No: {rh.cadetNo}</span>
                  <span className="text-slate-300">{rh.previousRank}</span>
                </div>
                <div className="text-amber-400 font-bold">➔</div>
                <div className="text-xs">
                  <span className="text-amber-400 block text-[10px] font-bold">Elevated Rank</span>
                  <span className="text-amber-300 font-bold">{rh.newRank}</span>
                </div>
              </div>

              <div className="text-xs text-white/60 space-y-0.5">
                <div><strong className="text-white">Authorizing Officer:</strong> {rh.promotedBy}</div>
                {rh.remarks && <div><strong className="text-white">Citation:</strong> {rh.remarks}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'certs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs text-emerald-400 font-bold block">{c.certificateNo}</span>
                  <h4 className="font-bold text-white text-sm">{c.title}</h4>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                  {c.grade || 'A+'}
                </span>
              </div>

              <div className="text-xs text-white/70 space-y-1">
                <div><span className="text-white/40">Awardee:</span> {c.cadetName} ({c.cadetNo})</div>
                <div><span className="text-white/40">Issuing Authority:</span> {c.issuingOrganization}</div>
                <div><span className="text-white/40">Issue Date:</span> {c.issueDate}</div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40 truncate">
                <span>{c.verificationHash}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
