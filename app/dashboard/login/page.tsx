// "use client";

// import React from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// import { ShieldCheck, User } from 'lucide-react';
// import Image from 'next/image';

// export default function LoginPage() {
//   const { login } = useAuth();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      
//       {/* Background Ambience */}
//       <div className="absolute inset-0 opacity-20 pointer-events-none" 
//            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
//       </div>
      
//       {/* Login Card */}
//       <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        
//         {/* Logo Placeholder */}
//         <div className="mb-8 flex justify-center">
//            {/* Replace with your actual Logo if available */}
//            <div className="text-3xl font-black text-white tracking-wider flex items-center gap-2">
//               <span className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">T</span>
//               TRAVDEK
//            </div>
//         </div>

//         <h2 className="text-xl font-bold text-gray-200 mb-6">Select Access Level</h2>

//         <div className="space-y-4">
          
//           {/* Admin Button */}
//           <button 
//             onClick={() => login('admin')}
//             className="group w-full p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all border border-blue-500/30 flex items-center justify-between"
//           >
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-blue-200 group-hover:bg-white/20 transition-colors">
//                 <ShieldCheck size={24} />
//               </div>
//               <div className="text-left">
//                 <div className="text-white font-bold text-lg">Admin / Manager</div>
//                 <div className="text-blue-200 text-xs">Full Access (Costing & Pricing)</div>
//               </div>
//             </div>
//             <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]"></div>
//           </button>

//           {/* Employee Button */}
//           <button 
//             onClick={() => login('employee')}
//             className="group w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 flex items-center justify-between"
//           >
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors">
//                 <User size={24} />
//               </div>
//               <div className="text-left">
//                 <div className="text-gray-200 font-bold text-lg">Employee / Staff</div>
//                 <div className="text-gray-400 text-xs">Restricted (Logistics Only)</div>
//               </div>
//             </div>
//           </button>

//         </div>

//         <p className="mt-8 text-xs text-gray-500">
//           Secure Mock Authentication System v1.0
//         </p>

//       </div>
//     </div>
//   );
// }