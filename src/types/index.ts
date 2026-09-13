export type SafetyLevel = 'safe' | 'caution' | 'risk';

export type ScreenName = 'welcome' | 'home' | 'navigate' | 'safety' | 'me';

export type NavTab = 'home' | 'navigate' | 'safety' | 'me';

export type RouteType = 'smart' | 'fastest' | 'balanced';

export type DeliveryStatus = 'sent' | 'queued' | 'failed';

export type LocationPrecision = 'precise' | 'approximate';

export interface GeoPoint {
  x: number;
  y: number;
}

export interface Location {
  id: string;
  name: string;
  area: string;
  point: GeoPoint;
}

export interface SafeSpot {
  id: string;
  name: string;
  type: 'store' | 'police' | 'hospital' | 'metro' | 'cafe';
  point: GeoPoint;
  distanceM: number;
  open24h: boolean;
  verified: boolean;
  address: string;
}

export interface RouteSegment {
  id: string;
  name: string;
  safety: SafetyLevel;
  lighting: string;
  crowd: string;
  recentActivity: string;
  polyline: GeoPoint[];
}

export interface RouteOption {
  id: string;
  type: RouteType;
  label: string;
  durationMin: number;
  distanceKm: number;
  safetyLevel: SafetyLevel;
  safetyScore: number;
  factors: string[];
  polyline: GeoPoint[];
  segments: RouteSegment[];
  recommended: boolean;
  badge?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  primary: boolean;
  avatar: string;
}

export interface IncidentReport {
  id: string;
  routeId: string;
  segmentId: string;
  type: string;
  note: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}

export interface EvidenceItem {
  id: string;
  type: 'note' | 'photo';
  text: string;
  photoData?: string;
  timestamp: number;
}

export interface SOSState {
  active: boolean;
  countdown: number;
  confirmed: boolean;
  delivery: DeliveryStatus;
  precision: LocationPrecision;
  startedAt: number | null;
}

export interface HelplineEntry {
  name: string;
  number: string;
  description: string;
}

export interface HelplineDirectory {
  national: HelplineEntry[];
  states: Record<string, HelplineEntry[]>;
}
