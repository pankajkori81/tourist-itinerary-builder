// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Mail, Lock, Loader2, LogIn } from "lucide-react";
// import { useUser } from "@/app/context/UserContext"; // <--- Import Context

// export default function LoginPage() {
//   const router = useRouter();
//   const { refreshUser } = useUser(); // <--- Get the refresh function
  
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // 1. Refresh Context (Fetch user profile immediately)
//         await refreshUser(); 
        
//         // 2. Smooth Redirect (SPA style)
//         router.push("/dashboard"); 
//       } else {
//         setError(data.message);
//         setLoading(false);
//       }
//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      
//       {/* Background Ambience (Matches your Design) */}
//       <div className="absolute inset-0 opacity-30 pointer-events-none" 
//            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
//       </div>
//       <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none" />

//       {/* Login Card */}
//       <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl mx-4">
        
//         <div className="text-center mb-8">
//            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-4 shadow-lg shadow-blue-900/20">
//               <span className="text-white font-bold text-2xl">T</span>
//            </div>
//            <h1 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h1>
//            <p className="text-gray-400 text-sm mt-1">Sign in to access Travdek Dashboard</p>
//         </div>

//         {error && (
//           <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs text-center font-medium animate-in fade-in">
//             {error}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="space-y-1">
//             <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
//             <div className="relative group">
//               <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18}/>
//               <input 
//                 type="email" 
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
//                 className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
//                 placeholder="name@travdek.com"
//                 required 
//               />
//             </div>
//           </div>

//           <div className="space-y-1">
//             <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
//             <div className="relative group">
//               <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18}/>
//               <input 
//                 type="password" 
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
//                 placeholder="••••••••"
//                 required 
//               />
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading} 
//             className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {loading ? <Loader2 className="animate-spin" size={18}/> : <LogIn size={18}/>} 
//             {loading ? "Verifying..." : "Sign In"}
//           </button>
//         </form>

//         <div className="mt-8 text-center text-sm text-gray-400">
//           No account? <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all">Register here</Link>
//         </div>
//       </div>
//     </div>
//   );
// } 
































"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, LogIn, Briefcase } from "lucide-react";
import { useUser } from "@/app/context/UserContext"; 

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useUser(); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 1. Refresh Context (Fetch user profile immediately)
        await refreshUser(); 
        
        // 2. Smooth Redirect (SPA style)
        router.push("/dashboard"); 
      } else {
        setError(data.message);
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl mx-4">
        
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-4 shadow-lg shadow-blue-900/20">
              <span className="text-white font-bold text-2xl">T</span>
           </div>
           <h1 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h1>
           <p className="text-gray-400 text-sm mt-1">Sign in to access Travdek Dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs text-center font-medium animate-in fade-in">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18}/>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                placeholder="name@travdek.com"
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18}/>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18}/> : <LogIn size={18}/>} 
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        {/* 👇 UPDATED FOOTER SECTION 👇 */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">
          <div className="text-sm text-gray-400">
            Internal Employee? <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all">Create Staff Account</Link>
          </div>

          {/* New Agent Link */}
          <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
             <p className="text-xs text-purple-200 mb-1 font-medium">Are you a Travel Agent?</p>
             <Link href="/auth/register-agent" className="text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 hover:underline">
                <Briefcase size={14} /> Register as Partner
             </Link>
          </div>
        </div>
        {/* 👆 END UPDATED SECTION 👆 */}

      </div>
    </div>
  );
}