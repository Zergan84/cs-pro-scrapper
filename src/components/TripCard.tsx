import React from 'react';
import { Trip } from '../types/trip';

interface TripCardProps {
  trip: Trip;
  onClick: (trip: Trip) => void;
  onFindHosts: (trip: Trip, e: React.MouseEvent) => void;
  onSync: (trip: Trip, e: React.MouseEvent) => void;
  isSyncing?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onClick,
  onFindHosts,
  onSync,
  isSyncing = false
}) => {
  // Format date range nicely
  const formatDateRange = (startStr: string, endStr: string) => {
    try {
      const s = new Date(startStr);
      const e = new Date(endStr);
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const startDay = s.getDate();
      const endDay = e.getDate();
      const startMonth = months[s.getMonth()];
      const endMonth = months[e.getMonth()];
      const year = s.getFullYear();

      if (startMonth === endMonth) {
        return `${startDay}–${endDay} ${startMonth} ${year}`;
      }
      return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`;
    } catch {
      return `${startStr} – ${endStr}`;
    }
  };

  const getDurationDays = (startStr: string, endStr: string) => {
    try {
      const s = new Date(startStr);
      const e = new Date(endStr);
      const diffTime = Math.abs(e.getTime() - s.getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${nights} ${nights === 1 ? 'night' : 'nights'}`;
    } catch {
      return '';
    }
  };

  const durationStr = getDurationDays(trip.startDate, trip.endDate);

  return (
    <div
      onClick={() => onClick(trip)}
      className="group relative flex flex-col p-3.5 bg-csCard/80 hover:bg-csCard border border-csBorder hover:border-csBorderLight rounded-2xl transition duration-200 shadow-md active:scale-[0.99] cursor-pointer overflow-hidden"
    >
      {/* Top accent line based on source */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] ${
          trip.source === 'couchsurfing' ? 'bg-amber-500/80' : 'bg-cyan-500/80'
        }`}
      />

      {/* Header: Destination & Status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold tracking-tight text-white uppercase font-sans">
              {trip.city}
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {trip.country}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="material-symbols-outlined text-[13px] text-amber-400">
                calendar_today
              </span>
              {formatDateRange(trip.startDate, trip.endDate)}
            </span>
            {durationStr && (
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700 font-sans">
                {durationStr}
              </span>
            )}
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {trip.source === 'couchsurfing' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Couchsurfing
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Local Trip
            </span>
          )}

          {/* Publication Tag */}
          {trip.publicationStatus === 'published' ? (
            <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">check_circle</span>
              Published
            </span>
          ) : trip.publicationStatus === 'pending' ? (
            <span className="text-[10px] font-medium text-amber-400 flex items-center gap-1 animate-pulse">
              <span className="material-symbols-outlined text-[12px]">hourglass_top</span>
              Publishing...
            </span>
          ) : (
            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">lock</span>
              Not published
            </span>
          )}
        </div>
      </div>

      {/* Host Metrics Bar */}
      <div className="mt-3.5 p-2.5 rounded-xl bg-csSurface/90 border border-csBorder/70 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <span className="text-amber-400 font-bold font-mono">
              {trip.hostStats.collected}
            </span>{' '}
            hosts collected
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-bold font-mono">
              {trip.hostStats.selected}
            </span>{' '}
            selected
          </div>
          {trip.hostStats.inQueue > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30">
              {trip.hostStats.inQueue} in queue
            </span>
          )}
        </div>

        {/* Progress meter */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-400 h-full rounded-l-full transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                trip.hostStats.collected > 0
                  ? (trip.hostStats.selected / trip.hostStats.collected) * 100
                  : 0
              )}%`
            }}
          />
          <div
            className="bg-amber-400/80 h-full transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                trip.hostStats.collected > 0
                  ? (trip.hostStats.inQueue / trip.hostStats.collected) * 100
                  : 0
              )}%`
            }}
          />
        </div>
      </div>

      {/* Footer Details & Action Buttons */}
      <div className="mt-3 pt-2.5 border-t border-csBorder/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
          <span className="material-symbols-outlined text-[13px] text-slate-500">
            sync
          </span>
          <span>{trip.lastSync}</span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => onSync(trip, e)}
            disabled={isSyncing}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 text-[10px] font-mono font-medium flex items-center gap-1 active:scale-95 transition"
            title="Synchronize host data with Couchsurfing"
          >
            <span
              className={`material-symbols-outlined text-[13px] ${
                isSyncing ? 'animate-spin text-amber-400' : ''
              }`}
            >
              refresh
            </span>
            <span>Sync</span>
          </button>

          <button
            onClick={(e) => onFindHosts(trip, e)}
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 active:scale-95 transition shadow-[0_0_8px_rgba(245,158,11,0.3)]"
          >
            <span className="material-symbols-outlined text-[13px]">person_search</span>
            <span>Find Hosts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
