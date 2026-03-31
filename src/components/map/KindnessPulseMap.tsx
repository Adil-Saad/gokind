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

function createMarkerIcon(status: string) {
  if (status === 'open') {
    return L.divIcon({
      className: '',
      html: `<div class="gk-marker" style="--c:#7C3AED;--g:rgba(124,58,237,0.5);--border:#4C1D95;">
        <div class="gk-ring gk-ring1"></div>
        <div class="gk-ring gk-ring2"></div>
        <div class="gk-core"></div>
      </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  }
  if (status === 'active') {
    return L.divIcon({
      className: '',
      html: `<div class="gk-marker" style="--c:#0D9488;--g:rgba(13,148,136,0.5);--border:#134E4A;">
        <div class="gk-orbit"></div>
        <div class="gk-core"></div>
      </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  }
  // completed
  return L.divIcon({
    className: '',
    html: `<div class="gk-marker" style="--c:#16A34A;--g:rgba(22,163,74,0.4);--border:#14532D;">
      <div class="gk-core gk-done"></div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

interface QuestPin {
  id: string;
  title: string;
  description?: string;
  category: string;
  lat: number;
  lng: number;
  status: string;
  reward_type: string;
  price: number;
}

// Zoom in on initial load
function MapInitZoom() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.flyTo([50.798, -1.091], 14, { duration: 2 });
    }, 500);
  }, [map]);
  return null;
}

// Fly to new quests when they appear
function MapFlyToNew({ quests }: { quests: QuestPin[] }) {
  const map = useMap();
  const prevCountRef = useRef(quests.length);

  useEffect(() => {
    if (quests.length > prevCountRef.current && quests.length > 0) {
      const newest = quests[quests.length - 1];
      map.flyTo([newest.lat, newest.lng], 16, { duration: 1.5 });
    }
    prevCountRef.current = quests.length;
  }, [quests, map]);

  return null;
}

export default function KindnessPulseMap() {
  const [quests, setQuests] = useState<QuestPin[]>([]);
  const supabaseRef = useRef(createClient());

  // Inject marker styles
  useEffect(() => {
    const styleId = 'gk-map-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .gk-marker { position:relative; width:36px; height:36px; overflow:visible; }
        .gk-core {
          position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
          width:16px; height:16px; border-radius:50%;
          background:var(--c); border:2.5px solid var(--border);
          box-shadow:0 0 14px 5px var(--g), 0 0 6px 2px var(--c), 0 2px 8px rgba(0,0,0,0.3);
          z-index:3;
        }
        .gk-done::after {
          content:'✓'; position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          font-size:9px; font-weight:900; color:white;
        }
        .gk-ring {
          position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) scale(0);
          border-radius:50%; border:2.5px solid var(--c);
          animation: gkPulse 2s ease-out infinite;
          z-index:1;
        }
        .gk-ring1 { width:36px; height:36px; animation-delay:0s; }
        .gk-ring2 { width:36px; height:36px; animation-delay:0.8s; }
        .gk-orbit {
          position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
          width:28px; height:28px; border-radius:50%;
          border:2px dashed var(--c); opacity:0.8;
          animation: gkOrbit 3s linear infinite;
          z-index:1;
        }
        @keyframes gkPulse {
          0%   { transform:translate(-50%,-50%) scale(0.4); opacity:0.9; }
          100% { transform:translate(-50%,-50%) scale(2.5); opacity:0; }
        }
        @keyframes gkOrbit {
          from { transform:translate(-50%,-50%) rotate(0deg); }
          to   { transform:translate(-50%,-50%) rotate(360deg); }
        }
        .leaflet-popup-content-wrapper {
          background:#fff !important;
          border-radius:14px !important;
          box-shadow:0 8px 30px rgba(0,0,0,0.15) !important;
          min-width:240px !important;
        }
        .leaflet-popup-tip { background:#fff !important; }
        .gk-popup { padding:4px; font-family:'Outfit',system-ui,sans-serif; }
        .gk-popup-title { font-size:15px; font-weight:700; color:#1a1a2e; margin-bottom:6px; }
        .gk-popup-desc { font-size:12px; color:#64748b; line-height:1.5; margin-bottom:10px; }
        .gk-popup-meta { display:flex; align-items:center; justify-content:space-between; }
        .gk-popup-status {
          display:inline-block; padding:3px 10px; border-radius:6px;
          font-size:11px; font-weight:700; text-transform:capitalize;
        }
        .gk-popup-status.open { background:#EDE9FE; color:#7C3AED; }
        .gk-popup-status.active { background:#CCFBF1; color:#0D9488; }
        .gk-popup-status.completed { background:#DCFCE7; color:#16A34A; }
        .gk-popup-reward { font-size:13px; font-weight:700; color:#0D9488; }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(styleId);
      if (el) document.head.removeChild(el);
    };
  }, []);

  // Fetch + realtime
  useEffect(() => {
    const supabase = supabaseRef.current;

    async function fetchQuests() {
      const { data } = await supabase
        .from('quests')
        .select('id, title, description, category, lat, lng, status, reward_type, price');
      if (data && data.length > 0) {
        setQuests(data);
      } else if (!data || data.length === 0) {
        // Demo data shown when DB is unavailable or table is empty
        setQuests([
          { id: 'd1', title: 'Litter pick Southsea Common', description: 'Help clean up the seafront', category: 'litter', lat: 50.783, lng: -1.085, status: 'open', reward_type: 'points', price: 50 },
          { id: 'd2', title: 'Shopping run for Jim', description: 'Weekly grocery trip needed', category: 'shopping', lat: 50.797, lng: -1.072, status: 'open', reward_type: 'money', price: 10 },
          { id: 'd3', title: 'Pothole Goldsmith Ave', description: 'Large pothole needs reporting', category: 'pothole', lat: 50.795, lng: -1.075, status: 'active', reward_type: 'points', price: 30 },
          { id: 'd4', title: 'Check on Mrs Davies', description: 'Elderly resident needs company', category: 'elderly', lat: 50.800, lng: -1.090, status: 'open', reward_type: 'points', price: 40 },
          { id: 'd5', title: 'Dog walk Milton Park', description: 'Daily walk for Biscuit', category: 'pet', lat: 50.792, lng: -1.065, status: 'completed', reward_type: 'money', price: 8 },
        ]);
      }
    }

    fetchQuests();

    const channel = supabase
      .channel('map-quests-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quests' }, (payload) => {
        const q = payload.new as QuestPin;
        setQuests(prev => [...prev, q]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'quests' }, (payload) => {
        const updated = payload.new as QuestPin;
        setQuests(prev => prev.map(q => q.id === updated.id ? updated : q));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'quests' }, (payload) => {
        const deleted = payload.old as { id: string };
        setQuests(prev => prev.filter(q => q.id !== deleted.id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const statusLabels: Record<string, string> = {
    open: '⏳ Waiting for helper',
    active: '🔄 In progress',
    completed: '✅ Completed',
  };

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={[50.81, -1.09]}
        zoom={12}
        style={{ height: '100%', width: '100%', background: '#f2f2f2' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapInitZoom />
        <MapFlyToNew quests={quests} />
        {quests.map((q) => (
          <Marker key={q.id} position={[q.lat, q.lng]} icon={createMarkerIcon(q.status)}>
            <Popup>
              <div className="gk-popup">
                <div className="gk-popup-title">
                  {CATEGORY_EMOJI[q.category] || '✨'} {q.title}
                </div>
                {q.description && (
                  <div className="gk-popup-desc">{q.description}</div>
                )}
                <div className="gk-popup-meta">
                  <span className={`gk-popup-status ${q.status}`}>
                    {statusLabels[q.status] || q.status}
                  </span>
                  <span className="gk-popup-reward">
                    {q.reward_type === 'money' ? `£${q.price}` : `${q.price || 50} pts`}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 px-4 py-3 z-[1000] shadow-lg">
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Kindness Pulse</p>
        <div className="flex items-center gap-2 text-xs text-gray-700 mb-1.5">
          <span className="w-3 h-3 rounded-full bg-[#7C3AED] inline-block shadow-[0_0_6px_2px_rgba(124,58,237,0.4)]"></span> Open
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700 mb-1.5">
          <span className="w-3 h-3 rounded-full bg-[#0D9488] inline-block shadow-[0_0_6px_2px_rgba(13,148,136,0.4)]"></span> In Progress
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <span className="w-3 h-3 rounded-full bg-[#16A34A] inline-block shadow-[0_0_6px_2px_rgba(22,163,74,0.3)]"></span> Completed
        </div>
      </div>

      {/* Quest count */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 px-4 py-2 z-[1000] shadow-lg">
        <span className="text-sm font-bold text-[#7C3AED]">{quests.filter(q => q.status === 'open').length}</span>
        <span className="text-xs text-gray-500 ml-1">open</span>
        <span className="text-gray-300 mx-1.5">·</span>
        <span className="text-sm font-bold text-[#0D9488]">{quests.filter(q => q.status === 'active').length}</span>
        <span className="text-xs text-gray-500 ml-1">active</span>
      </div>
    </div>
  );
}
