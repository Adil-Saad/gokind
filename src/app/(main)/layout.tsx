import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#0A1628]">
      <Header />
      <main className="flex-1 overflow-y-auto pb-16 relative">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
