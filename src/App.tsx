import React, { useState, useEffect, useMemo } from 'react';
import { Trip, CSAccount, TabType, FilterType } from './types/trip';
import { storage } from './services/storage';
import { csScraperService } from './services/csScraperService';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TripCard } from './components/TripCard';
import { ImportModal } from './components/ImportModal';
import { CreateTripModal } from './components/CreateTripModal';
import { TripDetailsModal } from './components/TripDetailsModal';
import { EditTripModal } from './components/EditTripModal';
import { AuthModal } from './components/AuthModal';
import { HostSearchModal } from './components/HostSearchModal';
import { StatusSheet } from './components/StatusSheet';
import { EmptyState } from './components/EmptyState';

export const App: React.FC = () => {
  // Persistence state
  const [trips, setTrips] = useState<Trip[]>(() => storage.getTrips());
  const [account, setAccount] = useState<CSAccount>(() => storage.getAccount());
  const [theme, setTheme] = useState<'dark' | 'light'>(() => storage.getTheme());

  // UI Navigation & View State
  const [activeTab, setActiveTab] = useState<TabType>('trips');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc' | 'hosts'>('date_asc');
  const [iphoneFrame, setIphoneFrame] = useState(false);

  // Modals state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isHostSearchOpen, setIsHostSearchOpen] = useState(false);

  // Selected Trip for Details / Edit / Search
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Syncing indicator
  const [syncingTripId, setSyncingTripId] = useState<string | null>(null);
  const [globalSyncing, setGlobalSyncing] = useState(false);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.saveTheme(theme);
  }, [theme]);

  // Persist trips
  useEffect(() => {
    storage.saveTrips(trips);
  }, [trips]);

  // Persist account
  useEffect(() => {
    storage.saveAccount(account);
  }, [account]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Handling Trip Operations
  const handleCreateTrip = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev]);
  };

  const handleImportComplete = (imported: Trip[]) => {
    setTrips((prev) => {
      // Merge unique trips
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

  const handleSyncSingleTrip = async (trip: Trip, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSyncingTripId(trip.id);
    try {
      const updates = await csScraperService.syncTrip(trip);
      handleUpdateTrip({ ...trip, ...updates });
    } finally {
      setSyncingTripId(null);
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

  const handleLaunchFindHosts = (trip: Trip, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTrip(trip);
    setIsHostSearchOpen(true);
  };

  // Bottom nav tab change router
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'search') {
      setIsHostSearchOpen(true);
    } else if (tab === 'context') {
      setIsAuthOpen(true);
    } else if (tab === 'auto') {
      setIsStatusOpen(true);
    }
  };

  // Filtered & Sorted Trips
  const filteredTrips = useMemo(() => {
    return trips
      .filter((t) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCity = t.city.toLowerCase().includes(q);
          const matchCountry = t.country.toLowerCase().includes(q);
          const matchDesc = t.description?.toLowerCase().includes(q);
          if (!matchCity && !matchCountry && !matchDesc) return false;
        }

        // Tab filters
        if (filter === 'upcoming') {
          return t.status === 'upcoming' || t.status === 'active';
        }
        if (filter === 'past') {
          return t.status === 'past';
        }
        if (filter === 'local') {
          return t.source === 'local';
        }
        if (filter === 'couchsurfing') {
          return t.source === 'couchsurfing';
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'hosts') {
          return b.hostStats.collected - a.hostStats.collected;
        }
        if (sortBy === 'date_desc') {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        }
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
  }, [trips, filter, searchQuery, sortBy]);

  return (
    <div
      className={`min-h-screen bg-[#07090d] text-slate-200 flex flex-col items-center justify-start transition-colors ${
        iphoneFrame ? 'py-4 sm:py-8' : ''
      }`}
    >
      {/* Desktop view controller tool bar */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-5xl px-4 py-2 text-xs text-slate-400 border-b border-csBorder mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400 font-mono">CS PRO MOBILE RUNTIME</span>
          <span>·</span>
          <span>Target Device: iPhone 15 Pro Max (430px viewport)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIphoneFrame(!iphoneFrame)}
            className="px-2.5 py-1 rounded-lg bg-csSurface border border-csBorder text-slate-300 hover:text-amber-400 text-[11px] font-mono flex items-center gap-1.5 transition"
          >
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            {iphoneFrame ? 'Full Width Mode' : 'iPhone 15 Pro Frame'}
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset all trips and authentication data to initial state?')) {
                const res = storage.resetDefaults();
                setTrips(res.trips);
                setAccount(res.account);
              }
            }}
            className="px-2 py-1 rounded-lg bg-csSurface border border-csBorder text-slate-400 hover:text-red-400 text-[11px] font-mono transition"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Main Container: Mobile or Framed iPhone View */}
      <div
        className={`w-full relative flex flex-col min-h-screen bg-csBg transition-all overflow-x-hidden ${
          iphoneFrame
            ? 'max-w-[430px] rounded-[50px] shadow-[0_0_50px_rgba(0,0,0,0.85)] border-[8px] border-slate-800/90'
            : 'max-w-md sm:max-w-lg md:max-w-xl'
        }`}
      >
        {/* Header & iOS Status Chrome */}
        <Header
          account={account}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenStatus={() => setIsStatusOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isSyncing={globalSyncing}
        />

        {/* Main Screen Content */}
        <main className="flex-1 flex flex-col relative w-full pt-24 pb-28 px-3.5 space-y-3.5">
          {/* Subheader Status Banner */}
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

          {/* Quick Action Buttons (Active & Clickable) */}
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
              className="flex flex-col text-left p-3 bg-csSurface border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl relative overflow-hidden shadow-sm active:scale-95 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/25 transition">
                  <span className="material-symbols-outlined text-[16px] font-bold">add</span>
                </div>
                <span className="material-symbols-outlined text-[15px] text-cyan-400 group-hover:translate-x-0.5 transition">
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

          {/* Filter Tabs & Search Controls */}
          <div className="space-y-2 pt-1">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`trip-filter px-3 py-1.5 rounded-xl transition shrink-0 ${
                  filter === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-csSurface border border-csBorder text-slate-400 font-semibold hover:text-slate-200'
                }`}
              >
                All Trips ({trips.length})
              </button>

              <button
                onClick={() => setFilter('upcoming')}
                className={`trip-filter px-3 py-1.5 rounded-xl transition shrink-0 ${
                  filter === 'upcoming'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-csSurface border border-csBorder text-slate-400 font-semibold hover:text-slate-200'
                }`}
              >
                Upcoming
              </button>

              <button
                onClick={() => setFilter('local')}
                className={`trip-filter px-3 py-1.5 rounded-xl transition shrink-0 ${
                  filter === 'local'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-csSurface border border-csBorder text-slate-400 font-semibold hover:text-slate-200'
                }`}
              >
                Local Only
              </button>

              <button
                onClick={() => setFilter('couchsurfing')}
                className={`trip-filter px-3 py-1.5 rounded-xl transition shrink-0 ${
                  filter === 'couchsurfing'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-csSurface border border-csBorder text-slate-400 font-semibold hover:text-slate-200'
                }`}
              >
                Couchsurfing
              </button>

              <button
                onClick={() => setFilter('past')}
                className={`trip-filter px-3 py-1.5 rounded-xl transition shrink-0 ${
                  filter === 'past'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-csSurface border border-csBorder text-slate-400 font-semibold hover:text-slate-200'
                }`}
              >
                Past
              </button>
            </div>

            {/* Search and Sort Row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-slate-500">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search destination or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-csSurface border border-csBorder rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[14px]">cancel</span>
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-csSurface border border-csBorder text-slate-300 text-xs px-2.5 py-2 rounded-xl font-mono focus:border-amber-500 focus:outline-none shrink-0"
              >
                <option value="date_asc">Dates: Earliest</option>
                <option value="date_desc">Dates: Latest</option>
                <option value="hosts">Most Hosts</option>
              </select>
            </div>
          </div>

          {/* Trip Cards List */}
          <div className="flex flex-col space-y-3">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onClick={handleOpenDetails}
                  onFindHosts={(t, e) => handleLaunchFindHosts(t, e)}
                  onSync={(t, e) => handleSyncSingleTrip(t, e)}
                  isSyncing={syncingTripId === trip.id}
                />
              ))
            ) : (
              <EmptyState
                hasFilterActive={Boolean(searchQuery || filter !== 'all')}
                onResetFilter={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                onImportClick={() => setIsImportOpen(true)}
                onCreateClick={() => setIsCreateOpen(true)}
              />
            )}
          </div>

          {/* Security Footnote Badge */}
          <div className="pt-2 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-csSurface/70 border border-csBorder text-[10px] font-mono text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Secure Couchsurfing Egress · Zero Cloud Leaks
            </span>
          </div>
        </main>

        {/* Couchsurfing Pro Native Dark Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          queueCount={10}
          inboxCount={18}
        />

        {/* MODALS & BOTTOM SHEETS */}
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
          onFindHosts={(trip) => handleLaunchFindHosts(trip)}
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

        <HostSearchModal
          isOpen={isHostSearchOpen}
          onClose={() => setIsHostSearchOpen(false)}
          selectedTrip={selectedTrip}
          allTrips={trips}
          onSelectTrip={(t) => setSelectedTrip(t)}
        />

        <StatusSheet isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} />
      </div>
    </div>
  );
};
export default App;
