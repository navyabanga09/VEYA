import { Shield, MapPin, Activity } from 'lucide-react';

interface SafetyPulseProps {
  area: string;
  safeSpotCount: number;
  crowdLevel: string;
  timestamp: string;
  compact?: boolean;
}

export function SafetyPulse({ area, safeSpotCount, crowdLevel, timestamp, compact = false }: SafetyPulseProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-veya-border bg-veya-surface px-4 py-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
          <div className="absolute inset-0 rounded-xl bg-emerald-500/10 animate-pulse-ring" />
          <Shield size={18} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-veya-text">YOUR SAFETY PULSE</span>
          </div>
          <p className="text-xs text-veya-text-dim">
            {area} · {safeSpotCount} safety points nearby
          </p>
        </div>
        <span className="text-[10px] text-veya-text-dim/60">as of {timestamp}</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-veya-border bg-gradient-to-br from-veya-surface to-veya-surface-2 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
            <div className="absolute inset-0 rounded-lg bg-emerald-500/10 animate-pulse-ring" />
            <Shield size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">YOUR SAFETY PULSE</span>
        </div>
        <span className="text-[10px] text-veya-text-dim/60">as of {timestamp}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-veya-bg/50 p-3">
          <MapPin size={14} className="mb-1 text-veya-lavender-bright" />
          <p className="text-sm font-bold text-veya-text">{area}</p>
          <p className="text-[10px] text-veya-text-dim">Area</p>
        </div>
        <div className="rounded-xl bg-veya-bg/50 p-3">
          <Shield size={14} className="mb-1 text-emerald-400" />
          <p className="text-sm font-bold text-veya-text">{safeSpotCount}</p>
          <p className="text-[10px] text-veya-text-dim">Safety points</p>
        </div>
        <div className="rounded-xl bg-veya-bg/50 p-3">
          <Activity size={14} className="mb-1 text-amber-400" />
          <p className="text-sm font-bold text-veya-text">{crowdLevel}</p>
          <p className="text-[10px] text-veya-text-dim">Crowd</p>
        </div>
      </div>
    </div>
  );
}
