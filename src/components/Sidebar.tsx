import React from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  CalendarCheck,
  CalendarDays,
  Award,
  BarChart3,
  Settings,
  ShieldAlert,
  ShieldCheck,
  IdCard,
  LogOut,
  ChevronRight,
  Menu,
  X,
  History,
  FileCode,
  Globe,
  Lock
} from 'lucide-react';
import { UserRole } from '../types';

export type NavView =
  | 'dashboard'
  | 'cadets'
  | 'batches'
  | 'attendance'
  | 'events'
  | 'certificates'
  | 'reports'
  | 'audit';

interface SidebarProps {
  currentView: NavView;
  onSelectView?: (view: NavView) => void;
  onNavigate?: (view: NavView) => void;
  isAdmin?: boolean;
  userRole?: UserRole;
  onToggleAdminModal?: () => void;
  onOpenSettings?: () => void;
  onOpenSchemaModal?: () => void;
  onSwitchToPublicPortal?: () => void;
  mobileOpen?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  totalCadets?: number;
  cadetsCount?: number;
  activeBatch?: string | null;
  onSelectBatch?: (batch: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onNavigate,
  isAdmin = false,
  userRole = 'admin',
  onToggleAdminModal = () => {},
  onOpenSettings = () => {},
  onOpenSchemaModal = () => {},
  onSwitchToPublicPortal = () => {},
  mobileOpen,
  isMobileOpen,
  onCloseMobile = () => {},
  totalCadets,
  cadetsCount,
  activeBatch,
  onSelectBatch
}) => {
  const isDrawerOpen = mobileOpen ?? isMobileOpen ?? false;
  const count = totalCadets ?? cadetsCount ?? 0;
  const handleNav = onSelectView ?? onNavigate ?? (() => {});

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'cadets', label: 'Cadet Database', icon: Users, badge: count > 0 ? count.toString() : '0' },
    { id: 'batches', label: 'Batch System', icon: Layers, badge: '4' },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, badge: null },
    { id: 'events', label: 'Events & Camps', icon: CalendarDays, badge: null },
    { id: 'certificates', label: 'Certificates & Ranks', icon: Award, badge: null },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3, badge: null },
    { id: 'audit', label: 'Audit Trail & Logs', icon: History, badge: null }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isDrawerOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-slate-950/90 backdrop-blur-2xl border-r border-white/10 flex flex-col p-5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              <img
                src="https://i.ibb.co/Fb3R6wR/Bncc-logo.png"
                alt="BNCC Crest"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain drop-shadow-md z-10"
              />
              <img
                src="https://i.ibb.co/SBfzG9K/logo-removebg-preview-2.png"
                alt="CBCC Logo"
                referrerPolicy="no-referrer"
                className="w-9 h-9 object-contain drop-shadow-md opacity-90"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white text-sm sm:text-base">BNCC CBCC</span>
                <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded">
                  OFFICER CONSOLE
                </span>
              </div>
              <p className="text-[10px] text-white/50 truncate max-w-[140px]">Cox's Bazar City College</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Public Portal Switcher Banner */}
        <button
          onClick={() => {
            onSwitchToPublicPortal();
            onCloseMobile();
          }}
          className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 text-left hover:border-emerald-400 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors">
                Public Verified Portal
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Zero-Leakage Directory</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" />
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/40 px-3 py-1.5">
            Command & Management Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  handleNav(item.id as NavView);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-lg shadow-amber-400/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-white/50 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-200'
                        : 'bg-white/10 text-white/60 group-hover:bg-white/20 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin & Footer section */}
        <div className="pt-4 mt-auto border-t border-white/10 space-y-2">
          {/* Schema & DDL Trigger */}
          <button
            onClick={() => {
              onOpenSchemaModal();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>PostgreSQL DDL & Architecture</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          </button>

          {/* Admin Status Card */}
          <div
            id="admin-status-card"
            onClick={onToggleAdminModal}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              isAdmin
                ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15 text-emerald-300'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                )}
                <span className="text-xs font-semibold text-white">
                  {isAdmin ? `Officer (${userRole.toUpperCase()})` : 'Guest View (PIN: 7171)'}
                </span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase bg-black/40 border border-white/10 text-white/70">
                {isAdmin ? 'AUTHENTICATED' : 'LOCKED'}
              </span>
            </div>
            <p className="text-[10px] text-white/40">
              {isAdmin ? 'Master CRUD, promotions & certification active' : 'Click to authorize full command console'}
            </p>
          </div>

          {/* Settings / Database Backup */}
          <button
            id="sidebar-settings-button"
            onClick={() => {
              onOpenSettings();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-white/50" />
              <span>Database & Settings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>
      </aside>
    </>
  );
};
