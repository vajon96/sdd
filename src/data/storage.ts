import {
  Cadet,
  PublicCadet,
  AttendanceSession,
  BNCCEvent,
  Certificate,
  VerificationResult,
  ActivityLog,
  AppSettings,
  RankHistoryEntry,
  UserAccount,
  CadetRank,
  AdminRole
} from '../types';
import {
  INITIAL_CADETS,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_EVENTS,
  INITIAL_CERTIFICATES,
  INITIAL_RANK_HISTORY,
  INITIAL_USERS,
  INITIAL_LOGS,
  INITIAL_SETTINGS
} from './seedData';

const KEYS = {
  VERSION: 'bncc_version_v6_enterprise',
  CADETS: 'bncc_cadets',
  ATTENDANCE: 'bncc_attendance',
  EVENTS: 'bncc_events',
  CERTIFICATES: 'bncc_certificates',
  RANK_HISTORY: 'bncc_rank_history',
  USERS: 'bncc_users',
  SETTINGS: 'bncc_settings',
  LOGS: 'bncc_logs'
};

export const storage = {
  // Cadets
  getCadets(includeSoftDeleted: boolean = false): Cadet[] {
    try {
      const v = localStorage.getItem(KEYS.VERSION);
      const data = localStorage.getItem(KEYS.CADETS);
      
      // Auto-migrate or initialize if version changed or no data
      if (!data || v !== '6.0') {
        localStorage.setItem(KEYS.VERSION, '6.0');
        this.saveCadets(INITIAL_CADETS);
        this.saveCertificates(INITIAL_CERTIFICATES);
        this.saveRankHistory(INITIAL_RANK_HISTORY);
        this.saveUsers(INITIAL_USERS);
        return INITIAL_CADETS;
      }
      const parsed: Cadet[] = JSON.parse(data);
      if (includeSoftDeleted) return parsed;
      return parsed.filter((c) => !c.deletedAt);
    } catch (e) {
      console.error('Error reading cadets from localStorage', e);
      return INITIAL_CADETS;
    }
  },

  /**
   * STRICT ZERO-LEAKAGE PUBLIC PROJECTION
   * Redacts NID, phone numbers, home address, guardian contact, and email.
   */
  getPublicCadets(): PublicCadet[] {
    const cadets = this.getCadets(false);
    return cadets.map((c) => ({
      id: c.id,
      cadetNo: c.cadetNo,
      fullName: c.fullName,
      photoUrl: c.photoUrl,
      gender: c.gender,
      bloodGroup: c.bloodGroup,
      institution: c.institution || "Cox's Bazar City College",
      batch: c.batch,
      rank: c.rank,
      regiment: c.regiment,
      battalion: c.battalion,
      company: c.company,
      platoon: c.platoon,
      status: c.status,
      enrollmentDate: c.enrollmentDate,
      achievements: c.achievements || []
    }));
  },

  saveCadets(cadets: Cadet[]): void {
    localStorage.setItem(KEYS.CADETS, JSON.stringify(cadets));
  },

  addCadet(cadet: Cadet): void {
    const cadets = this.getCadets(true);
    cadets.unshift(cadet);
    this.saveCadets(cadets);
    this.addLog('Enrolled Cadet', `${cadet.fullName} (${cadet.cadetNo})`, 'create');
  },

  updateCadet(cadet: Cadet): void {
    const cadets = this.getCadets(true);
    const index = cadets.findIndex((c) => c.id === cadet.id);
    if (index !== -1) {
      cadets[index] = cadet;
      this.saveCadets(cadets);
      this.addLog('Updated Cadet Profile', `${cadet.fullName} (${cadet.cadetNo})`, 'update');
    }
  },

  deleteCadet(id: string, hardDelete: boolean = false): void {
    const cadets = this.getCadets(true);
    const cadet = cadets.find((c) => c.id === id);
    if (hardDelete) {
      const updated = cadets.filter((c) => c.id !== id);
      this.saveCadets(updated);
      if (cadet) {
        this.addLog('Purged Cadet Record', `${cadet.fullName} (${cadet.cadetNo})`, 'delete');
      }
    } else {
      // Soft delete
      if (cadet) {
        cadet.deletedAt = new Date().toISOString();
        this.saveCadets(cadets);
        this.addLog('Soft Deleted Cadet', `${cadet.fullName} (${cadet.cadetNo})`, 'delete');
      }
    }
  },

  restoreCadet(id: string): void {
    const cadets = this.getCadets(true);
    const cadet = cadets.find((c) => c.id === id);
    if (cadet) {
      cadet.deletedAt = null;
      this.saveCadets(cadets);
      this.addLog('Restored Cadet Record', `${cadet.fullName} (${cadet.cadetNo})`, 'update');
    }
  },

  // Rank Progression & Promotion History
  getRankHistory(): RankHistoryEntry[] {
    try {
      const data = localStorage.getItem(KEYS.RANK_HISTORY);
      if (!data) {
        this.saveRankHistory(INITIAL_RANK_HISTORY);
        return INITIAL_RANK_HISTORY;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_RANK_HISTORY;
    }
  },

  saveRankHistory(history: RankHistoryEntry[]): void {
    localStorage.setItem(KEYS.RANK_HISTORY, JSON.stringify(history));
  },

  promoteCadet(
    cadetId: string,
    newRank: CadetRank,
    orderRef: string,
    promotedBy: string,
    promotionDate: string,
    remarks?: string
  ): Cadet | null {
    const cadets = this.getCadets(true);
    const cadet = cadets.find((c) => c.id === cadetId);
    if (!cadet) return null;

    const previousRank = cadet.rank;
    cadet.rank = newRank;
    cadet.updatedAt = new Date().toISOString();
    this.saveCadets(cadets);

    const history = this.getRankHistory();
    const entry: RankHistoryEntry = {
      id: 'rh-' + Date.now(),
      cadetId: cadet.id,
      cadetNo: cadet.cadetNo,
      cadetName: cadet.fullName,
      batch: cadet.batch,
      previousRank,
      newRank,
      promotionDate: promotionDate || new Date().toISOString().split('T')[0],
      orderRef: orderRef || `ORDER/HQ-5BNCC/${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      promotedBy: promotedBy || 'PUO Ujjwal Kanti Deb',
      remarks,
      createdAt: new Date().toISOString()
    };
    history.unshift(entry);
    this.saveRankHistory(history);

    this.addLog('Rank Promotion', `${cadet.fullName} -> ${newRank} (${entry.orderRef})`, 'promote');
    return cadet;
  },

  // Certificates & Public Verification
  getCertificates(): Certificate[] {
    try {
      const data = localStorage.getItem(KEYS.CERTIFICATES);
      if (!data) {
        this.saveCertificates(INITIAL_CERTIFICATES);
        return INITIAL_CERTIFICATES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading certificates', e);
      return INITIAL_CERTIFICATES;
    }
  },

  saveCertificates(certs: Certificate[]): void {
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));
  },

  addCertificate(cert: Certificate): void {
    const certs = this.getCertificates();
    certs.unshift(cert);
    this.saveCertificates(certs);
    this.addLog('Issued Certificate', `${cert.certificateNo} to ${cert.cadetName}`, 'create');
  },

  deleteCertificate(id: string): void {
    const certs = this.getCertificates();
    const cert = certs.find((c) => c.id === id);
    const updated = certs.filter((c) => c.id !== id);
    this.saveCertificates(updated);
    if (cert) {
      this.addLog('Revoked Certificate', `${cert.certificateNo}`, 'delete');
    }
  },

  verifyCertificate(certNoOrHash: string): VerificationResult {
    const query = certNoOrHash.trim().toUpperCase();
    const certs = this.getCertificates();
    const cert = certs.find(
      (c) =>
        c.certificateNo.toUpperCase() === query ||
        (c.verificationHash && c.verificationHash.toUpperCase() === query)
    );

    if (!cert) {
      this.addLog('Certificate Verification Failed', `Searched: ${certNoOrHash}`, 'verify');
      return {
        valid: false,
        statusText: 'RECORD NOT FOUND',
        message: 'No institutional certificate found matching this verification code or hash.'
      };
    }

    const publicCadets = this.getPublicCadets();
    const publicCadet = publicCadets.find((c) => c.id === cert.cadetId || c.cadetNo === cert.cadetNo);

    this.addLog('Certificate Verified', `${cert.certificateNo} (${cert.cadetName})`, 'verify');
    return {
      valid: true,
      certificate: cert,
      cadet: publicCadet,
      verificationHash: cert.verificationHash || `SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      verifiedAt: new Date().toISOString(),
      statusText: 'AUTHENTIC & VERIFIED',
      message: 'Official Bangladesh National Cadet Corps certificate record is authentic, active, and verified.'
    };
  },

  // Users & RBAC
  getUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(KEYS.USERS);
      if (!data) {
        this.saveUsers(INITIAL_USERS);
        return INITIAL_USERS;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: UserAccount[]): void {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  // Attendance
  getAttendance(): AttendanceSession[] {
    try {
      const data = localStorage.getItem(KEYS.ATTENDANCE);
      if (!data) {
        this.saveAttendance(INITIAL_ATTENDANCE_SESSIONS);
        return INITIAL_ATTENDANCE_SESSIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading attendance', e);
      return INITIAL_ATTENDANCE_SESSIONS;
    }
  },

  saveAttendance(sessions: AttendanceSession[]): void {
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(sessions));
  },

  addAttendanceSession(session: AttendanceSession): void {
    const sessions = this.getAttendance();
    sessions.unshift(session);
    this.saveAttendance(sessions);
    this.addLog('Recorded Attendance', `${session.eventName || 'Drill Session'} (${session.date})`, 'create');
  },

  deleteAttendanceSession(id: string): void {
    const sessions = this.getAttendance();
    const updated = sessions.filter((s) => s.id !== id);
    this.saveAttendance(updated);
    this.addLog('Deleted Attendance Record', `Session ID: ${id}`, 'delete');
  },

  // Events
  getEvents(): BNCCEvent[] {
    try {
      const data = localStorage.getItem(KEYS.EVENTS);
      if (!data) {
        this.saveEvents(INITIAL_EVENTS);
        return INITIAL_EVENTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading events', e);
      return INITIAL_EVENTS;
    }
  },

  saveEvents(events: BNCCEvent[]): void {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  },

  addEvent(event: BNCCEvent): void {
    const events = this.getEvents();
    events.unshift(event);
    this.saveEvents(events);
    this.addLog('Created Event', event.title, 'create');
  },

  updateEvent(event: BNCCEvent): void {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      events[index] = event;
      this.saveEvents(events);
      this.addLog('Updated Event', event.title, 'update');
    }
  },

  deleteEvent(id: string): void {
    const events = this.getEvents();
    const event = events.find((e) => e.id === id);
    const updated = events.filter((e) => e.id !== id);
    this.saveEvents(updated);
    if (event) {
      this.addLog('Deleted Event', event.title, 'delete');
    }
  },

  // Settings
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (!data) {
        this.saveSettings(INITIAL_SETTINGS);
        return INITIAL_SETTINGS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading settings', e);
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Activity Logs
  getLogs(): ActivityLog[] {
    try {
      const data = localStorage.getItem(KEYS.LOGS);
      if (!data) {
        this.saveLogs(INITIAL_LOGS);
        return INITIAL_LOGS;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_LOGS;
    }
  },

  saveLogs(logs: ActivityLog[]): void {
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs.slice(0, 100)));
  },

  addLog(
    action: string,
    target: string,
    type: 'create' | 'update' | 'delete' | 'export' | 'system' | 'verify' | 'promote' = 'system',
    adminName: string = 'Officer in Charge',
    role?: AdminRole
  ): void {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      action,
      target,
      timestamp: new Date().toISOString(),
      adminName,
      role: role || 'admin',
      type
    };
    logs.unshift(newLog);
    this.saveLogs(logs);
  },

  // Export Full Database JSON
  exportDatabaseJSON(): string {
    const fullBackup = {
      version: '6.0',
      exportedAt: new Date().toISOString(),
      system: 'Bangladesh National Cadet Corps Platoon Information System',
      cadets: this.getCadets(true),
      rankHistory: this.getRankHistory(),
      certificates: this.getCertificates(),
      attendance: this.getAttendance(),
      events: this.getEvents(),
      users: this.getUsers(),
      settings: this.getSettings(),
      logs: this.getLogs()
    };
    this.addLog('Exported JSON Database Backup', 'Full Enterprise Database', 'export');
    return JSON.stringify(fullBackup, null, 2);
  },

  // Import Full Database JSON
  importDatabaseJSON(jsonString: string): { success: boolean; message: string; count?: number } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.cadets || !Array.isArray(parsed.cadets)) {
        return { success: false, message: 'Invalid JSON format: Cadets array missing.' };
      }

      if (parsed.cadets) this.saveCadets(parsed.cadets);
      if (parsed.rankHistory) this.saveRankHistory(parsed.rankHistory);
      if (parsed.certificates) this.saveCertificates(parsed.certificates);
      if (parsed.attendance) this.saveAttendance(parsed.attendance);
      if (parsed.events) this.saveEvents(parsed.events);
      if (parsed.settings) this.saveSettings(parsed.settings);
      if (parsed.logs) this.saveLogs(parsed.logs);

      this.addLog('Imported Database Backup', `Restored ${parsed.cadets.length} Cadets`, 'system');
      return {
        success: true,
        message: `Successfully imported ${parsed.cadets.length} cadets, ${parsed.events?.length || 0} events, and ${parsed.certificates?.length || 0} certificates.`,
        count: parsed.cadets.length
      };
    } catch (e: any) {
      return { success: false, message: 'Failed to parse JSON file: ' + (e.message || 'Unknown error') };
    }
  },

  // Export Cadets as CSV
  exportCadetsCSV(): string {
    const cadets = this.getCadets(false);
    const headers = [
      'Cadet No',
      'Full Name',
      'Rank',
      'Batch',
      'Gender',
      'Blood Group',
      'DOB',
      'Status',
      'Institution',
      'Class',
      'Regiment',
      'Battalion',
      'Company',
      'Platoon',
      'Mobile',
      'Email',
      'District',
      'Upazila',
      'Father Name',
      'Mother Name'
    ];

    const rows = cadets.map((c) => [
      `"${c.cadetNo}"`,
      `"${c.fullName.replace(/"/g, '""')}"`,
      `"${c.rank}"`,
      `"${c.batch}"`,
      `"${c.gender}"`,
      `"${c.bloodGroup}"`,
      `"${c.dob}"`,
      `"${c.status}"`,
      `"${(c.institution || '').replace(/"/g, '""')}"`,
      `"${(c.classLevel || '').replace(/"/g, '""')}"`,
      `"${c.regiment}"`,
      `"${c.battalion}"`,
      `"${c.company}"`,
      `"${c.platoon}"`,
      `"${c.mobile}"`,
      `"${c.email}"`,
      `"${c.district || ''}"`,
      `"${c.upazila || ''}"`,
      `"${(c.fatherName || '').replace(/"/g, '""')}"`,
      `"${(c.motherName || '').replace(/"/g, '""')}"`
    ]);

    this.addLog('Exported Cadets CSV', `${cadets.length} Records`, 'export');
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },

  // Reset to Demo Data
  resetToDemoData(): void {
    localStorage.clear();
    this.saveCadets(INITIAL_CADETS);
    this.saveAttendance(INITIAL_ATTENDANCE_SESSIONS);
    this.saveEvents(INITIAL_EVENTS);
    this.saveCertificates(INITIAL_CERTIFICATES);
    this.saveRankHistory(INITIAL_RANK_HISTORY);
    this.saveUsers(INITIAL_USERS);
    this.saveSettings(INITIAL_SETTINGS);
    this.saveLogs(INITIAL_LOGS);
    this.addLog('Database Reset', 'Restored initial authentic institutional dataset', 'system');
  },

  // Calculate Attendance Stats for a Cadet
  getCadetAttendanceStats(cadetId: string): { totalSessions: number; attended: number; percentage: number } {
    const sessions = this.getAttendance();
    let total = 0;
    let attended = 0;

    sessions.forEach((s) => {
      const record = s.records.find((r) => r.cadetId === cadetId);
      if (record) {
        total++;
        if (record.status === 'Present' || record.status === 'Late') {
          attended++;
        }
      }
    });

    const percentage = total > 0 ? Math.round((attended / total) * 100) : 100;
    return { totalSessions: total, attended, percentage };
  }
};

