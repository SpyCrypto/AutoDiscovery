import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Search, FileCheck, Settings, LogOut,
  Scale, ChevronLeft, ChevronRight, Shield, BookOpen, Sparkles,
  Bell, Users,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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

// Mock notification data for demoLand
const demoNotifications = [
  { id: 'n1', type: 'deadline' as const, title: 'RFA Response Due in 5 Days', body: 'Henderson v. St. Alphonsus — IRCP 36 deadline approaching', time: '2 hours ago', read: false },
  { id: 'n2', type: 'obfuscation' as const, title: 'Haystack Alert — Production Set 1', body: 'Obfuscation score 0.62 detected on DEF production', time: '4 hours ago', read: false },
  { id: 'n3', type: 'compliance' as const, title: 'ZK Attestation Verified', body: 'Document hash attestation confirmed on-chain', time: '1 day ago', read: true },
  { id: 'n4', type: 'deadline' as const, title: 'Interrogatories Overdue', body: 'Henderson v. St. Alphonsus — IRCP 33 past deadline', time: '2 days ago', read: true },
];

export function ADLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showJurisdiction, setShowJurisdiction] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications);
  const notifRef = useRef<HTMLDivElement>(null);
  const { session, logout } = useAuth();
  const mode = useMode();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isOnCase = location.pathname.startsWith('/cases/');

  // Close notification dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

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
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-ad-gold text-[9px] font-bold text-amber-950 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl shadow-black/20 z-50 overflow-hidden ad-animate-fade-up">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <span className="text-xs font-bold uppercase tracking-wider">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[10px] text-ad-gold hover:underline font-medium">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto ad-scrollbar">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${
                            !n.read ? 'bg-ad-gold/5' : ''
                          }`}
                          onClick={() =>
                            setNotifications((prev) =>
                              prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
                            )
                          }
                        >
                          <div className="flex items-start gap-2">
                            {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-ad-gold shrink-0" />}
                            <div className={!n.read ? '' : 'ml-4'}>
                              <p className={`text-xs font-medium ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{n.body}</p>
                              <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
