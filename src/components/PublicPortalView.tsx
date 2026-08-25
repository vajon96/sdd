import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  Calendar,
  Building2,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  Shield,
  Layers,
  FileCode,
  Flame,
  ArrowRight,
  QrCode
} from 'lucide-react';
import { PublicCadet, BNCCEvent, PublicNavTab, BatchYear, CadetRank, BloodGroup } from '../types';
import { CertificateVerificationDesk } from './CertificateVerificationDesk';

interface PublicPortalViewProps {
  publicCadets: PublicCadet[];
  events: BNCCEvent[];
  onOpenAdminLogin: () => void;
  onOpenSchemaModal: () => void;
  onViewCadet?: (cadet: PublicCadet) => void;
}

export const PublicPortalView: React.FC<PublicPortalViewProps> = ({
  publicCadets,
  events,
  onOpenAdminLogin,
  onOpenSchemaModal,
  onViewCadet
}) => {
  const [activeTab, setActiveTab] = useState<PublicNavTab>('directory');
  
  // Directory Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [selectedRank, setSelectedRank] = useState<string>('All');
  const [selectedBlood, setSelectedBlood] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');

  // Filtered Public Cadets (Strict Zero Leakage)
  const filteredCadets = useMemo(() => {
    return publicCadets.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.cadetNo.toLowerCase().includes(q) ||
        c.rank.toLowerCase().includes(q) ||
        c.bloodGroup.toLowerCase().includes(q);

      const matchesBatch = selectedBatch === 'All' || c.batch === selectedBatch;
      const matchesRank = selectedRank === 'All' || c.rank === selectedRank;
      const matchesBlood = selectedBlood === 'All' || c.bloodGroup === selectedBlood;
      const matchesGender = selectedGender === 'All' || c.gender === selectedGender;

      return matchesQuery && matchesBatch && matchesRank && matchesBlood && matchesGender;
    });
  }, [publicCadets, searchQuery, selectedBatch, selectedRank, selectedBlood, selectedGender]);

  // Rank badge styling helper
  const getRankBadgeStyle = (rank: CadetRank) => {
    if (rank.includes('Officer') || rank.includes('PUO') || rank.includes('CUO') || rank.includes('SUO')) {
      return 'bg-amber-400/20 text-amber-300 border-amber-400/40';
    }
    if (rank.includes('Sergeant')) {
      return 'bg-red-500/20 text-red-300 border-red-500/40';
    }
    if (rank.includes('Corporal')) {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Public Portal Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Institutional Crest & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-400/20 border border-amber-300/50">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-sm sm:text-base tracking-tight">
                  BNCC PLATOON PORTAL
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase">
                  Public Verified Registry
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 tracking-wider font-medium">
                Cox's Bazar City College · ১৫ বিএনসিসি ব্যাটালিয়ন, কর্ণফুলী রেজিমেন্ট
              </p>
            </div>
          </div>

          {/* Quick Actions / Officer Mode */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenSchemaModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-semibold transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>DDL & API Docs</span>
            </button>

            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-400/20 border border-amber-300/40 transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Officer Console</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header & Institutional Motto */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-8 border-b border-white/10 bg-gradient-to-b from-emerald-950/40 via-slate-950 to-slate-950">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Motto: জ্ঞান, শৃঙ্খলা, একতা (Knowledge · Discipline · Unity)</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Bangladesh National Cadet Corps
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  Institutional Cadet & Verification Directory
                </span>
              </h1>
              <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
                Official public access portal for verifying enrolled cadets, authenticating training camp certificates, viewing upcoming parades, and reviewing institutional platoon achievements.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <span className="text-[10px] text-white/50 uppercase font-semibold block">Total Enrolled</span>
                <span className="text-2xl font-black text-white">{publicCadets.length} Cadets</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <span className="text-[10px] text-white/50 uppercase font-semibold block">Active Batches</span>
                <span className="text-2xl font-black text-amber-400">2023–2025</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md col-span-2 sm:col-span-1">
                <span className="text-[10px] text-white/50 uppercase font-semibold block">Regiment</span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">Karnafuli Reg.</span>
              </div>
            </div>
          </div>

          {/* Public Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-white/10 pt-4">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Cadets Directory ({filteredCadets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'verify'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Certificate Verification Desk</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'events'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Parades & Events ({events.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wing-info')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'wing-info'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Platoon Hierarchy & Wings</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 pb-20">
        {/* TAB 1: CADETS DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            {/* Zero-Leakage Guarantee Notice */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">Zero-Leakage Privacy Protection Active:</span> Sensitive civilian details (National ID / Birth Cert, phone numbers, emails, guardian contacts, and residential addresses) are redacted from this public portal.
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Cadet Name, Cadet Number, Rank, Blood Group..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/[0.07]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Batch Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50 font-semibold whitespace-nowrap">Batch:</span>
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="All">All Batches</option>
                    <option value="2025">Batch 2025</option>
                    <option value="2024">Batch 2024</option>
                    <option value="2023">Batch 2023</option>
                  </select>
                </div>

                {/* Rank Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50 font-semibold whitespace-nowrap">Rank:</span>
                  <select
                    value={selectedRank}
                    onChange={(e) => setSelectedRank(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="All">All Ranks</option>
                    <option value="Cadet">Cadet</option>
                    <option value="Lance Corporal">Lance Corporal</option>
                    <option value="Corporal">Corporal</option>
                    <option value="Sergeant">Sergeant</option>
                    <option value="Cadet Under Officer (CUO)">CUO</option>
                    <option value="Professor Under Officer (PUO)">PUO</option>
                  </select>
                </div>

                {/* Blood Group */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50 font-semibold whitespace-nowrap">Blood:</span>
                  <select
                    value={selectedBlood}
                    onChange={(e) => setSelectedBlood(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="All">All Groups</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cadets Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredCadets.map((cadet) => (
                <div
                  key={cadet.id}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-amber-400/40 backdrop-blur-xl shadow-xl transition-all duration-200 group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Header: Photo & Verified Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative">
                        <img
                          src={cadet.photoUrl}
                          alt={cadet.fullName}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/40 group-hover:border-amber-400 transition-colors shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-slate-950 shadow" title="Verified Institutional Cadet">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <div className="text-right space-y-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRankBadgeStyle(cadet.rank)}`}>
                          {cadet.rank}
                        </span>
                        <div className="text-[11px] font-mono text-amber-300 font-bold block">
                          #{cadet.cadetNo}
                        </div>
                      </div>
                    </div>

                    {/* Cadet Name & Academic Session */}
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                        {cadet.fullName}
                      </h3>
                      <p className="text-xs text-white/50 mt-0.5">
                        {cadet.institution}
                      </p>
                    </div>

                    {/* Details Pill Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5">
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[10px] text-white/40 block">Batch</span>
                        <span className="font-semibold text-white">Batch {cadet.batch}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[10px] text-white/40 block">Blood Group</span>
                        <span className="font-semibold text-red-400">{cadet.bloodGroup}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-white/50 space-y-0.5">
                      <div><span className="text-white/30">Platoon:</span> {cadet.platoon}</div>
                      <div><span className="text-white/30">Regiment:</span> {cadet.regiment}</div>
                    </div>
                  </div>

                  {/* Public Action / Status */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active Regular
                    </span>

                    <button
                      onClick={() => {
                        setActiveTab('verify');
                      }}
                      className="text-amber-300 hover:text-amber-200 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <span>Verify Status</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCadets.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
                <Search className="w-10 h-10 text-white/20 mx-auto" />
                <h4 className="text-base font-bold text-white">No Cadets Found</h4>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  Try adjusting your search criteria or resetting the batch/rank filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBatch('All');
                    setSelectedRank('All');
                    setSelectedBlood('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CERTIFICATE VERIFICATION */}
        {activeTab === 'verify' && (
          <CertificateVerificationDesk />
        )}

        {/* TAB 3: PUBLIC EVENTS & PARADES */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Platoon Ceremonial Parades & Camps Timeline</h2>
                <p className="text-xs text-white/50 mt-1">
                  Official schedule of district national day guards of honour, annual battalion training camps, and community initiatives.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-amber-400/30 transition-all space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 border border-amber-400/30 text-amber-300 uppercase">
                        {ev.type}
                      </span>
                      <h3 className="text-lg font-bold text-white">{ev.title}</h3>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                      {ev.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Date: <strong className="text-white">{ev.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>Venue: <strong className="text-white">{ev.location}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Organized by: <strong className="text-white">{ev.organizedBy}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WING & PLATOON HIERARCHY */}
        {activeTab === 'wing-info' && (
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border border-white/10 space-y-4">
              <h2 className="text-2xl font-bold text-white">Chain of Command & Institutional Dossier</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                The Bangladesh National Cadet Corps (BNCC) is a Tri-Services organization comprising Army, Navy, and Air wings. Cox's Bazar City College Platoon operates under the command of 15 BNCC Battalion (১৫ বিএনসিসি ব্যাটালিয়ন, কর্ণফুলী রেজিমেন্ট) within the prestigious Karnafuli Regiment.
              </p>
            </div>

            {/* Officers in Command */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-400/30 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-xl">
                    PUO
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">PUO Ujjwal Kanti Deb</h3>
                    <p className="text-xs text-amber-400 font-semibold">Professor Under Officer · Platoon Commander</p>
                    <p className="text-xs text-white/50">Faculty, Cox's Bazar City College</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Directs institutional drill training, ceremonial protocol, recruitment selection, and battalion camp delegations.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xl">
                    SGT
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Cadet Sgt. Mr. Kader</h3>
                    <p className="text-xs text-emerald-400 font-semibold">Cadet Sergeant · Platoon In-Charge</p>
                    <p className="text-xs text-white/50">Batch 2024 · Karnafuli Regiment</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Supervises daily parade formations, rifle drill instruction, uniform discipline, and physical fitness conditioning.
                </p>
              </div>
            </div>

            {/* Core Training Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <Shield className="w-6 h-6 text-amber-400" />
                <h4 className="font-bold text-white text-sm">Military Drill & Discipline</h4>
                <p className="text-xs text-white/60">Squad march, rifle manual of arms, ceremonial guard of honour, and leadership under pressure.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <Award className="w-6 h-6 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Disaster Relief & First Aid</h4>
                <p className="text-xs text-white/60">Coastal cyclone rescue, emergency medical triage, CPR certification, and humanitarian aid.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <Flame className="w-6 h-6 text-red-400" />
                <h4 className="font-bold text-white text-sm">Shooting & Field Craft</h4>
                <p className="text-xs text-white/60">0.22 Rifle marksmanship at 50m range, obstacle crossing, map reading, and camouflage.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Public Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-8 px-4 sm:px-8 text-xs text-white/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">BNCC Platoon Management Platform</span>
            <span>·</span>
            <span>Cox's Bazar City College</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSchemaModal}
              className="text-amber-400 hover:text-amber-300 font-semibold"
            >
              PostgreSQL DDL & Nginx Proxy Architecture
            </button>
            <span>·</span>
            <button
              onClick={onOpenAdminLogin}
              className="text-white/80 hover:text-white font-semibold"
            >
              Command Console
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
