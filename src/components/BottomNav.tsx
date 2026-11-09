import React from 'react';
import { TabType } from '../types/trip';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  queueCount?: number;
  inboxCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  queueCount = 10,
  inboxCount = 18
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#0c0f14]/95 backdrop-blur-xl border-t border-csBorder transition-colors">
      <div className="flex items-center justify-around h-16 px-1 text-[10px] font-sans">
        {/* Tab 1: Trips */}
        <button
          onClick={() => onTabChange('trips')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-0 relative active:scale-95 transition ${
            activeTab === 'trips'
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-full transition ${
              activeTab === 'trips'
                ? 'bg-amber-500/10 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px] leading-none">
              flight_takeoff
            </span>
          </div>
          <span className="tracking-tight mt-0.5 text-[10px]">Trips</span>
          {activeTab === 'trips' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1"></span>
          )}
        </button>

        {/* Tab 2: Search */}
        <button
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-0 relative active:scale-95 transition ${
            activeTab === 'search'
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-full transition ${
              activeTab === 'search'
                ? 'bg-amber-500/10 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px] leading-none">search</span>
          </div>
          <span className="tracking-tight mt-0.5 text-[10px]">Search</span>
          {activeTab === 'search' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1"></span>
          )}
        </button>

        {/* Tab 3: Queue */}
        <button
          onClick={() => onTabChange('queue')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-0 relative active:scale-95 transition ${
            activeTab === 'queue'
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[20px] leading-none">
              move_to_inbox
            </span>
            {queueCount > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-amber-500 text-slate-950 font-mono font-bold text-[9px] px-1 rounded-full leading-tight">
                {queueCount}
              </span>
            )}
          </div>
          <span className="tracking-tight mt-0.5 text-[10px]">Queue</span>
          {activeTab === 'queue' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1"></span>
          )}
        </button>

        {/* Tab 4: Auto */}
        <button
          onClick={() => onTabChange('auto')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-0 relative active:scale-95 transition ${
            activeTab === 'auto'
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-full transition ${
              activeTab === 'auto'
                ? 'bg-amber-500/10 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px] leading-none">bolt</span>
          </div>
          <span className="tracking-tight mt-0.5 text-[10px]">Auto</span>
          {activeTab === 'auto' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1"></span>
          )}
        </button>

        {/* Tab 5: Inbox */}
        <button
          onClick={() => onTabChange('inbox')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-0 relative active:scale-95 transition ${
            activeTab === 'inbox'
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[20px] leading-none">mail</span>
            {inboxCount > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-amber-500 text-slate-950 font-mono font-bold text-[9px] px-1 rounded-full leading-tight">
                {inboxCount}
              </span>
            )}
          </div>
          <span className="tracking-tight mt-0.5 text-[10px]">Inbox</span>
          {activeTab === 'inbox' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1"></span>
          )}
        </button>

        {/* Tab 6: Context / Settings */}
        <button
          onClick={() => onTabChange('context')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-0 relative active:scale-95 transition ${
            activeTab === 'context'
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-full transition ${
              activeTab === 'context'
                ? 'bg-amber-500/10 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px] leading-none">tune</span>
          </div>
          <span className="tracking-tight mt-0.5 text-[10px]">Context</span>
          {activeTab === 'context' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1"></span>
          )}
        </button>
      </div>

      {/* iOS Home Indicator */}
      <div className="flex justify-center pb-1">
        <div className="w-32 h-1 bg-slate-700/60 rounded-full"></div>
      </div>
    </nav>
  );
};
