import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  async function signOut() {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
  }

  return (
    <div className="flex flex-col items-center p-6 text-white h-[calc(100vh-120px)]">
      <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 flex items-center justify-center text-3xl font-bold">
        {user?.email?.charAt(0).toUpperCase() ?? 'U'}
      </div>
      <h2 className="text-2xl font-bold mb-2">{user?.email}</h2>
      <p className="text-[#34D1BF] mb-8">150 Kindness Points</p>

      <form action={signOut}>
        <button className="border border-red-500 text-red-500 rounded-md px-6 py-2 hover:bg-red-500 hover:text-white transition-colors">
          Log Out
        </button>
      </form>
    </div>
  );
}
