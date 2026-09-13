import type {
  Location,
  RouteOption,
  SafeSpot,
  TrustedContact,
  HelplineDirectory,
  RouteSegment,
} from '@/types';

export const currentLocation: Location = {
  id: 'current',
  name: 'Connaught Place',
  area: 'New Delhi',
  point: { x: 120, y: 340 },
};

export const destinations: Location[] = [
  { id: 'india-gate', name: 'India Gate', area: 'New Delhi', point: { x: 320, y: 180 } },
  { id: 'rajiv-chowk', name: 'Rajiv Chowk Metro', area: 'New Delhi', point: { x: 140, y: 280 } },
  { id: 'lajpat', name: 'Lajpat Nagar Market', area: 'South Delhi', point: { x: 380, y: 400 } },
  { id: 'saket', name: 'Saket', area: 'South Delhi', point: { x: 420, y: 460 } },
  { id: 'hauz-khas', name: 'Hauz Khas', area: 'South Delhi', point: { x: 440, y: 380 } },
  { id: 'igdtuw', name: 'IGDTUW', area: 'North Delhi', point: { x: 200, y: 120 } },
  { id: 'kashmere', name: 'Kashmere Gate', area: 'North Delhi', point: { x: 160, y: 80 } },
  { id: 'metro-station', name: 'Metro Station', area: 'New Delhi', point: { x: 280, y: 240 } },
];

export const safeSpots: SafeSpot[] = [
  {
    id: 'ss1',
    name: '24hr Convenience Store',
    type: 'store',
    point: { x: 180, y: 300 },
    distanceM: 120,
    open24h: true,
    verified: true,
    address: 'Block A, Connaught Place',
  },
  {
    id: 'ss2',
    name: 'Police Booth',
    type: 'police',
    point: { x: 240, y: 220 },
    distanceM: 340,
    open24h: true,
    verified: true,
    address: 'Outer Circle, CP',
  },
  {
    id: 'ss3',
    name: 'AIIMS Emergency',
    type: 'hospital',
    point: { x: 400, y: 420 },
    distanceM: 1800,
    open24h: true,
    verified: true,
    address: 'Ansari Nagar, South Delhi',
  },
  {
    id: 'ss4',
    name: 'Metro Station Help Desk',
    type: 'metro',
    point: { x: 140, y: 280 },
    distanceM: 280,
    open24h: true,
    verified: true,
    address: 'Rajiv Chowk Underground',
  },
  {
    id: 'ss5',
    name: 'Cafe Coffee Day',
    type: 'cafe',
    point: { x: 300, y: 320 },
    distanceM: 450,
    open24h: false,
    verified: true,
    address: 'Middle Circle, CP',
  },
  {
    id: 'ss6',
    name: 'Safar Shala Night Shelter',
    type: 'store',
    point: { x: 260, y: 160 },
    distanceM: 900,
    open24h: true,
    verified: false,
    address: 'Near India Gate roundabout',
  },
];

const seg = (
  id: string,
  name: string,
  safety: RouteSegment['safety'],
  lighting: string,
  crowd: string,
  recentActivity: string,
  polyline: { x: number; y: number }[]
): RouteSegment => ({ id, name, safety, lighting, crowd, recentActivity, polyline });

