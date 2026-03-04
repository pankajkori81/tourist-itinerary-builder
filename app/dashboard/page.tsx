
// import React from 'react'

// const page = () => {
//   return (
//     <div>
      
//       this is Dashboard page 
//     </div>
//   )
// }

// export default page 













"use client";

import { useUser } from "@/app/context/UserContext";
import { 
  Users, 
  Map, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Activity 
} from "lucide-react";

export default function DashboardPage() {
  const userData = useUser();

  const stats = [
    { label: "Total Trips", value: "24", icon: Map, color: "bg-blue-500" },
    { label: "Active Travelers", value: "142", icon: Users, color: "bg-green-500" },
    { label: "Upcoming Events", value: "8", icon: Calendar, color: "bg-purple-500" },
    { label: "Revenue", value: "$45k", icon: DollarSign, color: "bg-yellow-500" },
  ];

  return (
    <div className="p-8">
      {/* 1. Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
         Welcome back, {userData?.user?.name || 'Admin'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here is what's happening with your travel agency today.
        </p>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity size={20} className="text-blue-600" />
            Recent Activity
          </h2>
          <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                JD
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New trip created by <span className="font-bold">John Doe</span></p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
