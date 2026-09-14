import { useState, useMemo } from 'react';
import { Shield, Store, Hospital, Building2, Phone, Download, Check, ChevronDown, MapPin, Wifi, Info, AlertTriangle, Battery, Share2, Eye, Heart, Zap } from 'lucide-react';
import { safeSpots, helplineDirectory, stateList } from '@/data/mockData';
import { formatTimestamp } from '@/components/Timestamp';
import { useHaptic } from '@/hooks/useHaptic';
import type { SafeSpot } from '@/types';

interface SafetyScreenProps {
  offline: boolean;
  savedSpots: SafeSpot[];
  onSaveSpots: (spots: SafeSpot[]) => void;
  onSOS: () => void;
}

export function SafetyScreen({ offline, savedSpots, onSaveSpots, onSOS }: SafetyScreenProps) {
  const [selectedState, setSelectedState] = useState('delhi');
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [downloadToast, setDownloadToast] = useState(false);
  const now = useMemo(() => formatTimestamp(new Date()), []);
  const haptic = useHaptic();

  const stateName = stateList.find((s) => s.id === selectedState)?.name ?? 'Delhi';
  const isKnownState = helplineDirectory.states[selectedState] !== undefined;
  const helplines = isKnownState ? helplineDirectory.states[selectedState] : helplineDirectory.national;

  const handleSaveOffline = () => {
    const current = [...savedSpots];
    const toAdd = safeSpots.filter((s) => !current.find((c) => c.id === s.id));
    const updated = [...current, ...toAdd];
    onSaveSpots(updated);
    haptic('success');
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 2500);
  };

  const spotIcons = { store: Store, police: Shield, hospital: Hospital, metro: Building2, cafe: Store };

  const safetyKitCards = [
    { icon: Battery, title: 'Keep your phone ready', desc: 'Battery + emergency contacts accessible' },
    { icon: Share2, title: 'Share your plans', desc: 'Let someone you trust know where you\'re headed' },
    { icon: Eye, title: 'Stay aware', desc: 'Pay attention to your surroundings' },
    { icon: Heart, title: 'Trust your instincts', desc: 'Move toward a public place if something feels wrong' },
  ];

  return (
    <div className="min-h-screen bg-veya-bg pb-24 safe-top">
      <div className="sticky top-0 z-20 glass border-b border-veya-border px-5 py-4">
        <h1 className="text-xl font-extrabold font-display">Safety</h1>
        <p className="text-xs text-veya-text-dim">Safe spots, helplines & offline tools</p>
      </div>

      {/* Safety Kit */}
      <div className="px-5 mt-4">
        <h2 className="text-lg font-extrabold font-display">YOUR SAFETY KIT 🖤</h2>
        <p className="mt-0.5 text-xs text-veya-text-dim">Stay ready. Stay in control.</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {safetyKitCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-veya-border bg-gradient-to-br from-veya-surface to-veya-surface-2 p-4 transition-transform active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-veya-bg/50">
                  <Icon size={18} className="text-veya-lavender-bright" />
                </div>
                <p className="mt-2.5 text-sm font-bold text-veya-text leading-tight">{card.title}</p>
                <p className="mt-1 text-[11px] text-veya-text-dim leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safe spots */}
      <div className="px-5 mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-wide">VERIFIED SAFE SPOTS</h2>
          <span className="text-[10px] text-veya-text-dim/50">as of {now}</span>
        </div>

        <button
          onClick={handleSaveOffline}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-veya-lavender-bright/30 bg-veya-lavender-bright/5 px-4 py-3 text-sm font-bold text-veya-lavender-bright transition-colors active:scale-[0.98]"
        >
          <Download size={16} />
          SAVE FOR OFFLINE ({savedSpots.length} saved)
        </button>

        <div className="space-y-2">
          {safeSpots.map((spot) => {
            const Icon = spotIcons[spot.type];
            return (
              <div key={spot.id} className="flex items-start gap-3 rounded-xl border border-veya-border bg-veya-surface p-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-veya-bg/50 shrink-0">
                  <Icon size={18} className="text-veya-lavender-bright" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-veya-text truncate">{spot.name}</p>
                    {spot.verified && (
                      <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 shrink-0">
                        <Shield size={8} /> VERIFIED
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-veya-text-dim">{spot.address}</p>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-veya-text-dim">
                      <MapPin size={10} /> {spot.distanceM}m
                    </span>
                    {spot.open24h && (
                      <span className="text-[10px] font-semibold text-emerald-400/80">OPEN 24 HRS</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BLE notification */}
      <div className="px-5 mt-5">
        <div className="flex items-center gap-3 rounded-xl border border-veya-lavender-bright/20 bg-veya-lavender-bright/5 px-4 py-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-veya-lavender-bright/15">
            <div className="absolute inset-0 rounded-lg bg-veya-lavender-bright/10 animate-pulse-ring" />
            <Wifi size={16} className="text-veya-lavender-bright" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-wide text-veya-lavender-bright">SAFETY POINT NEARBY</p>
            <p className="text-xs text-veya-text-dim">Verified/demo safety node · 120 m</p>
            <p className="text-[9px] text-veya-text-dim/50">BLE/Bluetooth Mesh · Demo infrastructure</p>
          </div>
        </div>
      </div>

      {/* Emergency Helpline Directory */}
      <div className="px-5 mt-5">
        <h2 className="mb-3 text-sm font-bold tracking-wide">EMERGENCY HELPLINES</h2>

        {/* State selector */}
        <div className="relative mb-3">
          <button
            onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-veya-border bg-veya-surface px-4 py-3"
          >
            <span className="text-sm font-semibold text-veya-text">{stateName}</span>
            <ChevronDown size={18} className={`text-veya-text-dim transition-transform ${stateDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {stateDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-veya-border bg-veya-surface-2 no-scrollbar shadow-xl animate-scale-in">
              {stateList.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedState(s.id); setStateDropdownOpen(false); }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                    selectedState === s.id ? 'bg-veya-lavender-bright/10 text-veya-lavender-bright' : 'text-veya-text-dim'
                  }`}
                >
                  {s.name}
                  {selectedState === s.id && <Check size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {!isKnownState && (
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-veya-border bg-veya-surface/50 p-3">
            <Info size={14} className="mt-0.5 text-veya-text-dim shrink-0" />
            <p className="text-[11px] text-veya-text-dim">State-specific numbers coming soon. Showing national helplines.</p>
          </div>
        )}

        <div className="space-y-2">
          {helplines.map((h, i) => (
            <a
              key={i}
              href={`tel:${h.number}`}
              className="flex items-center gap-3 rounded-xl border border-veya-border bg-veya-surface p-3.5 transition-colors active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 shrink-0">
                <Phone size={18} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-veya-text">{h.name}</p>
                <p className="text-xs text-veya-text-dim truncate">{h.description}</p>
              </div>
              <span className="text-sm font-extrabold text-veya-lavender-bright font-display">{h.number}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Offline cached spots */}
      {savedSpots.length > 0 && (
        <div className="px-5 mt-5">
          <h2 className="mb-3 text-sm font-bold tracking-wide">OFFLINE CACHED SPOTS</h2>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="mb-2 text-[11px] text-amber-300">
              {savedSpots.length} safe spots saved. Available without connection.
            </p>
            <div className="space-y-1.5">
              {savedSpots.map((spot) => (
                <div key={spot.id} className="flex items-center gap-2 text-xs">
                  <MapPin size={12} className="text-amber-400" />
                  <span className="text-veya-text-dim">{spot.name} · {spot.address}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy info */}
      <div className="px-5 mt-5">
        <div className="rounded-xl border border-veya-border bg-veya-surface/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-400" />
            <p className="text-xs font-bold text-veya-text">PRIVACY & SHARING</p>
          </div>
          <ul className="space-y-1.5 text-[11px] leading-relaxed text-veya-text-dim">
            <li>• Location is used only while the app is open.</li>
            <li>• No one can see your location unless you start live sharing or activate SOS.</li>
            <li>• Live sharing stops when you cancel or close the app.</li>
            <li>• SOS shares your location and battery with trusted contacts only.</li>
          </ul>
        </div>
      </div>

      {/* Download toast */}
      {downloadToast && (
        <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-5 py-3 text-sm font-bold text-emerald-300 animate-slide-up">
          <Check size={16} className="inline mr-1" /> Saved for offline ({savedSpots.length} spots)
        </div>
      )}

      {/* Need Help */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-5">
          <p className="text-sm font-bold tracking-wide text-veya-text">NEED HELP RIGHT NOW?</p>
          <p className="mt-1 text-xs text-veya-text-dim">Press and hold the SOS button to alert your trusted contacts instantly.</p>
          <button
            onClick={onSOS}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3.5 text-sm font-bold text-white transition-transform active:scale-95 glow-sos"
          >
            <Zap size={18} />
            SOS
          </button>
        </div>
      </div>

      {/* Prototype notice */}
      <div className="px-5 mt-4">
        <p className="text-[10px] leading-relaxed text-veya-text-dim/40">
          Demo data · Placeholder safety information is not real-time or verified until connected to live sources.
        </p>
      </div>
    </div>
  );
}
