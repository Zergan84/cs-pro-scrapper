import { Trip, CSAccount } from '../types/trip';
import { INITIAL_TRIPS, INITIAL_ACCOUNT } from '../data/initialTrips';

const TRIPS_KEY = 'cs_pro_trips_v1';
const ACCOUNT_KEY = 'cs_pro_account_v1';
const THEME_KEY = 'cs_pro_theme_v1';

export const storage = {
  getTrips(): Trip[] {
    try {
      const data = localStorage.getItem(TRIPS_KEY);
      if (!data) {
        localStorage.setItem(TRIPS_KEY, JSON.stringify(INITIAL_TRIPS));
        return INITIAL_TRIPS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TRIPS;
    }
  },

  saveTrips(trips: Trip[]): void {
    try {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to save trips', e);
    }
  },

  getAccount(): CSAccount {
    try {
      const data = localStorage.getItem(ACCOUNT_KEY);
      if (!data) {
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(INITIAL_ACCOUNT));
        return INITIAL_ACCOUNT;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ACCOUNT;
    }
  },

  saveAccount(account: CSAccount): void {
    try {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    } catch (e) {
      console.error('Failed to save account', e);
    }
  },

  getTheme(): 'dark' | 'light' {
    try {
      const t = localStorage.getItem(THEME_KEY);
      return (t === 'light' ? 'light' : 'dark');
    } catch {
      return 'dark';
    }
  },

  saveTheme(theme: 'dark' | 'light'): void {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  },

  resetDefaults(): { trips: Trip[]; account: CSAccount } {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(INITIAL_TRIPS));
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(INITIAL_ACCOUNT));
    return { trips: INITIAL_TRIPS, account: INITIAL_ACCOUNT };
  }
};
