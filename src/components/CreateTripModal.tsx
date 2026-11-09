import React, { useState } from 'react';
import { Trip, CSAccount } from '../types/trip';
import { POPULAR_DESTINATIONS, resolveCountryForCity } from '../data/popularDestinations';
import { csScraperService } from '../services/csScraperService';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: CSAccount;
  onCreateTrip: (newTrip: Trip) => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  account,
  onCreateTrip
}) => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 12);
    return d.toISOString().split('T')[0];
  });
  const [description, setDescription] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [citySuggestions, setCitySuggestions] = useState<typeof POPULAR_DESTINATIONS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Separate publication state
  const [publishImmediately, setPublishImmediately] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishStatus, setPublishStatus] = useState<
    'idle' | 'local_success' | 'publishing' | 'published' | 'publish_failed'
  >('idle');
  const [publishError, setPublishError] = useState('');

  if (!isOpen) return null;

  const handleCityChange = (val: string) => {
    setCity(val);
    const resolved = resolveCountryForCity(val);
    if (resolved) {
      setCountry(resolved);
    }
    if (val.trim().length > 0) {
      const filtered = POPULAR_DESTINATIONS.filter((d) =>
        d.city.toLowerCase().includes(val.toLowerCase())
      );
      setCitySuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (d: typeof POPULAR_DESTINATIONS[0]) => {
    setCity(d.city);
    setCountry(d.country);
    setShowSuggestions(false);
  };

  const calculateDuration = () => {
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? `${diff} nights` : 'Invalid dates';
    } catch {
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !country.trim()) return;

    setIsSubmitting(true);

    const tripId = `trip-${city.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const baseTrip: Trip = {
      id: tripId,
      city: city.trim(),
      country: country.trim(),
      startDate,
      endDate,
      source: 'local',
      publicationStatus: 'not_published',
      status: 'upcoming',
      hostStats: {
        collected: 0,
        analyzed: 0,
        selected: 0,
        inQueue: 0
      },
      lastSync: 'Created locally',
      description: description.trim(),
      guestsCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (publishImmediately) {
      setPublishStatus('publishing');
      try {
        const res = await csScraperService.publishTripToCS(baseTrip, account);
        if (res.success && res.csTripId) {
          const publishedTrip: Trip = {
            ...baseTrip,
            publicationStatus: 'published',
            couchsurfingTripId: res.csTripId,
            lastSync: 'Published to CS just now'
          };
          onCreateTrip(publishedTrip);
          setPublishStatus('published');
          setTimeout(() => {
            onClose();
            resetForm();
          }, 800);
          return;
        } else {
          setPublishStatus('publish_failed');
          setPublishError(res.error || 'Failed to publish to Couchsurfing');
          // Still save local trip!
          onCreateTrip(baseTrip);
          return;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Publish failed';
        setPublishStatus('publish_failed');
        setPublishError(msg);
        onCreateTrip(baseTrip);
        return;
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Local only
      onCreateTrip(baseTrip);
      setPublishStatus('local_success');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 500);
    }
  };

  const resetForm = () => {
    setCity('');
    setCountry('');
    setDescription('');
    setPublishImmediately(false);
    setIsSubmitting(false);
    setPublishStatus('idle');
    setPublishError('');
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
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight font-sans">
                Create Trip
              </h3>
              <p className="text-[11px] text-slate-400">
                Plan a new travel itinerary (saved locally first)
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Destination Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Destination
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="City (e.g. Tokyo, Paris)"
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  onFocus={() => {
                    if (city.length > 0) setShowSuggestions(true);
                  }}
                  className="w-full px-3 py-2.5 bg-csCard border border-csBorder rounded-xl text-white placeholder-slate-500 text-xs focus:border-amber-500 focus:outline-none transition"
                />
                {showSuggestions && citySuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-csSurface border border-csBorder rounded-xl shadow-xl overflow-hidden">
                    {citySuggestions.map((s) => (
                      <div
                        key={s.city}
                        onClick={() => handleSelectSuggestion(s)}
                        className="px-3 py-2 text-xs text-slate-200 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between border-b border-csBorder last:border-0"
                      >
                        <span className="font-bold">{s.city}</span>
                        <span className="text-slate-400 text-[11px] font-mono">
                          {s.flag} {s.country}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2.5 bg-csCard border border-csBorder rounded-xl text-white placeholder-slate-500 text-xs focus:border-amber-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Quick popular chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-slate-500 font-mono">Suggestions:</span>
              {POPULAR_DESTINATIONS.slice(0, 4).map((d) => (
                <button
                  type="button"
                  key={d.city}
                  onClick={() => handleSelectSuggestion(d)}
                  className="px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-[10px] text-slate-300 transition"
                >
                  {d.city}
                </button>
              ))}
            </div>
          </div>

          {/* Dates & Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Travel Dates
              </label>
              <span className="text-[10px] font-mono text-amber-400 font-semibold">
                {calculateDuration()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-csCard border border-csBorder rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-csCard border border-csBorder rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Guests count */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Travelers / Guests
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setGuestsCount(num)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-mono font-bold transition ${
                    guestsCount === num
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-csCard text-slate-300 border-csBorder hover:border-slate-600'
                  }`}
                >
                  {num} {num === 1 ? 'Solo' : 'Guests'}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Trip Description / Notes <span className="text-slate-500 text-[10px] lowercase font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Why are you visiting? What are your travel goals, interests, or hosting preferences?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-csCard border border-csBorder rounded-xl text-white placeholder-slate-500 text-xs focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          {/* Local vs Couchsurfing Notice */}
          <div className="p-3 rounded-xl bg-csSurface border border-csBorderLight/60 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[10px] tracking-wider font-mono">
              <span className="material-symbols-outlined text-[15px]">security</span>
              Local Isolation Guarantee
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Creating a local trip saves it securely on your device. It will{' '}
              <strong className="text-white">NOT</strong> automatically publish anything to
              Couchsurfing. You can search hosts for local trips anytime.
            </p>
          </div>

          {/* Explicit separate Couchsurfing publication toggle */}
          <div className="p-3 rounded-xl bg-csCard border border-csBorder flex items-center justify-between">
            <div className="pr-3">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-amber-400">
                  publish
                </span>
                Publish to Couchsurfing
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Post this public trip card to your Couchsurfing account now.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={publishImmediately}
                onChange={(e) => setPublishImmediately(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Status feedback alerts */}
          {publishStatus === 'publishing' && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2 font-mono">
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
              <span>Publishing itinerary to Couchsurfing API...</span>
            </div>
          )}
          {publishStatus === 'published' && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-mono">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Trip created locally & successfully published to Couchsurfing!</span>
            </div>
          )}
          {publishStatus === 'publish_failed' && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 font-mono">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span>Local trip saved, but CS publish failed: {publishError}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold font-sans active:scale-95 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !city.trim() || !country.trim()}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.25)] active:scale-[0.98] transition font-sans flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">
                {publishImmediately ? 'cloud_upload' : 'save'}
              </span>
              {publishImmediately ? 'Create & Publish to CS' : 'Create Local Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
