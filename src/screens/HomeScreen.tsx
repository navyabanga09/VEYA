import { useState, useMemo } from 'react';
import { Search, MapPin, Navigation, Shield, Hospital, Store, Building2, ChevronRight, Wifi, WifiOff, BatteryLow, X } from 'lucide-react';
import { MapMockup } from '@/components/MapMockup';
import { SafetyPulse } from '@/components/SafetyPulse';
import { Toggle } from '@/components/Toggle';
import { formatTimestamp } from '@/components/Timestamp';
import { currentLocation, destinations, safeSpots } from '@/data/mockData';
import type { Location, NavTab } from '@/types';

interface HomeScreenProps {
  onNavigate: () => void;
  nightMode: boolean;
  onToggleNight: (v: boolean) => void;
  offline: boolean;
  onToggleOffline: (v: boolean) => void;
  batteryLevel: number;
  onSelectDestination: (dest: Location) => void;
  cachedRoutes: unknown;
  userName: string;
}

export function HomeScreen({
  onNavigate,
  nightMode,
  onToggleNight,
  offline,
  onToggleOffline,
  batteryLevel,
  onSelectDestination,
  userName,
}: HomeScreenProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const now = useMemo(() => formatTimestamp(new Date()), []);
  const hour = new Date().getHours();
  const isLateNight = hour < 5 || hour >= 22;
  const greeting = isLateNight
    ? 'Late night, smart moves. 🖤'
    : `${hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING'}, ${userName.toUpperCase()}!`;

  const filteredDest = destinations.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.area.toLowerCase().includes(query.toLowerCase())
  );

  const nearbySpots = safeSpots.slice(0, 4);

  const handleSelect = (dest: Location) => {
    onSelectDestination(dest);
    setSearchOpen(false);
    setQuery('');
    onNavigate();
  };

  return (
    <div className="min-h-screen bg-veya-bg pb-24 safe-top">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-veya-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-veya-text-dim">{greeting}</p>
            <p className="text-lg font-extrabold font-display text-veya-text">Where are we going?</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleOffline(!offline)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${offline ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-veya-border bg-veya-surface text-veya-text-dim'}`}
              aria-label={offline ? 'Online mode' : 'Offline mode'}
            >
              {offline ? <WifiOff size={16} /> : <Wifi size={16} />}
            </button>
            <button
              onClick={() => onToggleNight(!nightMode)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${nightMode ? 'border-veya-lavender-bright/30 bg-veya-lavender-bright/10 text-veya-lavender-bright' : 'border-veya-border bg-veya-surface text-veya-text-dim'}`}
              aria-label={nightMode ? 'Day mode' : 'Night mode'}
            >
              {nightMode ? <span className="text-xs font-bold">N</span> : <span className="text-xs font-bold">D</span>}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <button
          onClick={() => setSearchOpen(true)}
          className="mt-3 flex w-full items-center gap-3 rounded-xl border border-veya-border bg-veya-surface px-4 py-3.5 text-left transition-colors active:scale-[0.99]"
        >
          <Search size={18} className="text-veya-text-dim" />
          <span className="text-sm text-veya-text-dim">Search destination</span>
        </button>

        {/* Current location */}
        <div className="mt-2 flex items-center gap-2">
          <MapPin size={12} className="text-veya-lavender-bright" />
          <span className="text-xs text-veya-text-dim">
            <span className="font-semibold text-veya-text">{currentLocation.name}</span>, {currentLocation.area}
          </span>
          <span className="rounded bg-veya-border/50 px-1.5 py-0.5 text-[9px] text-veya-text-dim/60">MOCK</span>
        </div>
      </div>

      {/* Battery warning */}
      {batteryLevel < 20 && (
        <div className="mx-5 mt-4 flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 animate-slide-up">
          <BatteryLow size={18} className="text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">
            Battery at {batteryLevel}%. Consider carrying a charger or power bank before starting your route.
          </p>
        </div>
      )}

      {/* Map */}
      <div className="px-5 mt-4">
        <MapMockup
          currentLocation={currentLocation.point}
          safeSpots={nearbySpots}
          showSafeSpots
          nightMode={nightMode}
          offline={offline}
          height="280px"
          interactive
        />
      </div>

      {/* Safety Pulse */}
      <div className="px-5 mt-4">
        <SafetyPulse
          area="Well-connected"
          safeSpotCount={nearbySpots.length}
          crowdLevel="Moderate"
          timestamp={now}
          compact
        />
        <p className="mt-1.5 text-[10px] text-veya-text-dim/40 px-1">
          Powered by predictive risk modeling (simulated for demo).
        </p>
      </div>

      {/* Nearby section */}
      <div className="px-5 mt-5">
        <h3 className="mb-3 text-sm font-bold tracking-wide text-veya-text">NEARBY</h3>
        <div className="grid grid-cols-2 gap-3">
          {nearbySpots.map((spot) => {
            const icons = { store: Store, police: Shield, hospital: Hospital, metro: Building2, cafe: Store };
            const Icon = icons[spot.type];
            return (
              <div key={spot.id} className="rounded-xl border border-veya-border bg-veya-surface p-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-veya-bg/50">
                    <Icon size={14} className="text-veya-lavender-bright" />
                  </div>
                  {spot.verified && (
                    <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                      <Shield size={8} /> VERIFIED
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs font-bold text-veya-text leading-tight">{spot.name}</p>
                <p className="mt-0.5 text-[10px] text-veya-text-dim">{spot.distanceM}m · {spot.address}</p>
                {spot.open24h && (
                  <p className="mt-1 text-[9px] font-semibold text-emerald-400/80">OPEN 24 HRS</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BLE notification mock */}
      <div className="px-5 mt-4">
        <div className="flex items-center gap-3 rounded-xl border border-veya-lavender-bright/20 bg-veya-lavender-bright/5 px-4 py-3 animate-slide-in-right">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-veya-lavender-bright/15">
            <div className="absolute inset-0 rounded-lg bg-veya-lavender-bright/10 animate-pulse-ring" />
            <Building2 size={16} className="text-veya-lavender-bright" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-wide text-veya-lavender-bright">SAFETY POINT NEARBY</p>
            <p className="text-xs text-veya-text-dim">Verified/demo safety node · 120 m</p>
            <p className="text-[9px] text-veya-text-dim/50">BLE mesh · Demo signal</p>
          </div>
        </div>
      </div>

      {/* Privacy note */}
      <div className="px-5 mt-4">
        <p className="text-[10px] leading-relaxed text-veya-text-dim/50">
          Location is used only while the app is open. No one can see your location unless you start live sharing or activate SOS.
        </p>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-veya-bg/95 backdrop-blur-md animate-fade-in safe-top">
          <div className="flex items-center gap-3 border-b border-veya-border px-5 py-4">
            <Search size={20} className="text-veya-text-dim" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destination..."
              className="flex-1 bg-transparent text-sm text-veya-text placeholder:text-veya-text-dim/50 focus:outline-none"
            />
            <button onClick={() => setSearchOpen(false)} aria-label="Close search">
              <X size={20} className="text-veya-text-dim" />
            </button>
          </div>
          <div className="px-5 py-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-veya-text-dim">SUGGESTED DESTINATIONS</p>
            <div className="space-y-2">
              {filteredDest.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => handleSelect(dest)}
                  className="flex w-full items-center gap-3 rounded-xl border border-veya-border bg-veya-surface p-3.5 text-left transition-colors active:scale-[0.98]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-veya-bg/50">
                    <MapPin size={16} className="text-veya-lavender-bright" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-veya-text">{dest.name}</p>
                    <p className="text-xs text-veya-text-dim">{dest.area}</p>
                  </div>
                  <ChevronRight size={18} className="text-veya-text-dim/40" />
                </button>
              ))}
              {filteredDest.length === 0 && (
                <p className="py-8 text-center text-sm text-veya-text-dim">No destinations found</p>
              )}
            </div>
            <p className="mt-4 text-[10px] text-veya-text-dim/40">Demo locations · Replace with live Maps API</p>
          </div>
        </div>
      )}
    </div>
  );
}
