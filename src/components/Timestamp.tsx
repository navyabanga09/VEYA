export function formatTimestamp(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function Timestamp({ time }: { time: string }) {
  return (
    <span className="text-[10px] text-veya-text-dim/50">
      data as of {time}
    </span>
  );
}
