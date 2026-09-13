import type { SafetyLevel } from '@/types';

const config: Record<SafetyLevel, { color: string; bg: string; border: string; label: string; dot: string }> = {
  safe: { color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Safe', dot: 'bg-emerald-400' },
  caution: { color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Caution', dot: 'bg-amber-400' },
  risk: { color: 'text-red-300', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Risk', dot: 'bg-red-400' },
};

export function SafetyBadge({ level, size = 'sm' }: { level: SafetyLevel; size?: 'xs' | 'sm' | 'md' }) {
  const c = config[level];
  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  };
  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${c.bg} ${c.border} ${c.color} ${sizes[size]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
