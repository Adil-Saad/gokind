'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  let title = 'GoKind';
  if (pathname === '/browse') title = 'Discover';
  if (pathname === '/map') title = 'Kindness Pulse';
  if (pathname === '/post') title = 'Create Quest';
  if (pathname === '/profile') title = 'Profile';

  return (
    <header className="sticky top-0 w-full bg-[#0A1628]/90 backdrop-blur-md border-b border-gray-800 z-50 pt-safe">
      <div className="flex justify-between items-center h-14 px-4">
        <h1 className="text-xl font-bold text-white tracking-wide">
          {title}
        </h1>
        <button className="text-gray-300 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#34D1BF] rounded-full ring-2 ring-[#0A1628]"></span>
        </button>
      </div>
    </header>
  );
}
