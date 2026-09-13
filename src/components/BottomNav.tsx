import { Home, Navigation, Shield, User } from 'lucide-react';
import type { NavTab } from '@/types';

interface BottomNavProps {
  active: NavTab;
  onChange: (tab: NavTab) => void;
  nightMode: boolean;
}

const tabs: { id: NavTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'navigate', label: 'Navigate', icon: Navigation },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'me', label: 'Me', icon: User },
];

export function BottomNav({ active, onChange, nightMode }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-veya-border safe-bottom">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors"
              style={{ minHeight: 56 }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`relative flex h-8 w-8 items-center justify-center transition-all ${isActive ? 'scale-110' : ''}`}>
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-veya-lavender-bright/20 blur-sm" />
                )}
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-veya-lavender-bright' : nightMode ? 'text-veya-text-dim/60' : 'text-veya-text-dim'}
                />
              </div>
              <span className={`text-[10px] font-semibold tracking-wide transition-colors ${isActive ? 'text-veya-lavender-bright' : nightMode ? 'text-veya-text-dim/60' : 'text-veya-text-dim'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
