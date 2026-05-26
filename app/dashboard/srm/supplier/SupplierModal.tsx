

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { 
//   X, Wallet, Landmark, FileText, Upload, Trash2, Eye, 
//   Briefcase, FolderOpen 
// } from "lucide-react";
// import { SupplierData, saveSupplier, SupplierDoc } from "@/utils/srmStorage";

// interface SupplierModalProps {
//   initialData: SupplierData | null;
//   onClose: () => void;
//   onSave: () => void;
// }

// export default function SupplierModal({ initialData, onClose, onSave }: SupplierModalProps) {
//   const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'documents'>('overview');
//   const [docCategory, setDocCategory] = useState<'general' | 'trip'>('general');
//   const [tripRefInput, setTripRefInput] = useState(''); 

//   // REFS
//   const fileInputRef = useRef<HTMLInputElement>(null); 
//   const docInputRef = useRef<HTMLInputElement>(null);  

//   // Initialize State
//   const [formData, setFormData] = useState<Partial<SupplierData>>({
//     name: '', 
//     services: [], 
//     status: 'Active', 
//     paymentTerms: 'Prepaid', 
//     country: 'India', 
//     city: '',
//     isPreferred: false, 
//     rating: 0, 
//     documents: [], 
//     logoUrl: '',
//     contactPerson: '',
//     email: '',
//     phone: '',
//     website: '',
//     currency: 'INR',
//     bankDetails: { bankName: '', accountNumber: '', ifscCode: '', accountName: '' },
//     taxRegistered: false,
//     taxNumber: ''
//   });

//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     }
//   }, [initialData]);

//   const availableServices = ['Stay', 'Transport', 'Activity', 'Meal'];

//   // --- HANDLERS ---

//   const toggleService = (svc: string) => {
//     setFormData(prev => ({
//         ...prev, 
//         services: prev.services?.includes(svc) 
//           ? prev.services.filter(s => s !== svc) 
//           : [...(prev.services||[]), svc]
//     }));
//   };

//   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if(file) {
//         const reader = new FileReader();
//         reader.onloadend = () => setFormData(prev => ({...prev, logoUrl: reader.result as string}));
//         reader.readAsDataURL(file);
//     }
//   };

//   // --- DOCUMENT UPLOAD ---
//   const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     if (docCategory === 'trip' && !tripRefInput.trim()) {
//         alert("Please enter a Trip Name/Reference before uploading contracts.");
//         if (docInputRef.current) docInputRef.current.value = ''; 
//         return;
//     }

//     Array.from(files).forEach(file => {
//         const reader = new FileReader();
        
//         reader.onload = (loadEvent) => {
//             const base64Url = loadEvent.target?.result as string;
            
//             const newDoc: SupplierDoc = {
//                 id: Date.now().toString() + Math.random(),
//                 name: file.name,
//                 url: base64Url, 
//                 type: docCategory, 
//                 tripRef: docCategory === 'trip' ? tripRefInput : undefined
//             };

//             setFormData(prev => ({
//                 ...prev,
//                 documents: [...(prev.documents || []), newDoc]
//             }));
//         };

//         reader.readAsDataURL(file); 
//     });
    
//     if (docInputRef.current) docInputRef.current.value = '';
//   };

//   // --- NEW: VIEW DOCUMENT HANDLER (Fixes the blank page issue) ---
//   const handleViewDoc = (docUrl: string) => {
//     // 1. If it's a normal web URL, just open it
//     if (!docUrl.startsWith('data:')) {
//         window.open(docUrl, '_blank');
//         return;
//     }

//     // 2. If it's Base64, convert to Blob to ensure PDF opens
//     try {
//         // Split metadata from data
//         const [header, data] = docUrl.split(',');
//         const mimeMatch = header.match(/:(.*?);/);
//         const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

//         // Decode Base64
//         const byteCharacters = atob(data);
//         const byteNumbers = new Array(byteCharacters.length);
//         for (let i = 0; i < byteCharacters.length; i++) {
//             byteNumbers[i] = byteCharacters.charCodeAt(i);
//         }
//         const byteArray = new Uint8Array(byteNumbers);

//         // Create Blob and Object URL
//         const blob = new Blob([byteArray], { type: mimeType });
//         const blobUrl = URL.createObjectURL(blob);

//         // Open in new tab
//         window.open(blobUrl, '_blank');
        
//         // Optional: Clean up URL after a delay (browser handles this, but good practice)
//         // setTimeout(() => URL.revokeObjectURL(blobUrl), 1000); 

//     } catch (error) {
//         console.error("Error opening document:", error);
//         alert("Could not open document. It might be corrupted.");
//     }
//   };

//   const removeDoc = (docId: string) => {
//      setFormData(prev => ({
//          ...prev,
//          documents: prev.documents?.filter(d => d.id !== docId)
//      }));
//   };

//   const updateBankDetails = (field: string, value: string) => {
//     setFormData(prev => ({
//         ...prev,
//         bankDetails: { ...prev.bankDetails!, [field]: value }
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if(!formData.name || !formData.services?.length) {
//       alert("Please enter Company Name and select at least one Service.");
//       return;
//     }
    
//     const supplierToSave = { 
//         ...formData, 
//         updatedAt: new Date().toISOString() 
//     } as SupplierData;

//     if(!initialData) supplierToSave.createdAt = new Date().toISOString();

//     saveSupplier(supplierToSave);
//     onSave();
//   };

//   // Filter Logic
//   const filteredDocs = formData.documents?.filter(d => {
//       if (docCategory === 'general') {
//           return d.type === 'general' || !d.type;
//       } else {
//           return d.type === 'trip';
//       }
//   }) || [];


//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//       <div className="bg-white ml-10 mt-25 rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
//         {/* Modal Header */}
//         <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//             <div>
//                <h2 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Supplier' : 'New Supplier'}</h2>
//                <p className="text-xs text-gray-500">Add or update vendor details.</p>
//             </div>
//             <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
//                <X size={20} className="text-gray-400 hover:text-red-500"/>
//             </button>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-200 px-6 bg-white">
//             {['overview', 'financials', 'documents'].map(tab => (
//                 <button key={tab} onClick={() => setActiveTab(tab as any)} 
//                     className={`px-4 py-3 text-sm font-medium border-b-2 capitalize transition-colors ${activeTab === tab ? 'border-[#0a1f44] text-[#0a1f44]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
//                     {tab}
//                 </button>
//             ))}
//         </div>

//         {/* Scrollable Content */}
//         <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 bg-gray-50/20">
            
//             {/* --- TAB 1: OVERVIEW --- */}
//             {activeTab === 'overview' && (
//                 <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2">
//                     <div className="col-span-3">
//                         <div onClick={() => fileInputRef.current?.click()} 
//                              className="h-32 w-35 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center transition-colors bg-white"
//                              style={{backgroundImage: `url(${formData.logoUrl})`}}>
//                              {!formData.logoUrl && (
//                                 <div className="text-center p-2">
//                                    <Upload size={20} className="text-gray-400 mx-auto mb-1"/>
//                                    <span className="text-xs text-gray-400 font-medium">Upload Logo</span>
//                                 </div>
//                              )}
//                         </div>
//                         <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleLogoUpload} />
//                         <div className="mt-4 flex items-center gap-2 p-2 bg-yellow-50 rounded border border-yellow-100">
//                             <input type="checkbox" checked={formData.isPreferred} onChange={e => setFormData({...formData, isPreferred: e.target.checked})} className="w-4 h-4 text-yellow-600 rounded cursor-pointer"/>
//                             <label className="text-xs font-bold text-yellow-800">Preferred Partner</label>
//                         </div>
//                     </div>

//                     <div className="col-span-9 space-y-5">
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                <label className="block text-xs font-bold text-gray-600 mb-1">Company Name *</label>
//                                <input className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
//                                       value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="e.g. Royal Travels"/>
//                             </div>
//                             <div>
//                                <label className="block text-xs font-bold text-gray-600 mb-1">Status</label>
//                                <select className="w-full p-2.5 border border-gray-300 rounded-lg bg-white" 
//                                        value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value as any})}>
//                                    <option>Active</option><option>Inactive</option><option>Blacklisted</option>
//                                </select>
//                             </div>
//                         </div>

//                         <div>
//                              <label className="block text-xs font-bold text-gray-600 mb-1">Website</label>
//                              <div className="flex">
//                                 <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
//                                     https://
//                                 </span>
//                                 <input 
//                                     className="w-full p-2.5 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                                     value={formData.website || ''} 
//                                     onChange={e => setFormData({...formData, website: e.target.value})} 
//                                     placeholder="www.supplier-site.com"
//                                 />
//                              </div>
//                         </div>

//                         <div>
//                             <label className="block text-xs font-bold text-gray-600 mb-2">Services Provided *</label>
//                             <div className="flex gap-2 flex-wrap">
//                                {availableServices.map(s => (
//                                 <button type="button" key={s} onClick={() => toggleService(s)} 
//                                         className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all ${formData.services?.includes(s) ? 'bg-[#0a1f44] text-white border-[#0a1f44] shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
//                                     {s}
//                                 </button>
//                                ))}
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div><label className="block text-xs font-bold text-gray-600 mb-1">City</label><input className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})}/></div>
//                             <div><label className="block text-xs font-bold text-gray-600 mb-1">Country</label><input className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.country} onChange={e=>setFormData({...formData, country: e.target.value})}/></div>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div><label className="block text-xs font-bold text-gray-600 mb-1">Contact Person</label><input className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.contactPerson} onChange={e=>setFormData({...formData, contactPerson: e.target.value})}/></div>
//                             <div><label className="block text-xs font-bold text-gray-600 mb-1">Phone</label><input className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})}/></div>
//                             <div className="col-span-2"><label className="block text-xs font-bold text-gray-600 mb-1">Email (Bookings)</label><input className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})}/></div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* --- TAB 2: FINANCIALS --- */}
//             {activeTab === 'financials' && (
//                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
//                     <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
//                         <h3 className="font-bold text-yellow-800 text-sm mb-3 flex items-center gap-2"><Wallet size={16}/> Payment Terms</h3>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-600 mb-1">Terms</label>
//                                 <select className="w-full p-2.5 border border-gray-300 rounded-lg bg-white" value={formData.paymentTerms} onChange={e=>setFormData({...formData, paymentTerms: e.target.value as any})}>
//                                     <option value="Prepaid">Prepaid (100% Advance)</option>
//                                     <option value="Pay at Hotel">Pay at Hotel</option>
//                                     <option value="Credit-7">Credit (7 Days)</option>
//                                     <option value="Credit-15">Credit (15 Days)</option>
//                                     <option value="Credit-30">Credit (30 Days)</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-600 mb-1">Currency</label>
//                                 <select className="w-full p-2.5 border border-gray-300 rounded-lg bg-white" value={formData.currency} onChange={e=>setFormData({...formData, currency: e.target.value})}>
//                                     <option>INR</option><option>USD</option><option>EUR</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white p-5 rounded-xl border border-gray-200">
//                         <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2"><Landmark size={16}/> Bank Details</h3>
//                         <div className="grid grid-cols-2 gap-4">
//                              <input className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Bank Name" value={formData.bankDetails?.bankName} onChange={e => updateBankDetails('bankName', e.target.value)} />
//                              <input className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Account Number" value={formData.bankDetails?.accountNumber} onChange={e => updateBankDetails('accountNumber', e.target.value)} />
//                              <input className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="IFSC / Swift Code" value={formData.bankDetails?.ifscCode} onChange={e => updateBankDetails('ifscCode', e.target.value)} />
//                              <input className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Beneficiary Name" value={formData.bankDetails?.accountName} onChange={e => updateBankDetails('accountName', e.target.value)} />
//                         </div>
//                     </div>

