'use client';

import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';

export function DashboardHeader() {
  const { data: user } = useCurrentUser();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        {user && <p className="text-sm text-slate-500">{user.email}</p>}
      </div>
      <button
        onClick={handleLogout}
        className="rounded-md border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 hover:bg-slate-50"
      >
        Log Out
      </button>
    </div>
  );
}