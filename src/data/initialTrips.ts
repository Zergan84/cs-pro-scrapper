import { Trip, CSAccount, ImportCandidate } from '../types/trip';

export const INITIAL_ACCOUNT: CSAccount = {
  isConnected: true,
  username: 'alex_nomad',
  displayName: 'Alex Rivers',
  email: 'alex.nomad@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  lastSync: '10 mins ago',
  status: 'idle',
  verified: true,
  activeTripsCount: 3
};

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-tokyo-2026',
    city: 'Tokyo',
    country: 'Japan',
    startDate: '2026-11-16',
    endDate: '2026-11-19',
    source: 'couchsurfing',
    publicationStatus: 'published',
    status: 'upcoming',
    hostStats: {
      collected: 24,
      analyzed: 24,
      selected: 8,
      inQueue: 5
    },
    lastSync: '2 hours ago',
    description: 'Looking to explore local neighborhoods (Shimokitazawa, Yanaka) and exchange stories over izakaya food. Practicing conversational Japanese!',
    guestsCount: 1,
    couchsurfingTripId: 'cs-trip-908124',
    createdAt: '2026-10-15T10:00:00Z',
    updatedAt: '2026-11-09T14:30:00Z'
  },
  {
    id: 'trip-kyoto-2026',
    city: 'Kyoto',
    country: 'Japan',
    startDate: '2026-11-19',
    endDate: '2026-11-21',
    source: 'couchsurfing',
    publicationStatus: 'published',
    status: 'upcoming',
    hostStats: {
      collected: 12,
      analyzed: 12,
      selected: 0,
      inQueue: 0
    },
    lastSync: '5 hours ago',
    description: 'Ancient architecture, peaceful zen gardens, and morning matcha walks. Flexible traveler with own sleeping mat if needed.',
    guestsCount: 1,
    couchsurfingTripId: 'cs-trip-908125',
    createdAt: '2026-10-15T11:20:00Z',
    updatedAt: '2026-11-09T11:15:00Z'
  },
  {
    id: 'trip-osaka-2026',
    city: 'Osaka',
    country: 'Japan',
    startDate: '2026-11-21',
    endDate: '2026-11-22',
    source: 'local',
    publicationStatus: 'not_published',
    status: 'upcoming',
    hostStats: {
      collected: 6,
      analyzed: 4,
      selected: 2,
      inQueue: 1
    },
    lastSync: 'Never (Local Draft)',
    description: 'Food adventure! Street food in Dotonbori, takoyaki crawl, and photography around Umeda Sky building.',
    guestsCount: 1,
    createdAt: '2026-11-08T18:00:00Z',
    updatedAt: '2026-11-08T18:00:00Z'
  },
  {
    id: 'trip-sapporo-2026',
    city: 'Sapporo',
    country: 'Japan',
    startDate: '2026-12-05',
    endDate: '2026-12-10',
    source: 'couchsurfing',
    publicationStatus: 'published',
    status: 'upcoming',
    hostStats: {
      collected: 31,
      analyzed: 28,
      selected: 14,
      inQueue: 4
    },
    lastSync: 'Yesterday',
    description: 'Winter wonderland trip in Hokkaido. Snowscapes, hot springs, ramen alley.',
    guestsCount: 2,
    couchsurfingTripId: 'cs-trip-908129',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-11-08T09:40:00Z'
  }
];

// Candidates available in Couchsurfing account ready for import discovery
export const MOCK_CS_REMOTE_TRIPS: ImportCandidate[] = [
  {
    csTripId: 'cs-trip-908124',
    city: 'Tokyo',
    country: 'Japan',
    startDate: '2026-11-16',
    endDate: '2026-11-19',
    description: 'Looking to explore local neighborhoods and exchange stories over izakaya food.',
    hostsAvailable: 84,
    isAlreadyImported: true,
    existingTripId: 'trip-tokyo-2026',
    selected: false
  },
  {
    csTripId: 'cs-trip-908125',
    city: 'Kyoto',
    country: 'Japan',
    startDate: '2026-11-19',
    endDate: '2026-11-21',
    description: 'Ancient architecture, peaceful zen gardens, and morning matcha walks.',
    hostsAvailable: 38,
    isAlreadyImported: true,
    existingTripId: 'trip-kyoto-2026',
    selected: false
  },
  {
    csTripId: 'cs-trip-908129',
    city: 'Sapporo',
    country: 'Japan',
    startDate: '2026-12-05',
    endDate: '2026-12-10',
    description: 'Winter wonderland trip in Hokkaido.',
    hostsAvailable: 42,
    isAlreadyImported: true,
    existingTripId: 'trip-sapporo-2026',
    selected: false
  },
  {
    csTripId: 'cs-trip-909501',
    city: 'Seoul',
    country: 'South Korea',
    startDate: '2027-01-14',
    endDate: '2027-01-20',
    description: 'First time visiting Seoul. Interested in K-architecture, indie music scene in Hongdae, and hiking Bukhansan.',
    hostsAvailable: 95,
    isAlreadyImported: false,
    selected: true
  },
  {
    csTripId: 'cs-trip-909588',
    city: 'Taipei',
    country: 'Taiwan',
    startDate: '2027-02-02',
    endDate: '2027-02-07',
    description: 'Night markets, tea houses in Maokong, cycling around Daan park and cultural exploration.',
    hostsAvailable: 67,
    isAlreadyImported: false,
    selected: true
  }
];
