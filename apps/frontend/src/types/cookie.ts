export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  performance?: boolean;
  [key: string]: boolean | undefined;
}

export type CookiePreferenceKey = keyof Omit<CookiePreferences, 'essential'>;
