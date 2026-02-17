import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Mail, KeyRound, HardDrive, Loader2, Shield, Lock, Fingerprint } from 'lucide-react';
import { useAuth, useMode } from '@/providers/context';
import type { AuthMethod } from '@/providers/types';

export function LoginPage() {
  const { login } = useAuth();
  const mode = useMode();
  const navigate = useNavigate();

  const [method, setMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('demo@autodiscovery.legal');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    switch (method) {
      case 'yubikey':
        setStatus('Touch your YubiKey...');
        break;
      case 'trezor':
        setStatus('Connecting to Trezor... Confirm on device');
        break;
      default:
        setStatus('Authenticating...');
    }

    try {
      await login(method, { email, password });
      setStatus('Success! Redirecting...');
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  const authMethods: { key: AuthMethod; label: string; icon: typeof Mail; desc: string; badge?: string }[] = [
    {
      key: 'email',
      label: 'Email & Password',
      icon: Mail,
      desc: 'Traditional login with Argon2id-derived private key',
    },
    {
      key: 'yubikey',
      label: 'YubiKey',
      icon: KeyRound,
      desc: 'FIDO2/WebAuthn hardware security key — ECDSA P-256',
      badge: 'FIDO2',
    },
    {
      key: 'trezor',
      label: 'Trezor 5',
      icon: HardDrive,
      desc: 'Hardware wallet — native Ed25519 signing for Midnight',
      badge: 'Ed25519',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background: deep navy gradient with subtle pattern */}
      <div className="absolute inset-0 ad-gradient-navy" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Floating orbs for visual interest */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-ad-gold/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />

      {/* Demo Banner */}
      {mode === 'demoland' && (
        <div className="relative z-20 ad-gradient-gold text-amber-950 text-center text-xs font-bold py-1.5 px-4 flex items-center justify-center gap-2 tracking-wide uppercase">
          <Shield className="w-3.5 h-3.5" />
          Demo Mode — All authentication is simulated
          <Shield className="w-3.5 h-3.5" />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg space-y-8 ad-animate-fade-up">
          {/* Logo Section */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-ad-gold/10 mb-5 ad-glow-gold relative">
              <Scale className="w-10 h-10 text-ad-gold" />
              <div className="absolute -inset-px rounded-2xl border border-ad-gold/20" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Auto<span className="text-ad-gold">Discovery</span>
            </h1>
            <p className="text-blue-200/60 mt-2 text-sm">
              Privacy-preserving legal discovery automation
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-blue-300/50 font-medium">
                <Lock className="w-3 h-3" /> Zero-Knowledge
              </span>
              <span className="w-1 h-1 rounded-full bg-blue-400/30" />
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-blue-300/50 font-medium">
                <Fingerprint className="w-3 h-3" /> Midnight Chain
              </span>
            </div>
          </div>

          {/* Auth Card — Glass Effect */}
          <div className="ad-glass rounded-2xl p-7 space-y-6 ad-border-glow">
            {/* Method Selector */}
            <div>
              <label className="text-xs font-semibold text-blue-200/70 mb-3 block uppercase tracking-wider">
                Authentication Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {authMethods.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMethod(m.key)}
                    disabled={loading}
                    className={`group relative flex flex-col items-center gap-2.5 p-4 rounded-xl text-xs font-medium transition-all duration-300 ${
                      method === m.key
                        ? 'bg-ad-gold/10 text-ad-gold border border-ad-gold/30 shadow-lg shadow-ad-gold/5'
                        : 'bg-white/5 text-blue-200/60 border border-white/5 hover:border-white/15 hover:bg-white/8 hover:text-blue-100'
                    }`}
                  >
                    <m.icon className={`w-6 h-6 transition-transform duration-200 ${method === m.key ? 'scale-110' : 'group-hover:scale-105'}`} />
                    <span className="text-center leading-tight">{m.label}</span>
                    {m.badge && (
                      <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                        method === m.key ? 'bg-ad-gold/20 text-ad-gold' : 'bg-white/10 text-white/40'
                      }`}>
                        {m.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-blue-200/40 mt-3">
                {authMethods.find((m) => m.key === method)?.desc}
              </p>
            </div>

            {/* Email/Password Fields */}
            {method === 'email' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="email" className="text-xs font-medium text-blue-200/70 block mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
                    placeholder="you@firm.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="text-xs font-medium text-blue-200/70 block mb-1.5">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* YubiKey Instructions */}
            {method === 'yubikey' && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ad-gold/10 ad-glow-gold">
                  <KeyRound className="w-7 h-7 text-ad-gold" />
                </div>
                <p className="text-sm font-semibold text-white">Insert your YubiKey</p>
                <p className="text-xs text-blue-200/50 max-w-xs mx-auto">
                  Click Sign In, then touch the metal contact on your key when the light pulses
                </p>
              </div>
            )}

            {/* Trezor Instructions */}
            {method === 'trezor' && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ad-gold/10 ad-glow-gold">
                  <HardDrive className="w-7 h-7 text-ad-gold" />
                </div>
                <p className="text-sm font-semibold text-white">Connect your Trezor 5</p>
                <p className="text-xs text-blue-200/50 max-w-xs mx-auto">
                  Plug in via USB-C. Click Sign In, then confirm on the Trezor touchscreen.
                  Native Ed25519 signing for Midnight transactions.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Recommended — native curve match
                </div>
              </div>
            )}

            {/* Status / Error */}
            {status && (
              <div className="flex items-center gap-2 text-sm text-ad-gold">
                <Loader2 className="w-4 h-4 animate-spin" />
                {status}
              </div>
            )}
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            {/* Sign In Button — Gold Gradient */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 ad-gradient-gold text-amber-950 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-ad-gold/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In Securely
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-wider text-blue-300/30 font-medium">
              <span>Midnight Blockchain</span>
              <span className="w-1 h-1 rounded-full bg-blue-400/20" />
              <span>Zero-Knowledge Proofs</span>
              <span className="w-1 h-1 rounded-full bg-blue-400/20" />
              <span>Privacy-First</span>
            </div>
            <p className="text-[10px] text-blue-300/20">
              v0.1.0-demo • AutoDiscovery Legal Intelligence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
