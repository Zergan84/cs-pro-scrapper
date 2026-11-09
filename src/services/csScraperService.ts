import { Trip, ImportCandidate, CSAccount } from '../types/trip';
import { MOCK_CS_REMOTE_TRIPS } from '../data/initialTrips';

export interface ImportStepEvent {
  step: 'connect' | 'auth' | 'fetch' | 'parse' | 'compare' | 'ready';
  message: string;
  progressPercent: number;
}

export const csScraperService = {
  /**
   * Fetches trips from Couchsurfing account with realistic progress stages
   */
  async discoverRemoteTrips(
    account: CSAccount,
    existingTrips: Trip[],
    onProgress: (event: ImportStepEvent) => void
  ): Promise<ImportCandidate[]> {
    if (!account.isConnected) {
      throw new Error('Not connected to Couchsurfing. Please sign in to your CS account first.');
    }

    onProgress({
      step: 'connect',
      message: 'Connecting to Couchsurfing via secure proxy...',
      progressPercent: 15
    });
    await new Promise((r) => setTimeout(r, 600));

    onProgress({
      step: 'auth',
      message: `Verifying session token for @${account.username}...`,
      progressPercent: 40
    });
    await new Promise((r) => setTimeout(r, 700));

    onProgress({
      step: 'fetch',
      message: 'Scraping trips list from Couchsurfing dashboard...',
      progressPercent: 65
    });
    await new Promise((r) => setTimeout(r, 800));

    onProgress({
      step: 'parse',
      message: 'Discovered trip itineraries & parsing destination metadata...',
      progressPercent: 85
    });
    await new Promise((r) => setTimeout(r, 500));

    // Compare with existing trips to detect duplicates
    const candidates: ImportCandidate[] = MOCK_CS_REMOTE_TRIPS.map((cand) => {
      const match = existingTrips.find(
        (t) =>
          (t.couchsurfingTripId && t.couchsurfingTripId === cand.csTripId) ||
          (t.city.toLowerCase() === cand.city.toLowerCase() &&
            t.startDate === cand.startDate)
      );

      return {
        ...cand,
        isAlreadyImported: Boolean(match),
        existingTripId: match?.id,
        selected: !match // default selected if new
      };
    });

    onProgress({
      step: 'ready',
      message: `Found ${candidates.length} trips on Couchsurfing account.`,
      progressPercent: 100
    });

    return candidates;
  },

  /**
   * Publish a locally created trip to Couchsurfing
   */
  async publishTripToCS(
    trip: Trip,
    account: CSAccount
  ): Promise<{ success: boolean; csTripId?: string; error?: string }> {
    if (!account.isConnected) {
      return {
        success: false,
        error: 'Cannot publish: Couchsurfing session is not connected.'
      };
    }

    await new Promise((r) => setTimeout(r, 1200));

    // Generate simulated Couchsurfing trip ID
    const csTripId = `cs-trip-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      csTripId
    };
  },

  /**
   * Synchronize an individual trip with Couchsurfing
   */
  async syncTrip(trip: Trip): Promise<Partial<Trip>> {
    await new Promise((r) => setTimeout(r, 900));
    
    // Simulate slight updates in host stats
    const addition = Math.floor(Math.random() * 4) + 1;
    return {
      lastSync: 'Just now',
      hostStats: {
        ...trip.hostStats,
        collected: trip.hostStats.collected + addition,
        analyzed: trip.hostStats.analyzed + addition
      },
      updatedAt: new Date().toISOString()
    };
  }
};
