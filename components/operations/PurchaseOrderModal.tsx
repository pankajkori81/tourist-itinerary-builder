// "use client";

// import { X, Printer, Mail, Download, Building } from 'lucide-react';

// interface PurchaseOrderModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     service: any;
//     tripName: string;
//     tripId: string;
// }

// export default function PurchaseOrderModal({ isOpen, onClose, service, tripName, tripId }: PurchaseOrderModalProps) {
//     if (!isOpen || !service) return null;

//     const handlePrint = () => {
//         window.print(); // Simple browser print (can print to PDF)
//     };

//     // Auto-generate a PO Number
//     const poNumber = `PO-${tripId.substring(0, 5)}-${service.dayNumber}-${service.serviceType.substring(0, 3).toUpperCase()}`;

//     return (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="bg-gray-100 rounded-xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
                
//                 {/* Modal Header (Not printed) */}
//                 <div className="bg-slate-900 px-6 py-4 flex justify-between items-center shrink-0 print:hidden">
//                     <h2 className="text-white font-bold flex items-center gap-2">
//                         <Building size={18} className="text-blue-400" />
//                         Purchase Order Generator
//                     </h2>
//                     <div className="flex gap-3">
//                         <button onClick={handlePrint} className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
//                             <Printer size={16} /> Print / Save PDF
//                         </button>
//                         <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
//                             <X size={20} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* The Document Area (This is what gets printed) */}
//                 <div className="flex-1 overflow-y-auto p-8 bg-gray-100 print:p-0 print:bg-white">
                    
//                     {/* A4 Paper Container */}
//                     <div className="bg-white mx-auto max-w-2xl shadow-sm border border-gray-200 p-10 min-h-[800px] print:shadow-none print:border-none print:m-0 print:p-0 text-gray-800">
                        
//                         {/* PO Header */}
//                         <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-6">
//                             <div>
//                                 <h1 className="text-3xl font-black tracking-tighter text-gray-900">PURCHASE ORDER</h1>
//                                 <p className="text-sm font-bold text-gray-500 mt-1">Ref: {poNumber}</p>
//                             </div>
//                             <div className="text-right">
//                                 <h3 className="font-bold text-lg">Travdek Agency</h3>
//                                 <p className="text-xs text-gray-500 mt-1">123 Operations Blvd, Travel City<br/>ops@travdek.com | +1 234 567 890</p>
//                             </div>
//                         </div>

//                         {/* Supplier & Trip Details */}
//                         <div className="grid grid-cols-2 gap-8 mb-8">
//                             <div>
//                                 <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">To Supplier</h4>
//                                 <p className="font-bold text-lg leading-tight">{service.serviceName}</p>
//                                 <p className="text-sm text-gray-600 mt-1 uppercase">{service.serviceType} Provider</p>
//                             </div>
//                             <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
//                                 <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Booking Details</h4>
//                                 <div className="space-y-1 text-sm">
//                                     <p className="flex justify-between"><span className="text-gray-500">Trip Name:</span> <span className="font-bold text-right">{tripName}</span></p>
//                                     <p className="flex justify-between"><span className="text-gray-500">Service Day:</span> <span className="font-bold text-right">Day {service.dayNumber}</span></p>
//                                     <p className="flex justify-between"><span className="text-gray-500">Date Issued:</span> <span className="font-bold text-right">{new Date().toLocaleDateString()}</span></p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Order Table */}
//                         <div className="mb-8">
//                             <table className="w-full text-left border-collapse">
//                                 <thead>
//                                     <tr className="bg-gray-900 text-white text-xs uppercase font-bold">
//                                         <th className="p-3">Description of Service</th>
//                                         <th className="p-3 w-32 text-right">Agreed Net Cost</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     <tr className="border-b border-gray-200">
//                                         <td className="p-4">
//                                             <p className="font-bold text-base">{service.serviceName}</p>
//                                             <p className="text-sm text-gray-500 mt-1">Please confirm this booking at your earliest convenience and return your invoice referencing PO Number: <strong>{poNumber}</strong>.</p>
//                                         </td>
//                                         <td className="p-4 text-right font-mono font-bold text-lg">
//                                             {service.currency || 'USD'} {service.netCost || '0.00'}
//                                         </td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Terms */}
//                         <div className="mt-16 pt-6 border-t border-gray-200 text-xs text-gray-500">
//                             <h4 className="font-bold text-gray-900 mb-2">Standard Trading Terms:</h4>
//                             <p>1. This Purchase Order is a binding agreement for the services specified at the net cost shown above.<br/>
//                                2. Please send all invoices to accounts@travdek.com prior to the client arrival date.<br/>
//                                3. Any variance in cost must be approved in writing before invoicing.</p>
//                         </div>
//                     </div>
//                 </div>
                
//                 {/* CSS to make printing look good */}
//                 <style dangerouslySetInnerHTML={{__html: `
//                     @media print {
//                         body * { visibility: hidden; }
//                         .animate-in { animation: none !important; }
//                         .fixed { position: absolute; }
//                         .print\\:hidden { display: none !important; }
//                         .print\\:p-0 { padding: 0 !important; }
//                         .print\\:m-0 { margin: 0 !important; }
//                         .print\\:shadow-none { box-shadow: none !important; }
//                         .print\\:border-none { border: none !important; }
//                         .print\\:bg-white { background-color: white !important; }
//                         .max-w-2xl { max-width: 100% !important; }
//                         .bg-white { visibility: visible; }
//                         .bg-white * { visibility: visible; }
//                         .bg-white { position: absolute; left: 0; top: 0; width: 100%; }
//                     }
//                 `}} />
//             </div>
//         </div>
//     );
// } 

















