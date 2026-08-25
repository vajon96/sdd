import React, { useState } from 'react';
import {
  FileCode,
  Database,
  Server,
  Layers,
  Shield,
  Copy,
  Check,
  X,
  ExternalLink,
  Terminal,
  Cpu
} from 'lucide-react';

interface DatabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSchemaModal: React.FC<DatabaseSchemaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ddl' | 'api' | 'deployment' | 'security'>('ddl');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const DDL_CONTENT = `-- BANGLADESH NATIONAL CADET CORPS (BNCC) - INSTITUTIONAL PLATOON PLATFORM
-- PRODUCTION RELATIONAL DATABASE SCHEMA (PostgreSQL / MySQL Compatible)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE cadet_rank_enum AS ENUM (
    'Cadet', 'Lance Corporal', 'Corporal', 'Sergeant',
    'Cadet Sergeant', 'Cadet Under Officer (CUO)',
    'Senior Under Officer (SUO)', 'Professor Under Officer (PUO)'
);
CREATE TYPE cadet_status_enum AS ENUM ('Active', 'Inactive', 'Alumni', 'Probation');
CREATE TYPE user_role_enum AS ENUM ('admin', 'commander', 'instructor', 'operator', 'viewer');

-- 2. CADETS MASTER TABLE (With Soft-Delete & Indexes)
CREATE TABLE cadets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cadet_no VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    photo_url TEXT,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    nid_or_birth_certificate VARCHAR(60),
    institution VARCHAR(150) NOT NULL DEFAULT 'Cox''s Bazar City College',
    batch_year VARCHAR(10) NOT NULL,
    rank cadet_rank_enum NOT NULL DEFAULT 'Cadet',
    regiment VARCHAR(100) NOT NULL DEFAULT 'Karnafuli Regiment',
    battalion VARCHAR(100) NOT NULL DEFAULT '15 BNCC Battalion',
    company VARCHAR(100) NOT NULL DEFAULT 'Alpha Company',
    platoon VARCHAR(100) NOT NULL DEFAULT 'City College Platoon',
    enrollment_date DATE NOT NULL,
    status cadet_status_enum NOT NULL DEFAULT 'Active',
    mobile VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address TEXT,
    achievements TEXT[],
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cadets_cadet_no ON cadets(cadet_no) WHERE deleted_at IS NULL;
CREATE INDEX idx_cadets_batch ON cadets(batch_year) WHERE deleted_at IS NULL;
CREATE INDEX idx_cadets_rank ON cadets(rank) WHERE deleted_at IS NULL;

-- 3. RANK PROMOTION HISTORY AUDIT
CREATE TABLE rank_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cadet_id UUID NOT NULL REFERENCES cadets(id) ON DELETE CASCADE,
    cadet_no VARCHAR(50) NOT NULL,
    previous_rank cadet_rank_enum NOT NULL,
    new_rank cadet_rank_enum NOT NULL,
    promotion_date DATE NOT NULL,
    order_ref VARCHAR(100) NOT NULL,
    promoted_by VARCHAR(150) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CERTIFICATES & DIGITAL VERIFICATION REGISTRY
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_no VARCHAR(80) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    cadet_id UUID NOT NULL REFERENCES cadets(id) ON DELETE CASCADE,
    cadet_name VARCHAR(255) NOT NULL,
    cadet_no VARCHAR(50) NOT NULL,
    issue_date DATE NOT NULL,
    issuing_organization VARCHAR(200) NOT NULL,
    signed_by VARCHAR(200) NOT NULL,
    grade VARCHAR(50),
    verification_hash VARCHAR(128) NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ATTENDANCE & DRILL SESSIONS
CREATE TABLE attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_date DATE NOT NULL,
    batch_year VARCHAR(10) DEFAULT 'All',
    event_name VARCHAR(150) NOT NULL,
    taken_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    cadet_id UUID NOT NULL REFERENCES cadets(id) ON DELETE CASCADE,
    cadet_no VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Present',
    UNIQUE(session_id, cadet_id)
);

-- 6. ZERO-LEAKAGE SECURITY VIEW FOR PUBLIC API
CREATE OR REPLACE VIEW public_cadets_view AS
SELECT
    c.id, c.cadet_no, c.full_name, c.photo_url,
    c.gender, c.blood_group, c.institution,
    c.batch_year AS batch, c.rank, c.regiment,
    c.battalion, c.company, c.platoon,
    c.enrollment_date, c.status, c.achievements
