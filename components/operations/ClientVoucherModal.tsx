"use client";

import { X, Printer, Ticket, MapPin, Phone, Info, QrCode } from 'lucide-react';

interface ClientVoucherModalProps {
    isOpen: boolean;
    onClose: () => void;
    operationData: any;
    allSuppliers: any[];
}

export default function ClientVoucherModal({ isOpen, onClose, operationData, allSuppliers = [] }: ClientVoucherModalProps) {
    if (!isOpen || !operationData) return null;

    const handlePrint = () => {
        window.print(); 
    };

    // 👇 CORE LOGIC: Only generate vouchers for CONFIRMED services
    const confirmedServices = operationData.services?.filter((s: any) => s.status === 'Confirmed') || [];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-100 rounded-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
                
                {/* Header Strip */}
                <div className="bg-[#0a1f44] px-6 py-4 flex justify-between items-center shrink-0 print:hidden">
                    <h2 className="text-white font-bold flex items-center gap-2">
                        <Ticket size={18} className="text-purple-400" />
                        Client Vouchers ({confirmedServices.length} Confirmed)
                    </h2>
                    <div className="flex gap-3">
                        <button 
                            onClick={handlePrint} 
                            disabled={confirmedServices.length === 0}
                            className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            <Printer size={16} /> Print / Save PDF Bundle
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Voucher Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-200 print:p-0 print:bg-white">
                    
                    {confirmedServices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 print:hidden">
                            <Info size={48} className="mb-4 text-gray-400" />
                            <p className="text-xl font-bold text-gray-600">No Confirmed Services</p>
                            <p className="text-sm mt-2">Vouchers can only be generated for services marked as "Confirmed".</p>
                        </div>
                    ) : (

                     
                        <div className="space-y-12 print:space-y-0">
                            {confirmedServices.map((service: any, index: number) => {
                                // Find the linked supplier for address/phone info
                                const linkedSupplier = allSuppliers.find(sup => String(sup._id) === String(service.supplierId));
                                const voucherRef = `VCH-${operationData.tripId.substring(0, 5)}-${service.dayNumber}-${index + 1}`;

                                return (
                                    <div key={index} className="voucher-page bg-white mx-auto max-w-3xl shadow-lg border border-gray-200 rounded-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none relative">
                                        
                                        {/* Top Agency Branding */}
                                        <div className="bg-gradient-to-r from-[#0a1f44] to-indigo-900 text-white p-8 flex justify-between items-center">
                                            <div>
                                                <h1 className="text-3xl font-black tracking-wider">TRAVDEK</h1>
                                                <p className="text-xs text-indigo-200 uppercase tracking-widest mt-1 font-bold">Official Travel Document</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">24/7 Emergency Support</p>
                                                <p className="text-lg font-black text-purple-300">+1 800 555 0199</p>
                                                <p className="text-xs text-indigo-200 mt-1">ops@travdek.com</p>
                                            </div>
                                        </div>

                                        <div className="p-10">
                                            {/* Lead Passenger & Ref */}
                                            <div className="flex justify-between items-end border-b-2 border-gray-100 pb-6 mb-8">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Lead Passenger / Group</p>
                                                    <h2 className="text-2xl font-black text-gray-900">{operationData.tripName}</h2>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Voucher Reference</p>
                                                    <p className="text-xl font-mono font-bold text-indigo-700">{voucherRef}</p>
                                                </div>
                                            </div>

                                            {/* Crucial Data: The Supplier & Confirmation */}
                                            <div className="grid grid-cols-3 gap-8 mb-8">
                                                <div className="col-span-2">
                                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Service Provided By</p>
                                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                                        {linkedSupplier ? linkedSupplier.name : service.serviceName}
                                                    </h3>
                                                    <p className="text-sm text-purple-700 font-bold uppercase tracking-wide mt-1">{service.serviceType} Service</p>
                                                    
                                                    <div className="mt-4 space-y-2 text-sm text-gray-600 font-medium">
                                                        <p className="flex items-start gap-2">
                                                            <MapPin size={16} className="text-gray-400 mt-0.5" />
                                                            <span>{linkedSupplier?.city ? `${linkedSupplier.city}, ${linkedSupplier.country}` : 'Location provided in final itinerary'}</span>
                                                        </p>
                                                        {linkedSupplier?.phone && (
                                                            <p className="flex items-center gap-2">
                                                                <Phone size={16} className="text-gray-400" />
                                                                <span>{linkedSupplier.phone}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* The PNR Box (Highlight of the voucher) */}
                                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex flex-col justify-center items-center text-center">
                                                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-2">Booking Confirmation</p>
                                                    <p className="text-xl font-mono font-black text-indigo-900 break-all">
                                                        {service.confirmationNumber || 'TBA'}
                                                    </p>
                                                    {service.status === 'Confirmed' && (
                                                        <span className="mt-3 bg-green-100 text-green-700 text-[10px] font-black uppercase px-3 py-1 rounded-full">Confirmed</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Service Specifics */}
                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-10 flex justify-between items-center">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Service Details</p>
                                                    <p className="font-bold text-gray-800">{service.serviceName}</p>
                                                    <p className="text-sm text-gray-500 mt-1">Scheduled for: Day {service.dayNumber}</p>
                                                </div>
                                                <QrCode size={54} className="text-gray-300" />
                                            </div>

                                            {/* The Magic Phrase */}
                                            <div className="text-center mt-auto pt-8 border-t border-gray-200">
                                                <p className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                                    Important Notice to Supplier
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2 max-w-xl mx-auto font-medium leading-relaxed">
                                                    All services listed on this voucher have been fully prepaid by Travdek Agency on behalf of the client. 
                                                    <strong className="text-gray-800"> Please do not charge the guest directly for room rates, taxes, or booked services.</strong>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {/* Print Magic CSS */}
                <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                        body * { visibility: hidden; }
                        .animate-in { animation: none !important; }
                        .fixed { position: absolute; }
                        .print\\:hidden { display: none !important; }
                        .print\\:p-0 { padding: 0 !important; }
                        .print\\:shadow-none { box-shadow: none !important; }
                        .print\\:border-none { border: none !important; }
                        .print\\:rounded-none { border-radius: 0 !important; }
                        .bg-white { visibility: visible; }
                        .bg-white * { visibility: visible; }
                        
                        /* This is the magic that puts one voucher per printed page */
                        .voucher-page {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            page-break-after: always;
                            margin: 0 !important;
                        }
                    }
                `}} />
            </div>
        </div>
    );
}