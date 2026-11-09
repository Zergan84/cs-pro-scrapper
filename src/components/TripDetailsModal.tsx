import React, { useState } from 'react';
import { Trip, CSAccount } from '../types/trip';
import { csScraperService } from '../services/csScraperService';

interface TripDetailsModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
  onUpdateTrip: (updated: Trip) => void;
  onFindHosts: (trip: Trip) => void;
  account: CSAccount;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  trip,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onUpdateTrip,
  onFindHosts,
  account
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen || !trip) return null;

  const handlePublishToCS = async () => {
    setIsPublishing(true);
    setPublishMessage('Publishing to Couchsurfing API...');
    try {
      const res = await csScraperService.publishTripToCS(trip, account);
      if (res.success && res.csTripId) {
        const updated: Trip = {
          ...trip,
          publicationStatus: 'published',
          couchsurfingTripId: res.csTripId,
          lastSync: 'Published just now',
          updatedAt: new Date().toISOString()
        };
        onUpdateTrip(updated);
        setPublishMessage('Successfully published to Couchsurfing!');
        setTimeout(() => setPublishMessage(''), 2500);
      } else {
        setPublishMessage(`Failed: ${res.error || 'Connection failed'}`);
        setTimeout(() => setPublishMessage(''), 3000);
      }
    } catch {
      setPublishMessage('Failed to publish');
      setTimeout(() => setPublishMessage(''), 3000);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSyncTrip = async () => {
    setIsSyncing(true);
    try {
      const updates = await csScraperService.syncTrip(trip);
      const updated: Trip = { ...trip, ...updates };
      onUpdateTrip(updated);
    } finally {
      setIsSyncing(false);
    }
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
            <span className="material-symbols-outlined text-amber-400 text-[20px]">
              flight_takeoff
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight font-sans">
                Trip Details
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">ID: {trip.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white transition"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Destination & Dates Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-csCard to-csSurface border border-csBorder relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase font-sans">
                  {trip.city}
                </h2>
                <div className="text-xs text-amber-400 font-semibold font-mono mt-0.5">
                  {trip.country}
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex flex-col items-end gap-1">
                {trip.source === 'couchsurfing' ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold">
                    Couchsurfing
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 text-[10px] font-mono font-bold">
                    Local Itinerary
                  </span>
                )}
                {trip.publicationStatus === 'published' ? (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    Published on CS
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">lock</span>
                    Not published on CS
                  </span>
                )}
              </div>
            </div>

            {/* Travel dates & Guests */}
            <div className="mt-4 pt-3 border-t border-csBorder flex items-center justify-between text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-400">
                  calendar_month
                </span>
                <span>
                  {trip.startDate} → {trip.endDate}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="material-symbols-outlined text-[14px]">group</span>
                <span>
                  {trip.guestsCount} {trip.guestsCount === 1 ? 'traveler' : 'travelers'}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Host Discovery Statistics
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-csCard border border-csBorder">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Hosts Discovered
                </div>
                <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                  {trip.hostStats.collected}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">From local CS cluster</div>
              </div>

              <div className="p-3 rounded-xl bg-csCard border border-csBorder">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Profiles Analyzed
                </div>
                <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">
                  {trip.hostStats.analyzed}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Via LLaVA + Ollama</div>
              </div>

              <div className="p-3 rounded-xl bg-csCard border border-csBorder">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Hosts Selected</div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                  {trip.hostStats.selected}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">High compatibility score</div>
              </div>

              <div className="p-3 rounded-xl bg-csCard border border-csBorder">
                <div className="text-[10px] font-mono text-slate-400 uppercase">In Queue</div>
                <div className="text-xl font-black text-amber-300 font-mono mt-0.5">
                  {trip.hostStats.inQueue}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Pending dispatch</div>
              </div>
            </div>
          </div>

          {/* Main Action: FIND HOSTS */}
          <div className="pt-1">
            <button
              onClick={() => {
                onClose();
                onFindHosts(trip);
              }}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.35)] active:scale-[0.98] transition font-sans"
            >
              <span className="material-symbols-outlined text-[18px]">person_search</span>
              Find Hosts in {trip.city}
            </button>
            <p className="text-[10px] text-center text-slate-500 font-mono mt-1.5">
              Opens the Host Discovery & Analysis module with this trip preloaded
            </p>
          </div>

          {/* Trip Description */}
          {trip.description && (
            <div className="p-3 rounded-xl bg-csCard border border-csBorder space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Trip Description & Travel Notes
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {trip.description}
              </p>
            </div>
          )}

          {/* Sync & Publish Alerts */}
          {publishMessage && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              {publishMessage}
            </div>
          )}

          {/* Action Row */}
          <div className="space-y-2 pt-2 border-t border-csBorder">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onEdit(trip)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Edit Trip
              </button>

              <button
                onClick={handleSyncTrip}
                disabled={isSyncing}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition disabled:opacity-50"
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    isSyncing ? 'animate-spin text-amber-400' : ''
                  }`}
                >
                  sync
                </span>
                {isSyncing ? 'Syncing...' : 'Sync Data'}
              </button>
            </div>

            {/* If local and not published, offer Publish button */}
            {trip.publicationStatus !== 'published' && (
              <button
                onClick={handlePublishToCS}
                disabled={isPublishing}
                className="w-full py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <span className="material-symbols-outlined text-[16px]">publish</span>
                Publish to Couchsurfing
              </button>
            )}

            <button
              onClick={() => {
                if (window.confirm(`Delete trip to ${trip.city}?`)) {
                  onDelete(trip.id);
                  onClose();
                }
              }}
              className="w-full py-2 text-center text-xs text-red-400/80 hover:text-red-300 transition font-mono flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">delete</span>
              Delete or Archive Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