export const routes: RouteOption[] = [
  {
    id: 'route-smart',
    type: 'smart',
    label: 'SMART / SAFER',
    durationMin: 32,
    distanceKm: 4.2,
    safetyLevel: 'safe',
    safetyScore: 86,
    recommended: true,
    badge: 'Recommended',
    factors: [
      'Well-lit roads along entire route',
      'Moderate crowd density throughout',
      'No recent incident reports',
      '3 verified safety points en route',
    ],
    polyline: [
      { x: 120, y: 340 },
      { x: 160, y: 320 },
      { x: 200, y: 290 },
      { x: 240, y: 250 },
      { x: 280, y: 210 },
      { x: 320, y: 180 },
    ],
    segments: [
      seg('s1a', 'CP Inner Circle', 'safe', 'Well-lit', 'Moderate crowd', 'No recent reports', [
        { x: 120, y: 340 },
        { x: 160, y: 320 },
        { x: 200, y: 290 },
      ]),
      seg('s1b', 'Janpath Road', 'safe', 'Well-lit', 'Active foot traffic', 'No recent reports', [
        { x: 200, y: 290 },
        { x: 240, y: 250 },
        { x: 280, y: 210 },
      ]),
      seg('s1c', 'India Gate Approach', 'safe', 'Well-lit, open area', 'Moderate crowd', 'No recent reports', [
        { x: 280, y: 210 },
        { x: 320, y: 180 },
      ]),
    ],
  },
  {
    id: 'route-fastest',
    type: 'fastest',
    label: 'FASTEST',
    durationMin: 26,
    distanceKm: 3.5,
    safetyLevel: 'caution',
    safetyScore: 62,
    recommended: false,
    factors: [
      'Shorter route through side lanes',
      'Poor lighting after 7 PM on 2 segments',
      'Low crowd density in stretches',
      '1 recent incident report (harassment)',
    ],
    polyline: [
      { x: 120, y: 340 },
      { x: 150, y: 300 },
      { x: 190, y: 260 },
      { x: 250, y: 200 },
      { x: 320, y: 180 },
    ],
    segments: [
      seg('s2a', 'CP Back Lane', 'caution', 'Mixed lighting', 'Low crowd', 'No recent reports', [
        { x: 120, y: 340 },
        { x: 150, y: 300 },
        { x: 190, y: 260 },
      ]),
      seg('s2b', 'Tolstoy Marg Shortcut', 'risk', 'Poorly lit after 7 PM', 'Very low crowd', '1 recent report', [
        { x: 190, y: 260 },
        { x: 250, y: 200 },
      ]),
      seg('s2c', 'India Gate Link', 'safe', 'Well-lit', 'Moderate crowd', 'No recent reports', [
        { x: 250, y: 200 },
        { x: 320, y: 180 },
      ]),
    ],
  },
  {
    id: 'route-balanced',
    type: 'balanced',
    label: 'BALANCED',
    durationMin: 29,
    distanceKm: 3.8,
    safetyLevel: 'safe',
    safetyScore: 78,
    recommended: false,
    factors: [
      'Good lighting on main roads',
      'Active areas with steady crowd',
      'No recent incident reports',
      '2 verified safety points en route',
    ],
    polyline: [
      { x: 120, y: 340 },
      { x: 170, y: 330 },
      { x: 220, y: 300 },
      { x: 270, y: 240 },
      { x: 320, y: 180 },
    ],
    segments: [
      seg('s3a', 'Outer Circle', 'safe', 'Well-lit', 'Active traffic', 'No recent reports', [
        { x: 120, y: 340 },
        { x: 170, y: 330 },
        { x: 220, y: 300 },
      ]),
      seg('s3b', 'Ashoka Road', 'caution', 'Mixed lighting near park', 'Moderate crowd', 'No recent reports', [
        { x: 220, y: 300 },
        { x: 270, y: 240 },
      ]),
      seg('s3c', 'India Gate Approach', 'safe', 'Well-lit, open area', 'Moderate crowd', 'No recent reports', [
        { x: 270, y: 240 },
        { x: 320, y: 180 },
      ]),
    ],
  },
];

export const trustedContacts: TrustedContact[] = [
  { id: 'c1', name: 'Mom', phone: '+91 98xxx xxx01', primary: true, avatar: 'M' },
  { id: 'c2', name: 'Priya', phone: '+91 98xxx xxx02', primary: false, avatar: 'P' },
  { id: 'c3', name: 'Sneha', phone: '+91 98xxx xxx03', primary: false, avatar: 'S' },
];

export const helplineDirectory: HelplineDirectory = {
  national: [
    { name: 'Emergency (NERS)', number: '112', description: 'Single emergency number — police, fire, ambulance' },
    { name: 'Women Helpline', number: '181', description: '24/7 toll-free women in distress' },
    { name: 'Police', number: '100', description: 'Police control room' },
    { name: 'Women Helpline (Toll-free)', number: '1091', description: 'National Commission for Women' },
    { name: 'Cyber Crime', number: '1930', description: 'Report cybercrime / online harassment' },
    { name: 'Anti-Poison', number: '18002221122', description: 'Poison control center' },
  ],
  states: {
    delhi: [
      { name: 'Delhi Women Helpline', number: '181', description: '24/7 Delhi women in distress' },
      { name: 'Delhi Police Control Room', number: '100', description: 'Delhi Police' },
      { name: 'Shakti Camp (Women Safety)', number: '1091', description: 'Delhi women safety patrol' },
    ],
    maharashtra: [
      { name: 'Women Helpline', number: '1291', description: 'Maharashtra state women helpline' },
      { name: 'Mumbai Police Control', number: '100', description: 'Mumbai Police' },
    ],
    karnataka: [
      { name: 'Women Helpline', number: '1091', description: 'Karnataka women helpline' },
      { name: 'Bengaluru Police', number: '100', description: 'Bengaluru City Police' },
    ],
  },
};

export const incidentTypes = [
  'Poor lighting',
  'Harassment',
  'Suspicious activity',
  'Unsafe crowd',
  'Blocked path',
  'Other',
];

export const incidentSeverity: Record<string, 'low' | 'medium' | 'high'> = {
  'Poor lighting': 'low',
  'Harassment': 'high',
  'Suspicious activity': 'high',
  'Unsafe crowd': 'medium',
  'Blocked path': 'low',
  'Other': 'medium',
};

export const incidentScoreImpact: Record<string, number> = {
  low: 15,
  medium: 25,
  high: 40,
};

export const stateList = [
  { id: 'delhi', name: 'Delhi' },
  { id: 'maharashtra', name: 'Maharashtra' },
  { id: 'karnataka', name: 'Karnataka' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh' },
  { id: 'rajasthan', name: 'Rajasthan' },
  { id: 'tamil-nadu', name: 'Tamil Nadu' },
  { id: 'west-bengal', name: 'West Bengal' },
  { id: 'gujarat', name: 'Gujarat' },
  { id: 'punjab', name: 'Punjab' },
  { id: 'haryana', name: 'Haryana' },
];
