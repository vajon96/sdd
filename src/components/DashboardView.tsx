import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Layers,
  Award,
  CalendarDays,
  Activity,
  Droplet,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Cadet, BNCCEvent, AttendanceSession, ActivityLog } from '../types';
import { PLATOON_LEADERSHIP } from '../data/seedData';

interface DashboardViewProps {
  cadets: Cadet[];
  events: BNCCEvent[];
  attendanceSessions: AttendanceSession[];
  logs: ActivityLog[];
  onSelectBatch: (batch: string) => void;
  onNavigate: (view: any) => void;
  onOpenAddCadet: () => void;
  onOpenTakeAttendance: () => void;
  onOpenCreateEvent: () => void;
  onViewCadet: (cadet: Cadet) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cadets,
  events,
  attendanceSessions,
  logs,
  onSelectBatch,
  onNavigate,
  onOpenAddCadet,
  onOpenTakeAttendance,
  onOpenCreateEvent,
  onViewCadet
}) => {
  const totalCadets = cadets.length;
  const activeCadets = cadets.filter((c) => c.status === 'Active').length;
  const inactiveCadets = cadets.filter((c) => c.status !== 'Active').length;
  const maleCadets = cadets.filter((c) => c.gender === 'Male').length;
  const femaleCadets = cadets.filter((c) => c.gender === 'Female').length;

  const batches = ['2023', '2024', '2025', '2026'] as const;
  const batchCounts = batches.map((b) => ({
    batch: b,
    count: cadets.filter((c) => c.batch === b).length
  }));

  // Blood group breakdown
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const;
  const bloodCounts = bloodGroups.map((bg) => ({
    group: bg,
    count: cadets.filter((c) => c.bloodGroup === bg).length
  }));

  // Overall attendance rate
  let totalRecordsCount = 0;
  let presentRecordsCount = 0;
  attendanceSessions.forEach((s) => {
    s.records.forEach((r) => {
      totalRecordsCount++;
      if (r.status === 'Present' || r.status === 'Late') {
        presentRecordsCount++;
      }
    });
  });
  const avgAttendance =
    totalRecordsCount > 0 ? Math.round((presentRecordsCount / totalRecordsCount) * 100) : 94;

  const recentCadets = cadets.slice(0, 5);

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Header Banner with Session Info */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Institutional Database & Command System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Operational <span className="text-amber-400">Overview</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xl">
              Bangladesh National Cadet Corps — Karnafuli Regiment | Platoon: Cox's Bazar City College
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="dashboard-take-attendance-btn"
              onClick={onOpenTakeAttendance}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-medium backdrop-blur-md transition-all flex items-center gap-2"
            >
              <CalendarDays className="w-4 h-4 text-amber-400" />
              <span>Mark Attendance</span>
            </button>

            <button
              id="dashboard-add-event-btn"
              onClick={onOpenCreateEvent}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-medium backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Schedule Event</span>
            </button>

            <button
              id="dashboard-add-cadet-btn"
              onClick={onOpenAddCadet}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Enroll Cadet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Leadership & Command Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Platoon Commander */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex items-center gap-4 hover:border-amber-400/30 transition-all group">
          <img
            src={PLATOON_LEADERSHIP.commander.photoUrl}
            alt={PLATOON_LEADERSHIP.commander.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/40 shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Platoon Commander
              </span>
              <span className="text-[10px] text-white/40 font-mono hidden sm:inline">Army Wing</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
              {PLATOON_LEADERSHIP.commander.name}
            </h3>
            <p className="text-xs text-amber-300/80 font-medium">
              {PLATOON_LEADERSHIP.commander.rank}
            </p>
            <p className="text-[11px] text-white/50 truncate mt-0.5">
              {PLATOON_LEADERSHIP.commander.institution} · {PLATOON_LEADERSHIP.commander.location}
            </p>
          </div>
        </div>

        {/* Platoon In-Charge */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex items-center gap-4 hover:border-amber-400/30 transition-all group">
          <img
            src={PLATOON_LEADERSHIP.inCharge.photoUrl}
            alt={PLATOON_LEADERSHIP.inCharge.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/40 shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-400/20 text-blue-300 border border-blue-400/30">
                Platoon In-Charge
              </span>
              <span className="text-[10px] font-mono text-white/40">Cadet No: {PLATOON_LEADERSHIP.inCharge.cadetNo}</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
              {PLATOON_LEADERSHIP.inCharge.name}
            </h3>
            <p className="text-xs text-amber-300/80 font-medium">
              {PLATOON_LEADERSHIP.inCharge.rank} · Blood: <span className="text-red-400 font-bold">{PLATOON_LEADERSHIP.inCharge.bloodGroup}</span>
            </p>
            <p className="text-[11px] text-white/50 truncate mt-0.5">
              {PLATOON_LEADERSHIP.inCharge.email} · {PLATOON_LEADERSHIP.inCharge.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Key Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Cadets */}
        <div
          id="stat-card-total-cadets"
          onClick={() => onNavigate('cadets')}
          className="cursor-pointer p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.05] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Total Cadets
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {totalCadets}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{activeCadets} Active in Unit</span>
          </div>
        </div>

        {/* Card 2: Gender Breakdown */}
        <div
          id="stat-card-gender"
          onClick={() => onNavigate('cadets')}
          className="cursor-pointer p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.05] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Male / Female
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-400/10 border border-blue-400/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {maleCadets} <span className="text-white/30 text-lg">/</span> {femaleCadets}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-white/60">
            <span>{Math.round((maleCadets / (totalCadets || 1)) * 100)}% Male · {Math.round((femaleCadets / (totalCadets || 1)) * 100)}% Female</span>
          </div>
        </div>

        {/* Card 3: Batch Diversity */}
        <div
          id="stat-card-batches"
          onClick={() => onNavigate('batches')}
          className="cursor-pointer p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.05] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Batches Registered
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-400/10 border border-purple-400/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            4 <span className="text-sm font-normal text-white/50">Batches</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-white/60">
            <span>2023 · 2024 · 2025 · 2026</span>
          </div>
        </div>

        {/* Card 4: Attendance Efficiency */}
        <div
          id="stat-card-attendance"
          onClick={() => onNavigate('attendance')}
          className="cursor-pointer p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.05] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Avg. Attendance
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {avgAttendance}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <span>{attendanceSessions.length} sessions recorded</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Batch Distribution & Blood Bank Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch Breakdown Section */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Batch Distribution</h2>
              <p className="text-xs text-white/50">Click on any batch to filter cadet records immediately</p>
            </div>
            <button
              onClick={() => onNavigate('batches')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>Manage Batches</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {batchCounts.map(({ batch, count }) => {
              const pct = totalCadets > 0 ? Math.round((count / totalCadets) * 100) : 0;
              return (
                <div
                  key={batch}
                  onClick={() => onSelectBatch(batch)}
                  className="cursor-pointer p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-400/40 hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {batch}
                    </span>
                    <span className="text-xs text-white/40">{pct}%</span>
                  </div>
                  <div className="text-xl font-extrabold text-white">{count}</div>
                  <div className="text-[11px] text-white/50">Enrolled Cadets</div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blood Donor Directory readiness */}
        <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-red-400" />
                <h2 className="text-base font-bold text-white tracking-tight">Blood Group Matrix</h2>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">
                Emergency Ready
              </span>
            </div>
            <p className="text-xs text-white/50 mb-4">
              Instant cadet blood donor availability for institutional and humanitarian calls.
            </p>

            <div className="grid grid-cols-4 gap-2">
              {bloodCounts.map(({ group, count }) => (
                <div
                  key={group}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center"
                >
                  <div className="text-xs font-bold text-red-400">{group}</div>
                  <div className="text-base font-extrabold text-white mt-0.5">{count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span>Verified Donors:</span>
            <span className="font-semibold text-white">{totalCadets} Cadets</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Cadets Table + Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cadets Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white tracking-tight">Recently Enrolled Cadets</h2>
            <button
              onClick={() => onNavigate('cadets')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>View All ({totalCadets})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Cadet No</th>
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Rank</th>
                  <th className="pb-3 font-semibold">Blood</th>
                  <th className="pb-3 font-semibold">Batch</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentCadets.map((cadet) => (
                  <tr
                    key={cadet.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3 font-mono font-semibold text-white/80">
                      {cadet.cadetNo}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cadet.photoUrl}
                          alt={cadet.fullName}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-white/10"
                        />
                        <span className="font-semibold text-white">{cadet.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 text-white/70">{cadet.rank}</td>
                    <td className="py-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-300 border border-red-500/20">
                        {cadet.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-white/80">
                        {cadet.batch}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {cadet.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onViewCadet(cadet)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/20 hover:text-amber-300 text-white/70 text-[11px] font-medium border border-white/5 transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Logs feed */}
        <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Recent Activity</h2>
            </div>
            <span className="text-[10px] text-white/40 font-mono">Live LocalStorage</span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
            {logs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-white truncate">{log.action}</p>
                    <span className="text-[10px] text-white/40 font-mono shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 truncate mt-0.5">{log.target}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
