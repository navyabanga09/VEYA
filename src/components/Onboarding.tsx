import { useState } from 'react';
import { Sparkles, Shield, Zap, WifiOff, X } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Sparkles,
    title: 'Smarter Route Comparison',
    desc: 'Compare routes by safety — not just speed. Each route shows predicted safety scores, segment-level risk, and AI-assessed factors.',
    color: 'text-veya-lavender-bright',
    bg: 'bg-veya-lavender-bright/15',
  },
  {
    icon: Zap,
    title: 'SOS When You Need It',
    desc: 'Hold the SOS button to alert your trusted contacts with your live location. A 5-second countdown gives you time to cancel.',
    color: 'text-red-400',
    bg: 'bg-red-500/15',
  },
  {
    icon: Shield,
    title: 'Safe Spots & Helplines',
    desc: 'Find verified safe spots, emergency helplines for your state, and a safety kit — all in the Safety tab.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
  },
  {
    icon: WifiOff,
    title: 'Offline Mode',
    desc: 'Switch to offline mode to view cached routes and saved safe spots without a connection. Your data stays on your device.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const isLast = step === slides.length - 1;
  const slide = slides[step];
  const Icon = slide.icon;

  const handleNext = () => {
    if (isLast) onComplete();
    else setStep(step + 1);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-veya-bg/95 backdrop-blur-md animate-fade-in safe-top safe-bottom">
      <div className="flex justify-end p-5">
        <button onClick={onComplete} className="text-sm font-semibold text-veya-text-dim/60" aria-label="Skip onboarding">
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <div className={`relative mb-8 flex h-24 w-24 items-center justify-center ${slide.bg} rounded-3xl`}>
          <div className={`absolute inset-0 rounded-3xl ${slide.bg} blur-xl animate-pulse`} />
          <Icon size={40} className={`relative ${slide.color}`} />
        </div>

        <h2 className="text-2xl font-extrabold font-display text-center text-veya-text">{slide.title}</h2>
        <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-veya-text-dim">{slide.desc}</p>
      </div>

      <div className="px-8 pb-10">
        <div className="mb-6 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-veya-lavender-bright' : 'w-1.5 bg-veya-border'}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full rounded-xl bg-veya-lavender-bright py-4 text-base font-bold text-veya-bg transition-transform active:scale-95 glow-lavender"
        >
          {isLast ? "LET'S GO →" : 'NEXT'}
        </button>
      </div>
    </div>
  );
}
