import { useState } from 'react';
import {
  Shield, Bell, KeyRound, HardDrive, Mail, Globe,
  Lock, Fingerprint, Moon, Sun, Monitor, CheckCircle2, Sparkles,
} from 'lucide-react';
import { useAuth, useMode } from '@/providers/context';
import { useTheme } from '@/components/theme-provider';

export function SettingsPage() {
  const { session } = useAuth();
  const mode = useMode();
  const { theme, setTheme } = useTheme();

  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [notifyObfuscation, setNotifyObfuscation] = useState(true);
  const [notifyAttestations, setNotifyAttestations] = useState(true);
  const [notifySharing, setNotifySharing] = useState(false);

  const authMethodIcon = session?.authMethod === 'yubikey' ? KeyRound
    : session?.authMethod === 'trezor' ? HardDrive : Mail;

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-ad-gold" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-ad-gold font-bold">Configuration</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account, notifications, and display preferences</p>
      </div>

      {/* Account Section */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-bold flex items-center gap-2">
          <Shield className="w-4 h-4 text-ad-gold" /> Account & Authentication
        </h2>
        {session && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground text-xs block mb-0.5">Name</span>
                <span className="font-medium">{session.displayName}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block mb-0.5">Email</span>
                <span className="font-medium font-mono text-xs">{session.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block mb-0.5">Role</span>
                <span className="font-medium capitalize">{session.role}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block mb-0.5">Auth Method</span>
                <span className="font-medium capitalize flex items-center gap-1.5">
                  {(() => { const Icon = authMethodIcon; return <Icon className="w-3.5 h-3.5 text-ad-gold" />; })()}
                  {session.authMethod}
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <span className="text-muted-foreground text-xs block mb-0.5">
                Public Key
                <span
                  className="ml-1 cursor-help border-b border-dotted border-muted-foreground"
                  title="Your cryptographic public key used for signing transactions and generating zero-knowledge proofs on the Midnight blockchain"
                >
                  (what's this?)
                </span>
              </span>
              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg inline-block">
                {session.publicKey}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mode Indicator */}
      <div className={`border rounded-xl p-6 space-y-3 ${
        mode === 'demoland' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20'
      }`}>
        <h2 className="font-bold flex items-center gap-2">
          <Globe className="w-4 h-4 text-ad-gold" /> Environment
        </h2>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${mode === 'demoland' ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
            {mode === 'demoland' ? (
              <Shield className="w-5 h-5 text-amber-500" />
            ) : (
              <Lock className="w-5 h-5 text-emerald-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">
              {mode === 'demoland' ? 'Demo Mode (demoLand)' : 'Production Mode (realDeal)'}
            </p>
            <p className="text-xs text-muted-foreground">
              {mode === 'demoland'
                ? 'Running with simulated data and mock proofs. Not connected to blockchain.'
                : 'Connected to Midnight blockchain. All proofs are real and verifiable.'}
            </p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              mode === 'demoland' ? 'bg-amber-500/15 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'
            }`}>
              {mode}
            </span>
          </div>
        </div>
        {mode === 'realdeal' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Midnight Preprod Network</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected</span>
          </div>
        )}
      </div>

      {/* Appearance */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-bold flex items-center gap-2">
          <Sun className="w-4 h-4 text-ad-gold" /> Appearance
        </h2>
        <div className="flex gap-2">
          {([
            { value: 'light' as const, icon: Sun, label: 'Light' },
            { value: 'dark' as const, icon: Moon, label: 'Dark' },
            { value: 'system' as const, icon: Monitor, label: 'System' },
          ]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                theme === opt.value
                  ? 'bg-ad-gold/10 text-ad-gold border border-ad-gold/30'
                  : 'bg-muted/50 text-muted-foreground border border-transparent hover:border-border'
              }`}
            >
              <opt.icon className="w-4 h-4" />
              {opt.label}
              {theme === opt.value && <CheckCircle2 className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-bold flex items-center gap-2">
          <Bell className="w-4 h-4 text-ad-gold" /> Notifications
        </h2>
        <div className="space-y-3">
          {([
            { label: 'Deadline Alerts', desc: 'Notify when discovery deadlines are approaching or overdue', value: notifyDeadlines, set: setNotifyDeadlines },
            { label: 'Obfuscation Alerts', desc: 'Notify when AI detects potential data dump obfuscation in productions', value: notifyObfuscation, set: setNotifyObfuscation },
            { label: 'Proof Confirmations', desc: 'Notify when zero-knowledge attestations are verified on-chain', value: notifyAttestations, set: setNotifyAttestations },
            { label: 'Document Sharing', desc: 'Notify when documents are shared with or by other parties', value: notifySharing, set: setNotifySharing },
          ]).map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => item.set(!item.value)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  item.value ? 'bg-ad-gold' : 'bg-muted'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    item.value ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-1 pb-8">
        <p className="text-[10px] text-muted-foreground">AutoDiscovery Legal Intelligence v0.2.0-demo</p>
        <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground/50">
          <span>Midnight Blockchain</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
          <span>Zero-Knowledge Proofs</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
          <span>Privacy-First</span>
        </div>
      </div>
    </div>
  );
}
