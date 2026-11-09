import React, { useState, useEffect } from 'react';
import { Trip } from '../types/trip';

interface EditTripModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTrip: Trip) => void;
}

export const EditTripModal: React.FC<EditTripModalProps> = ({
  trip,
  isOpen,
  onClose,
  onSave
}) => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);

  useEffect(() => {
    if (trip) {
      setCity(trip.city);
      setCountry(trip.country);
      setStartDate(trip.startDate);
      setEndDate(trip.endDate);
      setDescription(trip.description || '');
      setGuestsCount(trip.guestsCount || 1);
    }
  }, [trip]);

  if (!isOpen || !trip) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !country.trim()) return;

    const updated: Trip = {
      ...trip,
      city: city.trim(),
      country: country.trim(),
      startDate,
      endDate,
      description: description.trim(),
      guestsCount,
      updatedAt: new Date().toISOString()
    };

    onSave(updated);
    onClose();
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
            <span className="material-symbols-outlined text-amber-400 text-[18px]">edit</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight font-sans">
              Edit Trip Details
            </h3>
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
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Destination
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full px-3 py-2 bg-csCard border border-csBorder rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
              />
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="w-full px-3 py-2 bg-csCard border border-csBorder rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Travel Dates
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-csCard border border-csBorder rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none font-mono"
              />
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
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-csCard text-slate-300 border-csBorder'
                  }`}
                >
                  {num} {num === 1 ? 'Solo' : 'Guests'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Trip Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-csCard border border-csBorder rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold active:scale-95 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition font-sans"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
