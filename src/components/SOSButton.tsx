import { useState, useEffect, useRef, useCallback } from 'react';
import { X, AlertTriangle, MapPin, Battery, Phone, Shield, Home, CheckCircle2 } from 'lucide-react';
import type { DeliveryStatus, LocationPrecision, TrustedContact } from '@/types';
import { useHaptic } from '@/hooks/useHaptic';

export interface ContactDelivery {
  contactId: string;
  status: DeliveryStatus;
}

interface SOSButtonProps {
  onActivate: () => void;
  active: boolean;
  onDeactivate: () => void;
  onBackHome: () => void;
  contacts: TrustedContact[];
  deliveries: ContactDelivery[];
  precision: LocationPrecision;
  batteryLevel: number;
  locationName: string;
}

export function SOSButton({
  onActivate,
  active,
  onDeactivate,
  onBackHome,
  contacts,
  deliveries,
  precision,
  batteryLevel,
  locationName,
}: SOSButtonProps) {
  const [countdown, setCountdown] = useState(0);
  const [holding, setHolding] = useState(false);
  const [showHint, setShowHint] = useState(() => {
    try { return localStorage.getItem('veya-sos-hint-seen') !== 'true'; } catch { return true; }
  });
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const haptic = useHaptic();

  const startHold = useCallback(() => {
    setHolding(true);
    haptic('medium');
    holdTimer.current = setTimeout(() => {
      haptic('heavy');
      setCountdown(5);
    }, 600);
  }, [haptic]);

  const cancelHold = useCallback(() => {
    setHolding(false);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (countdown === 0) return;
    setCountdown(0);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    haptic('light');
  }, [countdown, haptic]);

  useEffect(() => {
    if (countdown > 0) {
      countdownTimer.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            haptic('error');
            onActivate();
            return 0;
          }
          haptic('warning');
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, [countdown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  if (active) {
    return <SOSActivePanel onDeactivate={onDeactivate} onBackHome={onBackHome} contacts={contacts} deliveries={deliveries} precision={precision} batteryLevel={batteryLevel} locationName={locationName} />;
  }

  if (countdown > 0) {
    const contactNames = contacts.map((c) => c.name).join(', ');
    return (
      <>
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={cancelHold} />
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6">
          <div className="relative flex h-48 w-48 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse-ring" />
            <div className="absolute inset-4 rounded-full bg-red-500/30 animate-pulse-ring" style={{ animationDelay: '0.3s' }} />
            <div className="relative flex h-40 w-40 flex-col items-center justify-center rounded-full border-4 border-red-500 bg-veya-surface animate-countdown">
              <span className="text-6xl font-extrabold text-red-400 font-display">{countdown}</span>
              <span className="mt-1 text-xs font-semibold text-red-300/80">SENDING SOS...</span>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-veya-text-dim">
            Alert will be sent to <span className="font-bold text-veya-text">{contactNames}</span>
          </p>
          <button
            onClick={cancelHold}
            className="mt-6 flex items-center gap-2 rounded-full border border-veya-border bg-veya-surface px-6 py-3 text-sm font-bold text-veya-text transition-colors active:scale-95"
          >
            <X size={18} />
            CANCEL
          </button>
        </div>
      </>
    );
  }

  const dismissHint = () => {
    setShowHint(false);
    try { localStorage.setItem('veya-sos-hint-seen', 'true'); } catch { /* storage unavailable */ }
  };

  return (
    <>
      {showHint && !countdown && (
        <div className="fixed bottom-44 right-4 z-30 max-w-[200px] animate-slide-up">
          <div className="relative rounded-xl glass border border-veya-border px-3 py-2.5 text-[10px] text-veya-text-dim leading-tight">
            Tap and hold, or tap once for a cancel window
            <button
              onClick={dismissHint}
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-veya-surface-2 border border-veya-border text-veya-text-dim/60 text-[10px] leading-none"
              aria-label="Dismiss hint"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <button
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        className={`fixed bottom-24 right-4 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg glow-sos transition-transform active:scale-90 ${holding ? 'scale-110' : ''}`}
        aria-label="SOS — hold to activate emergency alert"
      >
        <div className="absolute inset-0 rounded-full bg-red-500/40 animate-pulse-ring" />
        <span className="relative text-sm font-extrabold tracking-wider">SOS</span>
      </button>
    </>
  );
}

function SOSActivePanel({
  onDeactivate,
  onBackHome,
  contacts,
  deliveries,
  precision,
  batteryLevel,
  locationName,
}: {
  onDeactivate: () => void;
  onBackHome: () => void;
  contacts: TrustedContact[];
  deliveries: ContactDelivery[];
  precision: LocationPrecision;
  batteryLevel: number;
  locationName: string;
}) {
  const allSent = deliveries.length > 0 && deliveries.every((d) => d.status === 'sent');
  const deliveryConfig: Record<DeliveryStatus, { icon: string; text: string; color: string; bg: string }> = {
    sent: { icon: '✓', text: 'Sent', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    queued: { icon: '○', text: 'Queued', color: 'text-amber-400', bg: 'bg-amber-500/15' },
    failed: { icon: '✕', text: 'Failed', color: 'text-red-400', bg: 'bg-red-500/15' },
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-veya-bg/95 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="safe-top flex-1 flex flex-col items-center justify-start px-6 py-8 min-h-full">
        <div className="relative mb-8 flex h-32 w-32 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse-ring" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-red-500 bg-red-500/10">
            <AlertTriangle size={40} className="text-red-400" />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-red-400 font-display tracking-tight">SOS ACTIVE</h2>
        <p className="mt-2 max-w-xs text-center text-sm text-veya-text-dim">
          Your location and battery update is being shared with your trusted contacts.
        </p>

        <div className="mt-5 w-full max-w-sm rounded-xl border border-red-500/20 bg-red-500/5 p-3.5">
          <p className="text-[10px] font-bold tracking-wide text-red-400/70 mb-1">MESSAGE SENT</p>
          <p className="text-xs text-veya-text-dim italic leading-relaxed">
            "Hey, I might need help. Last known location: {locationName}. Battery: {batteryLevel}%."
          </p>
        </div>

        {allSent && (
          <div className="mt-3 w-full max-w-sm flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 animate-slide-up">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <p className="text-xs font-semibold text-emerald-300">Alert sent to all contacts. You can return to the main page.</p>
          </div>
        )}

        <div className="mt-4 w-full max-w-sm space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-veya-border bg-veya-surface p-4">
            <MapPin size={20} className="text-veya-lavender-bright" />
            <div className="flex-1">
              <p className="text-xs text-veya-text-dim">Current Location</p>
              <p className="text-sm font-bold text-veya-text">Connaught Place, New Delhi</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${precision === 'precise' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
              {precision === 'precise' ? 'Precise' : 'Approximate'}
            </span>
          </div>

          <div className="rounded-xl border border-veya-border bg-veya-surface p-4">
            <p className="mb-2 text-xs text-veya-text-dim">Alert sent to</p>
            <div className="space-y-2">
              {contacts.map((contact) => {
                const delivery = deliveries.find((d) => d.contactId === contact.id);
                const status = delivery?.status ?? 'queued';
                const dc = deliveryConfig[status];
                return (
                  <div key={contact.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-veya-bg/50 shrink-0">
                      <span className="text-xs font-bold text-veya-lavender-bright">{contact.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-veya-text truncate">{contact.name}</p>
                      <p className="text-[10px] text-veya-text-dim/60">{contact.phone}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${dc.bg} ${dc.color} shrink-0`}>
                      <span>{dc.icon}</span> {dc.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-veya-border bg-veya-surface p-4">
            <Battery size={20} className={batteryLevel < 20 ? 'text-red-400' : 'text-veya-lavender-bright'} />
            <div className="flex-1">
              <p className="text-xs text-veya-text-dim">Battery</p>
              <p className="text-sm font-bold text-veya-text">{batteryLevel}%</p>
            </div>
          </div>
        </div>

        <a
          href="tel:112"
          className="mt-6 flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-red-500 py-4 text-base font-bold text-white transition-transform active:scale-95 glow-sos"
        >
          <Phone size={20} />
          CALL 112 EMERGENCY
        </a>

        <button
          onClick={onDeactivate}
          className="mt-4 flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-veya-border bg-veya-surface py-4 text-base font-bold text-veya-text transition-colors active:scale-95"
        >
          <X size={20} />
          CANCEL SOS — I'M SAFE
        </button>

        <p className="mt-4 text-center text-xs text-veya-text-dim/60">
          Sharing will stop immediately when you cancel.
        </p>

        <button
          onClick={onBackHome}
          className="mt-3 flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-veya-border bg-veya-surface/50 py-3.5 text-sm font-bold text-veya-text-dim transition-colors active:scale-95"
        >
          <Home size={18} />
          BACK TO HOME
        </button>
      </div>
    </div>
  );
}
