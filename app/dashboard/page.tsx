

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import { Loader2, Plane } from 'lucide-react';

export default function DashboardRouterPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // 1. Wait for the user context to load
    if (!user) return;

    // 2. The Ultimate Traffic Cop: Send everyone to their dedicated folders!
    if (user.role === 'admin') {
      router.replace('/dashboard/admin');
    } else if (user.role === 'agent') {
      router.replace('/dashboard/agent'); 
    } else {
      // Default fallback for employees
      router.replace('/dashboard/employee');
    }
  }, [user, router]);


  return (
  

    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200">
              <Plane className="text-white animate-pulse" size={28} />
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              Loading your dashboard...
            </div>
          </div>
        </div>
  );
}