import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Search, FileCheck, Settings, LogOut,
  Scale, ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth, useMode } from '@/providers/context';
import { ModeToggle } from '@/components/mode-toggle';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/cases', icon: FolderOpen, label: 'Cases' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/compliance', icon: FileCheck, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function ADLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { session, logout } = useAuth();
  const mode = useMode();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Demo Mode Banner */}
      {mode === 'demoland' && (
        <div className="bg-amber-500/90 text-amber-950 text-center text-sm font-medium py-1.5 px-4 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          DEMO MODE — Artificial Data — Not Connected to Blockchain
          <Shield className="w-4 h-4" />
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            collapsed ? 'w-16' : 'w-60'
          } bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-200`}
        >
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <Scale className="w-7 h-7 text-sidebar-primary shrink-0" />
            {!collapsed && (
              <span className="ml-3 font-bold text-lg tracking-tight">
                AutoDiscovery
              </span>
            )}
          </div>

          {/* Nav Links */}
          <nav className="flex-1 py-4 space-y-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-sidebar-border p-3">
            {session && !collapsed && (
              <div className="mb-3 px-1">
                <p className="text-sm font-medium truncate">{session.displayName}</p>
                <p className="text-xs text-sidebar-foreground/50 truncate capitalize">
                  {session.role} • {session.authMethod}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors w-full ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-10 flex items-center justify-center border-t border-sidebar-border text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center justify-between px-6">
            <div />
            <div className="flex items-center gap-3">
              {mode === 'realdeal' && session && (
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                  {session.publicKey.slice(0, 10)}...{session.publicKey.slice(-6)}
                </span>
              )}
              <ModeToggle />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
