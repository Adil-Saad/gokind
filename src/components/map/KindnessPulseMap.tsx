'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createClient } from '@/utils/supabase/client';

const CATEGORY_EMOJI: Record<string, string> = {
  shopping: '🛒', delivery: '📦', litter: '🗑️', charity: '💛',
  pothole: '🕳️', elderly: '👴', pet: '🐕', other: '✨',
};

function createGlowingIcon(status: string) {
  const isOpen = status === 'open';
  const color = isOpen ? '#8B5CF6' : '#34D1BF';
  const glowColor = isOpen ? 'rgba(139,92,246,0.6)' : 'rgba(52,209,191,0.6)';

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:40px;height:40px;">
        <div style="
          position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          width:14px;height:14px;border-radius:50%;
          background:${color};border:2px solid white;
          box-shadow:0 0 16px 6px ${glowColor}, 0 0 40px 12px ${glowColor}, 0 0 6px 2px ${color};
          z-index:3;
        "></div>
        <div style="
          position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.4);
          width:40px;height:40px;border-radius:50%;border:2px solid ${color};
          animation:gkPulse 2s ease-out infinite;
          z-index:1;
        "></div>
        <div style="
          position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.4);
          width:40px;height:40px;border-radius:50%;border:2px solid ${color};
          animation:gkPulse 2s ease-out infinite 0.8s;
          z-index:1;
        "></div>
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

interface QuestPin {
  id: string;
  title: string;
  category: string;
  lat: number;
  lng: number;
  status: string;
  reward_type: string;
  price: number;
  description?: string;
}

// Component to fly to new quests when they appear
function MapUpdater({ quests }: { quests: QuestPin[] }) {
  const map = useMap();
  const prevCountRef = useRef(quests.length);

  useEffect(() => {
    if (quests.length > prevCountRef.current && quests.length > 0) {
      const newest = quests[quests.length - 1];
      map.flyTo([newest.lat, newest.lng], 15, { duration: 1.5 });
    }
    prevCountRef.current = quests.length;
  }, [quests, map]);

  return null;
}

export default function KindnessPulseMap() {
  const [quests, setQuests] = useState<QuestPin[]>([]);
  const supabaseRef = useRef(createClient());

  // Inject pulse animation CSS
  useEffect(() => {
    const styleId = 'gk-map-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes gkPulse {
          0%   { transform:translate(-50%,-50%) scale(0.4); opacity:0.9; }
          100% { transform:translate(-50%,-50%) scale(2.5); opacity:0; }
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(styleId);
      if (el) document.head.removeChild(el);
    };
  }, []);

  // Fetch quests + realtime subscription
  useEffect(() => {
    const supabase = supabaseRef.current;

    async function fetchQuests() {
      const { data, error } = await supabase
        .from('quests')
        .select('id, title, category, lat, lng, status, reward_type, price, description');
      if (data) setQuests(data);
      if (error) console.error('Map fetch error:', error);
    }

    fetchQuests();

    const channel = supabase
      .channel('map-quests-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quests' }, (payload) => {
        console.log('New quest on map:', payload.new);
        const q = payload.new as QuestPin;
        setQuests(prev => [...prev, q]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'quests' }, (payload) => {
        console.log('Quest updated on map:', payload.new);
        const updated = payload.new as QuestPin;
        setQuests(prev => prev.map(q => q.id === updated.id ? updated : q));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'quests' }, (payload) => {
        const deleted = payload.old as { id: string };
        setQuests(prev => prev.filter(q => q.id !== deleted.id));
      })
      .subscribe((status) => {
        console.log('Map realtime status:', status);
      });

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={[50.8, -1.09]}
        zoom={13}
        style={{ height: '100%', width: '100%', background: '#0A1628' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater quests={quests} />
        {quests.map((q) => (
          <Marker key={q.id} position={[q.lat, q.lng]} icon={createGlowingIcon(q.status)}>
            <Popup>
              <div className="text-gray-900 min-w-[200px]">
                <div className="font-bold text-base mb-1">
                  {CATEGORY_EMOJI[q.category] || '✨'} {q.title}
                </div>
                {q.description && (
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2">{q.description}</p>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{q.status}</span>
                  <span className="font-semibold text-emerald-600">
                    {q.reward_type === 'money' ? `£${q.price}` : `${q.price || 50} pts`}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-700 px-4 py-3 z-[1000]">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Kindness Pulse</p>
        <div className="flex items-center gap-2 text-xs text-gray-300 mb-1.5">
          <span className="w-3 h-3 rounded-full bg-[#8B5CF6] inline-block shadow-[0_0_8px_3px_rgba(139,92,246,0.5)]"></span> Open Quest
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="w-3 h-3 rounded-full bg-[#34D1BF] inline-block shadow-[0_0_8px_3px_rgba(52,209,191,0.5)]"></span> Completed
        </div>
      </div>

      {/* Quest count badge */}
      <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-full border border-gray-700 px-4 py-2 z-[1000]">
        <span className="text-sm font-bold text-[#34D1BF]">{quests.length}</span>
        <span className="text-xs text-gray-400 ml-1">quests live</span>
      </div>
    </div>
  );
}
