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
































// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Mail, Lock, Loader2, LogIn, Briefcase, Eye, EyeOff} from "lucide-react";
// import { useUser } from "@/app/context/UserContext"; 

// export default function LoginPage() {
//   const router = useRouter();
//   const { refreshUser } = useUser(); 
  
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

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

//       // if (res.ok) {
//       //   // 1. Refresh Context (Fetch user profile immediately)
//       //   await refreshUser(); 
        
//       //   // 2. Smooth Redirect (SPA style)
//       //   router.push("/dashboard"); 
//       // } 
//       if (res.ok) {
//         // 1. Refresh Context (Fetch user profile immediately)
//         await refreshUser(); 
        
//         // 2. THE TRAFFIC COP: Route based on role
//         if (data.user.role === "admin") {
//           router.push("/dashboard/admin"); // Admin goes to specific Admin home
//         } else {
//           router.push("/dashboard"); // Agents and Employees go to standard dashboard
//         }
        
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
      
//       {/* Background Ambience */}
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
//                 type={showPassword ? "text" : "password"} 
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 className="w-full pl-10 pr-12 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
//                 placeholder="••••••••"
//                 required 
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors focus:outline-none"
//                 tabIndex={-1} // Prevents "tabbing" to the icon instead of the submit button
//               >
//                 {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
//               </button>
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

//         {/* 👇 UPDATED FOOTER SECTION 👇 */}
//        <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-5">
          
//           {/* Forgot Password Link */}
//           <div>
//             <Link href="/auth/forgot-password" className="text-sm text-gray-400 hover:text-blue-400 font-medium hover:underline transition-all">
//               Forgot your password?
//             </Link>
//           </div>

//           {/* New Agent Link */}
//           <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
//              <p className="text-xs text-purple-200 mb-1 font-medium">Are you a Travel Agent?</p>
//              <Link href="/auth/register-agent" className="text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 hover:underline">
//                 <Briefcase size={14} /> Register as Partner
//              </Link>
//           </div>
//         </div>
//         {/* 👆 END UPDATED SECTION 👆 */}

//       </div>
//     </div>
//   );
// } 


















// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { signIn } from "next-auth/react";
// import { Mail, Lock, Loader2, LogIn, Briefcase, Eye, EyeOff } from "lucide-react";
// import { useUser } from "@/app/context/UserContext"; 

// export default function LoginPage() {
//   const router = useRouter();
//   const { refreshUser } = useUser(); 
  
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
  
//   // Loading states for different buttons
//   const [loadingCreds, setLoadingCreds] = useState(false);
//   const [loadingGoogle, setLoadingGoogle] = useState(false);
//   const [loadingApple, setLoadingApple] = useState(false);
//   const [error, setError] = useState("");


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoadingCreds(true);
//     setError("");

//     try {
//       // 1. Sign in with NextAuth
//       const res = await signIn("credentials", {
//         redirect: false, // We handle the redirect manually so we can show errors
//         email,
//         password,
//       });

//       if (res?.error) {
//         setError(res.error);
//         setLoadingCreds(false); // Stop spinning on wrong password
//       } else if (res?.ok) {
        
//         // 2. We successfully logged in! Now, quickly fetch the profile to check their role.
//         const profileRes = await fetch("/api/auth/profile");
//         const profileJson = await profileRes.json();

//         // 3. The Traffic Cop: Redirect based on role using a HARD redirect
//         const userRole = profileJson?.data?.role || "agent";

//         if (userRole === "admin" || userRole === "employee") {
//           window.location.href = "/dashboard/admin";
//         } else {
//           window.location.href = "/dashboard";
//         }
        
//         // Notice we don't do setLoadingCreds(false) here, 
//         // because we want the spinner to keep spinning while the browser changes pages!
//       }
//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//       setLoadingCreds(false);
//     }
//   };



//   const handleGoogleLogin = () => {
//     setLoadingGoogle(true);
//     // NextAuth automatically redirects to Google and brings them back to /dashboard
//     signIn("google", { callbackUrl: "/dashboard" });
//   };

//   const handleAppleLogin = () => {
//     setLoadingApple(true);
//     // Placeholder for when you configure Apple in [...nextauth]/route.ts
//     signIn("apple", { callbackUrl: "/dashboard" });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      
//       {/* Background Ambience */}
//       <div className="absolute inset-0 opacity-30 pointer-events-none" 
//            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
//       </div>
//       <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none" />

//       {/* Login Card */}
//       <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl mx-4 my-8">
        
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

//         {/* 👇 NEW OAUTH SECTION 👇 */}
//         <div className="space-y-3 mb-6">
//           <button 
//             onClick={handleGoogleLogin}
//             disabled={loadingGoogle || loadingCreds || loadingApple}
//             className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 hover:bg-gray-50 font-bold py-2.5 rounded-lg shadow-sm border border-gray-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
//           >
//             {loadingGoogle ? <Loader2 className="animate-spin text-gray-500" size={18}/> : (
//               <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//               </svg>
//             )}
//             Continue with Google
//           </button>

