import React from 'react';

interface EmptyStateProps {
  onImportClick: () => void;
  onCreateClick: () => void;
  hasFilterActive?: boolean;
  onResetFilter?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onImportClick,
  onCreateClick,
  hasFilterActive = false,
  onResetFilter
}) => {
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4 bg-csSurface/40 border border-csBorder/60 rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
        <span className="material-symbols-outlined text-[32px]">
          {hasFilterActive ? 'filter_list_off' : 'flight_takeoff'}
        </span>
      </div>

      <div className="space-y-1 max-w-xs">
        <h3 className="text-base font-bold text-white uppercase tracking-tight font-sans">
          {hasFilterActive ? 'No Matching Trips Found' : 'No Travel Plans Yet'}
        </h3>
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          {hasFilterActive
            ? 'Try adjusting your search query or switching to another filter tab.'
            : 'Start by importing your existing itineraries from Couchsurfing, or create a new local trip.'}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-xs">
        {hasFilterActive ? (
          <button
            onClick={onResetFilter}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold font-mono active:scale-95 transition"
          >
            Reset Filters
          </button>
        ) : (
          <>
            <button
              onClick={onImportClick}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">cloud_download</span>
              Import from CS
            </button>
            <button
              onClick={onCreateClick}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Create Trip
            </button>
          </>
        )}
      </div>
    </div>
  );
};