//                     <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
//                         <div className="flex items-center gap-2">
//                             <input 
//                                 type="checkbox" 
//                                 id="taxReg" 
//                                 checked={formData.taxRegistered} 
//                                 onChange={e => setFormData({...formData, taxRegistered: e.target.checked})} 
//                                 className="w-4 h-4 rounded text-blue-600 cursor-pointer"
//                             />
//                             <label htmlFor="taxReg" className="text-sm font-bold text-gray-700 cursor-pointer">Tax Registered (GST/VAT)?</label>
//                         </div>
                        
//                         {formData.taxRegistered && (
//                             <input 
//                                 className="flex-1 p-2 border border-gray-300 rounded-lg text-sm bg-white animate-in fade-in" 
//                                 placeholder="Enter GST/VAT Number" 
//                                 value={formData.taxNumber || ''} 
//                                 onChange={e => setFormData({...formData, taxNumber: e.target.value})}
//                             />
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* --- TAB 3: DOCUMENTS --- */}
//             {activeTab === 'documents' && (
//                 <div className="flex flex-col h-full animate-in fade-in">
                    
//                     {/* 1. DOCUMENT TYPE TOGGLE */}
//                     <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg w-fit">
//                         <button 
//                             type="button"
//                             onClick={() => setDocCategory('general')}
//                             className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${docCategory === 'general' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//                         >
//                             General Documents
//                         </button>
//                         <button 
//                             type="button"
//                             onClick={() => setDocCategory('trip')}
//                             className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${docCategory === 'trip' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//                         >
//                             Trip Contracts
//                         </button>
//                     </div>

