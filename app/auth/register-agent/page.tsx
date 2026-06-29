"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Loader2, Building2, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function AgentRegisterPage() {
  const router = useRouter();
  
  // 1. New Field: agencyName
  const [formData, setFormData] = useState({ name: "", email: "", password: "", agencyName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // 2. Success State for "Pending" logic
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // 3. Connect to the NEW Agent API
      const res = await fetch("/api/auth/register-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (res.ok) {
        // 4. Show Success Card instead of redirecting
        setIsSuccess(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1671730323729-b493da943448?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-[#0f172a]/40 pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-white/4 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl mx-4">
        
        {/* === SUCCESS STATE === */}
        {isSuccess ? (
          <div className="text-center py-8 animate-in fade-in zoom-in-95">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-6 border border-green-500/30">
                <CheckCircle2 size={32} />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Application Received</h2>
             <p className="text-gray-300 text-sm leading-relaxed mb-6">
               Thank you for partnering with Travdek! <br/>
               Your agency account is currently <strong>under review</strong>. You will receive an email once an Admin approves your access.
             </p>
             <Link 
               href="/auth/login" 
               className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
             >
                <ArrowLeft size={16}/> Return to Login
             </Link>
          </div>
        ) : (

        /* === REGISTRATION FORM === */
        <>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600 mb-4 shadow-lg shadow-purple-900/20">
                <Building2 className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Agency Partner</h1>
            <p className="text-gray-400 text-sm mt-1">Register to access B2B pricing & tools</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs text-center font-medium animate-in fade-in">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* New Agency Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Travel Agency Name</label>
              <div className="relative group">
                <Building2 className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18}/>
                <input 
                  type="text" 
                  value={formData.agencyName} 
                  onChange={(e)=>setFormData({...formData, agencyName: e.target.value})} 
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  placeholder="e.g. World Travel Co."
                  required 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Agent Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18}/>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e)=>setFormData({...formData, name: e.target.value})} 
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  placeholder="Your Full Name"
                  required 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Business Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18}/>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e)=>setFormData({...formData, email: e.target.value})} 
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  placeholder="agent@company.com"
                  required 
                />
              </div>
            </div>

            {/* <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18}/>
                <input 
                  type="password" 
                  value={formData.password} 
                  onChange={(e)=>setFormData({...formData, password: e.target.value})} 
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  placeholder="••••••••"
                  required 
                  minLength={6}
                />
              </div>
            </div> */}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18}/>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password} 
                  onChange={(e)=>setFormData({...formData, password: e.target.value})} 
                  className="w-full pl-10 pr-12 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  placeholder="••••••••"
                  required 
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                 {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : "Submit Application"} 
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Already have a partner account? <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-all">Agent Login</Link>
          </div>
        </>
        )}

      </div>
    </div>
  );
}