"use client";

import { X, Printer, Building } from 'lucide-react';

interface PurchaseOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: any;
    tripName: string;
    tripId: string;
    // 👇 NEW: We now accept the master supplier list
    allSuppliers?: any[]; 
}

export default function PurchaseOrderModal({ isOpen, onClose, service, tripName, tripId, allSuppliers = [] }: PurchaseOrderModalProps) {
    if (!isOpen || !service) return null;

    const handlePrint = () => {
        window.print(); 
    };

    const poNumber = `PO-${tripId.substring(0, 5)}-${service.dayNumber}-${service.serviceType.substring(0, 3).toUpperCase()}`;

    // 👇 NEW MAGIC: Find the official supplier profile that the agent linked!
    // const linkedSupplier = allSuppliers.find(sup => sup._id === service.supplierId);

    const linkedSupplier = allSuppliers.find(sup => String(sup._id) === String(service.supplierId));

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-100 rounded-xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
                
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center shrink-0 print:hidden">
                    <h2 className="text-white font-bold flex items-center gap-2">
                        <Building size={18} className="text-blue-400" />
                        Purchase Order Generator
                    </h2>
                    <div className="flex gap-3">
                        <button onClick={handlePrint} className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                            <Printer size={16} /> Print / Save PDF
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-100 print:p-0 print:bg-white">
                    <div className="bg-white mx-auto max-w-2xl shadow-sm border border-gray-200 p-10 min-h-[800px] print:shadow-none print:border-none print:m-0 print:p-0 text-gray-800 relative">
                        
                        {/* 🚨 Warning if no supplier is linked */}
                        {!linkedSupplier && (
                            <div className="absolute top-0 left-0 w-full bg-red-100 text-red-700 text-center text-xs font-bold py-1 print:hidden">
                                Warning: No SRM Profile linked. This PO is using unverified text data.
                            </div>
                        )}

                        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-6 mt-4">
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter text-gray-900">PURCHASE ORDER</h1>
                                <p className="text-sm font-bold text-gray-500 mt-1">Ref: {poNumber}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-bold text-lg">Travdek Agency</h3>
                                <p className="text-xs text-gray-500 mt-1">123 Operations Blvd, Travel City<br/>ops@travdek.com | +1 234 567 890</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">To Supplier</h4>
                                {/* 👇 INJECT DYNAMIC SUPPLIER DATA */}
                                <p className="font-bold text-lg leading-tight">{linkedSupplier ? linkedSupplier.name : service.serviceName}</p>
                                <p className="text-sm text-gray-600 mt-1 uppercase">{service.serviceType} Provider</p>
                                
                                {linkedSupplier && (
                                    <div className="mt-3 text-xs text-gray-600 border-l-2 border-indigo-200 pl-3">
                                        <p className="font-bold text-indigo-700">Official Contact:</p>
                                        <p>{linkedSupplier.email}</p>
                                        <p>{linkedSupplier.phone}</p>
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Booking Details</h4>
                                <div className="space-y-1 text-sm">
                                    <p className="flex justify-between"><span className="text-gray-500">Trip Name:</span> <span className="font-bold text-right">{tripName}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-500">Service Day:</span> <span className="font-bold text-right">Day {service.dayNumber}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-500">Date Issued:</span> <span className="font-bold text-right">{new Date().toLocaleDateString()}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-900 text-white text-xs uppercase font-bold">
                                        <th className="p-3">Description of Service</th>
                                        <th className="p-3 w-32 text-right">Agreed Net Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-4">
                                            <p className="font-bold text-base">{service.serviceName}</p>
                                            <p className="text-sm text-gray-500 mt-1">Please confirm this booking at your earliest convenience and return your invoice referencing PO Number: <strong>{poNumber}</strong>.</p>
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold text-lg">
                                            {service.currency || 'USD'} {service.netCost || '0.00'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 👇 INJECT DYNAMIC FINANCIAL TERMS */}
                        <div className="mt-16 pt-6 border-t border-gray-200 text-xs text-gray-500">
                            <h4 className="font-bold text-gray-900 mb-2">Standard Trading Terms:</h4>
                            {linkedSupplier ? (
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-100">
                                    <div>
                                        <p className="font-bold text-gray-700">Payment Terms:</p>
                                        <p className="text-indigo-600 font-bold">{linkedSupplier.paymentTerms || 'Prepaid'}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-700">Supplier Bank Details:</p>
                                        <p className="font-mono">{linkedSupplier.bankDetails?.accountNumber ? `A/C: ${linkedSupplier.bankDetails.accountNumber}` : 'Data pending in SRM'}</p>
                                    </div>
                                </div>
                            ) : (
                                <p>1. This Purchase Order is a binding agreement for the services specified at the net cost shown above.<br/>
                                   2. Please send all invoices to accounts@travdek.com prior to the client arrival date.</p>
                            )}
                        </div>
                    </div>
                </div>
                
                <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                        body * { visibility: hidden; }
                        .animate-in { animation: none !important; }
                        .fixed { position: absolute; }
                        .print\\:hidden { display: none !important; }
                        .print\\:p-0 { padding: 0 !important; }
                        .print\\:m-0 { margin: 0 !important; }
                        .print\\:shadow-none { box-shadow: none !important; }
                        .print\\:border-none { border: none !important; }
                        .print\\:bg-white { background-color: white !important; }
                        .max-w-2xl { max-width: 100% !important; }
                        .bg-white { visibility: visible; }
                        .bg-white * { visibility: visible; }
                        .bg-white { position: absolute; left: 0; top: 0; width: 100%; }
                    }
                `}} />
            </div>
        </div>
    );
}