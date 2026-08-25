-- ============================================================================
-- BANGLADESH NATIONAL CADET CORPS (BNCC) - INSTITUTIONAL PLATOON PLATFORM
-- PRODUCTION RELATIONAL DATABASE SCHEMA (PostgreSQL / MySQL Compatible DDL)
-- ============================================================================

-- 1. EXTENSIONS & UUID GENERATION (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS & DOMAINS
CREATE TYPE cadet_rank_enum AS ENUM (
    'Cadet',
    'Lance Corporal',
    'Corporal',
    'Sergeant',
    'Cadet Sergeant',
    'Cadet Under Officer (CUO)',
    'Senior Under Officer (SUO)',
    'Professor Under Officer (PUO)'
);

CREATE TYPE cadet_status_enum AS ENUM (
    'Active',
    'Inactive',
    'Alumni',
    'Probation'
);

CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-');
CREATE TYPE user_role_enum AS ENUM ('admin', 'commander', 'instructor', 'operator', 'viewer');
CREATE TYPE attendance_status_enum AS ENUM ('Present', 'Absent', 'Leave', 'Late');
CREATE TYPE event_type_enum AS ENUM (
    'Parade',
    'Training',
    'Camp',
    'Rally',
    'Competition',
    'Seminar',
    'Independence Day',
    'Victory Day',
    'Social Service',
    'Other'
);

-- ============================================================================
-- 3. INSTITUTIONAL STRUCTURE & UNITS
-- ============================================================================
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regiment_name VARCHAR(100) NOT NULL DEFAULT 'Karnafuli Regiment',
    battalion_name VARCHAR(100) NOT NULL DEFAULT '5 BNCC Battalion',
    company_name VARCHAR(100) NOT NULL DEFAULT 'Alpha Company',
    platoon_name VARCHAR(100) NOT NULL DEFAULT 'City College Platoon',
    institution_name VARCHAR(150) NOT NULL DEFAULT 'Cox''s Bazar City College',
    wing_type VARCHAR(50) NOT NULL DEFAULT 'Army Wing', -- Army / Naval / Air
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_year VARCHAR(10) NOT NULL UNIQUE, -- e.g., '2023', '2024', '2025', '2026'
    enrollment_start DATE,
    enrollment_end DATE,
    cadet_strength INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. CADETS CORE MASTER TABLE (Normalized with Soft Delete)
-- ============================================================================
CREATE TABLE cadets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cadet_no VARCHAR(50) NOT NULL UNIQUE,
    ex_cadet_no VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    photo_url TEXT DEFAULT 'https://cbccbncc.netlify.app/default-avatar.png',
    gender gender_enum NOT NULL DEFAULT 'Male',
    blood_group blood_group_enum NOT NULL,
    date_of_birth DATE NOT NULL,
    nid_or_birth_certificate VARCHAR(60),
    nationality VARCHAR(60) NOT NULL DEFAULT 'Bangladeshi',
    
    -- Guardian & Family
    father_name VARCHAR(150),
    mother_name VARCHAR(150),
    guardian_name VARCHAR(150),
    guardian_mobile VARCHAR(30),
    
    -- Academic Profile
    institution VARCHAR(150) NOT NULL DEFAULT 'Cox''s Bazar City College',
    faculty_or_group VARCHAR(100),
    class_level VARCHAR(50) DEFAULT 'HSC 1st Year',
    academic_session VARCHAR(30) DEFAULT '2024-2025',
    
    -- BNCC Assignment
    batch_id UUID REFERENCES batches(id) ON DELETE RESTRICT,
    batch_year VARCHAR(10) NOT NULL,
    rank cadet_rank_enum NOT NULL DEFAULT 'Cadet',
    unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
    regiment VARCHAR(100) NOT NULL DEFAULT 'Karnafuli Regiment',
    battalion VARCHAR(100) NOT NULL DEFAULT '5 BNCC Battalion',
    company VARCHAR(100) NOT NULL DEFAULT 'Alpha Company',
    platoon VARCHAR(100) NOT NULL DEFAULT 'City College Platoon',
    enrollment_date DATE NOT NULL,
    status cadet_status_enum NOT NULL DEFAULT 'Active',
    
    -- Contact Information (Sensitive)
    mobile VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    division VARCHAR(100),
    district VARCHAR(100),
    upazila VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    
    -- Achievements & Metadata
    achievements TEXT[], -- Array of achievement titles
    bio TEXT,
    is_publicly_visible BOOLEAN DEFAULT TRUE,
    
    -- Soft-Delete & Auditing
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Highly Optimized Composite & Partial Indexes for Rapid Querying
CREATE INDEX idx_cadets_cadet_no ON cadets(cadet_no) WHERE deleted_at IS NULL;
CREATE INDEX idx_cadets_batch ON cadets(batch_year) WHERE deleted_at IS NULL;
CREATE INDEX idx_cadets_rank ON cadets(rank) WHERE deleted_at IS NULL;
CREATE INDEX idx_cadets_status ON cadets(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_cadets_blood_group ON cadets(blood_group) WHERE deleted_at IS NULL;
CREATE INDEX idx_cadets_search ON cadets USING gin(to_tsvector('english', full_name || ' ' || cadet_no));

-- ============================================================================
-- 5. RANK PROMOTION & PROGRESSION HISTORY AUDIT
-- ============================================================================
CREATE TABLE rank_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cadet_id UUID NOT NULL REFERENCES cadets(id) ON DELETE CASCADE,
    cadet_no VARCHAR(50) NOT NULL,
    previous_rank cadet_rank_enum NOT NULL,
    new_rank cadet_rank_enum NOT NULL,
    promotion_date DATE NOT NULL,
    order_ref VARCHAR(100) NOT NULL, -- e.g. "ORDER/HQ-5BNCC/2024-08"
    promoted_by VARCHAR(150) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rank_history_cadet ON rank_history(cadet_id);
CREATE INDEX idx_rank_history_date ON rank_history(promotion_date);

-- ============================================================================
-- 6. ATTENDANCE DRILL SESSIONS & INDIVIDUAL RECORDS
-- ============================================================================
CREATE TABLE attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_date DATE NOT NULL,
    batch_year VARCHAR(10) DEFAULT 'All',
    event_name VARCHAR(150) NOT NULL DEFAULT 'Weekly Squad Drill & Inspection',
    topic VARCHAR(255),
    taken_by VARCHAR(150) NOT NULL,
    total_present INT DEFAULT 0,
    total_absent INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    cadet_id UUID NOT NULL REFERENCES cadets(id) ON DELETE CASCADE,
    cadet_no VARCHAR(50) NOT NULL,
    status attendance_status_enum NOT NULL DEFAULT 'Present',
    notes VARCHAR(255),
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, cadet_id)
);

