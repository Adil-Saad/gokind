'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import { MapPin, Clock, X, Check } from 'lucide-react';

export interface Quest {
  id: string;
  title: string;
  description: string;
  distance: string;
  time: string;
  reward: string;
}

interface QuestCardGalleryProps {
  initialQuests: Quest[];
}

function SwipeCard({
  quest,
  onSwipe,
  isTop,
}: {
  quest: Quest;
  onSwipe: (dir: 'left' | 'right') => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Overlay indicators
  const acceptOpacity = useTransform(x, [0, 80], [0, 1]);
  const rejectOpacity = useTransform(x, [-80, 0], [1, 0]);

  function handleDragEnd(_: any, info: PanInfo) {
    if (info.offset.x > 100) {
      animate(x, 500, { duration: 0.3 });
      setTimeout(() => onSwipe('right'), 300);
    } else if (info.offset.x < -100) {
      animate(x, -500, { duration: 0.3 });
      setTimeout(() => onSwipe('left'), 300);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
    }
  }

  return (
    <motion.div
      className="absolute top-0 w-full h-full cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-full bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col select-none relative">
        {/* Swipe overlay indicators */}
        <motion.div
          className="absolute inset-0 bg-green-500/10 border-4 border-green-500 rounded-3xl z-20 flex items-center justify-center pointer-events-none"
          style={{ opacity: acceptOpacity }}
        >
          <span className="text-green-400 text-4xl font-black tracking-wider rotate-[-15deg] border-4 border-green-400 rounded-lg px-4 py-2">
            ACCEPT
          </span>
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-red-500/10 border-4 border-red-500 rounded-3xl z-20 flex items-center justify-center pointer-events-none"
          style={{ opacity: rejectOpacity }}
        >
          <span className="text-red-400 text-4xl font-black tracking-wider rotate-[15deg] border-4 border-red-400 rounded-lg px-4 py-2">
            SKIP
          </span>
        </motion.div>

        {/* Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-[#34D1BF]/20 to-[#0A1628]/80 w-full flex items-center justify-center">
          <MapPin size={48} className="text-[#34D1BF] opacity-50" />
        </div>

        {/* Card Content */}
        <div className="p-6 flex flex-col flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">{quest.title}</h2>
          <p className="text-sm text-gray-400 mb-6 line-clamp-3 leading-relaxed flex-1">
            {quest.description}
          </p>

          <div className="flex justify-between items-center text-sm font-medium border-t border-gray-700 pt-4">
            <div className="flex items-center text-gray-300 bg-gray-900 rounded-full px-3 py-1">
              <MapPin size={14} className="mr-1 text-[#34D1BF]" />
              {quest.distance}
            </div>
            <div className="flex items-center text-gray-300 bg-gray-900 rounded-full px-3 py-1">
              <Clock size={14} className="mr-1 text-[#34D1BF]" />
              {quest.time}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function QuestCardGallery({ initialQuests }: QuestCardGalleryProps) {
  const [quests, setQuests] = useState(initialQuests);

  const handleSwipe = (questId: string, direction: 'left' | 'right') => {
    console.log('Swiped', direction, 'on quest', questId);
    setQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  if (quests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-96 border-2 border-dashed border-gray-700 rounded-3xl bg-gray-900 shadow-xl w-full max-w-sm mx-auto">
        <h3 className="text-xl font-bold text-white mb-2">You&apos;re all caught up!</h3>
        <p className="text-gray-400 text-center">Check back later for new quests in your area.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <div className="relative w-full h-[28rem]">
        {quests.map((quest, index) => (
          <SwipeCard
            key={quest.id}
            quest={quest}
            isTop={index === quests.length - 1}
            onSwipe={(dir) => handleSwipe(quest.id, dir)}
          />
        ))}
      </div>

      {/* Manual Swipe Buttons */}
      <div className="flex items-center justify-center space-x-8 mt-8">
        <button
          onClick={() => handleSwipe(quests[quests.length - 1]?.id, 'left')}
          className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
        >
          <X size={32} />
        </button>
        <button
          onClick={() => handleSwipe(quests[quests.length - 1]?.id, 'right')}
          className="w-16 h-16 bg-[#34D1BF]/20 border border-[#34D1BF]/50 rounded-full flex items-center justify-center text-[#34D1BF] hover:bg-[#34D1BF] hover:text-[#0A1628] transition-colors shadow-lg"
        >
          <Check size={32} />
        </button>
      </div>
      <p className="text-gray-500 text-xs mt-6 uppercase tracking-wider font-semibold">
        Swipe ← Skip &nbsp;|&nbsp; Swipe → Accept
      </p>
    </div>
  );
}
