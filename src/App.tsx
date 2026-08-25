import React, { useState, useEffect } from 'react';
import { Sidebar, NavView } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { CadetTableView } from './components/CadetTableView';
import { BatchManagementView } from './components/BatchManagementView';
import { AttendanceView } from './components/AttendanceView';
import { EventsView } from './components/EventsView';
import { CertificatesView } from './components/CertificatesView';
import { AuditLogView } from './components/AuditLogView';
import { PublicPortalView } from './components/PublicPortalView';
import { CadetProfileModal } from './components/CadetProfileModal';
import { CadetFormModal } from './components/CadetFormModal';
import { MilitaryIdCardModal } from './components/MilitaryIdCardModal';
import { AdminPinModal } from './components/AdminPinModal';
import { ExportBackupModal } from './components/ExportBackupModal';
import { RankPromotionModal } from './components/RankPromotionModal';
import { CertificateStudioModal } from './components/CertificateStudioModal';
import { DatabaseSchemaModal } from './components/DatabaseSchemaModal';
import {
  Cadet,
  NavigationView,
  AttendanceSession,
  BNCCEvent,
  Certificate,
  ActivityLog,
  PublicCadet,
  CadetRank,
  UserRole
} from './types';
import {
  getCadets,
  getPublicCadets,
  saveCadet,
  deleteCadet,
  getAttendanceSessions,
  saveAttendanceSession,
  deleteAttendanceSession,
  getEvents,
  saveEvent,
  deleteEvent,
  getCertificates,
  saveCertificate,
  deleteCertificate,
  getActivityLogs,
  addActivityLog,
  promoteCadet,
  exportAllDataToJSON,
  importAllDataFromJSON,
  exportCadetsToCSV,
  resetToSeedData
} from './data/storage';