// Standalone convenience exports for direct modular imports
export const getCadets = (includeSoftDeleted?: boolean) => storage.getCadets(includeSoftDeleted);
export const getPublicCadets = () => storage.getPublicCadets();
export const saveCadet = (cadet: Cadet) => {
  const existing = storage.getCadets(true).find((c) => c.id === cadet.id);
  if (existing) {
    storage.updateCadet(cadet);
  } else {
    storage.addCadet(cadet);
  }
};
export const deleteCadet = (id: string, hard?: boolean) => storage.deleteCadet(id, hard);
export const restoreCadet = (id: string) => storage.restoreCadet(id);

export const getRankHistory = () => storage.getRankHistory();
export const promoteCadet = (
  cadetId: string,
  newRank: CadetRank,
  orderRef: string,
  promotedBy: string,
  promotionDate: string,
  remarks?: string
) => storage.promoteCadet(cadetId, newRank, orderRef, promotedBy, promotionDate, remarks);

export const getAttendanceSessions = () => storage.getAttendance();
export const saveAttendanceSession = (session: AttendanceSession) => storage.addAttendanceSession(session);
export const deleteAttendanceSession = (id: string) => storage.deleteAttendanceSession(id);

export const getEvents = () => storage.getEvents();
export const saveEvent = (event: BNCCEvent) => {
  const existing = storage.getEvents().find((e) => e.id === event.id);
  if (existing) {
    storage.updateEvent(event);
  } else {
    storage.addEvent(event);
  }
};
export const deleteEvent = (id: string) => storage.deleteEvent(id);

export const getCertificates = () => storage.getCertificates();
export const saveCertificate = (cert: Certificate) => storage.addCertificate(cert);
export const deleteCertificate = (id: string) => storage.deleteCertificate(id);
export const verifyCertificateByNo = (certNo: string) => storage.verifyCertificate(certNo);

export const getUsers = () => storage.getUsers();
export const getActivityLogs = () => storage.getLogs();
export const getAuditLogs = () => storage.getLogs();
export const addActivityLog = (
  action: string,
  target: string,
  type: 'create' | 'update' | 'delete' | 'export' | 'system' | 'verify' | 'promote' = 'system',
  adminName?: string,
  role?: AdminRole
) => storage.addLog(action, target, type, adminName, role);

export const exportAllDataToJSON = () => {
  const jsonStr = storage.exportDatabaseJSON();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BNCC_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importAllDataFromJSON = (jsonStr: string) => {
  const result = storage.importDatabaseJSON(jsonStr);
  return result.success;
};

export const exportCadetsToCSV = () => {
  const csvStr = storage.exportCadetsCSV();
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BNCC_Cadets_MasterRoll_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const resetToSeedData = () => storage.resetToDemoData();


