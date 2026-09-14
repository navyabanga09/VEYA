import { Clock, Route as RouteIcon, Check, Sparkles, Zap, Scale } from 'lucide-react';
import type { RouteOption } from '@/types';
import { SafetyBadge } from './SafetyBadge';

interface RouteCardProps {
  route: RouteOption;
  selected: boolean;
  onSelect: () => void;
  timestamp: string;
}

const typeIcons: Record<string, typeof Sparkles> = {
  smart: Sparkles,
  fastest: Zap,
  balanced: Scale,
};

export function RouteCard({ route, selected, onSelect, timestamp }: RouteCardProps) {
  const Icon = typeIcons[route.type] ?? RouteIcon;

  return (
    <button
      onClick={onSelect}
      className={`relative w-full rounded-2xl border p-4 text-left transition-all ${
        selected
          ? 'border-veya-lavender-bright bg-veya-surface-2 glow-lavender'
          : 'border-veya-border bg-veya-surface'
      }`}
    >
      {route.recommended && (
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-full bg-veya-lavender-bright px-2.5 py-0.5 text-[10px] font-bold text-veya-bg">
          <Check size={10} strokeWidth={3} /> RECOMMENDED
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${selected ? 'bg-veya-lavender-bright/20' : 'bg-veya-bg/50'}`}>
            <Icon size={16} className={selected ? 'text-veya-lavender-bright' : 'text-veya-text-dim'} />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight font-display">{route.label}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <Clock size={11} className="text-veya-text-dim" />
              <span className="text-xs text-veya-text-dim">{route.durationMin} min</span>
              <span className="text-veya-text-dim/40">·</span>
              <RouteIcon size={11} className="text-veya-text-dim" />
              <span className="text-xs text-veya-text-dim">{route.distanceKm} km</span>
            </div>
          </div>
        </div>
        <SafetyBadge level={route.safetyLevel} size="xs" />
      </div>

      {route.factors.length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-[10px] font-semibold text-veya-lavender-bright/60">AI-assessed factors:</p>
          {route.factors.slice(0, 3).map((f, i) => (
            <p key={i} className="text-xs text-veya-text-dim leading-relaxed">
              {f}
            </p>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-veya-text-dim/60">PREDICTED SAFETY SCORE</span>
          <span className="text-sm font-bold text-veya-text">{route.safetyScore}</span>
          <span className="text-xs text-veya-text-dim">/ 100</span>
        </div>
        <span className="text-[10px] text-veya-text-dim/50">as of {timestamp}</span>
      </div>

      {selected && (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-veya-lavender-bright/10 px-3 py-2 animate-slide-up">
          <span className="text-xs font-semibold text-veya-lavender-bright">Smart move. Let's go →</span>
        </div>
      )}
    </button>
  );
}
