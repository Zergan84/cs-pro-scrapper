import React, { useState } from 'react';
import { Trip } from '../types/trip';

interface HostSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTrip: Trip | null;
  allTrips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

export const HostSearchModal: React.FC<HostSearchModalProps> = ({
  isOpen,
  onClose,
  selectedTrip,
  allTrips,
  onSelectTrip
}) => {
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(true);
  const [filterAcceptingOnly, setFilterAcceptingOnly] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeSuccess, setScrapeSuccess] = useState(false);

  if (!isOpen) return null;

  const currentTrip = selectedTrip || allTrips[0];

  const handleStartHostDiscovery = () => {
    setIsScraping(true);
    setScrapeSuccess(false);
    setTimeout(() => {
      setIsScraping(false);
      setScrapeSuccess(true);
    }, 1800);
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
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-[18px]">person_search</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight font-sans">
                Host Search Module
              </h3>
              <p className="text-[11px] text-slate-400">
                Discover & filter Couchsurfing hosts for your trip
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Active Trip Selector */}
          <div className="p-3 rounded-xl bg-csCard border border-csBorder space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Active Loaded Trip
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-semibold">
                {currentTrip ? `${currentTrip.hostStats.collected} hosts tracked` : 'No trip'}
              </span>
            </div>

            {currentTrip ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-white uppercase">
                    {currentTrip.city}, {currentTrip.country}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {currentTrip.startDate} → {currentTrip.endDate}
                  </div>
                </div>

                {allTrips.length > 1 && (
                  <select
                    value={currentTrip.id}
                    onChange={(e) => {
                      const t = allTrips.find((x) => x.id === e.target.value);
                      if (t) onSelectTrip(t);
                    }}
                    className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-lg border border-slate-700 font-mono focus:outline-none"
                  >
                    {allTrips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.city} ({t.startDate.slice(5)})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400">Please select or create a trip first.</div>
            )}
          </div>

          {/* Search Filters */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Scraping & Ranking Parameters
            </h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-csCard border border-csBorder cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-white">Verified Hosts Only</div>
                  <div className="text-[10px] text-slate-400">
                    Prioritize hosts with phone, government ID & payment badge
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={filterVerifiedOnly}
                  onChange={(e) => setFilterVerifiedOnly(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-csCard border border-csBorder cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-white">Accepting Guests Status</div>
                  <div className="text-[10px] text-slate-400">
                    Filter out 'Wants to meet up' or 'Not accepting'
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={filterAcceptingOnly}
                  onChange={(e) => setFilterAcceptingOnly(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
              </label>
            </div>
          </div>

          {/* AI Scoring Pipeline Info */}
          <div className="p-3.5 rounded-xl bg-csSurface border border-csBorder text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between text-cyan-400 font-mono text-[11px] font-bold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">psychology</span>
                LLM Profile Matcher
              </span>
              <span>Ollama + LLaVA</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug font-sans">
              Analyzes host descriptions, home rules, references, and shared interests with your
              travel description to rank the highest probability responses.
            </p>
          </div>

          {/* Progress / Status feedback */}
          {isScraping && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
              <span>Scraping host profiles in {currentTrip?.city} via headless session...</span>
            </div>
          )}

          {scrapeSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>18 new host candidates matched & pushed to Queue tab!</span>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleStartHostDiscovery}
              disabled={isScraping || !currentTrip}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-[0.98] transition font-sans"
            >
              <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              Run Host Discovery Engine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