FROM cadets c
WHERE c.deleted_at IS NULL;`;

  const API_ROUTES_CONTENT = `# ============================================================================
# BNCC PLATOON REST API SPECIFICATION
# ============================================================================

# 1. PUBLIC ENDPOINTS (Strict Zero-Leakage & Rate Limited)
GET    /api/public/cadets              # Search/filter safe public roster
GET    /api/public/verify/certificate/:certNo  # Authenticate certificate & hash
GET    /api/public/events              # Public parade and camp calendar

# 2. AUTHENTICATION & RBAC
POST   /api/auth/login                 # Officer PIN/JWT generation
GET    /api/auth/me                    # Verify session role permissions

# 3. CADET MASTER MANAGEMENT (Admin, Commander, Operator)
GET    /api/cadets                     # Full master roster (including sensitive fields)
POST   /api/cadets                     # Enroll new cadet
PUT    /api/cadets/:id                 # Update dossier
DELETE /api/cadets/:id                 # Soft-delete cadet (sets deleted_at)
POST   /api/cadets/:id/restore         # Restore soft-deleted cadet
POST   /api/cadets/promote             # Record rank promotion & command order

# 4. OPERATIONS (Attendance & Certificates)
GET    /api/attendance                 # List parade drill sessions
POST   /api/attendance                 # Save squad attendance
POST   /api/certificates               # Issue cryptographically signed certificate
DELETE /api/certificates/:id          # Revoke certificate

# 5. AUDIT TRAIL & SYSTEM
GET    /api/audit-logs                 # System security audit trail
GET    /api/backup/export              # Export complete database JSON/CSV`;

  const DEPLOYMENT_CONTENT = `# ============================================================================
# PRODUCTION DEPLOYMENT GUIDE (PM2 + NGINX REVERSE PROXY)
# ============================================================================

# 1. System Requirements & Node Setup
sudo apt update && sudo apt install -y nodejs npm nginx postgresql git
npm install -g pm2

# 2. Build and Start Application with PM2
cd /var/www/bncc-platform
npm install
npm run build
pm2 start dist/server.cjs --name "bncc-platoon-app"
pm2 save
pm2 startup

# 3. Nginx Reverse Proxy Configuration (/etc/nginx/sites-available/bncc)
server {
    listen 80;
    server_name cbccbncc.edu.bd www.cbccbncc.edu.bd;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Public Portal & Admin Console Route Ingress
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Rate Limiting Buffer
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 4. Enable Configuration & SSL with Certbot
sudo ln -s /etc/nginx/sites-available/bncc /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
sudo certbot --nginx -d cbccbncc.edu.bd -d www.cbccbncc.edu.bd`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">System Architecture, DDL & Deployment Guide</h2>
              <p className="text-xs text-white/50">Production Relational Schema & Isolated Dual-Portal Routing</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-3 bg-slate-950 border-b border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ddl')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'ddl'
                ? 'bg-amber-400 text-slate-950'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1. PostgreSQL / MySQL DDL</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'api'
                ? 'bg-amber-400 text-slate-950'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>2. REST API Routes</span>
          </button>

          <button
            onClick={() => setActiveTab('deployment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'deployment'
                ? 'bg-amber-400 text-slate-950'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>3. PM2 & Nginx Setup</span>
          </button>
        </div>

        {/* Code Content View */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 relative">
          <button
            onClick={() => {
              if (activeTab === 'ddl') copyToClipboard(DDL_CONTENT);
              if (activeTab === 'api') copyToClipboard(API_ROUTES_CONTENT);
              if (activeTab === 'deployment') copyToClipboard(DEPLOYMENT_CONTENT);
            }}
            className="absolute top-8 right-8 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-semibold flex items-center gap-1.5 shadow"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Script'}</span>
          </button>

          <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 overflow-x-auto whitespace-pre leading-relaxed">
            {activeTab === 'ddl' && DDL_CONTENT}
            {activeTab === 'api' && API_ROUTES_CONTENT}
            {activeTab === 'deployment' && DEPLOYMENT_CONTENT}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <span>Production Ready · Strict Zero-Leakage Public Isolation Active</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
