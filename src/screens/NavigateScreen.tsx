import { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, Clock, Route as RouteIcon, Flag, X, Check, ChevronDown, ChevronRight, BatteryLow, Navigation as NavIcon, MapPin, Info } from 'lucide-react';
import { MapMockup } from '@/components/MapMockup';
import { RouteCard } from '@/components/RouteCard';
import { SafetyBadge } from '@/components/SafetyBadge';
import { Toggle } from '@/components/Toggle';
import { formatTimestamp } from '@/components/Timestamp';
import { routes as defaultRoutes, currentLocation, safeSpots, incidentTypes } from '@/data/mockData';
import type { Location, RouteOption, SafetyLevel, IncidentReport, RouteSegment } from '@/types';
import { useHaptic } from '@/hooks/useHaptic';

interface NavigateScreenProps {
  destination: Location | null;
  nightMode: boolean;
  offline: boolean;
  onToggleOffline: (v: boolean) => void;
  batteryLevel: number;
  incidents: IncidentReport[];
  onReportIncident: (report: IncidentReport) => void;
  onBack: () => void;
}

export function NavigateScreen({
  destination,
  nightMode,
  offline,
  onToggleOffline,
  batteryLevel,
  incidents,
  onReportIncident,
  onBack,
}: NavigateScreenProps) {
  const [selectedRouteId, setSelectedRouteId] = useState('route-smart');
  const [showSegments, setShowSegments] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportType, setReportType] = useState(incidentTypes[0]);
  const [reportNote, setReportNote] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [arrived, setArrived] = useState(false);
  const haptic = useHaptic();

  const now = useMemo(() => formatTimestamp(new Date()), []);

  const routes = useMemo(() => {
    return defaultRoutes.map((route) => {
      const updatedSegments = route.segments.map((seg) => {
        const incident = incidents.find((i) => i.segmentId === seg.id);
        if (incident) {
          const newSafety: SafetyLevel = seg.safety === 'safe' ? 'caution' : 'risk';
          return { ...seg, safety: newSafety, recentActivity: `Reported: ${incident.type}` };
        }
        return seg;
      });
      const hasRisk = updatedSegments.some((s) => s.safety === 'risk');
      const hasCaution = updatedSegments.some((s) => s.safety === 'caution');
      const newLevel: SafetyLevel = hasRisk ? 'risk' : hasCaution ? 'caution' : 'safe';
      return { ...route, segments: updatedSegments, safetyLevel: newLevel };
    });
  }, [incidents]);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) ?? routes[0];

  const handleSelectRoute = useCallback((id: string) => {
    setSelectedRouteId(id);
    haptic('light');
  }, [haptic]);

  const handleSubmitReport = () => {
    const targetSegment = selectedRoute.segments[0];
    const report: IncidentReport = {
      id: `inc-${Date.now()}`,
      routeId: selectedRouteId,
      segmentId: targetSegment.id,
      type: reportType,
      note: reportNote,
      timestamp: Date.now(),
    };
    onReportIncident(report);
    haptic('success');
    setReportSubmitted(true);
    setTimeout(() => {
      setReportOpen(false);
      setReportSubmitted(false);
      setReportNote('');
    }, 2000);
  };

  if (!destination) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-veya-bg px-6 safe-top">
        <p className="text-sm text-veya-text-dim">No destination selected.</p>
        <button onClick={onBack} className="mt-4 rounded-xl bg-veya-surface border border-veya-border px-6 py-3 text-sm font-bold text-veya-text">
          Back to Home
        </button>
      </div>
    );
  }

  if (arrived) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-veya-bg px-6 safe-top">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10">
            <Check size={36} className="text-emerald-400" />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold font-display text-veya-text">Made it.</h2>
        <p className="mt-2 text-sm text-veya-text-dim">You arrived at {destination.name}.</p>
        <button
          onClick={onBack}
          className="mt-8 rounded-full bg-veya-lavender-bright px-8 py-3.5 text-sm font-bold text-veya-bg active:scale-95"
        >
          BACK TO HOME
        </button>
      </div>
    );
  }

  if (navigating) {
    return (
      <div className="min-h-screen bg-veya-bg pb-24 safe-top">
        <div className="sticky top-0 z-20 glass border-b border-veya-border px-5 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setNavigating(false)} className="flex items-center gap-2 text-sm text-veya-text-dim">
              <ArrowLeft size={18} /> Back
            </button>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                ● LIVE NAV
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 mt-3">
          <MapMockup
            routes={[selectedRoute]}
            selectedRouteId={selectedRouteId}
            safeSpots={safeSpots}
            currentLocation={currentLocation.point}
            destination={destination.point}
            destinationLabel={destination.name}
            nightMode={nightMode}
            offline={offline}
            height="420px"
            interactive
          />
        </div>

        <div className="px-5 mt-4">
          <div className="rounded-2xl border border-veya-border bg-veya-surface p-4 animate-sheet-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-veya-text-dim">CURRENT SEGMENT</p>
                <p className="text-sm font-bold text-veya-text">{selectedRoute.segments[0].name}</p>
              </div>
              <SafetyBadge level={selectedRoute.segments[0].safety} />
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-veya-text-dim" />
                <span className="text-xs text-veya-text">{selectedRoute.durationMin} min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RouteIcon size={14} className="text-veya-text-dim" />
                <span className="text-xs text-veya-text">{selectedRoute.distanceKm} km</span>
              </div>
              <span className="text-[10px] text-veya-text-dim/50">as of {now}</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              {selectedRoute.segments.map((seg, i) => (
                <div
                  key={seg.id}
                  className={`h-1.5 flex-1 rounded-full ${
                    seg.safety === 'safe' ? 'bg-emerald-400' : seg.safety === 'caution' ? 'bg-amber-400' : 'bg-red-400'
                  } ${i === 0 ? 'opacity-100' : 'opacity-40'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setArrived(true)}
              className="mt-4 w-full rounded-xl bg-veya-lavender-bright py-3 text-sm font-bold text-veya-bg active:scale-95"
            >
              MARK AS ARRIVED
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-veya-bg pb-24 safe-top">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-veya-border px-5 py-3">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-veya-text-dim">
            <ArrowLeft size={18} /> Home
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleOffline(!offline)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${offline ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-veya-border bg-veya-surface text-veya-text-dim'}`}
              aria-label="Toggle offline mode"
            >
              {offline ? <span className="text-[10px] font-bold">OFF</span> : <span className="text-[10px] font-bold">ON</span>}
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <MapPin size={14} className="text-veya-lavender-bright" />
          <span className="text-xs text-veya-text-dim">
            <span className="font-semibold text-veya-text">{currentLocation.name}</span>
            <ChevronRight size={12} className="mx-1 inline text-veya-text-dim/40" />
            <span className="font-semibold text-veya-text">{destination.name}</span>
          </span>
        </div>
      </div>

      {/* Battery warning */}
      {batteryLevel < 20 && (
        <div className="mx-5 mt-3 flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5">
          <BatteryLow size={16} className="text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">Battery at {batteryLevel}%. Consider carrying a charger or power bank.</p>
        </div>
      )}

      {/* Map */}
      <div className="px-5 mt-3">
        <MapMockup
          routes={routes}
          selectedRouteId={selectedRouteId}
          safeSpots={safeSpots}
          currentLocation={currentLocation.point}
          destination={destination.point}
          destinationLabel={destination.name}
          nightMode={nightMode}
          offline={offline}
          height="260px"
          interactive
        />
      </div>

      {/* Route comparison */}
      <div className="px-5 mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold font-display">CHOOSE YOUR MOVE</h2>
          <span className="text-[10px] text-veya-text-dim/50">as of {now}</span>
        </div>

        {offline ? (
          <div className="space-y-3">
            {routes.map((route) => (
              <OfflineRouteCard
                key={route.id}
                route={route}
                selected={route.id === selectedRouteId}
                onSelect={() => handleSelectRoute(route.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                selected={route.id === selectedRouteId}
                onSelect={() => handleSelectRoute(route.id)}
                timestamp={now}
              />
            ))}
          </div>
        )}

        {/* Safety score transparency */}
        <div className="mt-4 rounded-xl border border-veya-border bg-veya-surface/50 p-4">
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5 text-veya-text-dim shrink-0" />
            <p className="text-[11px] leading-relaxed text-veya-text-dim">
              Predicted safety scores are AI-assessed based on available data (lighting, crowd, recent reports) — not a guarantee of safety.
              Always trust your instincts.
            </p>
          </div>
        </div>
      </div>

      {/* Segments */}
      <div className="px-5 mt-5">
        <button
          onClick={() => setShowSegments(!showSegments)}
          className="flex w-full items-center justify-between rounded-xl border border-veya-border bg-veya-surface px-4 py-3.5"
        >
          <span className="text-sm font-bold text-veya-text">Segment-level risk breakdown</span>
          <ChevronDown size={18} className={`text-veya-text-dim transition-transform ${showSegments ? 'rotate-180' : ''}`} />
        </button>

        {showSegments && (
          <div className="mt-3 space-y-2 animate-slide-up">
            {selectedRoute.segments.map((seg, i) => (
              <SegmentCard key={seg.id} segment={seg} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Report incident */}
      <div className="px-5 mt-5">
        <button
          onClick={() => setReportOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3.5 text-sm font-bold text-amber-300 transition-colors active:scale-[0.98]"
        >
          <Flag size={16} />
          REPORT AN ISSUE ON THIS ROUTE
        </button>
      </div>

      {/* Start navigation */}
      <div className="px-5 mt-5">
        <button
          onClick={() => { haptic('medium'); setNavigating(true); }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-veya-lavender-bright py-4 text-base font-bold text-veya-bg transition-transform active:scale-95 glow-lavender"
        >
          <NavIcon size={20} />
          LET'S GO →
        </button>
        <p className="mt-2 text-center text-[10px] text-veya-text-dim/50">
          You're good. Safe travels.
        </p>
      </div>

      {/* Report modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setReportOpen(false)}>
          <div
            className="w-full rounded-t-3xl border-t border-veya-border bg-veya-surface p-6 animate-sheet-up safe-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            {reportSubmitted ? (
              <div className="flex flex-col items-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                  <Check size={32} className="text-emerald-400" />
                </div>
                <p className="mt-4 text-base font-bold text-veya-text">Report submitted</p>
                <p className="mt-1 text-xs text-veya-text-dim">Route segment updated. Thanks — this helps improve our safety predictions for everyone.</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-bold font-display">Report an issue</h3>
                  <button onClick={() => setReportOpen(false)} aria-label="Close">
                    <X size={20} className="text-veya-text-dim" />
                  </button>
                </div>

                <p className="mb-2 text-xs font-semibold text-veya-text-dim">ISSUE TYPE</p>
                <div className="flex flex-wrap gap-2">
                  {incidentTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        reportType === type
                          ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                          : 'border-veya-border bg-veya-bg/50 text-veya-text-dim'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <p className="mb-2 mt-4 text-xs font-semibold text-veya-text-dim">NOTE (OPTIONAL)</p>
                <p className="mb-2 text-[10px] text-veya-text-dim/50">No personal information is attached to this report.</p>
                <textarea
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="Add details..."
                  rows={3}
                  className="w-full rounded-xl border border-veya-border bg-veya-bg/50 px-4 py-3 text-sm text-veya-text placeholder:text-veya-text-dim/40 focus:border-veya-lavender-bright/40 focus:outline-none resize-none"
                />

                <button
                  onClick={handleSubmitReport}
                  className="mt-4 w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-veya-bg active:scale-95"
                >
                  SUBMIT REPORT
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OfflineRouteCard({ route, selected, onSelect }: { route: RouteOption; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-xl border p-3.5 text-left transition-all ${selected ? 'border-veya-lavender-bright bg-veya-surface-2' : 'border-veya-border bg-veya-surface'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold font-display">{route.label}</p>
          <p className="mt-0.5 text-xs text-veya-text-dim">{route.durationMin} min · {route.distanceKm} km</p>
        </div>
        <span className={`text-xs font-bold ${route.safetyLevel === 'safe' ? 'text-emerald-400' : route.safetyLevel === 'caution' ? 'text-amber-400' : 'text-red-400'}`}>
          {route.safetyLevel === 'safe' ? 'SAFE' : route.safetyLevel === 'caution' ? 'CAUTION' : 'RISK'}
        </span>
      </div>
    </button>
  );
}

function SegmentCard({ segment, index }: { segment: RouteSegment; index: number }) {
  const colors: Record<SafetyLevel, { bg: string; border: string; text: string; dot: string }> = {
    safe: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    caution: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-300', dot: 'bg-amber-400' },
    risk: { bg: 'bg-red-500/5', border: 'border-red-500/20', text: 'text-red-300', dot: 'bg-red-400' },
  };
  const c = colors[segment.safety];

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-3.5`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${c.dot}`} />
          <span className="text-xs font-bold text-veya-text">
            {index + 1}. {segment.name}
          </span>
        </div>
        <SafetyBadge level={segment.safety} size="xs" />
      </div>
      <p className="mt-2 text-[10px] font-semibold text-veya-lavender-bright/60">AI-assessed factors:</p>
      <div className="mt-1 grid grid-cols-3 gap-2 text-[10px]">
        <div>
          <p className="text-veya-text-dim/50">Lighting</p>
          <p className="text-veya-text-dim">{segment.lighting}</p>
        </div>
        <div>
          <p className="text-veya-text-dim/50">Crowd</p>
          <p className="text-veya-text-dim">{segment.crowd}</p>
        </div>
        <div>
          <p className="text-veya-text-dim/50">Activity</p>
          <p className="text-veya-text-dim">{segment.recentActivity}</p>
        </div>
      </div>
    </div>
  );
}
