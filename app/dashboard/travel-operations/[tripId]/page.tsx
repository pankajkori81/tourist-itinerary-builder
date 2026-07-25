// "use client";

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { ArrowLeft, CheckCircle2, Clock, Hotel, Plane, MapPin, Utensils } from 'lucide-react';

// export default function TripManifestPage() {
//     const params = useParams();
//     const router = useRouter();
//     const [operationData, setOperationData] = useState<any>(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchManifest = async () => {
//             try {
//                 const res = await fetch(`/api/operations/${params.tripId}`);
//                 if (res.ok) {
//                     const data = await res.json();
//                     setOperationData(data);
//                 } else {
//                     alert("Manifest not found.");
//                 }
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchManifest();
//     }, [params.tripId]);

//     if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Operations Manifest...</div>;
//     if (!operationData) return <div className="p-8 text-center text-red-500">Failed to load data.</div>;

//     // Helper to get correct icon
//     const getIcon = (type: string) => {
//         if (type === 'hotel') return <Hotel size={18} className="text-emerald-600" />;
//         if (type === 'flight') return <Plane size={18} className="text-blue-600" />;
//         if (type === 'activity') return <MapPin size={18} className="text-orange-600" />;
//         if (type === 'meal') return <Utensils size={18} className="text-yellow-600" />;
//         return <Clock size={18} className="text-gray-600" />;
//     };

//     return (
//         <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            
//             {/* Header */}
//             <div className="flex justify-between items-center mb-8">
//                 <div>
//                     <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold text-sm mb-3">
//                         <ArrowLeft size={16} /> Back to Trips
//                     </button>
//                     <h1 className="text-3xl font-black text-gray-900 tracking-tight">{operationData.tripName}</h1>
//                     <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-1">Trip ID: {operationData.tripId} • Status: <span className="text-blue-600">{operationData.overallStatus}</span></p>
//                 </div>
//                 <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 hover:bg-indigo-700">
//                     <CheckCircle2 size={18} /> Complete Operations
//                 </button>
//             </div>

//             {/* The Services Table */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <table className="w-full text-left border-collapse">
//                     <thead>
//                         <tr className="bg-gray-100 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-black">
//                             <th className="p-4">Day</th>
//                             <th className="p-4">Service Details</th>
//                             <th className="p-4">Status</th>
//                             <th className="p-4">Conf. Number / PNR</th>
//                             <th className="p-4">Net Cost</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                         {operationData.services.map((service: any, index: number) => (
//                             <tr key={index} className="hover:bg-gray-50 transition-colors">
//                                 <td className="p-4 font-bold text-gray-600 text-sm">Day {service.dayNumber}</td>
                                
//                                 <td className="p-4">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
//                                             {getIcon(service.serviceType)}
//                                         </div>
//                                         <div>
//                                             <div className="font-bold text-gray-900 text-sm">{service.serviceName}</div>
//                                             <div className="text-[10px] uppercase font-bold text-gray-400">{service.serviceType}</div>
//                                         </div>
//                                     </div>
//                                 </td>

//                                 <td className="p-4">
//                                     <select className="border border-gray-300 rounded-md text-xs font-bold p-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 bg-white cursor-pointer">
//                                         <option value="Pending">Pending</option>
//                                         <option value="Requested">Requested</option>
//                                         <option value="Confirmed">Confirmed</option>
//                                         <option value="Cancelled">Cancelled</option>
//                                     </select>
//                                 </td>

//                                 <td className="p-4">
//                                     <input 
//                                         type="text" 
//                                         placeholder="e.g., PNR or Ref#" 
//                                         className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
//                                     />
//                                 </td>

//                                 <td className="p-4">
//                                     <div className="flex items-center gap-1">
//                                         <span className="text-xs font-bold text-gray-400">{service.currency}</span>
//                                         <input 
//                                             type="number" 
//                                             placeholder="0.00" 
//                                             className="border border-gray-300 rounded-md text-sm p-2 w-24 outline-none focus:border-indigo-500 text-right font-mono"
//                                         />
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//         </div>
//     );
// } 






















// "use client";

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { ArrowLeft, CheckCircle2, Clock, Hotel, Plane, MapPin, Utensils, Save } from 'lucide-react';

