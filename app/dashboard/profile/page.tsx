// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useUser } from "@/app/context/UserContext";
// import { Camera, Save, User, Mail, Phone, MapPin, Briefcase, Calendar, Loader2 } from "lucide-react";

// export default function ProfilePage() {
//   const { user, refreshUser } = useUser(); // Using global context for initial data
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
  
//   // Local state for editing
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     department: "",
//     position: "",
//   });

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Sync state with user data when it loads
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         phone: user.phone || "", // Ensure your User type in context has these fields
//         address: user.address || "",
//         department: user.department || "",
//         position: user.position || ""
//       });
//     }
//   }, [user]);

//   // Handle Text Update
//   const handleSaveProfile = async () => {
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch("/api/auth/profile", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
      
//       if (res.ok) {
//         setMessage("Profile updated successfully!");
//         refreshUser(); // Updates the Topbar immediately
//       } else {
//         setMessage(data.message || "Failed to update");
//       }
//     } catch (error) {
//       setMessage("Error updating profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Avatar Upload
//   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const uploadData = new FormData();
//     uploadData.append("avatar", file);

//     try {
//       // Optimistic UI update could go here
//       const res = await fetch("/api/auth/profile/avatar", {
//         method: "POST",
//         body: uploadData,
//       });
      
//       if (res.ok) {
//         refreshUser(); // Reloads user to get new image URL
//       }
//     } catch (error) {
//       alert("Failed to upload image");
//     }
//   };

//   if (!user) return <div className="p-10">Loading Profile...</div>;

//   return (
//     <div className="p-8 max-w-5xl mx-auto">
      
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

//       {/* 1. Header Card (Image + Basic Info) */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center gap-8 mb-6">
        
//         {/* Avatar Section */}
//         <div className="relative group">
//           <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
//             <img 
//               src={user.profilePicture || "https://i.pravatar.cc/150?u=default"} 
//               alt="Avatar" 
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <button 
//             onClick={() => fileInputRef.current?.click()}
//             className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
//           >
//             <Camera size={18} />
//           </button>
//           <input 
//             type="file" 
//             ref={fileInputRef} 
//             className="hidden" 
//             accept="image/*"
//             onChange={handleAvatarChange}
//           />
//         </div>

//         {/* Name Section */}
//         <div className="text-center md:text-left flex-1">
//           <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
//           <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
//             <Mail size={14} /> {user.email}
//           </p>
//           <div className="mt-3 flex gap-2 justify-center md:justify-start">
//             <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
//               {user.role}
//             </span>
//             <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
//               {user.status || 'Active'}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* 2. Edit Form */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//           <h3 className="font-bold text-gray-700 flex items-center gap-2">
//             <User size={18} /> Personal Details
//           </h3>
//         </div>
        
//         <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
//           <div className="space-y-1">
//             <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
//             <input 
//               type="text" 
//               value={formData.name} 
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//               className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
//             />
//           </div>

//           <div className="space-y-1">
//             <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
//             <div className="relative">
//                <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
//                <input 
//                  type="text" 
//                  value={formData.phone} 
//                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                  className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
//                  placeholder="+1 234 567 890"
//                />
//             </div>
//           </div>

//           <div className="space-y-1 md:col-span-2">
//             <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
//             <div className="relative">
//                <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
//                <input 
//                  type="text" 
//                  value={formData.address} 
//                  onChange={(e) => setFormData({...formData, address: e.target.value})}
//                  className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
//                  placeholder="123 Street Name, City, Country"
//                />
//             </div>
//           </div>

//           <div className="space-y-1">
//             <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
//             <div className="relative">
//                <Briefcase className="absolute left-3 top-3 text-gray-400" size={16} />
//                <input 
//                  type="text" 
//                  value={formData.department} 
//                  onChange={(e) => setFormData({...formData, department: e.target.value})}
//                  className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
//                />
//             </div>
//           </div>

//           <div className="space-y-1">
//             <label className="text-xs font-bold text-gray-500 uppercase">Position</label>
//             <input 
//               type="text" 
//               value={formData.position} 
//               onChange={(e) => setFormData({...formData, position: e.target.value})}
//               className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
//             />
//           </div>

//         </div>

//         <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-between items-center">
//            {message ? <span className="text-green-600 font-bold text-sm animate-pulse">{message}</span> : <span></span>}
           
//            <button 
//              onClick={handleSaveProfile}
//              disabled={loading}
//              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all"
//            >
//              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
//              Save Changes
//            </button>
//         </div>
//       </div>
//     </div>
//   );
// } 























// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@/app/context/UserContext";
// import {
//   User, Mail, Phone, MapPin, Briefcase, Calendar, Shield,
//   Camera, Edit2, Save, X, Key, Download, Trash2, Loader2,
//   CheckCircle, AlertCircle
// } from "lucide-react";

// export default function ProfilePage() {
//   const router = useRouter();
//   const { user, refreshUser } = useUser(); // Use Global User Context

//   // Local State
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [imageUploading, setImageUploading] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     department: "",
//     position: "",
//   });

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // 1. SYNC STATE: Load user data when available
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         phone: user.phone || "",
//         address: user.address || "",
//         department: user.department || "",
//         position: user.position || ""
//       });
//     }
//   }, [user]);

//   // 2. SAVE PROFILE: Update text fields
//   const handleSave = async () => {
//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const res = await fetch("/api/auth/profile", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage({ type: "success", text: "Profile updated successfully!" });
//         await refreshUser(); // Update Context immediately
//         setIsEditing(false);
//       } else {
//         setMessage({ type: "error", text: data.message || "Failed to update profile" });
//       }
//     } catch (error) {
//       setMessage({ type: "error", text: "Something went wrong. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 3. UPLOAD AVATAR
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validation
//     if (file.size > 5 * 1024 * 1024) {
//       alert("File size too large (Max 5MB)");
//       return;
//     }

//     setImageUploading(true);
//     const uploadData = new FormData();
//     uploadData.append("avatar", file);

//     try {
//       const res = await fetch("/api/auth/profile/avatar", {
//         method: "POST",
//         body: uploadData,
//       });

//       if (res.ok) {
//         await refreshUser(); // Refresh to show new image
//       } else {
//         alert("Failed to upload image");
//       }
//     } catch (error) {
//       console.error("Upload error", error);
//     } finally {
//       setImageUploading(false);
//     }
//   };

//   // 4. DOWNLOAD DATA (Mock Functionality)
//   const handleDownloadData = () => {
//     if(!user) return;
//     const dataStr = JSON.stringify(user, null, 2);
//     const blob = new Blob([dataStr], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `profile-${user._id}.json`;
//     link.click();
//   };

//   // Helper: Format Date
//   const formatDate = (date?: string) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
//   };

//   // Loading State
//   if (!user) {
//     return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-8 h-8"/></div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto space-y-6">
        
//         {/* --- FEEDBACK MESSAGE --- */}
//         {message.text && (
//           <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
//             {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
//             <span>{message.text}</span>
//           </div>
//         )}

//         {/* --- SECTION 1: HEADER CARD (Image + Basic Info) --- */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
//           <div className="flex flex-col md:flex-row items-center gap-8">
            
//             {/* Avatar */}
//             <div className="relative group">
//               <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
//                 <img 
//                   src={user.profilePicture || "https://i.pravatar.cc/150?u=default"} 
//                   alt="Profile" 
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
//                 {imageUploading ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
//                 <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} />
//               </label>
//             </div>

//             {/* Basic Details */}
//             <div className="flex-1 text-center md:text-left">
//               <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
//               <p className="text-gray-500 mt-1">{user.email}</p>
//               <div className="flex gap-2 mt-3 justify-center md:justify-start">
//                 <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase">{user.role}</span>
//                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
//               </div>
//             </div>

//             {/* Edit / Save Buttons */}
//             <div className="flex gap-2">
//               {!isEditing ? (
//                 <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
//                   <Edit2 size={18} /> Edit Profile
//                 </button>
//               ) : (
//                 <div className="flex gap-2">
//                   <button onClick={() => setIsEditing(false)} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">Cancel</button>
//                   <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
//                     {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} Save
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* --- SECTION 2: PERSONAL INFORMATION --- */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
//             <User className="text-blue-600" size={20} /> Personal Information
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
//               <input 
//                 type="text" 
//                 value={formData.name} 
//                 onChange={(e) => setFormData({...formData, name: e.target.value})}
//                 disabled={!isEditing}
//                 className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
//               <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed">
//                 <Mail size={16} /> {user.email}
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-3.5 text-gray-400"><Phone size={16}/></span>
//                 <input 
//                   type="text" 
//                   value={formData.phone} 
//                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                   disabled={!isEditing}
//                   placeholder="+1 234 567 890"
//                   className={`w-full pl-10 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
//                 />
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-3.5 text-gray-400"><MapPin size={16}/></span>
//                 <input 
//                   type="text" 
//                   value={formData.address} 
//                   onChange={(e) => setFormData({...formData, address: e.target.value})}
//                   disabled={!isEditing}
//                   placeholder="City, Country"
//                   className={`w-full pl-10 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
//                 />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* --- SECTION 3: PROFESSIONAL INFORMATION --- */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
//             <Briefcase className="text-blue-600" size={20} /> Professional Information
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
//               <input 
//                 type="text" 
//                 value={formData.department} 
//                 onChange={(e) => setFormData({...formData, department: e.target.value})}
//                 disabled={!isEditing}
//                 placeholder="e.g. Engineering"
//                 className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Position</label>
//               <input 
//                 type="text" 
//                 value={formData.position} 
//                 onChange={(e) => setFormData({...formData, position: e.target.value})}
//                 disabled={!isEditing}
//                 placeholder="e.g. Senior Developer"
//                 className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Date of Joining</label>
//               <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
//                 <Calendar size={16} /> {formatDate(user.dateOfJoining)}
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Employee ID</label>
//               <div className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-mono">
//                 {user._id.substring(0, 8).toUpperCase()}
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* --- SECTION 4: ACCOUNT INFORMATION --- */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
//             <Shield className="text-blue-600" size={20} /> Account Information
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
//               <div className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 capitalize">
//                 {user.role}
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Account Status</label>
//               <div className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 capitalize">
//                 {user.status}
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Last Login</label>
//               <div className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
//                 {formatDate(user.lastLogin)}
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Member Since</label>
//               <div className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
//                 {formatDate(user.createdAt)}
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* --- SECTION 5: QUICK ACTIONS --- */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
//             <button onClick={() => router.push('/dashboard/settings')} className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
//               <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
//                 <Key size={24} />
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 group-hover:text-blue-700">Change Password</h4>
//                 <p className="text-xs text-gray-500">Update your security</p>
//               </div>
//             </button>

//             <button onClick={handleDownloadData} className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all text-left">
//               <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-200 transition-colors">
//                 <Download size={24} />
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 group-hover:text-green-700">Download Data</h4>
//                 <p className="text-xs text-gray-500">Export profile JSON</p>
//               </div>
//             </button>

//             <button onClick={() => alert("Delete functionality pending")} className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all text-left">
//               <div className="bg-red-100 p-3 rounded-lg text-red-600 group-hover:bg-red-200 transition-colors">
//                 <Trash2 size={24} />
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 group-hover:text-red-700">Delete Account</h4>
//                 <p className="text-xs text-gray-500">Permanently remove</p>
//               </div>
//             </button>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// } 



























// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@/app/context/UserContext";
// import {
//   User, Mail, Phone, MapPin, Briefcase, Calendar, Shield,
//   Camera, Edit2, Save, X, Key, Download, Trash2, Loader2,
//   CheckCircle, AlertCircle
// } from "lucide-react";

// export default function ProfilePage() {
//   const router = useRouter();
//   const { user, refreshUser } = useUser(); // Using Global User Context

//   // --- Local State ---
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [imageUploading, setImageUploading] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // --- Form Data State ---
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     department: "",
//     position: "",
//   });

//   // 1. SYNC: Load user data into form when page loads
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         phone: user.phone || "",
//         address: user.address || "",
//         department: user.department || "",
//         position: user.position || ""
//       });
//     }
//   }, [user]);

//   // 2. ACTION: Save Profile (Text Data)
//   const handleSaveProfile = async () => {
//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const res = await fetch("/api/auth/profile", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage({ type: "success", text: "Profile updated successfully!" });
//         await refreshUser(); // Update the global context immediately
//         setIsEditing(false);
//       } else {
//         setMessage({ type: "error", text: data.message || "Failed to update profile" });
//       }
//     } catch (error) {
//       setMessage({ type: "error", text: "Something went wrong. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 3. ACTION: Upload Avatar
//   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       alert("File size too large (Max 5MB)");
//       return;
//     }

//     setImageUploading(true);
//     const uploadData = new FormData();
//     uploadData.append("avatar", file);

//     try {
//       const res = await fetch("/api/auth/profile/avatar", {
//         method: "POST",
//         body: uploadData,
//       });

//       if (res.ok) {
//         await refreshUser(); // Refresh to show new image
//       } else {
//         alert("Failed to upload image");
//       }
//     } catch (error) {
//       console.error("Upload error", error);
//     } finally {
//       setImageUploading(false);
//     }
//   };

//   // Helper: Format Dates
//   const formatDate = (date?: string) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
//   };

//   if (!user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-8 h-8"/></div>;

//   return (
//     // <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//     //   <div className="max-w-6xl mx-auto space-y-6">

//     <div className="h-full overflow-y-auto bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto space-y-6 pb-10"> {/* Added pb-10 for bottom spacing */}
        
//         {/* Feedback Message */}
//         {message.text && (
//           <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
//             {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
//             <span>{message.text}</span>
//           </div>
//         )}

//         {/* =========================================
//             HEADER SECTION: Avatar & Basic Info 
//            ========================================= */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex flex-col md:flex-row items-center gap-6">
            
//             {/* Avatar */}
//             <div className="relative group">
//               <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
//                 <img 
//                   src={user.profilePicture || "https://i.pravatar.cc/150?u=default"} 
//                   alt="Profile" 
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
//                 {imageUploading ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
//                 <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={imageUploading} />
//               </label>
//             </div>

//             {/* Name & Role */}
//             <div className="flex-1 text-center md:text-left">
//               <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
//               <p className="text-gray-500">{user.email}</p>
//               <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
//                 <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold uppercase">{user.role}</span>
//                 <span className={`bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold uppercase`}>{user.status}</span>
//               </div>
//             </div>

//             {/* Edit/Save Toggle */}
//             <div>
//               {!isEditing ? (
//                 <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
//                   <Edit2 size={16} /> Edit Profile
//                 </button>
//               ) : (
//                 <div className="flex gap-2">
//                   <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
//                     <X size={16} /> Cancel
//                   </button>
//                   <button onClick={handleSaveProfile} disabled={loading} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
//                     {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />} Save Changes
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* =========================================
//             SECTION 1: PERSONAL INFORMATION 
//            ========================================= */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <User className="text-blue-500" size={20}/> Personal Information
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-3.5 text-gray-400"><User size={16}/></span>
//                 <input 
//                   type="text" 
//                   value={formData.name} 
//                   onChange={(e) => setFormData({...formData, name: e.target.value})} 
//                   disabled={!isEditing}
//                   className={`w-full pl-10 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
//                 />
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
//               <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed">
//                 <Mail size={16}/> {user.email}
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-3.5 text-gray-400"><Phone size={16}/></span>
//                 <input 
//                   type="text" 
//                   value={formData.phone} 
//                   onChange={(e) => setFormData({...formData, phone: e.target.value})} 
//                   disabled={!isEditing}
//                   placeholder="+1 234 567 890"
//                   className={`w-full pl-10 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
//                 />
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-3.5 text-gray-400"><MapPin size={16}/></span>
//                 <input 
//                   type="text" 
//                   value={formData.address} 
//                   onChange={(e) => setFormData({...formData, address: e.target.value})} 
//                   disabled={!isEditing}
//                   placeholder="City, Country"
//                   className={`w-full pl-10 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
//                 />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* =========================================
//             SECTION 2: PROFESSIONAL INFORMATION 
//            ========================================= */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Briefcase className="text-blue-500" size={20}/> Professional Information
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
//               <input 
//                 type="text" 
//                 value={formData.department} 
//                 onChange={(e) => setFormData({...formData, department: e.target.value})} 
//                 disabled={!isEditing}
//                 placeholder="e.g. Sales"
//                 className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Position</label>
//               <input 
//                 type="text" 
//                 value={formData.position} 
//                 onChange={(e) => setFormData({...formData, position: e.target.value})} 
//                 disabled={!isEditing}
//                 placeholder="e.g. Manager"
//                 className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Date of Joining</label>
//               <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm flex items-center gap-2">
//                 <Calendar size={16} /> {formatDate(user.dateOfJoining)}
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Employee ID</label>
//               <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-mono text-sm">
//                 {user._id.substring(0, 8).toUpperCase()}
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* =========================================
//             SECTION 3: ACCOUNT INFORMATION 
//            ========================================= */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Shield className="text-blue-500" size={20}/> Account Information
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
//               <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm capitalize">
//                 {user.role}
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Account Status</label>
//               <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm capitalize">
//                 {user.status}
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Last Login</label>
//               <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
//                 {formatDate(user.lastLogin)}
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-xs font-bold text-gray-500 uppercase">Member Since</label>
//               <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
//                 {formatDate(user.createdAt)}
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* =========================================
//             SECTION 4: QUICK ACTIONS 
//            ========================================= */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
//             {/* Change Password */}
//             <button onClick={() => router.push('/dashboard/settings')} className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all text-left">
//               <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
//                 <Key size={24}/>
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 group-hover:text-blue-700">Change Password</h4>
//                 <p className="text-xs text-gray-500">Update security creds</p>
//               </div>
//             </button>

//             {/* Download Data */}
//             <button className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-green-300 transition-all text-left">
//               <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-200 transition-colors">
//                 <Download size={24}/>
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 group-hover:text-green-700">Download Data</h4>
//                 <p className="text-xs text-gray-500">Export profile JSON</p>
//               </div>
//             </button>

//             {/* Delete Account */}
//             <button onClick={() => alert("Delete functionality pending")} className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-red-300 transition-all text-left">
//               <div className="bg-red-100 p-3 rounded-lg text-red-600 group-hover:bg-red-200 transition-colors">
//                 <Trash2 size={24}/>
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 group-hover:text-red-700">Delete Account</h4>
//                 <p className="text-xs text-gray-500">Permanently remove</p>
//               </div>
//             </button>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// } 


































"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import {
  User, Mail, Phone, MapPin, Briefcase, Calendar, Shield,
  Camera, Edit2, Save, X, Key, Download, Trash2, Loader2,
  CheckCircle, AlertCircle, Lock,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser, logout } = useUser();

  // Local State
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageUploading, setImageUploading] = useState(false);
  
  // Password Modal State
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" });
  const [passLoading, setPassLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "", phone: "", address: "", department: "", position: "",
  });

  // Sync Data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        department: user.department || "",
        position: user.position || ""
      });
    }
  }, [user]);

  // --- ACTIONS ---

  // 1. Save Profile Text
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        await refreshUser();
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Update failed." });
    } finally {
      setLoading(false);
    }
  };

  // 2. Upload Avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("File too large"); return; }

    setImageUploading(true);
    const uploadData = new FormData();
    uploadData.append("avatar", file);

    try {
      const res = await fetch("/api/auth/profile/avatar", { method: "POST", body: uploadData });
      if (res.ok) await refreshUser();
    } catch (error) { alert("Upload failed"); }
    finally { setImageUploading(false); }
  };

  // 3. Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.new !== passForm.confirm) {
        alert("New passwords do not match!");
        return;
    }
    setPassLoading(true);
    try {
        const res = await fetch("/api/auth/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword: passForm.current, newPassword: passForm.new })
        });
        const data = await res.json();
        if (res.ok) {
            alert("Password updated! Please login again.");
            setIsPassModalOpen(false);
            setPassForm({ current: "", new: "", confirm: "" });
            logout(); // Force logout for security
        } else {
            alert(data.message || "Failed to update password");
        }
    } catch (err) {
        alert("Something went wrong");
    } finally {
        setPassLoading(false);
    }
  };

  // 4. Delete Account
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure? This action is PERMANENT and cannot be undone.");
    if (!confirmDelete) return;

    const secondConfirm = window.confirm("Please confirm again. Do you really want to delete your account?");
    if (!secondConfirm) return;

    try {
        const res = await fetch("/api/auth/profile", { method: "DELETE" });
        if (res.ok) {
            alert("Account deleted.");
            router.push("/auth/login");
        } else {
            alert("Failed to delete account.");
        }
    } catch (err) {
        alert("Error deleting account.");
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (!user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-8 h-8"/></div>;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6 relative">
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        
        {/* Feedback */}
        {message.text && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}



      <div className="flex justify-left mt-10">
          <Link
          href="/dashboard"
          className="inline-flex text-sm  items-center gap-2  text-blue-700 hover:text-blue-800 mb-6">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

      </div>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                <img src={user.profilePicture || "https://i.pravatar.cc/150?u=default"} alt="Profile" className="w-full h-full object-cover"/>
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
                {imageUploading ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={imageUploading} />
              </label>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold uppercase">{user.role}</span>
                <span className={`bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold uppercase`}>{user.status}</span>
              </div>
            </div>
            <div>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <Edit2 size={16} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"><X size={16} /> Cancel</button>
                  <button onClick={handleSaveProfile} disabled={loading} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">{loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />} Save</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><User className="text-blue-500" size={20}/> Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" value={formData.name} onChange={(v:string) => setFormData({...formData, name: v})} disabled={!isEditing} icon={<User size={16}/>} />
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"><Mail size={16}/> {user.email}</div>
            </div>
            <InputField label="Phone Number" value={formData.phone} onChange={(v:string) => setFormData({...formData, phone: v})} disabled={!isEditing} icon={<Phone size={16}/>} />
            <InputField label="Address" value={formData.address} onChange={(v:string) => setFormData({...formData, address: v})} disabled={!isEditing} icon={<MapPin size={16}/>} />
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Briefcase className="text-blue-500" size={20}/> Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Department" value={formData.department} onChange={(v:string) => setFormData({...formData, department: v})} disabled={!isEditing} />
            <InputField label="Position" value={formData.position} onChange={(v:string) => setFormData({...formData, position: v})} disabled={!isEditing} />
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Date of Joining</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm flex items-center gap-2"><Calendar size={16} /> {formatDate(user.dateOfJoining)}</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Employee ID</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-mono text-sm">{user._id.substring(0, 8).toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Shield className="text-blue-500" size={20}/> Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Role</label><div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm capitalize">{user.role}</div></div>
            <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Account Status</label><div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm capitalize">{user.status}</div></div>
            <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Last Login</label><div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">{formatDate(user.lastLogin)}</div></div>
            <div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Member Since</label><div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">{formatDate(user.createdAt)}</div></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Change Password Button -> Opens Modal */}
            <button onClick={() => setIsPassModalOpen(true)} className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors"><Key size={24}/></div>
              <div><h4 className="font-bold text-gray-900 group-hover:text-blue-700">Change Password</h4><p className="text-xs text-gray-500">Update security creds</p></div>
            </button>

            {/* Download Data Button */}
            <button onClick={() => {
                const dataStr = JSON.stringify(user, null, 2);
                const blob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `profile-${user._id}.json`;
                link.click();
            }} className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all text-left">
              <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-200 transition-colors"><Download size={24}/></div>
              <div><h4 className="font-bold text-gray-900 group-hover:text-green-700">Download Data</h4><p className="text-xs text-gray-500">Export profile JSON</p></div>
            </button>

            {/* Delete Account Button */}
            <button onClick={handleDeleteAccount} className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all text-left">
              <div className="bg-red-100 p-3 rounded-lg text-red-600 group-hover:bg-red-200 transition-colors"><Trash2 size={24}/></div>
              <div><h4 className="font-bold text-gray-900 group-hover:text-red-700">Delete Account</h4><p className="text-xs text-gray-500">Permanently remove</p></div>
            </button>
          </div>
        </div>
      </div>

      {/* --- PASSWORD CHANGE MODAL --- */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><Lock size={18} className="text-blue-600"/> Change Password</h3>
                    <button onClick={() => setIsPassModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>
                <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Password</label>
                        <input type="password" required className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none" 
                            value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                        <input type="password" required minLength={6} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none" 
                            value={passForm.new} onChange={e => setPassForm({...passForm, new: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm New Password</label>
                        <input type="password" required minLength={6} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none" 
                            value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} />
                    </div>
                    <div className="pt-2 flex gap-3">
                        <button type="button" onClick={() => setIsPassModalOpen(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={passLoading} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50">
                            {passLoading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}

// Helper Component for inputs
function InputField({ label, value, onChange, disabled, icon }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-3.5 text-gray-400">{icon}</span>}
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          disabled={disabled}
          className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${icon ? 'pl-10' : ''} ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
        />
      </div>
    </div>
  );
}