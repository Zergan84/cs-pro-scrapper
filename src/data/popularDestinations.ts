export interface DestinationInfo {
  city: string;
  country: string;
  flag: string;
}

export const POPULAR_DESTINATIONS: DestinationInfo[] = [
  { city: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { city: 'Kyoto', country: 'Japan', flag: '🇯🇵' },
  { city: 'Osaka', country: 'Japan', flag: '🇯🇵' },
  { city: 'Sapporo', country: 'Japan', flag: '🇯🇵' },
  { city: 'Paris', country: 'France', flag: '🇫🇷' },
  { city: 'Berlin', country: 'Germany', flag: '🇩🇪' },
  { city: 'Rome', country: 'Italy', flag: '🇮🇹' },
  { city: 'Barcelona', country: 'Spain', flag: '🇪🇸' },
  { city: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱' },
  { city: 'Lisbon', country: 'Portugal', flag: '🇵🇹' },
  { city: 'Prague', country: 'Czech Republic', flag: '🇨🇿' },
  { city: 'Vienna', country: 'Austria', flag: '🇦🇹' },
  { city: 'Budapest', country: 'Hungary', flag: '🇭🇺' },
  { city: 'Istanbul', country: 'Turkey', flag: '🇹🇷' },
  { city: 'Bangkok', country: 'Thailand', flag: '🇹🇭' },
  { city: 'Seoul', country: 'South Korea', flag: '🇰🇷' },
  { city: 'Taipei', country: 'Taiwan', flag: '🇹🇼' },
  { city: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
  { city: 'Sydney', country: 'Australia', flag: '🇦🇺' },
  { city: 'New York', country: 'United States', flag: '🇺🇸' },
  { city: 'San Francisco', country: 'United States', flag: '🇺🇸' },
  { city: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷' },
  { city: 'Rio de Janeiro', country: 'Brazil', flag: '🇧🇷' },
  { city: 'Cape Town', country: 'South Africa', flag: '🇿🇦' },
  { city: 'Tbilisi', country: 'Georgia', flag: '🇬🇪' },
  { city: 'Yerevan', country: 'Armenia', flag: '🇦🇲' },
  { city: 'Almaty', country: 'Kazakhstan', flag: '🇰🇿' },
  { city: 'Tashkent', country: 'Uzbekistan', flag: '🇺🇿' }
];

export function resolveCountryForCity(cityQuery: string): string {
  const normalized = cityQuery.trim().toLowerCase();
  const found = POPULAR_DESTINATIONS.find(
    (d) => d.city.toLowerCase() === normalized
  );
  return found ? found.country : '';
}
