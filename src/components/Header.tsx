import React, { useState, useEffect } from 'react';
import { CSAccount } from '../types/trip';

interface HeaderProps {
  account: CSAccount;
  onOpenAuth: () => void;
  onOpenStatus: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  account,
  onOpenAuth,
  onOpenStatus,
  theme,
  onToggleTheme,
  isSyncing = false
}) => {
  const [timeStr, setTimeStr] = useState('02:31');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0c0f14]/95 dark:bg-[#0c0f14]/95 backdrop-blur-xl border-b border-csBorder/80 pt-1.5 transition-colors">
      {/* iOS Status Bar Chrome */}
      <div className="px-4 flex items-center justify-between h-7 text-xs font-semibold text-slate-300 tracking-tight">
        <span className="font-mono text-[13px] text-slate-100 font-medium">{timeStr}</span>

        {/* Dynamic Island / CS Status Capsule */}
        <button
          onClick={onOpenStatus}
          className="h-[22px] px-3 bg-black rounded-full flex items-center justify-center space-x-1.5 border border-white/10 shadow-inner hover:border-amber-500/40 active:scale-95 transition"
          title="Click to view AI & Scraper node status"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSyncing
                ? 'bg-amber-400 animate-spin'
                : account.isConnected
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-red-400'
            }`}
          ></span>
          <span className="text-[9px] font-mono tracking-widest text-emerald-300 font-bold uppercase">
            {isSyncing ? 'CS: SYNC' : account.isConnected ? 'CS: IDLE' : 'CS: OFFLINE'}
          </span>
        </button>

        {/* 5G & Battery Chrome */}
        <div className="flex items-center space-x-2 text-slate-300 text-[11px]">
          <span className="text-[10px] font-bold font-mono">5G</span>
          <div className="w-5 h-2.5 border border-slate-400 rounded-[3px] p-[1px] flex items-center">
            <div className="h-full w-3.5 bg-emerald-400 rounded-[1px]"></div>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="h-12 px-4 flex items-center justify-between gap-2 mt-0.5">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center font-mono font-black text-amber-400 text-xs shadow-[0_0_10px_rgba(245,158,11,0.25)] shrink-0">
            CS
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold tracking-tight text-white uppercase font-sans leading-none">
                CS PRO
              </h1>
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono font-bold border border-amber-500/30">
                v1.2
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Assistant</span>
          </div>
        </div>

        {/* Right: AI & Scraper Network Badges & Profile */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] shrink-0">
          <button
            onClick={onOpenStatus}
            className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 shrink-0 hover:bg-emerald-900/40 transition active:scale-95"
            title="LLaVA Vision Model active"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            LLaVA
          </button>

          <button
            onClick={onOpenStatus}
            className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 shrink-0 hover:bg-emerald-900/40 transition active:scale-95"
            title="Ollama Local LLM connected"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Ollama
          </button>

          <button
            onClick={onOpenStatus}
            className="hidden xs:flex px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 items-center gap-1 shrink-0"
            title="Tailscale Mesh Proxy online"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Tailscale
          </button>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className="w-7 h-7 rounded-lg bg-csSurface border border-csBorder flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition active:scale-90"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Couchsurfing Account / Profile button */}
          <button
            onClick={onOpenAuth}
            className="relative w-7 h-7 rounded-lg bg-csSurface border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 hover:border-amber-400 transition active:scale-95 shadow-[0_0_8px_rgba(245,158,11,0.15)]"
            title={account.isConnected ? `Signed in as @${account.username}` : 'Connect Couchsurfing'}
          >
            {account.avatarUrl ? (
              <img
                src={account.avatarUrl}
                alt={account.username}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="material-symbols-outlined text-[16px]">person</span>
            )}
            <span
              className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0c0f14] ${
                account.isConnected ? 'bg-emerald-400' : 'bg-red-500'
              }`}
            ></span>
          </button>
        </div>
      </div>
    </header>
  );
};
