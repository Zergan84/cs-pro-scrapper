import React from 'react';
import { CSAccount } from '../types/trip';

interface HeaderProps {
  account: CSAccount;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ account, onOpenAuth }) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0c0f14]/95 backdrop-blur-xl border-b border-csBorder/80 pt-1.5">
      <div className="h-12 px-4 flex items-center justify-between gap-2 mt-0.5">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center font-mono font-black text-amber-400 text-xs shadow-[0_0_10px_rgba(245,158,11,0.25)] shrink-0">
            CS
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-sm font-extrabold tracking-tight text-white uppercase font-sans leading-none">
              CS PRO
            </h1>
          </div>
        </div>

        {/* Right: AI Nodes & Profile Button */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] shrink-0">
          <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            LLaVA
          </span>

          <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Ollama
          </span>

          <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Tailscale
          </span>

          {/* Profile Button to log in to Couchsurfing */}
          <button
            onClick={onOpenAuth}
            className="w-7 h-7 rounded-lg bg-csSurface border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 hover:border-amber-400 active:scale-95 transition shadow-[0_0_8px_rgba(245,158,11,0.2)]"
            title={account.isConnected ? `Couchsurfing: @${account.username}` : 'Log in to Couchsurfing'}
          >
            {account.avatarUrl && account.isConnected ? (
              <img
                src={account.avatarUrl}
                alt={account.username}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="material-symbols-outlined text-[16px]">person</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
