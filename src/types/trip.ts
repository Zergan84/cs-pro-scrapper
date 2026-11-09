export type TripSource = 'couchsurfing' | 'local';

export type PublicationStatus = 'not_published' | 'pending' | 'published' | 'failed';

export type TripStatus = 'active' | 'upcoming' | 'past' | 'draft';

export interface HostStats {
  collected: number;
  analyzed: number;
  selected: number;
  inQueue: number;
}

export interface Trip {
  id: string;
  city: string;
  country: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  source: TripSource;
  publicationStatus: PublicationStatus;
  status: TripStatus;
  hostStats: HostStats;
  lastSync: string;
  description?: string;
  guestsCount: number;
  couchsurfingTripId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CSAccount {
  isConnected: boolean;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  lastSync: string;
  sessionToken?: string;
  status: 'idle' | 'connected' | 'syncing' | 'error';
  verified: boolean;
  activeTripsCount: number;
}

export interface ImportCandidate {
  csTripId: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  description: string;
  hostsAvailable: number;
  isAlreadyImported: boolean;
  existingTripId?: string;
  selected: boolean;
}

export type TabType = 'trips' | 'search' | 'queue' | 'auto' | 'inbox' | 'context';
export type FilterType = 'all' | 'upcoming' | 'past' | 'local' | 'couchsurfing';