//                     {/* 2. TRIP NAME INPUT (Only for Trip Docs) */}
//                     {docCategory === 'trip' && (
//                         <div className="mb-4 animate-in slide-in-from-top-2">
//                             <label className="block text-xs font-bold text-purple-800 mb-1">
//                                 Trip Reference Name <span className="text-red-500">*</span>
//                             </label>
//                             <input 
//                                 type="text"
//                                 placeholder="e.g. Goa Group - Summer 2025" 
//                                 value={tripRefInput}
//                                 onChange={(e) => setTripRefInput(e.target.value)}
//                                 className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none text-sm"
//                             />
//                             <p className="text-[10px] text-gray-400 mt-1">
//                                 Files uploaded below will be tagged with this trip name.
//                             </p>
//                         </div>
//                     )}
                    
//                     {/* 3. UPLOAD AREA */}
//                     <div 
//                         onClick={() => docInputRef.current?.click()}
//                         className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors mb-4 ${docCategory === 'trip' ? 'border-purple-200 bg-purple-50/30' : 'border-gray-300'}`}
//                     >
//                         <input 
//                             ref={docInputRef} 
//                             type="file" 
//                             multiple 
//                             hidden 
//                             accept=".pdf,.jpg,.jpeg,.png"
//                             onChange={handleDocUpload} 
//                         />
//                         {docCategory === 'trip' ? <Briefcase className="text-purple-300 mb-2"/> : <FolderOpen className="text-blue-300 mb-2"/>}
//                         <p className="text-gray-500 font-medium text-sm">
//                             Click to Upload {docCategory === 'trip' ? 'Trip Contract' : 'General Document'}
//                         </p>
//                     </div>

