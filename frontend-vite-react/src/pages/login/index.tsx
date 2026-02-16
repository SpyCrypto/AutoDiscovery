import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Mail, KeyRound, HardDrive, Loader2, Shield } from 'lucide-react';
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

  const authMethods: { key: AuthMethod; label: string; icon: typeof Mail; desc: string }[] = [
    {
      key: 'email',
      label: 'Email & Password',
      icon: Mail,
      desc: 'Traditional login with derived private key',
    },
    {
      key: 'yubikey',
      label: 'YubiKey',
      icon: KeyRound,
      desc: 'FIDO2/WebAuthn hardware security key',
    },
    {
      key: 'trezor',
      label: 'Trezor 5',
      icon: HardDrive,
      desc: 'Hardware wallet with Ed25519 signing',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
      {/* Demo Banner */}
      {mode === 'demoland' && (
        <div className="bg-amber-500/90 text-amber-950 text-center text-sm font-medium py-1.5 px-4 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          DEMO MODE — All authentication is simulated
          <Shield className="w-4 h-4" />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Scale className="w-9 h-9 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">AutoDiscovery</h1>
            <p className="text-muted-foreground mt-2">Privacy-preserving legal discovery automation</p>
          </div>

          {/* Auth Method Selector */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Authentication Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {authMethods.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMethod(m.key)}
                    disabled={loading}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all ${
                      method === m.key
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <m.icon className="w-5 h-5" />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {authMethods.find((m) => m.key === method)?.desc}
              </p>
            </div>

            {/* Email/Password Fields */}
            {method === 'email' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="email" className="text-sm font-medium block mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="you@firm.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="text-sm font-medium block mb-1.5">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* YubiKey Instructions */}
            {method === 'yubikey' && (
              <div className="bg-muted/50 rounded-lg p-4 text-center space-y-2">
                <KeyRound className="w-10 h-10 text-primary mx-auto" />
                <p className="text-sm font-medium">Insert your YubiKey</p>
                <p className="text-xs text-muted-foreground">
                  Click Sign In, then touch the metal contact on your key when prompted
                </p>
              </div>
            )}

            {/* Trezor Instructions */}
            {method === 'trezor' && (
              <div className="bg-muted/50 rounded-lg p-4 text-center space-y-2">
                <HardDrive className="w-10 h-10 text-primary mx-auto" />
                <p className="text-sm font-medium">Connect your Trezor 5</p>
                <p className="text-xs text-muted-foreground">
                  Plug in via USB-C. Click Sign In, then confirm on the Trezor touchscreen.
                  Supports native Ed25519 signing for Midnight transactions.
                </p>
              </div>
            )}

            {/* Status / Error */}
            {status && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Loader2 className="w-4 h-4 animate-spin" />
                {status}
              </div>
            )}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            Powered by Midnight blockchain • Zero-knowledge proofs • Privacy-first
          </p>
        </div>
      </div>
    </div>
  );
}
