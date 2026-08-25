import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Trash2,
  Plus,
  Users,
  Filter,
  Check,
  Award
} from 'lucide-react';
import { Cadet, AttendanceSession, AttendanceStatus, BatchYear } from '../types';

interface AttendanceViewProps {
  cadets: Cadet[];
  sessions: AttendanceSession[];
  onSaveSession: (session: AttendanceSession) => void;
  onDeleteSession: (id: string) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  cadets,
  sessions,
  onSaveSession,
  onDeleteSession,
  isAdmin,
  onRequireAdmin
}) => {
  // New session state
  const [selectedBatch, setSelectedBatch] = useState<BatchYear | 'All'>('All');
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [eventName, setEventName] = useState<string>('Weekly Squad Drill & Uniform Inspection');
  const [topic, setTopic] = useState<string>('Parade movements, slow march, and saluting');
  const [takenBy, setTakenBy] = useState<string>('Sgt. Sajon Dey (Karnafuli Regiment)');

  // Selected cadets attendance statuses in form
  const relevantCadets = useMemo(() => {
    if (selectedBatch === 'All') return cadets.filter((c) => c.status === 'Active');
    return cadets.filter((c) => c.batch === selectedBatch && c.status === 'Active');
  }, [cadets, selectedBatch]);

  const [recordsMap, setRecordsMap] = useState<Record<string, AttendanceStatus>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  // Initialize records map with 'Present' default when relevant cadets change
  const currentRecords = useMemo(() => {
    return relevantCadets.map((c) => ({
      cadetId: c.id,
      cadetNo: c.cadetNo,
      fullName: c.fullName,
      rank: c.rank,
      batch: c.batch,
      photoUrl: c.photoUrl,
      status: recordsMap[c.id] || 'Present',
      notes: notesMap[c.id] || ''
    }));
  }, [relevantCadets, recordsMap, notesMap]);

  const handleSetStatus = (cadetId: string, status: AttendanceStatus) => {
    setRecordsMap((prev) => ({ ...prev, [cadetId]: status }));
  };

  const handleSetAll = (status: AttendanceStatus) => {
    const next: Record<string, AttendanceStatus> = {};
    relevantCadets.forEach((c) => {
      next[c.id] = status;
    });
    setRecordsMap(next);
  };

  // Real-time calculation
  const presentCount = currentRecords.filter((r) => r.status === 'Present' || r.status === 'Late').length;
  const absentCount = currentRecords.filter((r) => r.status === 'Absent').length;
  const leaveCount = currentRecords.filter((r) => r.status === 'Leave').length;
  const currentPercentage = currentRecords.length > 0 ? Math.round((presentCount / currentRecords.length) * 100) : 100;

  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSaveAttendance = () => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }

    const sessionObj: AttendanceSession = {
      id: 'att-' + Date.now(),
      date: sessionDate,
      batch: selectedBatch,
      eventName,
      topic,
      takenBy,
      records: currentRecords.map((r) => ({
        cadetId: r.cadetId,
        cadetNo: r.cadetNo,
        status: r.status,
        notes: r.notes
      })),
      createdAt: new Date().toISOString()
    };

    onSaveSession(sessionObj);
    setSuccessToast(`Attendance for ${sessionDate} saved successfully!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div id="attendance-view" className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Attendance & Drill Log Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Attendance System</h1>
          <p className="text-xs text-white/50 mt-1">
            Record regular drill attendance, compute attendance percentages, and maintain historical parade logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-center">
            <span className="text-[10px] text-white/40 block uppercase">Efficiency</span>
            <span className="text-xl font-mono font-extrabold text-emerald-400">{currentPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Take Attendance Console */}
      <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-5">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span>Take New Drill Attendance</span>
        </h2>

        {/* Configuration Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-white/60 mb-1 font-medium">Parade Date</label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-white/60 mb-1 font-medium">Batch Filter</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Active Batches ({cadets.length})</option>
              <option value="2023">Batch 2023</option>
              <option value="2024">Batch 2024</option>
              <option value="2025">Batch 2025</option>
              <option value="2026">Batch 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-white/60 mb-1 font-medium">Session Title</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Weekly Drill"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-white/60 mb-1 font-medium">Instructor / Officer in Charge</label>
            <input
              type="text"
              value={takenBy}
              onChange={(e) => setTakenBy(e.target.value)}
              placeholder="e.g. CUO Robiullah"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Quick bulk action controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Quick Mark All:</span>
            <button
              onClick={() => handleSetAll('Present')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
            >
              All Present
            </button>
            <button
              onClick={() => handleSetAll('Absent')}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold"
            >
              All Absent
            </button>
            <button
              onClick={() => handleSetAll('Leave')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              All Leave
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-400 font-bold">Present: {presentCount}</span>
            <span className="text-red-400 font-bold">Absent: {absentCount}</span>
            <span className="text-amber-400 font-bold">Leave: {leaveCount}</span>
            <span className="text-white/50">Total: {currentRecords.length}</span>
          </div>
        </div>

        {/* Cadets Attendance Roster Table */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-950 text-white/50 uppercase text-[10px] tracking-wider z-10">
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4">Cadet No</th>
                  <th className="py-3 px-4">Photo & Name</th>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Mark Attendance</th>
                  <th className="py-3 px-4">Remark / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-white/[0.01]">
                {currentRecords.map((record) => (
                  <tr key={record.cadetId} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">{record.cadetNo}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={record.photoUrl}
                          alt={record.fullName}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-white/15"
                        />
                        <span className="font-semibold text-white">{record.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/70">{record.rank}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-white/5 border border-white/10 text-white/80">
                        {record.batch}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex rounded-lg bg-black/40 p-0.5 border border-white/10">
                        {(['Present', 'Late', 'Leave', 'Absent'] as AttendanceStatus[]).map((status) => {
                          const isSelected = record.status === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => handleSetStatus(record.cadetId, status)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                isSelected
                                  ? status === 'Present'
                                    ? 'bg-emerald-500 text-slate-950 shadow'
                                    : status === 'Late'
                                    ? 'bg-amber-400 text-slate-950 shadow'
                                    : status === 'Leave'
                                    ? 'bg-blue-500 text-white shadow'
                                    : 'bg-red-500 text-white shadow'
                                  : 'text-white/50 hover:text-white'
                              }`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Optional remarks..."
                        value={notesMap[record.cadetId] || ''}
                        onChange={(e) =>
                          setNotesMap((prev) => ({ ...prev, [record.cadetId]: e.target.value }))
                        }
                        className="w-full px-2 py-1 rounded bg-slate-950/80 border border-white/10 text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Session Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-white/50">
            Records are persisted into local storage key <code className="font-mono text-amber-300">bncc_attendance</code>
          </span>
          <button
            onClick={handleSaveAttendance}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Lock Attendance Session</span>
          </button>
        </div>
      </div>

      {/* Historical Attendance Sessions Log */}
      <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Historical Drill Sessions ({sessions.length})</span>
        </h2>

        <div className="space-y-3">
          {sessions.map((sess) => {
            const pCount = sess.records.filter((r) => r.status === 'Present' || r.status === 'Late').length;
            const pct = sess.records.length > 0 ? Math.round((pCount / sess.records.length) * 100) : 0;

            return (
              <div
                key={sess.id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {sess.date}
                    </span>
                    <h3 className="font-bold text-white text-sm">{sess.eventName || 'Drill Session'}</h3>
                  </div>
                  <p className="text-white/60 text-xs mt-1">Topic: {sess.topic || 'General Drill'}</p>
                  <div className="flex items-center gap-3 text-[11px] text-white/40 mt-2 font-mono">
                    <span>Taken By: {sess.takenBy}</span>
                    <span>•</span>
                    <span>Batch: {sess.batch}</span>
                    <span>•</span>
                    <span>
                      Present: {pCount}/{sess.records.length} ({pct}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-mono font-extrabold text-emerald-400">{pct}%</span>
                    <span className="text-[10px] text-white/40 block">Attendance Rate</span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => onDeleteSession(sess.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
