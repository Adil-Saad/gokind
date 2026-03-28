'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createClient } from '@/utils/supabase/client';

// Use DivIcon to avoid missing standard Leaflet images in Next.js
const defaultIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="width:16px; height:16px; background:#34D1BF; border-radius:50%; border:2px solid white; box-shadow: 0 0 10px rgba(52, 209, 191, 0.8);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const pulseIcon = L.divIcon({
  className: 'pulse-marker',
  html: `
    <div style="position:relative; width:20px; height:20px;">
      <div style="width:20px; height:20px; background:#34D1BF; border-radius:50%; position:absolute;"></div>
      <div style="width:20px; height:20px; background:#34D1BF; border-radius:50%; position:absolute; animation: mapPulse 1.5s infinite;"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function KindnessPulseMap() {
  const [quests, setQuests] = useState<any[]>([]);
  const supabase = createClient();

  // Inject pulse animation keyframes into the document safely
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes mapPulse {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(3); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Initial mock data simulating Portsmouth area
    setQuests([
      { id: 1, title: 'Help with groceries', location: [50.799, -1.091], status: 'open' },
      { id: 2, title: 'Walk my dog', location: [50.801, -1.095], status: 'completed' },
      { id: 3, title: 'Pick up medication', location: [50.795, -1.085], status: 'open' },
    ]);

    // Supabase Real-time Listener (will work once DB is configured)
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quests' }, (payload) => {
        console.log('Realtime Update:', payload);
        // We will update the state here when the DB is ready
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[50.8, -1.09]} 
        zoom={13} 
        style={{ height: "100%", width: "100%", background: '#0A1628' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {quests.map(q => (
          <Marker 
            key={q.id} 
            position={q.location as [number, number]} 
            icon={q.status === 'completed' ? pulseIcon : defaultIcon}
          >
            <Popup className="custom-popup">
              <strong className="text-gray-900">{q.title}</strong><br/>
              <span className="text-gray-600 capitalize">Status: {q.status}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
