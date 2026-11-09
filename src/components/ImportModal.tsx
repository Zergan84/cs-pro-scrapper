import React, { useState } from 'react';
import { CSAccount, ImportCandidate, Trip } from '../types/trip';
import { csScraperService, ImportStepEvent } from '../services/csScraperService';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: CSAccount;
  existingTrips: Trip[];
  onImportComplete: (importedTrips: Trip[]) => void;
  onOpenAuth: () => void;
}

type ImportScreen = 'source' | 'importing' | 'results' | 'error';

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  account,
  existingTrips,
  onImportComplete,
  onOpenAuth
}) => {
  const [screen, setScreen] = useState<ImportScreen>('source');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [discoveredCandidates, setDiscoveredCandidates] = useState<ImportCandidate[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCancelled, setIsCancelled] = useState(false);
  const [skipDuplicates, setSkipDuplicates] = useState(true);

  if (!isOpen) return null;

  const handleStartImport = async () => {
    if (!account.isConnected) {
      setErrorMessage('Couchsurfing account is not connected. Please connect your credentials first.');
      setScreen('error');
      return;
    }

    setScreen('importing');
    setProgress(10);
    setStatusMessage('Initializing scraper proxy...');
    setIsCancelled(false);

    try {
      const candidates = await csScraperService.discoverRemoteTrips(
        account,
        existingTrips,
        (evt: ImportStepEvent) => {
          if (!isCancelled) {
            setProgress(evt.progressPercent);
            setStatusMessage(evt.message);
          }
        }
      );

      if (isCancelled) return;

      setDiscoveredCandidates(candidates);
      setScreen('results');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown scraping error';
      setErrorMessage(msg);
      setScreen('error');
    }
  };

  const handleCancelImport = () => {
    setIsCancelled(true);
    setScreen('source');
    setProgress(0);
  };

  const handleToggleSelectCandidate = (csTripId: string) => {
    setDiscoveredCandidates((prev) =>
      prev.map((c) =>
        c.csTripId === csTripId ? { ...c, selected: !c.selected } : c
      )
    );
  };

  const handleSelectAllNew = () => {
    setDiscoveredCandidates((prev) =>
      prev.map((c) => ({
        ...c,
        selected: !c.isAlreadyImported
      }))
    );
  };

  const handleSelectAll = () => {
    const allSelected = discoveredCandidates.every((c) => c.selected);
    setDiscoveredCandidates((prev) =>
      prev.map((c) => ({
        ...c,
        selected: !allSelected
      }))
    );
  };

  const handleConfirmImport = () => {
    const toImport = discoveredCandidates.filter((c) => {
      if (!c.selected) return false;
      if (skipDuplicates && c.isAlreadyImported) return false;
      return true;
    });

    const newTrips: Trip[] = toImport.map((c) => {
      // If already imported and user chose to refresh:
      if (c.isAlreadyImported && c.existingTripId) {
        const existing = existingTrips.find((t) => t.id === c.existingTripId);
        return (
          existing || {
            id: `trip-${c.city.toLowerCase()}-${Date.now()}`,
            city: c.city,
            country: c.country,
            startDate: c.startDate,
            endDate: c.endDate,
            source: 'couchsurfing',
            publicationStatus: 'published',
            status: 'upcoming',
            hostStats: {
              collected: c.hostsAvailable,
              analyzed: Math.floor(c.hostsAvailable * 0.7),
              selected: 0,
              inQueue: 0
            },
            lastSync: 'Just now',
            description: c.description,
            guestsCount: 1,
            couchsurfingTripId: c.csTripId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        );
      }

      return {
        id: `trip-${c.city.toLowerCase()}-${Date.now()}`,
        city: c.city,
        country: c.country,
        startDate: c.startDate,
        endDate: c.endDate,
        source: 'couchsurfing',
        publicationStatus: 'published',
        status: 'upcoming',
        hostStats: {
          collected: c.hostsAvailable,
          analyzed: Math.floor(c.hostsAvailable * 0.6),
          selected: 0,
          inQueue: 0
        },
        lastSync: 'Just now',
        description: c.description,
        guestsCount: 1,
        couchsurfingTripId: c.csTripId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    onImportComplete(newTrips);
    onClose();
    setScreen('source');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-csSurface border-t sm:border border-csBorder rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden pb-safe">
        {/* Modal Handle for iOS swipe-down feel */}
        <div className="w-full flex justify-center pt-2.5 pb-1">
          <div className="w-12 h-1 bg-slate-700/60 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-csBorder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-[18px]">cloud_download</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight font-sans">
                {screen === 'source' && 'Import Trips from Couchsurfing'}
                {screen === 'importing' && 'Synchronizing CS Trips...'}
                {screen === 'results' && 'Import Discovered Trips'}
                {screen === 'error' && 'Import Failed'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {screen === 'source' && 'Retrieve your active trip cards from Couchsurfing'}
                {screen === 'importing' && 'Live scraper agent fetching itineraries'}
                {screen === 'results' && 'Review & select trips to synchronize locally'}
                {screen === 'error' && 'Encountered an issue during synchronization'}
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
        <div className="p-5 overflow-y-auto flex-1">
          {/* SCREEN A: IMPORT SOURCE */}
          {screen === 'source' && (
            <div className="space-y-4">
              {/* Account Status Card */}
              <div className="p-3.5 rounded-xl bg-csCard border border-csBorder flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-slate-300">
                    {account.avatarUrl ? (
                      <img
                        src={account.avatarUrl}
                        alt={account.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined">person</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">
                        @{account.username}
                      </span>
                      {account.verified && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Status:{' '}
                      <span
                        className={
                          account.isConnected ? 'text-emerald-400 font-semibold' : 'text-red-400'
                        }
                      >
                        {account.isConnected ? 'Connected & Active' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenAuth}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 font-mono active:scale-95 transition"
                >
                  Configure
                </button>
              </div>

              {/* Explanatory notes */}
              <div className="p-3.5 rounded-xl bg-csSurface border border-csBorderLight/50 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[10px] tracking-wider font-mono">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  How Import Works
                </div>
                <p className="leading-relaxed text-[12px] text-slate-300">
                  The scraper connects to your authenticated Couchsurfing account, extracts your
                  active, upcoming, and planned travel itineraries, and calculates host discovery
                  candidates.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-csBorder text-[11px] text-slate-400 font-mono">
                  <span>Last sync:</span>
                  <span className="text-slate-200">{account.lastSync}</span>
                </div>
              </div>

              {/* Duplicate detection preview note */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                <span className="material-symbols-outlined text-[16px] shrink-0">verified</span>
                <span>Duplicate detection active: Existing local trips will be preserved and merged safely.</span>
              </div>

              {/* Primary action */}
              <div className="pt-2">
                <button
                  onClick={handleStartImport}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-[0.98] transition font-sans"
                >
                  <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
                  Start Import from Couchsurfing
                </button>
              </div>
            </div>
          )}

          {/* SCREEN B: IMPORTING PROGRESS */}
          {screen === 'importing' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-5">
              {/* Animated Progress Ring */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-amber-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-amber-400">
                  {progress}%
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-sans">
                  Querying Couchsurfing Itineraries
                </h4>
                <p className="text-xs text-amber-400 font-mono animate-pulse">{statusMessage}</p>
              </div>

              {/* Pipeline Step Indicators */}
              <div className="w-full max-w-xs space-y-2 text-left text-[11px] font-mono bg-csCard p-3 rounded-xl border border-csBorder">
                <div className="flex items-center justify-between text-slate-300">
                  <span>1. Tailscale Proxy</span>
                  <span className="text-emerald-400">OK</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>2. Session Token Auth</span>
                  <span className={progress >= 40 ? 'text-emerald-400' : 'text-slate-500'}>
                    {progress >= 40 ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>3. Scrape Trip Cards</span>
                  <span className={progress >= 70 ? 'text-emerald-400' : 'text-slate-500'}>
                    {progress >= 70 ? 'DONE' : 'IN PROGRESS'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>4. Host Metadata & Deduplication</span>
                  <span className={progress >= 90 ? 'text-emerald-400' : 'text-slate-500'}>
                    {progress >= 90 ? 'READY' : 'WAITING'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCancelImport}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs font-mono active:scale-95 transition"
              >
                Cancel Safely
              </button>
            </div>
          )}

          {/* SCREEN C: IMPORT RESULTS */}
          {screen === 'results' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">
                    Found {discoveredCandidates.length} Couchsurfing Trips
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Select which trip cards you want to import into your workspace.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    onClick={handleSelectAllNew}
                    className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 hover:border-amber-500/40 text-[10px] font-mono"
                  >
                    Select New
                  </button>
                  <button
                    onClick={handleSelectAll}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono"
                  >
                    Toggle All
                  </button>
                </div>
              </div>

              {/* Deduplication option */}
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-csCard border border-csBorder text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span>Skip existing duplicate trips (recommended)</span>
              </label>

              {/* List of candidates */}
              <div className="space-y-2.5 max-h-[42vh] overflow-y-auto pr-1">
                {discoveredCandidates.map((cand) => (
                  <div
                    key={cand.csTripId}
                    onClick={() => handleToggleSelectCandidate(cand.csTripId)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                      cand.selected
                        ? 'bg-csCard border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                        : 'bg-csCard/50 border-csBorder opacity-80'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={cand.selected}
                      onChange={() => handleToggleSelectCandidate(cand.csTripId)}
                      className="mt-1 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white uppercase font-sans">
                            {cand.city}
                          </span>
                          <span className="text-[11px] text-slate-400">{cand.country}</span>
                        </div>
                        {cand.isAlreadyImported ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
                            Already in Trips
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 font-mono border border-emerald-500/40">
                            New Trip
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                        {cand.startDate} → {cand.endDate}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-sans">
                        {cand.description}
                      </p>
                      <div className="text-[10px] text-amber-400/90 font-mono mt-1">
                        ~{cand.hostsAvailable} potential Couchsurfing hosts identified
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Confirm Import Action */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setScreen('source')}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold font-sans active:scale-95 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmImport}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.25)] active:scale-[0.98] transition font-sans flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">done_all</span>
                  Import Selected ({discoveredCandidates.filter((c) => c.selected).length})
                </button>
              </div>
            </div>
          )}

          {/* SCREEN D: ERROR STATE */}
          {screen === 'error' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">error</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Import Failed</h4>
                <p className="text-xs text-red-300/90 mt-1 max-w-sm mx-auto">{errorMessage}</p>
              </div>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold active:scale-95 transition"
                >
                  Check Credentials
                </button>
                <button
                  onClick={() => setScreen('source')}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs active:scale-95 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