//           <button 
//             onClick={handleAppleLogin}
//             disabled={loadingApple || loadingCreds || loadingGoogle}
//             className="w-full flex items-center justify-center gap-3 bg-black text-white hover:bg-gray-900 font-bold py-2.5 rounded-lg shadow-sm border border-gray-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
//           >
//             {loadingApple ? <Loader2 className="animate-spin text-gray-400" size={18}/> : (
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M16.365 1.43c0 2.083-1.615 3.845-3.4 3.737-0.088-2.004 1.706-3.832 3.4-3.737zM11.603 5.41c-1.393 0.05-2.88 0.89-3.612 0.89-0.75 0-2.006-0.816-3.176-0.793-1.524 0.022-2.924 0.885-3.714 2.26-1.597 2.766-0.407 6.85 1.144 9.096 0.76 1.106 1.656 2.33 2.84 2.288 1.135-0.043 1.57-0.732 2.946-0.732 1.365 0 1.774 0.732 2.956 0.71 1.214-0.023 1.986-1.118 2.734-2.213 0.865-1.264 1.223-2.49 1.242-2.553-0.026-0.012-2.394-0.92-2.42-3.66-0.022-2.3 1.88-3.407 1.97-3.46-1.077-1.572-2.738-1.786-3.33-1.834z"/>
//               </svg>
//             )}
//             Continue with Apple
//           </button>
//         </div>

//         {/* Divider */}
//         <div className="relative flex items-center py-2 mb-6">
//           <div className="flex-grow border-t border-white/10"></div>
//           <span className="flex-shrink-0 mx-4 text-gray-500 text-[10px] font-black uppercase tracking-wider">Or sign in with email</span>
//           <div className="flex-grow border-t border-white/10"></div>
//         </div>
        
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
//                 type={showPassword ? "text" : "password"} 
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 className="w-full pl-10 pr-12 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
//                 placeholder="••••••••"
//                 required 
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors focus:outline-none"
//                 tabIndex={-1} 
//               >
//                 {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
//               </button>
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loadingCreds || loadingGoogle || loadingApple} 
//             className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {loadingCreds ? <Loader2 className="animate-spin" size={18}/> : <LogIn size={18}/>} 
//             {loadingCreds ? "Verifying..." : "Sign In"}
//           </button>
//         </form>

//        <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-5">
//           <div>
//             <Link href="/auth/forgot-password" className="text-sm text-gray-400 hover:text-blue-400 font-medium hover:underline transition-all">
//               Forgot your password?
//             </Link>
//           </div>

//           <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
//              <p className="text-xs text-purple-200 mb-1 font-medium">Are you a Travel Agent?</p>
//              <Link href="/auth/register-agent" className="text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 hover:underline">
//                 <Briefcase size={14} /> Register as Partner
//              </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
















"use client";

import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, Lock, Loader2, LogIn, Briefcase, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useUser } from "@/app/context/UserContext";

// ── Friendly error messages (no raw NextAuth strings shown to user) ──
const AUTH_ERRORS: Record<string, string> = {
  AccessDenied          : "Access denied. Your account may be suspended or not yet registered.",
  CredentialsSignin     : "Incorrect email or password. Please try again.",
  OAuthSignin           : "Google sign-in failed. Please try again.",
  OAuthCallback         : "Google authentication error. Please try again.",
  OAuthAccountNotLinked : "This email is already registered. Please sign in with email & password.",
  SessionRequired       : "Your session expired. Please sign in again.",
  "No user found"       : "No account found with this email address.",
  "Wrong password"      : "Incorrect password. Please try again.",
  "No user found with this email" : "No account found with this email address.",
  "Incorrect password. Please try again." : "Incorrect password. Please try again.",
  "Your account has been suspended. Contact support." : "Your account has been suspended. Please contact support.",
  Default               : "Something went wrong. Please try again.",
};

const getFriendlyError = (raw: string): string => {
  if (!raw) return "";
  // Direct key match
  if (AUTH_ERRORS[raw]) return AUTH_ERRORS[raw];
  // Partial match for longer thrown error strings
  for (const key of Object.keys(AUTH_ERRORS)) {
    if (raw.toLowerCase().includes(key.toLowerCase())) return AUTH_ERRORS[key];
  }
  return AUTH_ERRORS.Default;
};