// export default function TripManifestPage() {
//     const params = useParams();
//     const router = useRouter();
//     const [operationData, setOperationData] = useState<any>(null);
//     const [isLoading, setIsLoading] = useState(true);

//     // Fetch the data
//     useEffect(() => {
//         const fetchManifest = async () => {
//             const res = await fetch(`/api/operations/${params.tripId}`);
//             if (res.ok) setOperationData(await res.json());
//             setIsLoading(false);
//         };
//         fetchManifest();
//     }, [params.tripId]);

//     // Handle updates (Status, PNR, Cost)
//     const updateService = (index: number, field: string, value: any) => {
//         const updatedServices = [...operationData.services];
//         updatedServices[index][field] = value;
//         setOperationData({ ...operationData, services: updatedServices });
//     };

//     // Save changes to MongoDB
//     // const saveManifest = async () => {
//     //     const res = await fetch(`/api/operations/update`, { // You will need to create this route
//     //         method: 'POST',
//     //         body: JSON.stringify({ tripId: params.tripId, services: operationData.services }),
//     //         headers: { 'Content-Type': 'application/json' }
//     //     });
//     //     if (res.ok) alert("Saved successfully!");
//     // };

//     const saveManifest = async () => {
//         // 👇 GUARD CLAUSE: If no data, stop here and don't try to access .services
//         if (!operationData || !operationData.services) {
//             alert("Data is still loading or missing. Please wait.");
//             return;
//         }

//         const res = await fetch(`/api/operations/update`, {
//             method: 'POST',
//             body: JSON.stringify({ tripId: params.tripId, services: operationData.services }),
//             headers: { 'Content-Type': 'application/json' }
//         });
        
//         if (res.ok) alert("Saved successfully!");
//         else alert("Failed to save.");
//     };

//     if (isLoading) return <div>Loading...</div>;

//     function getIcon(serviceType: any): import("react").ReactNode {
//         throw new Error('Function not implemented.');
//     }

//     return (
//         <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
//             <div className="flex justify-between items-center mb-8">
//                 <button onClick={() => router.back()} className="flex items-center gap-2 font-bold text-sm"><ArrowLeft size={16} /> Back</button>
//                 <button onClick={saveManifest} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
//                     <Save size={18} /> Save Changes
//                 </button>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//                 <table className="w-full">
//                     <thead>
//                         <tr className="bg-gray-100 text-xs text-gray-500 font-black uppercase">
//                             <th className="p-4">Day</th>
//                             <th className="p-4">Service</th>
//                             <th className="p-4">Status</th>
//                             <th className="p-4">Conf # / PNR</th>
//                             <th className="p-4">Net Cost</th>
//                         </tr>
//                     </thead>
//                  <tbody className="divide-y divide-gray-100">
//     {/* 👇 Added Optional Chaining here to prevent the crash */}
//     {operationData?.services?.map((service: any, index: number) => (
//         <tr key={index} className="hover:bg-gray-50 transition-colors">
//             <td className="p-4 font-bold text-gray-600 text-sm">Day {service.dayNumber}</td>
            
//             <td className="p-4">
//                 <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
//                         {getIcon(service.serviceType)}
//                     </div>
//                     <div>
//                         <div className="font-bold text-gray-900 text-sm">{service.serviceName}</div>
//                         <div className="text-[10px] uppercase font-bold text-gray-400">{service.serviceType}</div>
//                     </div>
//                 </div>
//             </td>

//             <td className="p-4">
//                 <select 
//                     value={service.status || 'Pending'} 
//                     onChange={(e) => updateService(index, 'status', e.target.value)}
//                     className="border border-gray-300 rounded-md text-xs font-bold p-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 bg-white cursor-pointer"
//                 >
//                     <option value="Pending">Pending</option>
//                     <option value="Requested">Requested</option>
//                     <option value="Confirmed">Confirmed</option>
//                     <option value="Cancelled">Cancelled</option>
//                 </select>
//             </td>

//             <td className="p-4">
//                 <input 
//                     type="text" 
//                     value={service.confirmationNumber || ''}
//                     onChange={(e) => updateService(index, 'confirmationNumber', e.target.value)}
//                     placeholder="e.g., PNR or Ref#" 
//                     className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
//                 />
//             </td>

