import { ArrowRight, Shield, Navigation, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-veya-bg px-6 safe-top safe-bottom">
      {/* Background glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-veya-lavender-bright/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in">
        {/* Logo */}
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-veya-lavender-bright/20 blur-xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-veya-lavender-bright/30 bg-veya-surface">
            <svg viewBox="0 0 96 96" className="h-14 w-14">
              <path d="M48 18 L70 27 L70 51 Q70 66 48 78 Q26 66 26 51 L26 27 Z" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx="48" cy="48" r="9" fill="none" stroke="#c4b5fd" strokeWidth="2.5" />
              <circle cx="48" cy="48" r="3" fill="#a78bfa" />
              <path d="M48 39 L48 33 M48 57 L48 63 M39 48 L33 48 M57 48 L63 48" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <p className="mb-2 text-sm font-semibold tracking-[0.3em] text-veya-lavender-bright uppercase">VEYA</p>
        <h1 className="text-4xl font-extrabold tracking-tight font-display text-gradient-lavender">
          TRAVEL WITH<br />CONFIDENCE.
        </h1>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-veya-text-dim">
          Safer routes. Trusted people.<br />Help when you need it.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-veya-surface border border-veya-border">
              <Navigation size={16} className="text-veya-lavender-bright" />
            </div>
            <p className="text-xs text-veya-text-dim">Route safety comparison</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-veya-surface border border-veya-border">
              <Shield size={16} className="text-emerald-400" />
            </div>
            <p className="text-xs text-veya-text-dim">Verified safe spots nearby</p>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-veya-surface border border-veya-border">
              <Heart size={16} className="text-red-400" />
            </div>
            <p className="text-xs text-veya-text-dim">One-tap SOS to your circle</p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="mt-12 flex items-center gap-2 rounded-full bg-veya-lavender-bright px-8 py-4 text-sm font-bold text-veya-bg transition-all active:scale-95 glow-lavender"
        >
          START EXPLORING
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>

        <p className="mt-6 text-[10px] text-veya-text-dim/40">
          Demo prototype · Mock data · Not for real emergencies
        </p>
      </div>
    </div>
  );
}
