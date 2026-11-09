import React, { useState } from 'react';
import { CSAccount } from '../types/trip';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: CSAccount;
  onSaveAccount: (account: CSAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  account,
  onSaveAccount
}) => {
  const [authMethod, setAuthMethod] = useState<'credentials' | 'session_cookie'>('credentials');
  const [email, setEmail] = useState(account.email || '');
  const [username, setUsername] = useState(account.username || '');
  const [password, setPassword] = useState('');
  const [sessionToken, setSessionToken] = useState(account.sessionToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.cs_session_live');
  const [isConnecting, setIsConnecting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setSuccessMessage('');

    // Simulate login verification through Couchsurfing scraper backend
    setTimeout(() => {
      const updated: CSAccount = {
        ...account,
        isConnected: true,
        email: email || 'alex.nomad@example.com',
        username: username || 'alex_nomad',
        displayName: username ? `@${username}` : 'Alex Rivers',
        sessionToken,
        status: 'connected',
        lastSync: 'Just now',
        verified: true
      };

      onSaveAccount(updated);
      setIsConnecting(false);
      setSuccessMessage('Successfully authenticated with Couchsurfing!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1000);
    }, 1000);
  };

  const handleDisconnect = () => {
    const updated: CSAccount = {
      ...account,
      isConnected: false,
      status: 'idle',
      lastSync: 'Disconnected'
    };
    onSaveAccount(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-csSurface border-t sm:border border-csBorder rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden pb-safe">
        {/* iOS Handle */}
        <div className="w-full flex justify-center pt-2.5 pb-1">
          <div className="w-12 h-1 bg-slate-700/60 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-csBorder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold font-mono text-xs">
              CS
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight font-sans">
                Couchsurfing Authentication
              </h3>
              <p className="text-[11px] text-slate-400">
                Connect your account to synchronize trips & host searches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white transition"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Active Session Status */}
          <div className="p-3.5 rounded-xl bg-csCard border border-csBorder flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                {account.avatarUrl ? (
                  <img src={account.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-slate-400">person</span>
                )}
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-csSurface ${
                    account.isConnected ? 'bg-emerald-400' : 'bg-red-500'
                  }`}
                />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  @{account.username || 'guest'}
                  {account.isConnected && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-1 rounded">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {account.isConnected ? 'Session token valid' : 'No active session'}
                </div>
              </div>
            </div>

            {account.isConnected && (
              <button
                onClick={handleDisconnect}
                className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/40 border border-red-500/40 text-red-300 text-xs font-mono active:scale-95 transition"
              >
                Log Out
              </button>
            )}
          </div>

          {/* Auth Method Switcher */}
          <div className="flex rounded-xl bg-csCard p-1 border border-csBorder text-xs font-medium">
            <button
              type="button"
              onClick={() => setAuthMethod('credentials')}
              className={`flex-1 py-1.5 rounded-lg text-center transition ${
                authMethod === 'credentials'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('session_cookie')}
              className={`flex-1 py-1.5 rounded-lg text-center transition ${
                authMethod === 'session_cookie'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Session Cookie / Token
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            {authMethod === 'credentials' ? (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Couchsurfing Email / Username
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.nomad@example.com"
                    className="w-full px-3 py-2.5 bg-csCard border border-csBorder rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2.5 bg-csCard border border-csBorder rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Couchsurfing Session Cookie / Bearer Token
                </label>
                <textarea
                  rows={3}
                  required
                  value={sessionToken}
                  onChange={(e) => setSessionToken(e.target.value)}
                  placeholder="Paste _couchsurfing_session cookie or mobile API Bearer token..."
                  className="w-full px-3 py-2 bg-csCard border border-csBorder rounded-xl text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">
                  Recommended for 2FA-enabled accounts or proxy browser scraping sessions.
                </p>
              </div>
            )}

            {/* AI Scraper Node config status */}
            <div className="p-3 rounded-xl bg-csSurface border border-csBorder text-[11px] font-mono text-slate-400 space-y-1">
              <div className="text-slate-300 font-bold flex items-center justify-between">
                <span>Scraper Engine:</span>
                <span className="text-emerald-400">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tunnel:</span>
                <span className="text-slate-300">Tailscale MagicDNS</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vision Evaluator:</span>
                <span className="text-slate-300">LLaVA-13B (Quantized)</span>
              </div>
            </div>

            {successMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isConnecting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(245,158,11,0.25)] active:scale-95 transition"
            >
              {isConnecting ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                  Verifying Couchsurfing Session...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  Save & Authenticate Session
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
