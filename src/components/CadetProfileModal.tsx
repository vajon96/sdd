import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Edit2,
  IdCard,
  User,
  GraduationCap,
  Shield,
  CalendarCheck,
  Award,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  FileText,
  QrCode,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Cadet, AttendanceSession, BNCCEvent, Certificate } from '../types';

interface CadetProfileModalProps {
  cadet: Cadet | null;
  attendanceSessions: AttendanceSession[];
  events: BNCCEvent[];
  certificates: Certificate[];
  onClose: () => void;
  onEdit: (cadet: Cadet) => void;
  onOpenIdCard: (cadet: Cadet) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const CadetProfileModal: React.FC<CadetProfileModalProps> = ({
  cadet,
  attendanceSessions,
  events,
  certificates,
  onClose,
  onEdit,
  onOpenIdCard,
  isAdmin,
  onRequireAdmin
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'bncc' | 'academic' | 'attendance' | 'events' | 'certificates'
  >('overview');

  if (!cadet) return null;

  // Calculate Attendance Stats for this Cadet
  let totalSessions = 0;
  let attendedSessions = 0;
  const cadetAttendanceRecords: {
    sessionName: string;
    date: string;
    status: string;
    notes?: string;
  }[] = [];

  attendanceSessions.forEach((session) => {
    const rec = session.records.find((r) => r.cadetId === cadet.id || r.cadetNo === cadet.cadetNo);
    if (rec) {
      totalSessions++;
      if (rec.status === 'Present' || rec.status === 'Late') attendedSessions++;
      cadetAttendanceRecords.push({
        sessionName: session.eventName || 'Routine Drill Session',
        date: session.date,
        status: rec.status,
        notes: rec.notes
      });
    }
  });

  const attendanceRate =
    totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 92;

  // Filter Events participated by this cadet
  const cadetEvents = events.filter((e) =>
    e.participatingCadetIds.includes(cadet.id)
  );

  // Filter Certificates for this cadet
  const cadetCerts = certificates.filter(
    (c) => c.cadetId === cadet.id || c.cadetNo === cadet.cadetNo
  );

  const handlePrintProfile = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cadet, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Cadet_${cadet.cadetNo}_${cadet.fullName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      id="cadet-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="cadet-profile-card"
        className="w-full max-w-4xl max-h-[92vh] bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white my-auto"
      >
        {/* Modal Top Header with Quick Actions */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
              ID
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Cadet Dossier & Profile</h2>
              <p className="text-xs text-white/50">Bangladesh National Cadet Corps Official Record</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintProfile}
              title="Print Dossier"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownloadJSON}
              title="Download Cadet JSON"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenIdCard(cadet)}
              title="Generate Military ID Card"
              className="px-3 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <IdCard className="w-4 h-4" />
              <span className="hidden sm:inline">ID Card</span>
            </button>

            <button
              onClick={() => {
                if (isAdmin) {
                  onEdit(cadet);
                } else {
                  onRequireAdmin();
                }
              }}
              title="Edit Profile"
              className="px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Hero Section */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-amber-500/10 via-transparent to-blue-500/10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group shrink-0">
            <img
              src={cadet.photoUrl}
              alt={cadet.fullName}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cadet.fullName)}&background=0f172a&color=f59e0b&bold=true`;
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-400/40 shadow-xl"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-red-600 text-white border border-white/20 shadow">
              {cadet.bloodGroup}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                CADET NO: {cadet.cadetNo}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white/10 border border-white/15 text-white/90">
                Rank: {cadet.rank}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Batch: {cadet.batch}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  cadet.status === 'Ex Cadet' || cadet.status === 'Alumni'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                    : cadet.status === 'Active'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'
                }`}
              >
                ● {cadet.status}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {cadet.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-0.5">{cadet.institution}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{cadet.mobile || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{cadet.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{cadet.district || "Cox's Bazar"}, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Mini QR Card */}
          <div className="shrink-0 hidden md:flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
            {/* SVG QR Code Simulation */}
            <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center">
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
                <rect x="65" y="65" width="15" height="15" />
                <rect x="40" y="75" width="10" height="10" />
              </svg>
            </div>
            <span className="text-[10px] font-mono text-white/50 mt-1">ID: {cadet.cadetNo}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-b border-white/10 overflow-x-auto text-xs font-semibold bg-white/[0.01]">
          {[
            { id: 'overview', label: 'Personal & Family', icon: User },
            { id: 'bncc', label: 'BNCC Career', icon: Shield },
            { id: 'academic', label: 'Academic Details', icon: GraduationCap },
            { id: 'attendance', label: `Attendance (${attendanceRate}%)`, icon: CalendarCheck },
            { id: 'events', label: `Events (${cadetEvents.length})`, icon: Calendar },
            { id: 'certificates', label: `Certificates (${cadetCerts.length})`, icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-amber-400 text-amber-300 bg-amber-400/5'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[480px]">
          {/* Tab 1: Overview, Personal & Family */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Personal Details</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Full Name</span>
                    <span className="font-semibold text-white">{cadet.fullName}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Date of Birth</span>
                    <span className="font-semibold text-white">{cadet.dob || 'N/A'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Gender</span>
                    <span className="font-semibold text-white">{cadet.gender}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Blood Group</span>
                    <span className="font-bold text-red-400">{cadet.bloodGroup}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Nationality</span>
                    <span className="font-semibold text-white">{cadet.nationality || 'Bangladeshi'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">NID / Birth Certificate</span>
                    <span className="font-mono text-white/90">{cadet.nidOrBirthCert || 'Verified on file'}</span>
                  </div>
                </div>
              </div>

              {/* Family & Guardian Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Family & Emergency Contacts</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Father's Name</span>
                    <span className="font-semibold text-white">{cadet.fatherName || 'Not recorded'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Mother's Name</span>
                    <span className="font-semibold text-white">{cadet.motherName || 'Not recorded'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Guardian Contact</span>
                    <span className="font-semibold text-white">{cadet.guardianMobile || cadet.mobile || 'N/A'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase">Residential Address</span>
                    <span className="font-semibold text-white">{cadet.address || `${cadet.upazila || ''}, ${cadet.district || ''}`}</span>
                  </div>
                </div>
              </div>

              {/* Bio & Achievements */}
              {cadet.bio && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase font-bold mb-1">Cadet Bio</span>
                  <p className="text-xs text-white/80 leading-relaxed">{cadet.bio}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: BNCC Career */}
          {activeTab === 'bncc' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>BNCC Organizational Placement</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Regiment</span>
                  <span className="font-semibold text-white">{cadet.regiment || 'Karnafuli Regiment'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Battalion</span>
                  <span className="font-semibold text-white">{cadet.battalion || '5 BNCC Battalion'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Company & Platoon</span>
                  <span className="font-semibold text-white">{cadet.company || 'Alpha Coy'} · {cadet.platoon || 'City College Platoon'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Batch Year</span>
                  <span className="font-mono font-bold text-amber-300">{cadet.batch}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Current Rank</span>
                  <span className="font-semibold text-white">{cadet.rank}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Enrollment Date</span>
                  <span className="font-semibold text-white">{cadet.enrollmentDate || '12/01/2024'}</span>
                </div>
              </div>

              {cadet.achievements && cadet.achievements.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase font-bold mb-2">Honors & Commendations</span>
                  <div className="flex flex-wrap gap-2">
                    {cadet.achievements.map((ach, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20"
                      >
                        ★ {ach}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Academic */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Educational Background</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Institution</span>
                  <span className="font-bold text-white text-sm">{cadet.institution}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Academic Class / Level</span>
                  <span className="font-semibold text-white">{cadet.classLevel || 'HSC / Degree'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Group / Faculty</span>
                  <span className="font-semibold text-white">{cadet.facultyOrGroup || 'Science / Business Studies / Humanities'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Academic Session</span>
                  <span className="font-semibold text-white">{cadet.session || '2024-2025'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Attendance */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Attendance Ratio</h4>
                  <p className="text-xs text-white/50">{attendedSessions} attended out of {totalSessions || 10} recorded drill parades</p>
                </div>
                <div className="text-2xl font-extrabold text-amber-400 font-mono">
                  {attendanceRate}%
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Drill Parade Log</h4>
                {cadetAttendanceRecords.length === 0 ? (
                  <p className="text-xs text-white/50 py-4 text-center">No individual session records found.</p>
                ) : (
                  cadetAttendanceRecords.map((r, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white block">{r.sessionName}</span>
                        <span className="text-white/40 text-[11px] font-mono">{r.date}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          r.status === 'Present'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : r.status === 'Late'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Events */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Participated Camps & Events
              </h3>
              {cadetEvents.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-xs">
                  No event records directly linked to this cadet.
                </div>
              ) : (
                cadetEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {evt.type}
                        </span>
                        <h4 className="font-bold text-white text-sm">{evt.title}</h4>
                      </div>
                      <p className="text-white/60 text-xs mt-1">{evt.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-white/40 mt-2">
                        <span>Date: {evt.date}</span>
                        <span>•</span>
                        <span>Location: {evt.location}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      Completed
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 6: Certificates */}
          {activeTab === 'certificates' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Military & Corps Certifications
              </h3>
              {cadetCerts.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-xs">
                  No certificate records on file for this cadet yet.
                </div>
              ) : (
                cadetCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-white text-sm">{cert.title}</h4>
                      </div>
                      <p className="text-white/60 text-xs mt-1">{cert.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-white/40 mt-2 font-mono">
                        <span>Cert No: {cert.certificateNo}</span>
                        <span>•</span>
                        <span>Issued: {cert.issueDate}</span>
                        <span>•</span>
                        <span>Grade: {cert.grade || 'Passed'}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 shrink-0">
                      Verified
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50 bg-white/[0.01]">
          <span>Record ID: {cadet.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
