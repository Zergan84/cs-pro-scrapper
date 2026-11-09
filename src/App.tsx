import React, { useState, useEffect } from 'react';
import { Trip, CSAccount } from './types/trip';
import { storage } from './services/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TripCard } from './components/TripCard';
import { ImportModal } from './components/ImportModal';
import { CreateTripModal } from './components/CreateTripModal';
import { TripDetailsModal } from './components/TripDetailsModal';
import { EditTripModal } from './components/EditTripModal';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(() => storage.getTrips());
  const [account, setAccount] = useState<CSAccount>(() => storage.getAccount());

  // Modal states
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Selected Trip for Details / Edit
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Syncing state
  const [syncingTripId, setSyncingTripId] = useState<string | null>(null);

  // Persist trips & account
  useEffect(() => {
    storage.saveTrips(trips);
  }, [trips]);

  useEffect(() => {
    storage.saveAccount(account);
  }, [account]);

  const handleCreateTrip = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev]);
  };

  const handleImportComplete = (imported: Trip[]) => {
    setTrips((prev) => {
      const updated = [...prev];
      for (const item of imported) {
        const idx = updated.findIndex(
          (t) =>
            t.id === item.id ||
            (t.couchsurfingTripId && t.couchsurfingTripId === item.couchsurfingTripId)
        );
        if (idx >= 0) {
          updated[idx] = item;
        } else {
          updated.unshift(item);
        }
      }
      return updated;
    });
  };

  const handleUpdateTrip = (updated: Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    if (selectedTrip?.id === updated.id) {
      setSelectedTrip(updated);
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(null);
      setIsDetailsOpen(false);
    }
  };

  const handleOpenDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsDetailsOpen(false);
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-csBg font-sans text-[13px] text-slate-200 antialiased flex flex-col selection:bg-csAmber/30 selection:text-amber-300">
      {/* Header (Top status block removed as requested) */}
      <Header account={account} onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main Screen Content */}
      <main className="flex-1 flex flex-col relative w-full pb-28 px-3.5 space-y-3.5 pt-16 max-w-lg mx-auto">
        {/* Subheader Status Banner: НАЧАЛО РАБОТЫ */}
        <div className="flex items-start gap-3 p-3.5 bg-csSurface border border-amber-500/30 rounded-xl relative overflow-hidden shadow-lg">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            <span className="material-symbols-outlined text-[18px]">info</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest font-mono">
              Начало работы
            </span>
            <p className="text-xs text-slate-200 mt-1 leading-snug font-medium">
              Чтобы начать импортируйте существующий трип или создайте новый трип
            </p>
          </div>
        </div>

        {/* Quick Action Buttons: Import from CS & + Create Trip */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex flex-col text-left p-3 bg-csSurface border border-amber-500/30 hover:border-amber-400/60 rounded-xl relative overflow-hidden shadow-sm active:scale-95 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/25 transition">
                <span className="material-symbols-outlined text-[16px]">cloud_download</span>
              </div>
              <span className="material-symbols-outlined text-[15px] text-amber-400 group-hover:translate-x-0.5 transition">
                arrow_forward
              </span>
            </div>
            <span className="text-xs font-bold text-white tracking-tight">Import from CS</span>
            <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
              Sync existing trip cards
            </span>
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex flex-col text-left p-3 bg-csSurface border border-amber-500/30 hover:border-amber-400/60 rounded-xl relative overflow-hidden shadow-sm active:scale-95 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/25 transition">
                <span className="material-symbols-outlined text-[16px] font-bold">add</span>
              </div>
              <span className="material-symbols-outlined text-[15px] text-amber-400 group-hover:translate-x-0.5 transition">
                flight_takeoff
              </span>
            </div>
            <span className="text-xs font-bold text-white tracking-tight font-sans">
              + Create Trip
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
              Local or unlisted itinerary
            </span>
          </button>
        </div>

        {/* Trip Cards List in User's Cabinet */}
        <div className="flex flex-col space-y-3 pt-1">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onClick={handleOpenDetails}
              onFindHosts={(t, e) => {
                e.stopPropagation();
                handleOpenDetails(t);
              }}
              onSync={(t, e) => {
                e.stopPropagation();
                handleOpenDetails(t);
              }}
              isSyncing={syncingTripId === trip.id}
            />
          ))}
        </div>
      </main>

      {/* Couchsurfing Pro Native Dark Bottom Navigation Bar */}
      <BottomNav />

      {/* Modals for CS Login, Import, Create, Details & Edit */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        account={account}
        existingTrips={trips}
        onImportComplete={handleImportComplete}
        onOpenAuth={() => {
          setIsImportOpen(false);
          setIsAuthOpen(true);
        }}
      />

      <CreateTripModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        account={account}
        onCreateTrip={handleCreateTrip}
      />

      <TripDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        trip={selectedTrip}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteTrip}
        onUpdateTrip={handleUpdateTrip}
        onFindHosts={(trip) => handleOpenDetails(trip)}
        account={account}
      />

      <EditTripModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        trip={selectedTrip}
        onSave={handleUpdateTrip}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        account={account}
        onSaveAccount={(updated) => setAccount(updated)}
      />
    </div>
  );
};

export default App;
