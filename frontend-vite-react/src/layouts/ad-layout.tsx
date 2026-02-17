import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Search, FileCheck, Settings, LogOut,
  Scale, ChevronLeft, ChevronRight, Shield, BookOpen, Sparkles,
  Bell, Users,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth, useMode } from '@/providers/context';
import { ModeToggle } from '@/components/mode-toggle';
import { JurisdictionPanel } from '@/components/jurisdiction-panel';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/cases', icon: FolderOpen, label: 'Cases', end: false },
  { to: '/search', icon: Search, label: 'Search', end: false },
  { to: '/compliance', icon: FileCheck, label: 'Reports', end: false },
  { to: '/settings', icon: Settings, label: 'Settings', end: false },
];

export function ADLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showJurisdiction, setShowJurisdiction] = useState(true);
  const { session, logout } = useAuth();
  const mode = useMode();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isOnCase = location.pathname.startsWith('/cases/');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Demo Mode Banner — branded gold gradient */}
      {mode === 'demoland' && (
        <div className="ad-gradient-gold text-amber-950 text-center text-xs font-bold py-1.5 px-4 flex items-center justify-center gap-2 tracking-wide uppercase">
          <Shield className="w-3.5 h-3.5" />
          Demo Mode — Artificial Data — Not Connected to Blockchain
          <Shield className="w-3.5 h-3.5" />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Sidebar ── */}
        <aside
          className={`${
            collapsed ? 'w-[68px]' : 'w-[240px]'
          } bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 shrink-0 relative`}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

          {/* Logo Block */}
          <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-5'} border-b border-sidebar-border relative z-10`}>
            <div className="relative">
              <Scale className="w-7 h-7 text-ad-gold shrink-0" />
              <div className="absolute -inset-1 bg-ad-gold/10 rounded-lg blur-sm -z-10" />
            </div>
            {!collapsed && (
              <div className="ml-3">
                <span className="font-bold text-base tracking-tight text-sidebar-foreground">
                  Auto<span className="text-ad-gold">Discovery</span>
                </span>
                <p className="text-[9px] uppercase tracking-[0.2em] text-sidebar-foreground/40 -mt-0.5">Legal Intelligence</p>
              </div>
            )}
          </div>

          {/* Nav Links */}
          <nav className="flex-1 py-4 space-y-0.5 px-2 relative z-10">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-black/10'
                      : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-ad-gold" />
                    )}
                    <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-ad-gold' : ''}`} />
                    {!collapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}

            {/* Case Contacts — visible when viewing a case */}
            {isOnCase && (
              <NavLink
                to={`${location.pathname.replace(/\/contacts$/, '')}/contacts`}
                end
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mt-3 relative ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 shadow-lg shadow-black/10'
                      : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-emerald-400" />
                    )}
                    <Users className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-emerald-400' : ''}`} />
                    {!collapsed && <span>Contacts</span>}
                  </>
                )}
              </NavLink>
            )}

            {/* Jurisdiction Toggle in Sidebar */}
            <button
              onClick={() => setShowJurisdiction(!showJurisdiction)}
              className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mt-3 ${
                showJurisdiction
                  ? 'bg-ad-gold/10 text-ad-gold'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <BookOpen className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <>
                  <span>Rules Panel</span>
                  <Sparkles className="w-3 h-3 ml-auto text-ad-gold opacity-60" />
                </>
              )}
            </button>
          </nav>

          {/* User Section */}
          <div className="border-t border-sidebar-border p-3 relative z-10">
            {session && !collapsed && (
              <div className="mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ad-gold/30 to-blue-500/30 flex items-center justify-center text-xs font-bold text-sidebar-foreground">
                    {session.displayName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{session.displayName}</p>
                    <p className="text-[10px] text-sidebar-foreground/40 truncate capitalize">
                      {session.role} • {session.authMethod}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-sidebar-foreground/50 hover:bg-red-500/10 hover:text-red-400 transition-all w-full ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-9 flex items-center justify-center border-t border-sidebar-border text-sidebar-foreground/30 hover:text-sidebar-foreground/70 transition-colors relative z-10"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Bar */}
          <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              {isOnCase && (
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                  IRCP — Idaho Rules
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {mode === 'realdeal' && session && (
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded-lg">
                  {session.publicKey.slice(0, 10)}...{session.publicKey.slice(-6)}
                </span>
              )}
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ad-gold" />
              </button>
              <ModeToggle />
            </div>
          </header>

          {/* Page + Jurisdiction Panel */}
          <div className="flex-1 flex overflow-hidden">
            {/* Scrollable Page Content */}
            <main className="flex-1 overflow-y-auto p-6 ad-scrollbar">
              <div className="ad-animate-fade-up">
                <Outlet />
              </div>
            </main>

            {/* Jurisdiction Panel (right side) */}
            {showJurisdiction && (
              <div className="ad-animate-slide-in shrink-0">
                <JurisdictionPanel
                  primaryJurisdiction="ID"
                  onClose={() => setShowJurisdiction(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
