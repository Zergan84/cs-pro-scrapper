import React from 'react';

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#0c0f14]/95 backdrop-blur-xl border-t border-csBorder">
      <div className="flex items-center justify-around h-16 px-1 text-[10px] font-sans">
        {/* Tab 1: Trips (Active) */}
        <a
          aria-current="page"
          className="flex flex-col items-center justify-center flex-1 h-full min-w-0 text-amber-400 font-semibold relative active:scale-95 transition"
          data-path="trips"
          href="#"
        >
          <div className="p-1 rounded-full bg-amber-500/10 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
            <span className="material-symbols-outlined text-[20px] text-amber-400 leading-none">
              flight_takeoff
            </span>
          </div>
          <span className="tracking-tight text-amber-400 mt-0.5 text-[10px]">Trips</span>
          <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1"></span>
        </a>

        {/* Tab 2: Search (Disabled/Inactive) */}
        <div
          className="flex flex-col items-center justify-center flex-1 h-full min-w-0 text-slate-600 opacity-40 cursor-not-allowed pointer-events-none select-none"
          data-path="search"
        >
          <span className="material-symbols-outlined text-[20px] leading-none">search</span>
          <span className="tracking-tight mt-0.5 text-[10px]">Search</span>
        </div>

        {/* Tab 3: Queue with Badge 10 (Disabled/Inactive) */}
        <div
          className="flex flex-col items-center justify-center flex-1 h-full min-w-0 text-slate-600 opacity-40 cursor-not-allowed pointer-events-none select-none relative"
          data-path="queue"
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[20px] leading-none">
              move_to_inbox
            </span>
            <span className="absolute -top-1 -right-2 bg-amber-500/60 text-slate-950 font-mono font-bold text-[9px] px-1 rounded-full leading-tight">
              10
            </span>
          </div>
          <span className="tracking-tight mt-0.5 text-[10px]">Queue</span>
        </div>

        {/* Tab 4: Auto (Disabled/Inactive) */}
        <div
          className="flex flex-col items-center justify-center flex-1 h-full min-w-0 text-slate-600 opacity-40 cursor-not-allowed pointer-events-none select-none"
          data-path="auto"
        >
          <span className="material-symbols-outlined text-[20px] leading-none">bolt</span>
          <span className="tracking-tight mt-0.5 text-[10px]">Auto</span>
        </div>

        {/* Tab 5: Inbox with Badge 18 (Disabled/Inactive) */}
        <div
          className="flex flex-col items-center justify-center flex-1 h-full min-w-0 text-slate-600 opacity-40 cursor-not-allowed pointer-events-none select-none relative"
          data-path="inbox"
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[20px] leading-none">mail</span>
            <span className="absolute -top-1 -right-2.5 bg-amber-500/60 text-slate-950 font-mono font-bold text-[9px] px-1 rounded-full leading-tight">
              18
            </span>
          </div>
          <span className="tracking-tight mt-0.5 text-[10px]">Inbox</span>
        </div>

        {/* Tab 6: Context (Disabled/Inactive) */}
        <div
          className="flex flex-col items-center justify-center flex-1 h-full min-w-0 text-slate-600 opacity-40 cursor-not-allowed pointer-events-none select-none"
          data-path="context"
        >
          <span className="material-symbols-outlined text-[20px] leading-none">tune</span>
          <span className="tracking-tight mt-0.5 text-[10px]">Context</span>
        </div>
      </div>

      {/* iOS Home Indicator */}
      <div className="flex justify-center pb-1">
        <div className="w-32 h-1 bg-slate-700/60 rounded-full"></div>
      </div>
    </nav>
  );
};