//             <td className="p-4">
//                 <div className="flex items-center gap-1">
//                     <span className="text-xs font-bold text-gray-400">{service.currency || 'USD'}</span>
//                     <input 
//                         type="number" 
//                         value={service.netCost || 0}
//                         onChange={(e) => updateService(index, 'netCost', e.target.value)}
//                         placeholder="0.00" 
//                         className="border border-gray-300 rounded-md text-sm p-2 w-24 outline-none focus:border-indigo-500 text-right font-mono"
//                     />
//                 </div>
//             </td>
//         </tr>
//     ))}
    
//     {/* Optional: Add a safety fallback if services are empty */}
//     {operationData?.services?.length === 0 && (
//         <tr>
//             <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">
//                 No services found for this trip.
//             </td>
//         </tr>
//     )}
// </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }





// "use client";

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { ArrowLeft, CheckCircle2, Clock, Hotel, Plane, MapPin, Utensils, Save, FileText } from 'lucide-react';
// // import PurchaseOrderModal from '@/components/operations/PurchaseOrderModal';
// import PurchaseOrderModal from '@/components/operations/PurchaseOrderModal';

// export default function TripManifestPage() {
//     const params = useParams();
//     const router = useRouter();
//     const [operationData, setOperationData] = useState<any>(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchManifest = async () => {
//             const res = await fetch(`/api/operations/${params.tripId}`);
//             if (res.ok) setOperationData(await res.json());
//             setIsLoading(false);
//         };
//         fetchManifest();
//     }, [params.tripId]);

//     const updateService = (index: number, field: string, value: any) => {
//         const updatedServices = [...operationData.services];
//         updatedServices[index][field] = value;
//         setOperationData({ ...operationData, services: updatedServices });
//     };

//     const saveManifest = async () => {
//         if (!operationData || !operationData.services) {
//             alert("Data is still loading or missing.");
//             return;
//         }

//         const res = await fetch(`/api/operations/update`, {
//             method: 'POST',
//             body: JSON.stringify({ tripId: params.tripId, services: operationData.services }),
//             headers: { 'Content-Type': 'application/json' }
//         });
        
//         if (res.ok) alert("Saved successfully!");
//         else alert("Failed to save.");
//     };

//     // 🌟 FIX: Actual implementation of getIcon
//     const getIcon = (type: string) => {
//         if (type === 'hotel') return <Hotel size={18} className="text-emerald-600" />;
//         if (type === 'flight') return <Plane size={18} className="text-blue-600" />;
//         if (type === 'activity') return <MapPin size={18} className="text-orange-600" />;
//         if (type === 'meal') return <Utensils size={18} className="text-yellow-600" />;
//         return <Clock size={18} className="text-gray-600" />;
//     };

//     if (isLoading) return <div className="p-8">Loading...</div>;

//     function openPoModal(service: any): void {
//         throw new Error('Function not implemented.');
//     }

//     return (
//         // <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            
//         //     <div className="flex justify-between items-center mb-8">
//         //         <button onClick={() => router.back()} className="flex items-center gap-2 font-bold text-sm text-gray-600 hover:text-black">
//         //             <ArrowLeft size={16} /> Back
//         //         </button>
                
//         //         {/* 🌟 NEW SAVE BUTTON */}
//         //         <button 
//         //             onClick={saveManifest} 
//         //             disabled={isLoading || !operationData}
//         //             className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
//         //                 isLoading || !operationData ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
//         //             } text-white shadow-md`}
//         //         >
//         //             <Save size={18} /> {isLoading ? 'Loading...' : 'Save Changes'}
//         //         </button>
//         //     </div>

//         <div className="relative min-h-screen overflow-hidden">
//         {/* --- Background Layers --- */}
//         <div 
//             className="absolute inset-0 z-0 bg-cover bg-center blur-sm scale-105"
//             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
//         />
//         {/* Dim Blue Overlay */}
//         <div className="absolute inset-0 z-0 bg-gray-900/60 backdrop-blur-sm" />

//         {/* --- Content Layer --- */}
//         <div className="relative z-10 p-8 max-w-7xl mx-auto">
            
//             <div className="flex justify-between items-center mb-8">
//                 <button onClick={() => router.back()} className="flex items-center gap-2 font-bold text-sm text-white hover:text-gray-200">
//                     <ArrowLeft size={16} /> Back
//                 </button>
                
