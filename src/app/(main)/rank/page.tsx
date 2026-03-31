'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Ticket, TrendingUp, Star } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string | null;
  points: number;
  avatar_url: string | null;
}

const DEMO_LEADERS: LeaderboardEntry[] = [
  { id: '1', username: 'Sarah M.',  points: 580, avatar_url: null },
  { id: '2', username: 'Raj P.',    points: 470, avatar_url: null },
  { id: '3', username: 'Donna K.',  points: 425, avatar_url: null },
  { id: '4', username: 'Tom W.',    points: 350, avatar_url: null },
  { id: '5', username: 'Aisha H.', points: 310, avatar_url: null },
  { id: '6', username: 'Mike R.',   points: 260, avatar_url: null },
  { id: '7', username: 'Jenny L.', points: 210, avatar_url: null },
  { id: '8', username: 'Chris B.', points: 180, avatar_url: null },
  { id: '9', username: 'Priya S.', points: 155, avatar_url: null },
  { id: '10', username: 'James O.', points: 130, avatar_url: null },
];

const AVATAR_BG = [
  'bg-teal-500/20 text-teal-400',
  'bg-purple-500/20 text-purple-400',
  'bg-amber-500/20 text-amber-400',
  'bg-pink-500/20 text-pink-400',
  'bg-blue-500/20 text-blue-400',
  'bg-green-500/20 text-green-400',
];

function Avatar({ index, large = false }: { index: number; large?: boolean }) {
  return (
    <div className={`${large ? 'w-14 h-14' : 'w-10 h-10'} rounded-xl flex items-center justify-center ${AVATAR_BG[index % AVATAR_BG.length]}`}>
      <User size={large ? 22 : 18} strokeWidth={1.5} />
    </div>
  );
}

export default function RankPage() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchLeaderboard() {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, points, avatar_url')
        .order('points', { ascending: false })
        .limit(20);

      setLeaders(profiles && profiles.length > 0 ? profiles : DEMO_LEADERS);

      const { data: { user } } = await supabase.auth.getUser();
      if (user && profiles) {
        const idx = profiles.findIndex(p => p.id === user.id);
        if (idx !== -1) {
          setUserRank(idx + 1);
          setUserPoints(profiles[idx].points);
        }
      }
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse text-[#34D1BF]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-28 pt-2">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Leaderboard
        </h2>
        <p className="text-[#34D1BF] font-medium text-sm mt-1">Top helpers in Portsmouth</p>
      </div>

      {/* Weekly Draw */}
      <div className="bg-gray-800/80 border border-amber-500/20 rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Ticket size={13} className="text-amber-400" />
            </div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Weekly Draw</span>
          </div>
          <span className="text-[10px] text-gray-500 bg-gray-700/60 px-2 py-1 rounded-full">3d 14h left</span>
        </div>
        <p className="text-sm font-bold text-white mb-1">£25 Gunwharf Quays Voucher</p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Every completed quest earns one entry. More kindness, better odds.
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-700/40 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-amber-400">142</div>
            <div className="text-[10px] text-gray-500 uppercase mt-0.5">Entries</div>
          </div>
          <div className="bg-gray-700/40 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-[#34D1BF]">{userPoints > 0 ? Math.floor(userPoints / 20) : 3}</div>
            <div className="text-[10px] text-gray-500 uppercase mt-0.5">Yours</div>
          </div>
          <div className="bg-gray-700/40 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-white">1 in 47</div>
            <div className="text-[10px] text-gray-500 uppercase mt-0.5">Your odds</div>
          </div>
        </div>
      </div>

      {/* Podium */}
      {top3.length >= 3 && (
        <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-4 mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5">This week</p>
          <div className="flex items-end justify-center gap-3">
            {/* 2nd */}
            <div className="flex-1 flex flex-col items-center">
              <Avatar index={1} />
              <p className="text-xs font-bold text-white mt-2 mb-1 truncate w-full text-center">{top3[1].username || 'User'}</p>
              <p className="text-[11px] text-gray-400 mb-2">{top3[1].points} pts</p>
              <div className="w-full h-16 bg-gray-700/50 border border-gray-600/40 rounded-t-xl flex items-center justify-center">
                <span className="text-sm font-black text-gray-300">2nd</span>
              </div>
            </div>
            {/* 1st */}
            <div className="flex-1 flex flex-col items-center">
              <Avatar index={2} large />
              <p className="text-xs font-bold text-white mt-2 mb-1 truncate w-full text-center">{top3[0].username || 'User'}</p>
              <p className="text-[11px] text-amber-400 font-semibold mb-2">{top3[0].points} pts</p>
              <div className="w-full h-24 bg-amber-500/10 border border-amber-500/30 rounded-t-xl flex items-center justify-center">
                <span className="text-sm font-black text-amber-400">1st</span>
              </div>
            </div>
            {/* 3rd */}
            <div className="flex-1 flex flex-col items-center">
              <Avatar index={3} />
              <p className="text-xs font-bold text-white mt-2 mb-1 truncate w-full text-center">{top3[2].username || 'User'}</p>
              <p className="text-[11px] text-gray-400 mb-2">{top3[2].points} pts</p>
              <div className="w-full h-12 bg-gray-700/30 border border-gray-600/30 rounded-t-xl flex items-center justify-center">
                <span className="text-sm font-black text-gray-500">3rd</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Your rank */}
      {userRank && (
        <div className="bg-[#34D1BF]/10 border border-[#34D1BF]/20 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#34D1BF]/20 flex items-center justify-center">
            <Star size={18} className="text-[#34D1BF]" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">You are ranked #{userRank}</div>
            <div className="text-xs text-gray-400">{userPoints} kindness points</div>
          </div>
          <div className="flex items-center gap-1 text-[#34D1BF] text-xs font-bold">
            <TrendingUp size={12} /> Rising
          </div>
        </div>
      )}

      {/* Rankings */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-700">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rankings</p>
        </div>
        <div className="divide-y divide-gray-700/50">
          {rest.map((entry, i) => (
            <div key={entry.id} className="px-4 py-3 flex items-center gap-3">
              <div className="w-6 text-center text-sm font-bold text-gray-500">{i + 4}</div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${AVATAR_BG[(i + 3) % AVATAR_BG.length]}`}>
                <User size={16} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{entry.username || 'Anonymous'}</div>
                <div className="text-[11px] text-gray-500">{Math.floor(entry.points / 20)} quests completed</div>
              </div>
              <div className="text-sm font-bold text-amber-400">{entry.points} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
