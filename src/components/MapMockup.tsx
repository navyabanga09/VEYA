import { useState, useRef, useEffect } from 'react';
import { Shield, Store, Hospital, Building2, X } from 'lucide-react';
import type { GeoPoint, SafeSpot, RouteOption, SafetyLevel } from '@/types';

interface MapMockupProps {
  routes?: RouteOption[];
  selectedRouteId?: string;
  safeSpots?: SafeSpot[];
  currentLocation: GeoPoint;
  destination?: GeoPoint;
  destinationLabel?: string;
  showSafeSpots?: boolean;
  nightMode?: boolean;
  offline?: boolean;
  height?: string;
  onSegmentClick?: (segmentId: string) => void;
  interactive?: boolean;
}

const safetyColor: Record<SafetyLevel, string> = {
  safe: '#34d399',
  caution: '#fbbf24',
  risk: '#f87171',
};

function buildPath(points: GeoPoint[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

const roads = [
  { d: 'M 0 340 L 500 340', w: 14 },
  { d: 'M 0 180 L 500 180', w: 12 },
  { d: 'M 120 0 L 120 500', w: 14 },
  { d: 'M 320 0 L 320 500', w: 12 },
  { d: 'M 0 80 L 500 80', w: 8 },
  { d: 'M 0 460 L 500 460', w: 8 },
  { d: 'M 200 0 L 200 500', w: 8 },
  { d: 'M 420 0 L 420 500', w: 8 },
  { d: 'M 0 240 L 500 240', w: 10 },
  { d: 'M 0 400 L 500 400', w: 8 },
  { d: 'M 60 0 L 60 500', w: 6 },
  { d: 'M 0 120 L 500 120', w: 6 },
  { d: 'M 0 280 L 500 280', w: 6 },
  { d: 'M 380 0 L 380 500', w: 6 },
  { d: 'M 0 200 L 120 120 L 200 80 L 320 120 L 420 200', w: 6 },
  { d: 'M 120 340 L 200 400 L 320 460 L 420 400', w: 6 },
];

const blocks = [
  { x: 130, y: 190, w: 60, h: 40 },
  { x: 210, y: 90, w: 100, h: 80 },
  { x: 330, y: 190, w: 80, h: 40 },
  { x: 70, y: 250, w: 40, h: 20 },
  { x: 210, y: 250, w: 100, h: 20 },
  { x: 330, y: 250, w: 80, h: 20 },
  { x: 70, y: 350, w: 40, h: 40 },
  { x: 130, y: 350, w: 60, h: 40 },
  { x: 210, y: 300, w: 100, h: 40 },
  { x: 330, y: 300, w: 80, h: 40 },
  { x: 70, y: 410, w: 40, h: 40 },
  { x: 130, y: 410, w: 60, h: 40 },
  { x: 210, y: 410, w: 100, h: 40 },
  { x: 330, y: 410, w: 80, h: 40 },
  { x: 70, y: 130, w: 40, h: 40 },
  { x: 130, y: 130, w: 60, h: 40 },
];

export function MapMockup({
  routes,
  selectedRouteId,
  safeSpots = [],
  currentLocation,
  destination,
  destinationLabel,
  showSafeSpots = true,
  nightMode = false,
  offline = false,
  height = '100%',
  onSegmentClick,
  interactive = true,
}: MapMockupProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<SafeSpot | null>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const selectedRoute = routes?.find((r) => r.id === selectedRouteId);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !interactive) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!interactive) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale((s) => Math.min(2.5, Math.max(0.5, s * delta)));
    };
    const el = svgRef.current;
    el?.addEventListener('wheel', handleWheel, { passive: false });
    return () => el?.removeEventListener('wheel', handleWheel);
  }, [interactive]);

  const bgFill = nightMode ? '#0d0d14' : '#12121a';
  const roadColor = nightMode ? '#1a1a26' : '#1e1e2a';
  const roadStroke = nightMode ? '#252535' : '#2a2a3a';
  const blockFill = nightMode ? '#13131c' : '#181822';

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-veya-border"
      style={{ height, background: bgFill }}
    >
      {offline && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 border border-amber-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          OFFLINE · CACHED
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox="0 0 500 500"
        className="w-full h-full"
        style={{ cursor: interactive ? 'grab' : 'default', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <defs>
          <radialGradient id="locGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="destGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g transform={`translate(${pan.x} ${pan.y}) scale(${scale})`}>
          <g transform="translate(0 0) scale(1)">
            {/* Blocks */}
            {blocks.map((b, i) => (
              <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill={blockFill} stroke={roadStroke} strokeWidth="0.5" />
            ))}

            {/* Roads */}
            {roads.map((r, i) => (
              <path key={i} d={r.d} fill="none" stroke={roadColor} strokeWidth={r.w} strokeLinecap="round" />
            ))}
            {roads.map((r, i) => (
              <path key={`l${i}`} d={r.d} fill="none" stroke={roadStroke} strokeWidth="1" strokeDasharray="4 6" strokeLinecap="round" opacity="0.4" />
            ))}

            {/* Safe spots */}
            {showSafeSpots &&
              safeSpots.map((spot) => (
                <g
                  key={spot.id}
                  className="marker-drop"
                  style={{ transformOrigin: `${spot.point.x}px ${spot.point.y}px`, cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); setSelectedSpot(spot); }}
                >
                  <circle cx={spot.point.x} cy={spot.point.y} r="12" fill="transparent" />
                  <circle cx={spot.point.x} cy={spot.point.y} r="10" fill="#1c1c28" stroke={spot.verified ? '#34d399' : '#6b7280'} strokeWidth="2" />
                  {spot.type === 'police' && <path d={`M${spot.point.x - 4} ${spot.point.y - 1} L${spot.point.x} ${spot.point.y - 5} L${spot.point.x + 4} ${spot.point.y - 1} Z M${spot.point.x - 4} ${spot.point.y - 1} L${spot.point.x + 4} ${spot.point.y - 1} L${spot.point.x + 4} ${spot.point.y + 4} L${spot.point.x - 4} ${spot.point.y + 4} Z`} fill={spot.verified ? '#34d399' : '#6b7280'} />}
                  {spot.type === 'store' && <rect x={spot.point.x - 4} y={spot.point.y - 4} width="8" height="8" rx="1" fill={spot.verified ? '#34d399' : '#6b7280'} />}
                  {spot.type === 'hospital' && <path d={`M${spot.point.x - 1} ${spot.point.y - 5} L${spot.point.x + 1} ${spot.point.y - 5} L${spot.point.x + 1} ${spot.point.y - 1} L${spot.point.x + 5} ${spot.point.y - 1} L${spot.point.x + 5} ${spot.point.y + 1} L${spot.point.x + 1} ${spot.point.y + 1} L${spot.point.x + 1} ${spot.point.y + 5} L${spot.point.x - 1} ${spot.point.y + 5} L${spot.point.x - 1} ${spot.point.y + 1} L${spot.point.x - 5} ${spot.point.y + 1} L${spot.point.x - 5} ${spot.point.y - 1} L${spot.point.x - 1} ${spot.point.y - 1} Z`} fill={spot.verified ? '#34d399' : '#6b7280'} />}
                  {spot.type === 'metro' && <circle cx={spot.point.x} cy={spot.point.y} r="3" fill="none" stroke={spot.verified ? '#34d399' : '#6b7280'} strokeWidth="1.5" />}
                  {spot.type === 'cafe' && <circle cx={spot.point.x} cy={spot.point.y} r="3" fill={spot.verified ? '#34d399' : '#6b7280'} />}
                  {spot.verified && (
                    <circle cx={spot.point.x + 7} cy={spot.point.y - 7} r="4" fill="#34d399" stroke="#0a0a0f" strokeWidth="1.5" />
                  )}
                </g>
              ))}

            {/* Route polylines */}
            {routes?.map((route) => {
              const isSelected = route.id === selectedRouteId;
              const opacity = selectedRouteId && !isSelected ? 0.25 : 0.9;
              return (
                <g key={route.id} opacity={opacity}>
                  {route.segments.map((seg) => (
                    <path
                      key={seg.id}
                      d={buildPath(seg.polyline)}
                      fill="none"
                      stroke={safetyColor[seg.safety]}
                      strokeWidth={isSelected ? 5 : 3.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={isSelected ? 'route-dash' : ''}
                      style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
                      onClick={() => onSegmentClick?.(seg.id)}
                    />
                  ))}
                </g>
              );
            })}

            {/* Destination marker */}
            {destination && (
              <g className="marker-drop" style={{ transformOrigin: `${destination.x}px ${destination.y}px` }}>
                <circle cx={destination.x} cy={destination.y} r="24" fill="url(#destGlow)" />
                <path d={`M${destination.x} ${destination.y - 14} C${destination.x - 10} ${destination.y - 14} ${destination.x - 10} ${destination.y} ${destination.x} ${destination.y + 4} C${destination.x + 10} ${destination.y} ${destination.x + 10} ${destination.y - 14} ${destination.x} ${destination.y - 14} Z`} fill="#34d399" stroke="#0a0a0f" strokeWidth="2" />
                <circle cx={destination.x} cy={destination.y - 8} r="4" fill="#0a0a0f" />
              </g>
            )}

            {/* Current location marker */}
            <g style={{ transformOrigin: `${currentLocation.x}px ${currentLocation.y}px` }}>
              <circle cx={currentLocation.x} cy={currentLocation.y} r="30" fill="url(#locGlow)" className="animate-pulse-ring" />
              <circle cx={currentLocation.x} cy={currentLocation.y} r="10" fill="#a78bfa" stroke="#0a0a0f" strokeWidth="3" />
              <circle cx={currentLocation.x} cy={currentLocation.y} r="4" fill="#f5f5f7" />
            </g>
          </g>
        </g>
      </svg>

      {/* Label overlays */}
      {destinationLabel && destination && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg glass px-2.5 py-1 text-xs font-semibold text-veya-text"
          style={{
            left: `${(destination.x / 500) * 100}%`,
            top: `${(destination.y / 500) * 100}%`,
            marginTop: '-12px',
          }}
        >
          {destinationLabel}
        </div>
      )}

      {/* Safe spot popup */}
      {selectedSpot && (
        <div className="absolute bottom-3 left-3 right-3 z-20 animate-slide-up">
          <div className="flex items-start gap-3 rounded-xl glass border border-veya-border p-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-veya-bg/50 shrink-0">
              {selectedSpot.type === 'police' && <Shield size={16} className="text-veya-lavender-bright" />}
              {selectedSpot.type === 'store' && <Store size={16} className="text-veya-lavender-bright" />}
              {selectedSpot.type === 'hospital' && <Hospital size={16} className="text-veya-lavender-bright" />}
              {selectedSpot.type === 'metro' && <Building2 size={16} className="text-veya-lavender-bright" />}
              {selectedSpot.type === 'cafe' && <Store size={16} className="text-veya-lavender-bright" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-veya-text truncate">{selectedSpot.name}</p>
                {selectedSpot.verified && (
                  <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 shrink-0">
                    <Shield size={8} /> VERIFIED
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-veya-text-dim">{selectedSpot.address} · {selectedSpot.distanceM}m</p>
              {selectedSpot.open24h && <p className="text-[9px] font-semibold text-emerald-400/80">OPEN 24 HRS</p>}
            </div>
            <button onClick={() => setSelectedSpot(null)} className="text-veya-text-dim/40 p-1" aria-label="Close">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-md glass-light px-2 py-1 text-[10px] font-medium text-veya-text-dim">
        MOCK MAP · Demo data
      </div>
    </div>
  );
}
