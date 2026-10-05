import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  IdCard,
  Download,
  Plus,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Cadet, BatchYear, BloodGroup, Gender, CadetRank, CadetStatus } from '../types';

interface CadetTableViewProps {
  cadets: Cadet[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBatch: string | null;
  onSelectBatch: (b: string | null) => void;
  onViewCadet: (cadet: Cadet) => void;
  onEditCadet: (cadet: Cadet) => void;
  onDeleteCadet: (id: string) => void;
  onOpenIdCard: (cadet: Cadet) => void;
  onOpenAddCadet: () => void;
  onExportCSV: () => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const CadetTableView: React.FC<CadetTableViewProps> = ({
  cadets,
  searchQuery,
  onSearchChange,
  selectedBatch,
  onSelectBatch,
  onViewCadet,
  onEditCadet,
  onDeleteCadet,
  onOpenIdCard,
  onOpenAddCadet,
  onExportCSV,
  isAdmin,
  onRequireAdmin
}) => {
  // Filters state
  const [filterBlood, setFilterBlood] = useState<string>('All');
  const [filterGender, setFilterGender] = useState<string>('All');
  const [filterRank, setFilterRank] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Sorting
  const [sortBy, setSortBy] = useState<'cadetNo' | 'fullName' | 'rank' | 'batch' | 'bloodGroup'>('cadetNo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Deletion confirm modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtering logic
  const filteredCadets = useMemo(() => {
    return cadets.filter((cadet) => {
      // Global Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          cadet.fullName.toLowerCase().includes(query) ||
          cadet.cadetNo.toLowerCase().includes(query) ||
          cadet.rank.toLowerCase().includes(query) ||
          cadet.batch.toLowerCase().includes(query) ||
          cadet.bloodGroup.toLowerCase().includes(query) ||
          cadet.institution.toLowerCase().includes(query) ||
          (cadet.mobile && cadet.mobile.includes(query)) ||
          (cadet.fatherName && cadet.fatherName.toLowerCase().includes(query)) ||
          (cadet.district && cadet.district.toLowerCase().includes(query));

        if (!matchesQuery) return false;
      }

      // Batch filter
      if (selectedBatch && selectedBatch !== 'All' && cadet.batch !== selectedBatch) {
        return false;
      }

      // Blood group filter
      if (filterBlood !== 'All' && cadet.bloodGroup !== filterBlood) {
        return false;
      }

      // Gender filter
      if (filterGender !== 'All' && cadet.gender !== filterGender) {
        return false;
      }

      // Rank filter
      if (filterRank !== 'All' && cadet.rank !== filterRank) {
        return false;
      }

      // Status filter
      if (filterStatus !== 'All' && cadet.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [cadets, searchQuery, selectedBatch, filterBlood, filterGender, filterRank, filterStatus]);

  // Sorting logic
  const sortedCadets = useMemo(() => {
    return [...filteredCadets].sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCadets, sortBy, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedCadets.length / itemsPerPage) || 1;
  const paginatedCadets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCadets.slice(start, start + itemsPerPage);
  }, [sortedCadets, currentPage, itemsPerPage]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleClearAllFilters = () => {
    onSearchChange('');
    onSelectBatch(null);
    setFilterBlood('All');
    setFilterGender('All');
    setFilterRank('All');
    setFilterStatus('All');
    setCurrentPage(1);
  };

  return (
    <div id="cadet-table-view" className="space-y-5">
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Cadet Master Database</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-amber-400/10 text-amber-300 border border-amber-400/30">
              {filteredCadets.length} Records
            </span>
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            Real-time filtered view of all enrolled military cadets with search & print capabilities
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="cadet-export-csv-btn"
            onClick={onExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/90 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-white/60" />
            <span>Export CSV</span>
          </button>

          <button
            id="cadet-add-new-btn"
            onClick={onOpenAddCadet}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Cadet</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Search box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search name, cadet no, institution..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          {/* Batch Selector */}
          <div>
            <select
              value={selectedBatch || 'All'}
              onChange={(e) => {
                onSelectBatch(e.target.value === 'All' ? null : e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
            >
              <option value="All">All Batches</option>
              <option value="2023">Batch 2023</option>
              <option value="2024">Batch 2024</option>
              <option value="2025">Batch 2025</option>
              <option value="2026">Batch 2026</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <select
              value={filterBlood}
              onChange={(e) => {
                setFilterBlood(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
            >
              <option value="All">All Blood Groups</option>
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

          {/* Gender */}
          <div>
            <select
              value={filterGender}
              onChange={(e) => {
                setFilterGender(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Status / Reset */}
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Ex Cadet">Ex Cadet</option>
              <option value="Inactive">Inactive</option>
              <option value="Alumni">Alumni</option>
            </select>

            {(searchQuery || selectedBatch || filterBlood !== 'All' || filterGender !== 'All' || filterStatus !== 'All') && (
              <button
                onClick={handleClearAllFilters}
                className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 font-semibold text-xs border border-white/10"
                title="Reset filters"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table id="cadet-master-table" className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-white/50 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold w-12 text-center">SL</th>
                <th
                  onClick={() => handleSort('cadetNo')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Cadet No</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold">Photo</th>
                <th
                  onClick={() => handleSort('fullName')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Cadet Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('rank')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('batch')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Batch</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold">Gender</th>
                <th
                  onClick={() => handleSort('bloodGroup')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Blood</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedCadets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-white/40">
                    <p className="text-sm font-medium">No cadet records found matching current criteria.</p>
                    <button
                      onClick={handleClearAllFilters}
                      className="mt-2 text-xs text-amber-400 hover:underline font-semibold"
                    >
                      Clear search & filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedCadets.map((cadet, idx) => {
                  const sl = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr
                      key={cadet.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* SL */}
                      <td className="py-3.5 px-4 text-center font-mono text-white/40">{sl}</td>

                      {/* Cadet No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                        {cadet.cadetNo}
                      </td>

                      {/* Photo */}
                      <td className="py-3.5 px-4">
                        <img
                          src={cadet.photoUrl}
                          alt={cadet.fullName}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cadet.fullName)}&background=0f172a&color=f59e0b&bold=true`;
                          }}
                          className="w-9 h-9 rounded-full object-cover border border-white/15 shadow-sm group-hover:scale-105 transition-transform"
                        />
                      </td>

                      {/* Name & Academic info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                          {cadet.fullName}
                        </div>
                        <div className="text-[11px] text-white/50 truncate max-w-[180px]">
                          {cadet.institution}
                        </div>
                      </td>

                      {/* Rank */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded font-medium text-[11px] bg-white/5 border border-white/10 text-white/80">
                          {cadet.rank}
                        </span>
                      </td>

                      {/* Batch */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-amber-400/10 text-amber-300 border border-amber-400/20">
                          {cadet.batch}
                        </span>
                      </td>

                      {/* Gender */}
                      <td className="py-3.5 px-4 text-white/70">{cadet.gender}</td>

                      {/* Blood */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-red-500/10 text-red-300 border border-red-500/20">
                          {cadet.bloodGroup}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            cadet.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : cadet.status === 'Ex Cadet' || cadet.status === 'Alumni'
                              ? 'bg-amber-400/15 text-amber-300 border-amber-400/30 font-bold'
                              : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                          }`}
                        >
                          {cadet.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <button
                            id={`view-cadet-${cadet.id}`}
                            onClick={() => onViewCadet(cadet)}
                            title="View Full Profile"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Print Military ID Card */}
                          <button
                            id={`idcard-cadet-${cadet.id}`}
                            onClick={() => onOpenIdCard(cadet)}
                            title="Military ID Card & QR"
                            className="p-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/20 transition-colors"
                          >
                            <IdCard className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Cadet */}
                          <button
                            id={`edit-cadet-${cadet.id}`}
                            onClick={() => {
                              if (isAdmin) {
                                onEditCadet(cadet);
                              } else {
                                onRequireAdmin();
                              }
                            }}
                            title={isAdmin ? 'Edit Cadet Details' : 'Admin PIN Required to Edit'}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-500/20 text-white/70 hover:text-blue-300 border border-white/10 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Cadet */}
                          <button
                            id={`delete-cadet-${cadet.id}`}
                            onClick={() => {
                              if (isAdmin) {
                                setDeleteConfirmId(cadet.id);
                              } else {
                                onRequireAdmin();
                              }
                            }}
                            title={isAdmin ? 'Delete Cadet' : 'Admin PIN Required to Delete'}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 border border-white/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination & Items Per Page */}
        <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedCadets.length)} of {sortedCadets.length} cadets
            </span>
            <span className="text-white/20">|</span>
            <span>Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
            >
              Prev
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Are you sure you want to permanently delete this cadet record from the database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteCadet(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-600/30"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