//                     {/* 4. FILE LIST (Filtered) */}
//                     {filteredDocs.length > 0 ? (
//                         <div className="space-y-3">
//                             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
//                                 {docCategory === 'general' ? 'Company Documents' : 'Trip Specific Contracts'} ({filteredDocs.length})
//                             </h4>
                            
//                             {filteredDocs.map((doc, idx) => (
//                                 <div key={doc.id || idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
//                                     <div className="flex items-center gap-3">
//                                         <div className={`p-2 rounded-lg ${doc.type === 'trip' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
//                                             <FileText size={20} />
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-bold text-gray-700 truncate max-w-[250px]">{doc.name}</p>
//                                             {doc.type === 'trip' && (
//                                                 <p className="text-[10px] text-purple-600 font-medium bg-purple-50 w-fit px-1.5 rounded mt-0.5">
//                                                     Ref: {doc.tripRef}
//                                                 </p>
//                                             )}
//                                             {/* CHANGED THIS SECTION TO BUTTON FOR PROPER PDF HANDLING */}
//                                             <button 
//                                                 type="button"
//                                                 onClick={() => handleViewDoc(doc.url)} 
//                                                 className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-0.5 hover:text-blue-700"
//                                             >
//                                                 <Eye size={10} /> View Document
//                                             </button>
//                                         </div>
//                                     </div>
//                                     <button 
//                                         type="button"
//                                         onClick={() => removeDoc(doc.id)} 
//                                         className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                                         title="Remove File"
//                                     >
//                                         <Trash2 size={16} />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-4 text-gray-400 text-xs italic">
//                             No {docCategory} documents found.
//                         </div>
//                     )}
//                 </div>
//             )}
//         </form>