CREATE INDEX idx_att_records_session ON attendance_records(session_id);
CREATE INDEX idx_att_records_cadet ON attendance_records(cadet_id);

-- ============================================================================
-- 7. EVENTS, CAMPS & PARTICIPANTS
-- ============================================================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    event_type event_type_enum NOT NULL DEFAULT 'Parade',
    start_date DATE NOT NULL,
    end_date DATE,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    organized_by VARCHAR(150) NOT NULL DEFAULT 'Karnafuli Regiment BNCC',
    status VARCHAR(50) NOT NULL DEFAULT 'Upcoming', -- Upcoming, Ongoing, Completed
    is_public BOOLEAN DEFAULT TRUE,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    cadet_id UUID NOT NULL REFERENCES cadets(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'Participant', -- Parade Commander, Flag Bearer, Participant
    performance_rating VARCHAR(50),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, cadet_id)
);

-- ============================================================================
-- 8. CERTIFICATES & DIGITAL VERIFICATION REGISTRY
-- ============================================================================
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_no VARCHAR(80) NOT NULL UNIQUE, -- e.g. "BNCC/KRN/2025/ATC-001"
    title VARCHAR(255) NOT NULL,
    certificate_type VARCHAR(100) NOT NULL,
    cadet_id UUID NOT NULL REFERENCES cadets(id) ON DELETE CASCADE,
    cadet_name VARCHAR(255) NOT NULL,
    cadet_no VARCHAR(50) NOT NULL,
    batch VARCHAR(10),
    rank cadet_rank_enum NOT NULL,
    issue_date DATE NOT NULL,
    issuing_organization VARCHAR(200) NOT NULL DEFAULT 'Karnafuli Regiment, BNCC',
    signed_by VARCHAR(200) NOT NULL,
    grade VARCHAR(50) DEFAULT 'A+ (Distinction)',
    description TEXT,
    verification_hash VARCHAR(128) NOT NULL, -- SHA-256 integrity hash
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certificates_cert_no ON certificates(certificate_no);
CREATE INDEX idx_certificates_cadet_id ON certificates(cadet_id);
CREATE INDEX idx_certificates_hash ON certificates(verification_hash);

-- ============================================================================
-- 9. USER ACCOUNTS & ROLE-BASED ACCESS CONTROL (RBAC)
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hashed
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role user_role_enum NOT NULL DEFAULT 'viewer',
    rank_title VARCHAR(100) DEFAULT 'Staff',
    assigned_unit VARCHAR(150) DEFAULT 'City College Platoon',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 10. SYSTEM ACTIVITY AUDIT LOGS
-- ============================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_name VARCHAR(150) NOT NULL,
    role user_role_enum,
    action VARCHAR(150) NOT NULL,
    target_entity VARCHAR(200) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- create, update, delete, verify, promote, export
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action_type);

-- ============================================================================
-- 11. SECURITY VIEW: PUBLIC CADET SAFE PROJECTION (ZERO-LEAKAGE)
-- ============================================================================
CREATE OR REPLACE VIEW public_cadets_view AS
SELECT
    c.id,
    c.cadet_no,
    c.full_name,
    c.photo_url,
    c.gender,
    c.blood_group,
    c.institution,
    c.batch_year AS batch,
    c.rank,
    c.regiment,
    c.battalion,
    c.company,
    c.platoon,
    c.enrollment_date,
    c.status,
    c.achievements
FROM cadets c
WHERE c.deleted_at IS NULL
  AND c.is_publicly_visible = TRUE;
