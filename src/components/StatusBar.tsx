import { Signal, Wifi, BatteryFull } from 'lucide-react';

export function StatusBar() {
  return (
    <div className="flex justify-between items-center px-7 pt-3 pb-1.5 bg-white shrink-0 z-30 relative">
      <span className="text-sm font-bold text-neutral-900">9:41</span>
      <div className="flex gap-1.5 items-center text-neutral-900">
        <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
        <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
        <BatteryFull className="w-4 h-4" strokeWidth={2.5} />
      </div>
    </div>
  );
}