export default function LoginPage() {
  const router  = useRouter();
  const { refreshUser } = useUser();

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPassword,setShowPassword]= useState(false);

  // const [loadingCreds,  setLoadingCreds]  = useState(false);
  // const [loadingGoogle, setLoadingGoogle] = useState(false);
  // const [loadingApple,  setLoadingApple]  = useState(false);
  // const [error,         setError]         = useState("");


  const [loadingCreds,  setLoadingCreds]  = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingApple,  setLoadingApple]  = useState(false);
  const [error,         setError]         = useState("");

  // 👇 NEW: Read the URL for errors on initial load
  // (Make sure this is at the top of your file if not already imported!)
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      if (urlError) {
        setError(getFriendlyError(urlError));
      }
    }
  }, []);

  // 👇 NEW: Silently erase the error from the UI and the URL
  const clearErrorAndUrl = () => {
    if (error) {
      setError(""); 
      if (typeof window !== "undefined") {
        // This removes "?error=AccessDenied" from the address bar without reloading the page
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  };

  // ── Credentials Login ──────────────────────────────────────────────────────

  // ── Credentials Login ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCreds(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        // ✅ Map raw error to friendly message
        setError(getFriendlyError(res.error));
        setLoadingCreds(false);
      } else if (res?.ok) {
        // Fetch profile to get role, then redirect
        const profileRes  = await fetch("/api/auth/profile");
        const profileJson = await profileRes.json();
        const userRole    = profileJson?.data?.role || "agent";

        // if (userRole === "admin" || userRole === "employee") {
        //   window.location.href = "/dashboard/admin";
        // } else {
        //   window.location.href = "/dashboard";
        // }
        // Keep spinner running during page transition

        // REPLACE WITH this (3 separate destinations):
if (userRole === "admin") {
  window.location.href = "/dashboard/admin";        // admin goes here
} else if (userRole === "employee") {
  window.location.href = "/dashboard/employee";     // employee goes here
} else {
  window.location.href = "/dashboard/agent";        // agent goes here
}
      }
    } catch (err) {
      setError(AUTH_ERRORS.Default);
      setLoadingCreds(false);
    }
  };

  // ── Google Login ───────────────────────────────────────────────────────────
  const handleGoogleLogin = () => {
    setLoadingGoogle(true);
    setError("");
    signIn("google", { callbackUrl: "/dashboard" });
  };

  // ── Apple Login (placeholder) ──────────────────────────────────────────────
  const handleAppleLogin = () => {
    setLoadingApple(true);
    setError("");
    signIn("apple", { callbackUrl: "/dashboard" });
  };

  const anyLoading = loadingCreds || loadingGoogle || loadingApple;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">

      {/* Background image */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl mx-4 my-8">

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-4 shadow-lg shadow-blue-900/20">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to access Travdek Dashboard</p>
        </div>

        {/* ── ERROR BANNER ── */}
        {error && (
          <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl text-sm font-medium animate-in fade-in">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── OAuth Buttons ── */}
        <div className="space-y-3 mb-6">

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={anyLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 hover:bg-gray-50 font-bold py-2.5 rounded-lg shadow-sm border border-gray-200 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingGoogle ? (
              <Loader2 className="animate-spin text-gray-500" size={18} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Apple */}
          <button
            onClick={handleAppleLogin}
            disabled={anyLoading}
            className="w-full flex items-center justify-center gap-3 bg-black text-white hover:bg-gray-900 font-bold py-2.5 rounded-lg shadow-sm border border-gray-700 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingApple ? (
              <Loader2 className="animate-spin text-gray-400" size={18} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.365 1.43c0 2.083-1.615 3.845-3.4 3.737-0.088-2.004 1.706-3.832 3.4-3.737zM11.603 5.41c-1.393 0.05-2.88 0.89-3.612 0.89-0.75 0-2.006-0.816-3.176-0.793-1.524 0.022-2.924 0.885-3.714 2.26-1.597 2.766-0.407 6.85 1.144 9.096 0.76 1.106 1.656 2.33 2.84 2.288 1.135-0.043 1.57-0.732 2.946-0.732 1.365 0 1.774 0.732 2.956 0.71 1.214-0.023 1.986-1.118 2.734-2.213 0.865-1.264 1.223-2.49 1.242-2.553-0.026-0.012-2.394-0.92-2.42-3.66-0.022-2.3 1.88-3.407 1.97-3.46-1.077-1.572-2.738-1.786-3.33-1.834z"/>
              </svg>
            )}
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-white/10" />
          <span className="flex-shrink-0 mx-4 text-gray-500 text-[10px] font-black uppercase tracking-wider">
            Or sign in with email
          </span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        {/* ── Credentials Form ── */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="email"
                value={email}
                // onChange={e => setEmail(e.target.value)}
                onChange={e => {
                  setEmail(e.target.value);
                  clearErrorAndUrl(); 
                }}
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                placeholder="name@travdek.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
               onChange={e => {
                  setPassword(e.target.value);
                  clearErrorAndUrl(); 
                }}
                className="w-full pl-10 pr-12 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={anyLoading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loadingCreds
              ? <><Loader2 className="animate-spin" size={18}/> Verifying...</>
              : <><LogIn size={18}/> Sign In</>
            }
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-5">
          <div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-400 hover:text-blue-400 font-medium hover:underline transition-all"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
            <p className="text-xs text-purple-200 mb-1 font-medium">Are you a Travel Agent?</p>
            <Link
              href="/auth/register-agent"
              className="text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 hover:underline"
            >
              <Briefcase size={14} /> Register as Partner
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}