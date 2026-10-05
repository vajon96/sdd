export type PortalMode = 'public' | 'admin';

export type PublicNavTab = 'directory' | 'verify' | 'events' | 'wing-info' | 'architecture';

export type NavigationView = 
  | 'dashboard' 
  | 'cadets' 
  | 'batches' 
  | 'attendance' 
  | 'events' 
  | 'ranks'
  | 'certificates'
  | 'reports' 
  | 'idcards' 
  | 'audit'
  | 'api-schema'
  | 'settings';

export type AdminRole = 'admin' | 'commander' | 'instructor' | 'operator' | 'viewer';
export type UserRole = AdminRole;
export type AuditLog = ActivityLog;

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  rankTitle: string;
  unit: string;
  email: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type Gender = 'Male' | 'Female' | 'Other';
export type CadetStatus = 'Active' | 'Inactive' | 'Alumni' | 'Probation' | 'Ex Cadet';
export type CadetRank = 
  | 'Cadet' 
  | 'CADET'
  | 'Lance Corporal' 
  | 'Corporal' 
  | 'Sergeant' 
  | 'Cadet Sergeant'
  | 'Cadet Under Officer (CUO)' 
  | 'Senior Under Officer (SUO)'
  | 'Professor Under Officer (PUO)';

export type BatchYear = '2023' | '2024' | '2025' | '2026';

export interface Cadet {
  id: string;
  cadetNo: string;
  exCadetNo?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  photoUrl: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  dob: string; // DD/MM/YYYY or YYYY-MM-DD
  nidOrBirthCert?: string;
  nationality: string;
  
  // Family Information
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  guardianMobile?: string;
  
  // Academic Information
  institution: string;
  facultyOrGroup?: string;
  classLevel?: string;
  session?: string;
  
  // BNCC Information
  batch: BatchYear;
  rank: CadetRank;
  regiment: string;
  battalion: string;
  company: string;
  platoon: string;
  enrollmentDate: string;
  status: CadetStatus;
  
  // Contact
  mobile: string;
  email: string;
  division?: string;
  district?: string;
  upazila?: string;
  city?: string;
  address?: string;
  
  // Achievements & Bio
  achievements?: string[];
  bio?: string;
  deletedAt?: string | null; // Soft delete support
  createdAt: string;
  updatedAt: string;
}

/**
 * Public Safe Projection (Strict Zero-Leakage Security Contract)
 * Guaranteed free of NID/Birth certificate, phone numbers, home address, guardian data, email.
 */
export interface PublicCadet {
  id: string;
  cadetNo: string;
  fullName: string;
  photoUrl: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  institution: string;
  batch: BatchYear;
  rank: CadetRank;
  regiment: string;
  battalion: string;
  company: string;
  platoon: string;
  status: CadetStatus;
  enrollmentDate: string;
  achievements?: string[];
}

export interface RankHistoryEntry {
  id: string;
  cadetId: string;
  cadetNo: string;
  cadetName: string;
  batch: BatchYear;
  previousRank: CadetRank;
  newRank: CadetRank;
  promotionDate: string;
  orderRef: string;
  promotedBy: string;
  remarks?: string;
  createdAt: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Late';

export interface AttendanceEntry {
  cadetId: string;
  cadetNo: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSession {
  id: string;
  date: string; // YYYY-MM-DD
  batch: BatchYear | 'All';
  eventName?: string;
  topic?: string;
  takenBy: string;
  records: AttendanceEntry[];
  createdAt: string;
}

export type EventType = 
  | 'Parade' 
  | 'Training' 
  | 'Camp' 
  | 'Rally' 
  | 'Competition' 
  | 'Seminar' 
  | 'Independence Day' 
  | 'Victory Day' 
  | 'Social Service'
  | 'Other';

export interface BNCCEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  participatingCadetIds: string[];
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  organizedBy: string;
  isPublic?: boolean;
  coverImage?: string;
  createdAt: string;
}

export type CertificateType = 
  | 'Basic Military Training' 
  | 'Annual Training Camp (ATC)' 
  | 'National Day Parade' 
  | 'Leadership & Drill' 
  | 'First Aid & Disaster Management' 
  | 'Shooting / Firing Excellence' 
  | 'Youth Exchange Program (YEP)'
  | 'Special Recognition';

export interface Certificate {
  id: string;
  certificateNo: string;
  title: string;
  type: CertificateType;
  cadetId: string;
  cadetName: string;
  cadetNo: string;
  batch?: BatchYear;
  rank?: CadetRank;
  platoon?: string;
  issueDate: string;
  issuingOrganization: string;
  signedBy: string;
  description?: string;
  grade?: string;
  verificationHash?: string;
  qrPayload?: string;
  createdAt: string;
}

export interface VerificationResult {
  valid: boolean;
  certificate?: Certificate;
  cadet?: PublicCadet;
  verificationHash?: string;
  verifiedAt?: string;
  statusText?: string;
  message?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  adminName: string;
  role?: AdminRole;
  ipAddress?: string;
  type: 'create' | 'update' | 'delete' | 'export' | 'system' | 'verify' | 'promote';
}

export interface AppSettings {
  adminPin: string;
  institutionName: string;
  platoonName: string;
  regimentName: string;
  theme: 'dark' | 'light';
  itemsPerPage: number;
}