//                 <button 
//                     onClick={saveManifest} 
//                     disabled={isLoading || !operationData}
//                     className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
//                         isLoading || !operationData ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
//                     } text-white shadow-md`}
//                 >
//                     <Save size={18} /> {isLoading ? 'Loading...' : 'Save Changes'}
//                 </button>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <table className="w-full">
//                     <thead>
//                         <tr className="bg-gray-100 text-xs text-gray-500 font-black uppercase">
//                             <th className="p-4">Day</th>
//                             <th className="p-4">Service</th>
//                             <th className="p-4">Status</th>
//                             <th className="p-4">Conf # / PNR</th>
//                             <th className="p-4">Net Cost</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                         {operationData?.services?.map((service: any, index: number) => (
//                             <tr key={index} className="hover:bg-gray-50 transition-colors">
//                                 <td className="p-4 font-bold text-gray-600 text-sm"> Day {service.dayNumber}</td>
                               
                                
//                                 <td className="p-4">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
//                                             {getIcon(service.serviceType)}
                                        
//                                         </div>

//                                         <div>
//                                             <div className="font-bold text-gray-900 text-sm">  {service.serviceName} </div>
                                           
//                                             <div className="text-[10px] uppercase font-bold text-gray-400">{service.serviceType} </div>
                                            
//                                         </div>
//                                     </div>
//                                 </td>

//                                 <td className="p-4">
//                                     <select 
//                                         value={service.status || 'Pending'} 
//                                         onChange={(e) => updateService(index, 'status', e.target.value)}
//                                         className="border border-gray-300 rounded-md text-xs font-bold p-2 outline-none focus:border-indigo-500 text-gray-700 bg-white cursor-pointer"
//                                     >
//                                         <option value="Pending">Pending</option>
//                                         <option value="Requested">Requested</option>
//                                         <option value="Confirmed">Confirmed</option>
//                                         <option value="Cancelled">Cancelled</option>
//                                     </select>
//                                 </td>

//                                 <td className="p-4">
//                                     <input 
//                                         type="text" 
//                                         value={service.confirmationNumber || ''}
//                                         onChange={(e) => updateService(index, 'confirmationNumber', e.target.value)}
//                                         placeholder="e.g., PNR" 
//                                         className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-indigo-500 font-mono"
//                                     />
//                                 </td>

//                                 <td className="p-4">
//                                     <div className="flex items-center gap-1">
//                                         <span className="text-xs font-bold text-gray-400"> {service.currency || 'USD'} </span>
                                        
//                                         <input 
//                                             type="number" 
//                                             value={service.netCost || 0}
//                                             onChange={(e) => updateService(index, 'netCost', e.target.value)}
//                                             className="border border-gray-300 rounded-md text-sm p-2 w-24 outline-none focus:border-indigo-500 text-right font-mono"
//                                         />
//                                     </div>
//                                 </td>
//                                 <td className="py-3 px-4 text-center">
//                                         <button 
//                                             onClick={() => openPoModal(service)}
//                                             className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 mx-auto"
//                                         >
//                                             <FileText size={14} className="text-blue-600"/> Generate PO
//                                         </button>
//                                     </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>

//         {/* 👇 Mount the PO Modal */}
//             <PurchaseOrderModal 
//                 isOpen={isPoModalOpen}
//                 onClose={() => setIsPoModalOpen(false)}
//                 service={selectedServiceForPo}
//                 tripName={operationData?.tripName || 'N/A'}
//                 tripId={operationData?.tripId || 'N/A'}
//             />
//         </div>
//     );
// }













"use client";

import React,{ useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Hotel, Plane, MapPin, Utensils, Save, FileText, Wallet, Link2, Ticket, Loader2 ,User, Calendar, ArrowRight, Briefcase } from 'lucide-react';
import PurchaseOrderModal from '@/components/operations/PurchaseOrderModal';
import ClientVoucherModal from '@/components/operations/ClientVoucherModal';