export default function App() {
  // Dual-Portal Mode: 'public' (Public Verification & Directory) vs. 'admin' (Officer Command Console)
  const [portalMode, setPortalMode] = useState<'public' | 'admin'>('public');

  // Navigation within Admin Portal
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Core Data
  const [cadets, setCadets] = useState<Cadet[]>([]);
  const [publicCadets, setPublicCadets] = useState<PublicCadet[]>([]);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>([]);
  const [events, setEvents] = useState<BNCCEvent[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Search & Batch Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  // Admin Mode & Role
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Modals
  const [viewingCadet, setViewingCadet] = useState<Cadet | null>(null);
  const [editingCadet, setEditingCadet] = useState<Cadet | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [idCardCadet, setIdCardCadet] = useState<Cadet | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState<boolean>(false);
  const [isIssueCertModalOpen, setIsIssueCertModalOpen] = useState<boolean>(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Load initial data from localStorage (or seed)
  const refreshData = () => {
    setCadets(getCadets());
    setPublicCadets(getPublicCadets());
    setAttendanceSessions(getAttendanceSessions());
    setEvents(getEvents());
    setCertificates(getCertificates());
    setLogs(getActivityLogs());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers for Cadet CRUD
  const handleSaveCadet = (cadetData: Cadet) => {
    const isEdit = !!editingCadet;
    saveCadet(cadetData);
    refreshData();
    showToast(isEdit ? `Updated record for ${cadetData.fullName}` : `Enrolled ${cadetData.fullName} into Batch ${cadetData.batch}`);
    if (viewingCadet && viewingCadet.id === cadetData.id) {
      setViewingCadet(cadetData);
    }
  };

  const handleDeleteCadet = (id: string) => {
    const cadetToDelete = cadets.find((c) => c.id === id);
    deleteCadet(id);
    refreshData();
    showToast(`Soft-deleted record: ${cadetToDelete?.fullName || id}`);
    if (viewingCadet?.id === id) {
      setViewingCadet(null);
    }
  };

  // Handlers for Rank Promotion
  const handlePromoteCadet = (
    cadetId: string,
    newRank: CadetRank,
    orderRef: string,
    promotedBy: string,
    promotionDate: string,
    remarks?: string
  ) => {
    const updated = promoteCadet(cadetId, newRank, orderRef, promotedBy, promotionDate, remarks);
    if (updated) {
      refreshData();
      showToast(`Rank promotion order executed: ${updated.fullName} ➔ ${newRank}`);
    }
  };

  // Handlers for Certificates
  const handleIssueCertificate = (cert: Certificate) => {
    saveCertificate(cert);
    refreshData();
    showToast(`Certificate ${cert.certificateNo} issued to ${cert.cadetName}!`);
  };

  // Handlers for Attendance
  const handleSaveAttendance = (session: AttendanceSession) => {
    saveAttendanceSession(session);
    refreshData();
    showToast(`Parade attendance for ${session.date} saved!`);
  };

  const handleDeleteAttendance = (id: string) => {
    deleteAttendanceSession(id);
    refreshData();
    showToast('Attendance session deleted.');
  };

  // Handlers for Events
  const handleSaveEvent = (event: BNCCEvent) => {
    saveEvent(event);
    refreshData();
    showToast(`Event "${event.title}" saved!`);
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    refreshData();
    showToast('Event removed.');
  };

  // Export/Import & Reset Handlers
  const handleExportJSON = () => {
    exportAllDataToJSON();
    showToast('Full JSON backup downloaded.');
  };

  const handleImportJSON = (jsonStr: string): boolean => {
    const res = importAllDataFromJSON(jsonStr);
    if (res) {
      refreshData();
      showToast('Database successfully restored from backup file.');
    }
    return res;
  };

  const handleExportCSV = () => {
    exportCadetsToCSV();
    showToast('Cadet CSV file downloaded.');
  };

  const handleResetSeedData = () => {
    resetToSeedData();
    refreshData();
    showToast('Database reset to original institutional seed cadets.');
  };

  // Batch Filter Jump helper
  const handleBatchSelectAndFilter = (batchYear: string) => {
    setSelectedBatch(batchYear);
    setCurrentView('cadets');
  };

  return (
    <div id="bncc-app-root" className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-x-hidden font-sans">
      {/* Background Decorative Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Floating Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900/95 border border-amber-400/40 text-amber-300 text-xs font-semibold shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PUBLIC PORTAL VIEW (Zero-Leakage Directory & Verification Desk)        */}
      {/* ========================================================================= */}
      {portalMode === 'public' ? (
        <PublicPortalView
          publicCadets={publicCadets}
          events={events}
          onOpenAdminLogin={() => setIsAdminModalOpen(true)}
          onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
          onViewCadet={(publicCadet) => {
            const fullCadet = cadets.find((c) => c.id === publicCadet.id);
            if (fullCadet) setViewingCadet(fullCadet);
          }}
        />
      ) : (
        /* ========================================================================= */
        /* 2. OFFICER ADMIN MANAGEMENT CONSOLE (Full Master Records & Command Desk)   */
        /* ========================================================================= */
        <div className="min-h-screen flex w-full relative">
          {/* Sidebar Navigation */}
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => {
              setCurrentView(view);
              setIsMobileSidebarOpen(false);
            }}
            onSelectView={(view) => {
              setCurrentView(view);
              setIsMobileSidebarOpen(false);
            }}
            isMobileOpen={isMobileSidebarOpen}
            mobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            totalCadets={cadets.length}
            cadetsCount={cadets.length}
            isAdmin={isAdmin}
            userRole={userRole}
            onToggleAdminModal={() => setIsAdminModalOpen(true)}
            onOpenSettings={() => setIsExportModalOpen(true)}
            onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
            onSwitchToPublicPortal={() => setPortalMode('public')}
            activeBatch={selectedBatch}
            onSelectBatch={(b) => {
              setSelectedBatch(b);
              setCurrentView('cadets');
            }}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
            {/* TopBar with Search & Quick Actions */}
            <TopBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenAddCadet={() => {
                setEditingCadet(null);
                setIsFormModalOpen(true);
              }}
              isAdmin={isAdmin}
              onToggleAdmin={() => setIsAdminModalOpen(true)}
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              selectedBatch={selectedBatch}
              onClearBatchFilter={() => setSelectedBatch(null)}
            />

            {/* View Router */}
            <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-16">
              {currentView === 'dashboard' && (
                <DashboardView
                  cadets={cadets}
                  events={events}
                  attendanceSessions={attendanceSessions}
                  logs={logs}
                  onSelectBatch={handleBatchSelectAndFilter}
                  onNavigate={setCurrentView}
                  onOpenAddCadet={() => {
                    setEditingCadet(null);
                    setIsFormModalOpen(true);
                  }}
                  onOpenTakeAttendance={() => setCurrentView('attendance')}
                  onOpenCreateEvent={() => setCurrentView('events')}
                  onViewCadet={(cadet) => setViewingCadet(cadet)}
                />
              )}

              {currentView === 'cadets' && (
                <CadetTableView
                  cadets={cadets}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedBatch={selectedBatch}
                  onSelectBatch={setSelectedBatch}
                  onViewCadet={(c) => setViewingCadet(c)}
                  onEditCadet={(c) => {
                    setEditingCadet(c);
                    setIsFormModalOpen(true);
                  }}
                  onDeleteCadet={handleDeleteCadet}
                  onOpenIdCard={(c) => setIdCardCadet(c)}
                  onOpenAddCadet={() => {
                    setEditingCadet(null);
                    setIsFormModalOpen(true);
                  }}
                  onExportCSV={handleExportCSV}
                  isAdmin={isAdmin}
                  onRequireAdmin={() => setIsAdminModalOpen(true)}
                />
              )}

              {currentView === 'batches' && (
                <BatchManagementView
                  cadets={cadets}
                  onSelectBatchAndFilter={handleBatchSelectAndFilter}
                  onViewCadet={(c) => setViewingCadet(c)}
                />
              )}

              {currentView === 'attendance' && (
                <AttendanceView
                  cadets={cadets}
                  sessions={attendanceSessions}
                  onSaveSession={handleSaveAttendance}
                  onDeleteSession={handleDeleteAttendance}
                  isAdmin={isAdmin}
                  onRequireAdmin={() => setIsAdminModalOpen(true)}
                />
              )}

              {currentView === 'events' && (
                <EventsView
                  events={events}
                  cadets={cadets}
                  onSaveEvent={handleSaveEvent}
                  onDeleteEvent={handleDeleteEvent}
                  isAdmin={isAdmin}
                  onRequireAdmin={() => setIsAdminModalOpen(true)}
                />
              )}

              {currentView === 'certificates' && (
                <CertificatesView
                  certificates={certificates}
                  cadets={cadets}
                  onOpenIssueModal={() => setIsIssueCertModalOpen(true)}
                  onOpenPromotionModal={() => setIsPromotionModalOpen(true)}
                  onRefresh={refreshData}
                  isAdmin={isAdmin}
                  onRequireAdmin={() => setIsAdminModalOpen(true)}
                />
              )}

              {currentView === 'audit' && (
                <AuditLogView />
              )}

              {currentView === 'reports' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-bold text-white">Official Institutional Reports & Master Roll</h1>
                      <p className="text-xs text-white/50 mt-1">
                        Export high-fidelity reports for Bangladesh National Cadet Corps Headquarter (HQ) submission.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                      >
                        Download CSV
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold shadow"
                      >
                        Print Full Master Roll
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white uppercase tracking-wider">Unit Summary</span>
                      <span className="font-mono text-white/50">{new Date().toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                        <span className="text-white/40 block text-[10px]">Total Strength</span>
                        <span className="text-lg font-bold text-white">{cadets.length} Cadets</span>
                      </div>
                      <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                        <span className="text-white/40 block text-[10px]">Parades Recorded</span>
                        <span className="text-lg font-bold text-emerald-400">{attendanceSessions.length} Sessions</span>
                      </div>
                      <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                        <span className="text-white/40 block text-[10px]">Field Camps</span>
                        <span className="text-lg font-bold text-blue-400">{events.length} Camps</span>
                      </div>
                      <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                        <span className="text-white/40 block text-[10px]">Certificates Issued</span>
                        <span className="text-lg font-bold text-amber-400">{certificates.length} Records</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS & DIALOGS                                                          */}
      {/* ========================================================================= */}

      {/* Cadets Dossier Profile Modal */}
      {viewingCadet && (
        <CadetProfileModal
          cadet={viewingCadet}
          attendanceSessions={attendanceSessions}
          events={events}
          certificates={certificates}
          onClose={() => setViewingCadet(null)}
          onEdit={(c) => {
            setViewingCadet(null);
            setEditingCadet(c);
            setIsFormModalOpen(true);
          }}
          onOpenIdCard={(c) => {
            setViewingCadet(null);
            setIdCardCadet(c);
          }}
          isAdmin={isAdmin}
          onRequireAdmin={() => setIsAdminModalOpen(true)}
        />
      )}

      {/* Cadet Add / Edit Form Modal */}
      {isFormModalOpen && (
        <CadetFormModal
          cadetToEdit={editingCadet}
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingCadet(null);
          }}
          onSave={handleSaveCadet}
        />
      )}

      {/* Military ID Card Modal */}
      {idCardCadet && (
        <MilitaryIdCardModal
          cadet={idCardCadet}
          allCadets={cadets}
          onClose={() => setIdCardCadet(null)}
        />
      )}

      {/* Admin Security PIN Modal (Supports Auto-Jump to Admin Console) */}
      <AdminPinModal
        isOpen={isAdminModalOpen}
        isAdmin={isAdmin}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setUserRole('admin');
          setPortalMode('admin');
          showToast('Officer Command Console unlocked!');
        }}
        onDeactivate={() => {
          setIsAdmin(false);
          showToast('Admin session closed.');
        }}
      />

      {/* Rank Promotion Modal */}
      {isPromotionModalOpen && (
        <RankPromotionModal
          cadets={cadets}
          isOpen={isPromotionModalOpen}
          onClose={() => setIsPromotionModalOpen(false)}
          onPromote={handlePromoteCadet}
        />
      )}

      {/* Certificate Studio Modal */}
      {isIssueCertModalOpen && (
        <CertificateStudioModal
          cadets={cadets}
          isOpen={isIssueCertModalOpen}
          onClose={() => setIsIssueCertModalOpen(false)}
          onIssueCertificate={handleIssueCertificate}
        />
      )}

      {/* PostgreSQL DDL & Architecture Modal */}
      <DatabaseSchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />

      {/* Backup & Export Modal */}
      <ExportBackupModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onExportCSV={handleExportCSV}
        onResetSeedData={handleResetSeedData}
        isAdmin={isAdmin}
        onRequireAdmin={() => setIsAdminModalOpen(true)}
        cadetsCount={cadets.length}
      />
    </div>
  );
}
