// ══════════════════════════════════════════════════════════════
// FILE: app/dashboard/agent/page.tsx  
// PURPOSE: Dashboard for external travel agents / partners
// ══════════════════════════════════════════════════════════════

"use client";

import { useUser } from "@/app/context/UserContext";
import { Plane } from "lucide-react";

export default function AgentDashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200">
          <Plane size={28} className="text-white"/>
        </div>
        <h1 className="text-2xl font-black text-slate-800">
          Welcome, <span className="text-blue-600">{user?.name ?? "Agent"}</span>
        </h1>
        <p className="text-slate-500 text-sm max-w-sm">
          Your agent portal is being set up. Your trips and leads will appear here.
        </p>
      </div>
    </div>
  );
}