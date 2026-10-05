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
  Phone,
  Clock,
  Shield,
  Layers,
  FileCode,
  Flame,
  ArrowRight,
  QrCode,
  LayoutGrid,
  List,
  HeartPulse,
  Medal,
  Target,
  FileBadge,
  Eye,
  Info,
  ChevronDown
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
  const [viewLayout, setViewLayout] = useState<'grid' | 'table' | 'blood'>('grid');
  
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
        c.bloodGroup.toLowerCase().includes(q) ||
        (c.platoon && c.platoon.toLowerCase().includes(q));

      const matchesBatch = selectedBatch === 'All' || c.batch === selectedBatch;
      const matchesRank = selectedRank === 'All' || c.rank === selectedRank;
      const matchesBlood = selectedBlood === 'All' || c.bloodGroup === selectedBlood;
      const matchesGender = selectedGender === 'All' || c.gender === selectedGender;

      return matchesQuery && matchesBatch && matchesRank && matchesBlood && matchesGender;
    });
  }, [publicCadets, searchQuery, selectedBatch, selectedRank, selectedBlood, selectedGender]);

  // Blood group breakdown for quick medical stats
  const bloodStats = useMemo(() => {
    const counts: Record<string, number> = { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0 };
    publicCadets.forEach((c) => {
      if (counts[c.bloodGroup] !== undefined) {
        counts[c.bloodGroup]++;
      }
    });
    return counts;
  }, [publicCadets]);

  const activeCount = useMemo(() => publicCadets.filter((c) => c.status === 'Active').length, [publicCadets]);
  const exCadetCount = useMemo(() => publicCadets.filter((c) => c.status === 'Ex Cadet' || c.status === 'Alumni').length, [publicCadets]);

  // Rank badge styling helper
  const getRankBadgeStyle = (rank: CadetRank) => {
    if (rank.includes('Officer') || rank.includes('PUO') || rank.includes('CUO') || rank.includes('SUO')) {
      return 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-sm shadow-amber-500/10';
    }
    if (rank.includes('Sergeant')) {
      return 'bg-red-500/20 text-red-300 border-red-500/50';
    }
    if (rank.includes('Corporal')) {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    }
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 tactical-grid-pattern">
      {/* Tactical Ambient Glows */}
      <div className="tactical-mesh-bg" />

      {/* Public Portal Top Navigation Bar & Official Institutional Header */}
      <header className="sticky top-0 z-40 bg-[#030712]/95 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Official Header Main with College Logo & BNCC Crest */}
          <div className="header-main flex items-center justify-between md:justify-start gap-4">
            <div className="relative group">
              <img
                src="https://i.ibb.co/SBfzG9K/logo-removebg-preview-2.png"
                alt="College Logo"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=CBCC&background=0b1120&color=e2b16a&bold=true';
                }}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0 drop-shadow-[0_0_12px_rgba(226,177,106,0.2)]"
              />
            </div>
            
            <div className="header-text text-left">
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight flex items-center gap-2">
                <span>Cox's Bazar City College</span>
                <span className="hidden lg:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  EST. 1993
                </span>
              </h1>
              <p
                style={{ color: '#e2b16a', letterSpacing: '2px' }}
                className="text-[11px] sm:text-xs font-bold uppercase tracking-wider"
              >
                BNCC PLATOON | ARMY WING
              </p>
              <p className="text-[10px] sm:text-[11px] text-amber-300/80 font-medium">
                ১৫ বিএনসিসি ব্যাটালিয়ন, কর্ণফুলী রেজিমেন্ট
              </p>
            </div>

            <div className="relative group">
              <img
                src="https://i.ibb.co/Fb3R6wR/Bncc-logo.png"
                alt="BNCC Logo"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=BNCC&background=0b1120&color=e2b16a&bold=true';
                }}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0 drop-shadow-[0_0_12px_rgba(226,177,106,0.2)]"
              />
            </div>
          </div>

          {/* Quick Actions & Officer Access */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              onClick={onOpenSchemaModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all active:scale-95"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>DDL & Specs</span>
            </button>

            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 border border-amber-300/40 transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Officer Console</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section & Platoon Identity */}
      <section className="relative overflow-hidden pt-8 pb-8 px-4 sm:px-8 border-b border-white/10 bg-gradient-to-b from-emerald-950/20 via-slate-950/80 to-[#030712]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>মৌলিক মূলনীতি: জ্ঞান, শৃঙ্খলা, একতা (Knowledge · Discipline · Unity)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Bangladesh National Cadet Corps
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 font-extrabold">
                  Institutional Cadet & Verification Dossier
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Official digital repository of Cox's Bazar City College Platoon (15 BNCC Battalion, Karnafuli Regiment). Search enrolled cadets, authenticate credentials, and access platoon operational schedules.
              </p>
            </div>

            {/* Tactical Strength Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-semibold">
                  <span>Enrolled Cadets</span>
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1">{publicCadets.length}</div>
                <div className="text-[10px] font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {activeCount} Active
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="text-amber-300">{exCadetCount} Ex-Cadet</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-semibold">
                  <span>Unit Battalion</span>
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">15 BNCC</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">Karnafuli Reg.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-semibold">
                  <span>Platoon Batches</span>
                  <Medal className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1">2023–25</div>
                <div className="text-[10px] text-amber-300 font-medium mt-0.5">2023 & 2024 Ex-Cadet</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-semibold">
                  <span>Blood Donors</span>
                  <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-red-400 mt-1">
                  {Object.values(bloodStats).reduce((a: number, b: number) => a + b, 0)}
                </div>
                <div className="text-[10px] text-red-300 font-semibold mt-0.5">Emergency Ready</div>
              </div>
            </div>
          </div>

          {/* Public Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-white/10 pt-4">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 font-black'
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
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 font-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Certificate Verification</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'events'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 font-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Training & Parades ({events.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wing-info')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'wing-info'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 font-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Platoon Command & Wings</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 pb-20 space-y-6">
        {/* TAB 1: CADETS DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            {/* Zero-Leakage Guarantee Notice */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3 text-xs text-emerald-300">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold">Zero-Leakage Institutional Privacy Active:</span> Sensitive civilian identifiers (NID, mobile numbers, resident addresses, guardian records) are strictly excluded from public views.
                </div>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>15 BNCC Verified</span>
              </div>
            </div>

            {/* Controls / Search Box & Layout Switcher */}
            <div className="controls p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="search-box relative flex-1">
                  <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="cadetSearch"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, cadet ID, rank, or blood group..."
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/[0.07] transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white px-1.5 py-0.5 rounded-full bg-white/10"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Selectors */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Batch Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-white/50 font-semibold">Batch:</span>
                    <select
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      className="px-2.5 py-2 text-xs rounded-xl bg-slate-950 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-semibold"
                    >
                      <option value="All">All Batches</option>
                      <option value="2025">Batch 2025 (Active)</option>
                      <option value="2024">Batch 2024 (Ex-Cadet)</option>
                      <option value="2023">Batch 2023 (Ex-Cadet)</option>
                    </select>
                  </div>

                  {/* Rank Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-white/50 font-semibold">Rank:</span>
                    <select
                      value={selectedRank}
                      onChange={(e) => setSelectedRank(e.target.value)}
                      className="px-2.5 py-2 text-xs rounded-xl bg-slate-950 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-semibold"
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
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-white/50 font-semibold">Blood:</span>
                    <select
                      value={selectedBlood}
                      onChange={(e) => setSelectedBlood(e.target.value)}
                      className="px-2.5 py-2 text-xs rounded-xl bg-slate-950 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-semibold"
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

                  {/* View Mode Layout Switcher */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/10 ml-auto lg:ml-2">
                    <button
                      onClick={() => setViewLayout('grid')}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewLayout === 'grid' ? 'bg-amber-400 text-slate-950 shadow' : 'text-white/60 hover:text-white'
                      }`}
                      title="Tactical Grid View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewLayout('table')}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewLayout === 'table' ? 'bg-amber-400 text-slate-950 shadow' : 'text-white/60 hover:text-white'
                      }`}
                      title="Roster Table View"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewLayout('blood')}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewLayout === 'blood' ? 'bg-red-600 text-white shadow' : 'text-white/60 hover:text-white'
                      }`}
                      title="Blood Donor Roster View"
                    >
                      <HeartPulse className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Batch Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-white/5">
                <span className="text-white/40 font-medium text-[11px] mr-1">Quick Filter:</span>
                {[
                  { id: 'All', label: 'All Cadets' },
                  { id: '2025', label: 'Batch 2025 (Active)' },
                  { id: '2024', label: 'Batch 2024 (Ex-Cadet)' },
                  { id: '2023', label: 'Batch 2023 (Ex-Cadet)' }
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBatch(b.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      selectedBatch === b.id
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-white/[0.02] text-white/60 hover:text-white border border-white/5'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}

                <div className="h-3 w-[1px] bg-white/10 mx-1" />

                {['A+', 'B+', 'O+', 'AB+'].map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBlood(selectedBlood === bg ? 'All' : bg)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                      selectedBlood === bg
                        ? 'bg-red-600/30 text-red-300 border border-red-500/50'
                        : 'bg-white/[0.02] text-white/60 hover:text-white border border-white/5'
                    }`}
                  >
                    🩸 {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* VIEW 1: TACTICAL GRID CARDS */}
            {viewLayout === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredCadets.map((cadet) => (
                  <div
                    key={cadet.id}
                    className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-amber-400/50 backdrop-blur-xl shadow-xl transition-all duration-200 group flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-amber-500/5"
                  >
                    <div className="space-y-3">
                      {/* Top Header: Photo & Verified Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="relative">
                          <img
                            src={cadet.photoUrl}
                            alt={cadet.fullName}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cadet.fullName)}&background=0f172a&color=f59e0b&bold=true`;
                            }}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/40 group-hover:border-amber-400 transition-colors shadow-md"
                          />
                          <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-slate-950 shadow" title="15 BNCC Verified Institutional Cadet">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        </div>

                        <div className="text-right space-y-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${getRankBadgeStyle(cadet.rank)}`}>
                            {cadet.rank}
                          </span>
                          <div className="text-[11px] font-mono text-amber-300 font-bold block">
                            #{cadet.cadetNo}
                          </div>
                        </div>
                      </div>

                      {/* Cadet Name & Academic Institution */}
                      <div>
                        <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                          {cadet.fullName}
                        </h3>
                        <p className="text-xs text-white/50 mt-0.5 line-clamp-1">
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
                          <span className="font-bold font-mono text-red-400">{cadet.bloodGroup}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-white/50 space-y-0.5">
                        <div><span className="text-white/30">Platoon:</span> {cadet.platoon}</div>
                        <div><span className="text-white/30">Unit:</span> 15 BNCC Battalion</div>
                      </div>
                    </div>

                    {/* Public Action / Verification */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      {cadet.status === 'Ex Cadet' || cadet.status === 'Alumni' ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Ex-Cadet
                        </span>
                      ) : cadet.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Active Cadet
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 font-semibold">
                          {cadet.status}
                        </span>
                      )}

                      <button
                        onClick={() => {
                          if (onViewCadet) {
                            onViewCadet(cadet);
                          } else {
                            setActiveTab('verify');
                          }
                        }}
                        className="text-amber-300 hover:text-amber-200 font-bold text-[11px] flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Dossier</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW 2: ROSTER TABLE VIEW */}
            {viewLayout === 'table' && (
              <div className="rounded-3xl bg-slate-900/90 border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-white/60 font-semibold border-b border-white/10 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Cadet Personnel</th>
                        <th className="py-3.5 px-4">Cadet ID</th>
                        <th className="py-3.5 px-4">Rank</th>
                        <th className="py-3.5 px-4">Batch</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Blood</th>
                        <th className="py-3.5 px-4">Platoon / Unit</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredCadets.map((cadet) => (
                        <tr key={cadet.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img
                              src={cadet.photoUrl}
                              alt={cadet.fullName}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cadet.fullName)}&background=0f172a&color=f59e0b&bold=true`;
                              }}
                              className="w-8 h-8 rounded-full object-cover border border-amber-400/40"
                            />
                            <div>
                              <div className="font-bold text-white group-hover:text-amber-300 transition-colors">{cadet.fullName}</div>
                              <div className="text-[10px] text-white/40">{cadet.institution}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-amber-300">{cadet.cadetNo}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRankBadgeStyle(cadet.rank)}`}>
                              {cadet.rank}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-white">Batch {cadet.batch}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                cadet.status === 'Ex Cadet' || cadet.status === 'Alumni'
                                  ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                                  : cadet.status === 'Active'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                              }`}
                            >
                              {cadet.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-red-400">{cadet.bloodGroup}</td>
                          <td className="py-3 px-4 text-white/60">
                            <div>{cadet.platoon}</div>
                            <div className="text-[10px] text-white/40">15 BNCC Battalion</div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                if (onViewCadet) onViewCadet(cadet);
                                else setActiveTab('verify');
                              }}
                              className="px-3 py-1 rounded-lg bg-amber-400/10 text-amber-300 hover:bg-amber-400 hover:text-slate-950 font-bold text-[11px] border border-amber-400/30 transition-all"
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 3: BLOOD DONOR EMERGENCY MATRIX */}
            {viewLayout === 'blood' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-red-950/30 border border-red-500/30 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Emergency Blood Donor Network</h3>
                      <p className="text-xs text-slate-300">
                        In medical emergencies, hospital authorities can cross-verify registered cadet blood groups through the Platoon Office.
                      </p>
                    </div>
                  </div>
                  <a
                    href="tel:+8801812430454"
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all shrink-0 justify-center"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Emergency Hotline: +880 1812-430454</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {Object.entries(bloodStats).map(([bg, count]) => (
                    <button
                      key={bg}
                      onClick={() => setSelectedBlood(selectedBlood === bg ? 'All' : bg)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        selectedBlood === bg
                          ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/30 scale-105'
                          : 'bg-slate-900/80 border-white/10 hover:border-red-500/40'
                      }`}
                    >
                      <div className="text-xl font-black font-mono">{bg}</div>
                      <div className="text-xs font-semibold mt-1 text-red-300">{count} Donors</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCadets.map((cadet) => (
                    <div
                      key={cadet.id}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-3 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 font-black font-mono flex items-center justify-center text-sm">
                          {cadet.bloodGroup}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{cadet.fullName}</div>
                          <div className="text-[11px] text-white/50">{cadet.rank} · Batch {cadet.batch}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        Ready
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredCadets.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/10 space-y-3">
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
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Platoon Ceremonial Parades & Training Camps</h2>
                <p className="text-xs text-white/50 mt-1">
                  Official schedule of district national day guards of honour, annual battalion training camps, and community initiatives.
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold font-mono">
                Session 2024–2026
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-amber-400/40 transition-all space-y-4 shadow-xl group hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 border border-amber-400/30 text-amber-300 uppercase">
                        {ev.type}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{ev.title}</h3>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                      {ev.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-white/10 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Date: <strong className="text-white">{ev.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>Venue: <strong className="text-white">{ev.location}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Command: <strong className="text-white">{ev.organizedBy}</strong></span>
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
            <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border border-white/10 space-y-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-white">Chain of Command & Institutional Dossier</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                The Bangladesh National Cadet Corps (BNCC) is a Tri-Services organization comprising Army, Navy, and Air wings. Cox's Bazar City College Platoon operates under the command of 15 BNCC Battalion (১৫ বিএনসিসি ব্যাটালিয়ন, কর্ণফুলী রেজিমেন্ট) within the prestigious Karnafuli Regiment.
              </p>
            </div>

            {/* Officers in Command */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-400/30 space-y-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black text-xl shadow-lg">
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

              <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-black text-xl shadow-lg">
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
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 shadow-lg">
                <Shield className="w-6 h-6 text-amber-400" />
                <h4 className="font-bold text-white text-sm">Military Drill & Discipline</h4>
                <p className="text-xs text-white/60">Squad march, rifle manual of arms, ceremonial guard of honour, and leadership under pressure.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 shadow-lg">
                <Award className="w-6 h-6 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Disaster Relief & First Aid</h4>
                <p className="text-xs text-white/60">Coastal cyclone rescue, emergency medical triage, CPR certification, and humanitarian aid.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 shadow-lg">
                <Flame className="w-6 h-6 text-red-400" />
                <h4 className="font-bold text-white text-sm">Shooting & Field Craft</h4>
                <p className="text-xs text-white/60">0.22 Rifle marksmanship at 50m range, obstacle crossing, map reading, and camouflage.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="institutional-footer border-t border-white/10 bg-[#030712]/95 py-12 px-4 sm:px-8 text-xs text-white/70">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Column 1: Commander */}
          <div style={{ textAlign: 'center' }} className="flex flex-col items-center">
            <img
              src="https://cbccbncc.netlify.app/POU.png"
              alt="Commander"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=PUO+Ujjwal+Kanti+Deb&background=0f172a&color=e2b16a&bold=true';
              }}
              style={{ width: '120px', height: '140px', border: '3px solid #e2b16a', objectFit: 'cover' }}
              className="rounded-lg shadow-lg"
            />
            <h4 style={{ margin: '10px 0 5px' }} className="text-base font-bold text-white">
              PUO Ujjwal Kanti Deb
            </h4>
            <p style={{ color: '#e2b16a', fontSize: '0.8rem' }} className="font-semibold">
              Platoon Commander
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: 'white', borderBottom: '2px solid #dc2626', display: 'inline-block' }} className="font-bold pb-1 text-sm tracking-wide">
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#e2b16a', lineHeight: 2 }} className="mt-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('events');
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Training Schedule</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('directory');
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Official Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Emergency Log</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Location */}
          <div>
            <h4 style={{ color: 'white', borderBottom: '2px solid #dc2626', display: 'inline-block' }} className="font-bold pb-1 text-sm tracking-wide">
              Location
            </h4>
            <div className="mt-2 space-y-2 text-[0.9rem] text-slate-300">
              <p style={{ fontSize: '0.9rem' }} className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Cox's Bazar City College, College Road</span>
              </p>
              <p style={{ fontSize: '0.9rem' }} className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+8801812430454" className="hover:text-white transition-colors font-mono">
                  +880 1812-430454
                </a>
              </p>
              <p className="text-xs text-white/50 pt-2 border-t border-white/5">
                Regiment: Karnafuli Regiment (15 BNCC Battalion)
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.75rem', color: '#777', borderTop: '1px solid #333', paddingTop: '20px' }}>
          &copy; 2026 CBCC BNCC PLATOON. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};