export default function TripManifestPage() {
    const params = useParams();
    const router = useRouter();
    const [operationData, setOperationData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 👇 FIX 1: Added missing state variables for the PO Modal
    const [isPoModalOpen, setIsPoModalOpen] = useState(false);
    const [selectedServiceForPo, setSelectedServiceForPo] = useState<any>(null);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
 
    useEffect(() => {
        const fetchData = async () => {
            const tripId = await params.tripId;
            
            try {
                // Fetch 1: Get the Trip Data
                const tripRes = await fetch(`/api/operations/${tripId}`);
                if (tripRes.ok) setOperationData(await tripRes.json());

                // 👇 NEW Fetch 2: Get all official Suppliers from your SRM API
                const supplierRes = await fetch(`/api/srm/suppliers`); // Assuming this is your route based on your provided code
                if (supplierRes.ok) {
                    const suppData = await supplierRes.json();
                    setSuppliers(suppData.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [params]);

    const updateService = (index: number, field: string, value: any) => {
        const updatedServices = [...operationData.services];
        updatedServices[index][field] = value;
        setOperationData({ ...operationData, services: updatedServices });
    };

    const saveManifest = async () => {
        if (!operationData || !operationData.services) {
            alert("Data is still loading or missing.");
            return;
        }

        const tripId = await params.tripId;
        const res = await fetch(`/api/operations/update`, {
            method: 'POST',
            body: JSON.stringify({ tripId: tripId, services: operationData.services }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (res.ok) alert("Saved successfully!");
        else alert("Failed to save.");
    };

    const getIcon = (type: string) => {
        if (type === 'hotel') return <Hotel size={18} className="text-emerald-600" />;
        if (type === 'flight') return <Plane size={18} className="text-blue-600" />;
        if (type === 'activity') return <MapPin size={18} className="text-orange-600" />;
        if (type === 'meal') return <Utensils size={18} className="text-yellow-600" />;
        return <Clock size={18} className="text-gray-600" />;
    };

    // 👇 FIX 2: Added the actual logic to open the modal
    const openPoModal = (service: any) => {
        setSelectedServiceForPo(service);
        setIsPoModalOpen(true);
    };

      if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200">
            <Plane className="text-white animate-pulse" size={28} />
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
            <Loader2 size={16} className="animate-spin text-blue-600" />
            Loading your travel Operation..
          </div>
        </div>
      </div>
    );
  }
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* --- Background Layers --- */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center blur-sm scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
            />
            {/* Dim Overlay */}
            <div className="absolute inset-0 z-0 bg-gray-900/60 backdrop-blur-sm" />

            {/* --- Content Layer --- */}
            <div className="relative z-10 p-8 max-w-7xl mx-auto">
                
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => router.back()} className="flex items-center gap-2 font-bold text-sm text-white hover:text-gray-200">
                        <ArrowLeft size={16} /> Back
                    </button>


                    <div className="flex items-center gap-3">
        {/* NEW: Global Ledger Button */}
        <button 
            onClick={() => router.push('/dashboard/travel-operations/ledger')}
            className="px-4 py-2 rounded-lg font-bold flex items-center gap-2 cursor-pointer bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm border border-indigo-100 transition-all"
            title="View all company payables"
        >
            <Wallet size={18} /> Global Ledger
        </button>

        <button 
        onClick={() => setIsVoucherModalOpen(true)}
        disabled={isLoading || !operationData}
        className="px-4 py-2 rounded-lg font-bold flex items-center gap-2 bg-white text-purple-600 hover:bg-purple-50 shadow-sm border border-purple-100 transition-all"
        title="Generate Client Vouchers"
    >
        <Ticket size={18} /> Client Vouchers
    </button>
                    
                    <button 
                        onClick={saveManifest} 
                        disabled={isLoading || !operationData}
                        className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            isLoading || !operationData ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white shadow-md`}
                    >
                        <Save size={18} /> {isLoading ? 'Loading...' : 'Save Changes'}
                    </button>
                </div>
                </div>



                {operationData && (
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-white/40 p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        {/* Column 1: Trip & Client */}
                        <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4 relative z-10">
                            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Trip & Client</span>
                            <h2 className="text-lg font-black text-gray-900 leading-tight truncate" title={operationData.tripContext?.tripName || operationData.tripName}>
                                {operationData.tripContext?.tripName || operationData.tripName}
                            </h2>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded-md border border-indigo-100"><User size={14} /></div>
                                <span className="text-sm font-bold text-gray-500">
                                    Client: <span className="text-gray-900">{operationData.tripContext?.clientName || "Unknown"}</span>
                                </span>
                            </div>
                        </div>

                        {/* Column 2: Schedule */}
                        <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:px-4 relative z-10">
                            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">Schedule</span>
                            <div className="flex items-center gap-3 text-gray-900 font-bold text-sm mt-1.5">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={16} className="text-emerald-500" />
                                    <span>{operationData.tripContext?.startDate || "TBA"}</span>
                                </div>
                                <ArrowRight size={14} className="text-gray-300" />
                                <span>{operationData.tripContext?.endDate || "TBA"}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-gray-500 bg-gray-50 w-fit px-2 py-1 rounded border border-gray-100">
                                <Clock size={12} />
                                <span className="text-xs font-bold">{operationData.tripContext?.duration || "N/A"}</span>
                            </div>
                        </div>

                        {/* Column 3: Sales Channel */}
                        <div className="flex flex-col gap-1 md:pl-4 relative z-10">
                            <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Sales Channel</span>
                            <div className="mt-2 flex items-center">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold shadow-sm">
                                    <Briefcase size={14} />
                                    {operationData.tripContext?.agentName || "Internal Sale"}
                                </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold mt-2 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                Ref: {operationData.tripId}
                            </span>
                        </div>
                    </div>
                )}
                {/* 👆 END OF TRIP CONTEXT HEADER 👆 */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        {/* <thead>
                            <tr className="bg-gray-100 text-xs text-gray-500 font-black uppercase">
                                <th className="p-4 w-24">Day</th>
                                <th className="p-4">Service</th>
                                <th className="p-4 w-40">Status</th>
                                <th className="p-4 w-48">Conf # / PNR</th>
                                <th className="p-4 w-32">Total Net Cost</th>
                                <th className="p-4 w-40">Pay Deadline</th>
        <th className="p-4 w-36">Pay Status</th>
                                <th className="p-4 w-32 text-center">Procurement</th>
                              
                                
                            </tr>
                        </thead> */}

                        {/* ── UPGRADED TABLE HEADER ── */}
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                <th className="p-4 w-20">Day</th>
                                {/* Added min-w-[250px] to prevent text from wrapping awkwardly */}
                                <th className="p-4 min-w-[250px]">Service</th>
                                <th className="p-4 w-40">Status</th>
                                <th className="p-4 w-44">Conf # / PNR</th>
                                <th className="p-4 w-36">Net Cost</th>
                                <th className="p-4 w-40">Pay Deadline</th>
                                <th className="p-4 w-36">Pay Status</th>
                                <th className="p-4 w-40 text-center">Procurement</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {/* 1. Define the professional categories */}
                            {[
                                { type: 'hotel', label: '🏨 Accommodations (Stays)', color: 'bg-emerald-50 text-emerald-700' },
                                { type: 'flight', label: '✈️ Flights & Aviation', color: 'bg-blue-50 text-blue-700' },
                                { type: 'transport', label: '🚗 Transportation & Transfers', color: 'bg-indigo-50 text-indigo-700' },
                                { type: 'activity', label: '🎟️ Activities, Tours & Guides', color: 'bg-orange-50 text-orange-700' },
                                { type: 'meal', label: '🍽️ Meals & Dining', color: 'bg-yellow-50 text-yellow-700' }
                            ].map((category) => {
                                
                                // 2. Map original indexes, THEN filter for this specific category
                                const categoryServices = operationData?.services
                                    ?.map((service: any, index: number) => ({ ...service, originalIndex: index }))
                                    .filter((service: any) => service.serviceType === category.type)
                                    // Optional: Sort them chronologically by Day Number within the category
                                    .sort((a: any, b: any) => a.dayNumber - b.dayNumber);

                                // 3. If there are no services in this category, don't show the header at all
                                if (!categoryServices || categoryServices.length === 0) return null;

                                return (
                                    <React.Fragment key={category.type}>
                                        {/* --- CATEGORY SUB-HEADER --- */}
                                        <tr>
                                            <td colSpan={8} className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-y border-gray-200 ${category.color}`}>
                                                {category.label}
                                            </td>
                                        </tr>

                                        {/* --- CATEGORY ITEMS --- */}
                                        {categoryServices.map((service: any) => (
                                            <tr key={service.originalIndex} className="hover:bg-gray-50 transition-colors">
                                                
                                                <td className="p-4 font-bold text-gray-600 text-sm">Day {service.dayNumber}</td>
                                                
                                           
                                                <td className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0 mt-1">
                                                            {getIcon(service.serviceType)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-bold text-gray-900 text-sm mb-1">{service.serviceName}</div>
                                                            <div className="flex items-center gap-1 bg-blue-50/50 p-1.5 rounded border border-blue-100">
                                                                <Link2 size={12} className="text-blue-500 shrink-0" />
                                                                <select 
                                                                    value={service.supplierId || ''} 
                                                                    onChange={(e) => updateService(service.originalIndex, 'supplierId', e.target.value)}
                                                                    className="bg-transparent text-[10px] font-bold text-blue-700 w-full outline-none cursor-pointer"
                                                                >
                                                                    <option value="">-- Link Master Supplier --</option>
                                                                    {suppliers.map(sup => (
                                                                        <option key={sup._id} value={sup._id}>{sup.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                
                                                <td className="p-4">
                                                    <select 
                                                        value={service.status || 'Pending'} 
                                                        onChange={(e) => updateService(service.originalIndex, 'status', e.target.value)}
                                                        className="border border-gray-300 rounded-md text-xs font-bold p-2 w-full outline-none focus:border-indigo-500 text-gray-700 bg-white"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Requested">Requested</option>
                                                        <option value="Confirmed">Confirmed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>

                                                <td className="p-4">
                                                    <input 
                                                        type="text" 
                                                        value={service.confirmationNumber || ''}
                                                        onChange={(e) => updateService(service.originalIndex, 'confirmationNumber', e.target.value)}
                                                        placeholder="e.g., PNR/CONF" 
                                                        className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-indigo-500 font-mono"
                                                    />
                                                </td>

                                               
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs font-bold text-gray-400"> {service.currency || 'USD'} </span>
                                                        <input 
                                                            type="number" 
                                                            value={service.netCost || 0}
                                                            onChange={(e) => updateService(service.originalIndex, 'netCost', e.target.value)}
                                                            className="border border-gray-300 rounded-md text-sm p-2 w-24 outline-none focus:border-indigo-500 text-right font-mono"
                                                        />
                                                    </div>
                                                </td>

                                           
                                                <td className="p-4">
                                                    <input 
                                                        type="date" 
                                                        value={service.paymentDeadline ? new Date(service.paymentDeadline).toISOString().split('T')[0] : ''}
                                                        onChange={(e) => updateService(service.originalIndex, 'paymentDeadline', e.target.value)}
                                                        className="border border-gray-300 rounded-md text-xs font-bold p-2 w-full outline-none focus:border-indigo-500 text-gray-700 bg-white"
                                                    />
                                                </td>

                                           
                                                <td className="p-4">
                                                    <select 
                                                        value={service.paymentStatus || 'Unpaid'} 
                                                        onChange={(e) => updateService(service.originalIndex, 'paymentStatus', e.target.value)}
                                                        className={`border rounded-md text-xs font-bold p-2 w-full outline-none cursor-pointer ${
                                                            service.paymentStatus === 'Fully Paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            service.paymentStatus === 'Deposit Paid' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                            'bg-white text-gray-700 border-gray-300'
                                                        }`}
                                                    >
                                                        <option value="Unpaid">Unpaid</option>
                                                        <option value="Deposit Paid">Deposit Paid</option>
                                                        <option value="Fully Paid">Fully Paid</option>
                                                    </select>
                                                </td>

                                                
                                                <td className="p-4 text-center">
                                                    <button 
                                                        onClick={() => openPoModal(service)}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 mx-auto whitespace-nowrap"
                                                    >
                                                        <FileText size={14} className="text-blue-600"/> Generate PO
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                      
                    </table>
                </div>
            </div>

          {/* 👇 Mount the PO Modal */}
<PurchaseOrderModal 
    isOpen={isPoModalOpen}
    onClose={() => setIsPoModalOpen(false)}
    service={selectedServiceForPo}
    tripName={operationData?.tripName || 'N/A'}
    tripId={operationData?.tripId || 'N/A'}
    allSuppliers={suppliers} /* 👈 THIS IS THE MISSING MAGIC LINK! */
/>


{/* 👇 Mount the Client Voucher Modal */}
            <ClientVoucherModal 
                isOpen={isVoucherModalOpen}
                onClose={() => setIsVoucherModalOpen(false)}
                operationData={operationData}
                allSuppliers={suppliers}
            />
        </div>
    );
}