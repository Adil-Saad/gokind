'use client';

import dynamic from 'next/dynamic';

// Next.js needs dynamic import for react-leaflet to avoid window not defined errors
const KindnessPulseMap = dynamic(
  () => import('@/components/map/KindnessPulseMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#0A1628] flex items-center justify-center">
        <span className="text-[#34D1BF] animate-pulse">Loading Kindness Pulse...</span>
      </div>
    )
  }
);

export default function MapPage() {
  return (
    <div className="relative w-full h-[calc(100vh-120px)]">
      <KindnessPulseMap />
    </div>
  );
}