//         <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
//             <button onClick={onClose} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors">Cancel</button>
//             <button onClick={handleSubmit} className="px-5 py-2.5 bg-[#0a1f44] text-white font-medium rounded-lg hover:bg-blue-900 shadow-md transition-colors">
//                 {initialData ? 'Update Supplier' : 'Save Supplier'}
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// } 


































"use client";

import { useState, useRef, useEffect } from "react";
import { 
  X, Wallet, Landmark, FileText, Upload, Trash2, Eye, 
  Briefcase, FolderOpen, Loader2
} from "lucide-react";
import { SupplierData, saveSupplier, SupplierDoc } from "@/utils/srmStorage";

interface SupplierModalProps {
  initialData: SupplierData | null;
  onClose: () => void;
  onSave: () => Promise<void> | void;
}

export default function SupplierModal({ initialData, onClose, onSave }: SupplierModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents'>('overview');
  const [docCategory, setDocCategory] = useState<'general' | 'trip'>('general');
  const [tripRefInput, setTripRefInput] = useState(''); 
  const [isSaving, setIsSaving] = useState(false); // NEW STATE

  // REFS
  const fileInputRef = useRef<HTMLInputElement>(null); 
  const docInputRef = useRef<HTMLInputElement>(null);  

  // Initialize State
  const [formData, setFormData] = useState<Partial<SupplierData>>({
    name: '', 
    services: [], 
    status: 'Active', 
    paymentTerms: 'Prepaid', 
    country: 'India', 
    city: '',
    isPreferred: false, 
    rating: 0, 
    documents: [], 
    logoUrl: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    currency: 'INR',
    bankDetails: { bankName: '', accountNumber: '', ifscCode: '', accountName: '' },
    taxRegistered: false,
    taxNumber: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const availableServices = ['Stay', 'Transport', 'Activity', 'Meal'];

  // --- HANDLERS ---
  const toggleService = (svc: string) => {
    setFormData(prev => ({
        ...prev, 
        services: prev.services?.includes(svc) 
          ? prev.services.filter(s => s !== svc) 
          : [...(prev.services||[]), svc]
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
        const reader = new FileReader();
        reader.onloadend = () => setFormData(prev => ({...prev, logoUrl: reader.result as string}));
        reader.readAsDataURL(file);
    }
  };

  // --- DOCUMENT UPLOAD ---
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (docCategory === 'trip' && !tripRefInput.trim()) {
        alert("Please enter a Trip Name/Reference before uploading contracts.");
        if (docInputRef.current) docInputRef.current.value = ''; 
        return;
    }

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const base64Url = loadEvent.target?.result as string;
            const newDoc: SupplierDoc = {
                id: Date.now().toString() + Math.random(),
                name: file.name,
                url: base64Url, 
                type: docCategory, 
                tripRef: docCategory === 'trip' ? tripRefInput : undefined
            };
            setFormData(prev => ({ ...prev, documents: [...(prev.documents || []), newDoc] }));
        };
        reader.readAsDataURL(file); 
    });
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const handleViewDoc = (docUrl: string) => {
    if (!docUrl.startsWith('data:')) {
        window.open(docUrl, '_blank');
        return;
    }
    try {
        const [header, data] = docUrl.split(',');
        const mimeMatch = header.match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const byteCharacters = atob(data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    } catch (error) {
        alert("Could not open document. It might be corrupted.");
    }
  };

  const removeDoc = (docId: string) => {
     setFormData(prev => ({ ...prev, documents: prev.documents?.filter(d => d.id !== docId) }));
  };

  const updateBankDetails = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, bankDetails: { ...prev.bankDetails!, [field]: value } }));
  };

  // CHANGED: Now Async
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.name || !formData.services?.length) {
      alert("Please enter Company Name and select at least one Service.");
      return;
    }
    
    setIsSaving(true);
    const supplierToSave = { ...formData } as SupplierData;
    
    const success = await saveSupplier(supplierToSave);
    if(success) {
       await onSave();
    } else {
       alert("Failed to save to database");
    }
    setIsSaving(false);
  };

  const filteredDocs = formData.documents?.filter(d => {
      if (docCategory === 'general') return d.type === 'general' || !d.type;
      return d.type === 'trip';
  }) || [];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white ml-10 mt-25 rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
               <h2 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Supplier' : 'New Supplier'}</h2>
               <p className="text-xs text-gray-500">Add or update vendor details.</p>
            </div>
            <button onClick={onClose} disabled={isSaving} className="p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50">
               <X size={20} className="text-gray-400 hover:text-red-500"/>
            </button>
        </div>

        <div className="flex border-b border-gray-200 px-6 bg-white">
            {['overview', 'documents'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} 
                    className={`px-4 py-3 text-sm font-medium border-b-2 capitalize transition-colors ${activeTab === tab ? 'border-[#0a1f44] text-[#0a1f44]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {tab}
                </button>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 bg-gray-50/20">
            
            {activeTab === 'overview' && (
                <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="col-span-3">
                        <div onClick={() => fileInputRef.current?.click()} 
                             className="h-32 w-35 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center transition-colors bg-white"
                             style={{backgroundImage: `url(${formData.logoUrl})`}}>
                             {!formData.logoUrl && (
                                <div className="text-center p-2">
                                   <Upload size={20} className="text-gray-400 mx-auto mb-1"/>
                                   <span className="text-xs text-gray-400 font-medium">Upload Logo</span>
                                </div>
                             )}
                        </div>
                        <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                        <div className="mt-4 flex items-center gap-2 p-2 bg-yellow-50 rounded border border-yellow-100">
                            <input type="checkbox" checked={formData.isPreferred} onChange={e => setFormData({...formData, isPreferred: e.target.checked})} className="w-4 h-4 text-yellow-600 rounded cursor-pointer"/>
                            <label className="text-xs font-bold text-yellow-800">Preferred Partner</label>
                        </div>
                    </div>

                    <div className="col-span-9 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-xs font-bold text-gray-600 mb-1">Company Name *</label>
                               <input className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                      value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="e.g. Royal Travels"/>
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-600 mb-1">Status</label>
                               <select className="w-full p-2.5 border border-gray-300 rounded-lg bg-white" 
                                       value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value as any})}>
                                   <option>Active</option><option>Inactive</option><option>Blacklisted</option>
                               </select>
                            </div>
                        </div>

                        <div>
                             <label className="block text-xs font-bold text-gray-600 mb-1">Website</label>
                             <div className="flex">
                                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                                    https://
                                </span>
                                <input 
                                    className="w-full p-2.5 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.website || ''} 
                                    onChange={e => setFormData({...formData, website: e.target.value})} 
                                    placeholder="www.supplier-site.com"
                                />
                             </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2">Services Provided *</label>
                            <div className="flex gap-2 flex-wrap">
                               {availableServices.map(s => (
                                <button type="button" key={s} onClick={() => toggleService(s)} 
                                        className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all ${formData.services?.includes(s) ? 'bg-[#0a1f44] text-white border-[#0a1f44] shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                                    {s}
                                </button>
                               ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold text-gray-600 mb-1">City</label><input className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})}/></div>
                            <div><label className="block text-xs font-bold text-gray-600 mb-1">Country</label><input className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.country} onChange={e=>setFormData({...formData, country: e.target.value})}/></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold text-gray-600 mb-1">Contact Person</label><input className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.contactPerson} onChange={e=>setFormData({...formData, contactPerson: e.target.value})}/></div>
                            <div><label className="block text-xs font-bold text-gray-600 mb-1">Phone</label><input className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})}/></div>
                            <div className="col-span-2"><label className="block text-xs font-bold text-gray-600 mb-1">Email (Bookings)</label><input className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})}/></div>
                        </div>
                    </div>
                </div>
            )}

    

            {activeTab === 'documents' && (
                <div className="flex flex-col h-full animate-in fade-in">
                    
                    <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg w-fit">
                        <button 
                            type="button"
                            onClick={() => setDocCategory('general')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${docCategory === 'general' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            General Documents
                        </button>
                        <button 
                            type="button"
                            onClick={() => setDocCategory('trip')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${docCategory === 'trip' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Trip Contracts
                        </button>
                    </div>

                    {docCategory === 'trip' && (
                        <div className="mb-4 animate-in slide-in-from-top-2">
                            <label className="block text-xs font-bold text-purple-800 mb-1">
                                Trip Reference Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                placeholder="e.g. Goa Group - Summer 2025" 
                                value={tripRefInput}
                                onChange={(e) => setTripRefInput(e.target.value)}
                                className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none text-sm"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                                Files uploaded below will be tagged with this trip name.
                            </p>
                        </div>
                    )}
                    
                    <div 
                        onClick={() => docInputRef.current?.click()}
                        className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors mb-4 ${docCategory === 'trip' ? 'border-purple-200 bg-purple-50/30' : 'border-gray-300'}`}
                    >
                        <input 
                            ref={docInputRef} 
                            type="file" 
                            multiple 
                            hidden 
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleDocUpload} 
                        />
                        {docCategory === 'trip' ? <Briefcase className="text-purple-300 mb-2"/> : <FolderOpen className="text-blue-300 mb-2"/>}
                        <p className="text-gray-500 font-medium text-sm">
                            Click to Upload {docCategory === 'trip' ? 'Trip Contract' : 'General Document'}
                        </p>
                    </div>

                    {filteredDocs.length > 0 ? (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {docCategory === 'general' ? 'Company Documents' : 'Trip Specific Contracts'} ({filteredDocs.length})
                            </h4>
                            
                            {filteredDocs.map((doc, idx) => (
                                <div key={doc.id || idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${doc.type === 'trip' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-700 truncate max-w-[250px]">{doc.name}</p>
                                            {doc.type === 'trip' && (
                                                <p className="text-[10px] text-purple-600 font-medium bg-purple-50 w-fit px-1.5 rounded mt-0.5">
                                                    Ref: {doc.tripRef}
                                                </p>
                                            )}
                                            <button 
                                                type="button"
                                                onClick={() => handleViewDoc(doc.url)} 
                                                className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-0.5 hover:text-blue-700"
                                            >
                                                <Eye size={10} /> View Document
                                            </button>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => removeDoc(doc.id as string)} 
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove File"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-400 text-xs italic">
                            No {docCategory} documents found.
                        </div>
                    )}
                </div>
            )}
        </form>

        <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} disabled={isSaving} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50">Cancel</button>
            <button onClick={handleSubmit} disabled={isSaving} className="px-5 py-2.5 bg-[#0a1f44] text-white font-medium rounded-lg hover:bg-blue-900 shadow-md transition-colors flex items-center gap-2 disabled:opacity-70">
                {isSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : (initialData ? 'Update Supplier' : 'Save Supplier')}
            </button>
        </div>
      </div>
    </div>
  );
}