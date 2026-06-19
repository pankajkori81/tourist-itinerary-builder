"use client";

import { useEffect, useState } from 'react';
import { Wallet, AlertTriangle, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalLedgerPage() {
    const [ledger, setLedger] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                const res = await fetch('/api/operations/ledger');
                if (res.ok) {
                    const data = await res.json();
                    setLedger(data.ledger);
                }
            } catch (error) {
                console.error("Failed to fetch ledger", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLedger();
    }, []);

    // Helper to calculate days until deadline
    const getDaysUntil = (dateString: string | null) => {
        if (!dateString) return null;
        const deadline = new Date(dateString);
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    };

    if (isLoading) {
        return <div className="p-10 flex justify-center items-center h-screen bg-slate-50"><div className="animate-pulse font-bold text-gray-500">Loading Financial Ledger...</div></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <Wallet className="text-indigo-600" size={32} />
                            Global Payment Ledger
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Master accounts payable overview across all active trips.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-center min-w-[120px]">
                            <p className="text-xs font-bold text-slate-400 uppercase">Unpaid Items</p>
                            <p className="text-xl font-black text-red-600">{ledger.filter(l => l.paymentStatus === 'Unpaid').length}</p>
                        </div>
                    </div>
                </div>

                {/* The Ledger Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-[11px] text-slate-500 font-black uppercase border-b border-slate-200">
                                <th className="p-4 w-40">Payment Deadline</th>
                                <th className="p-4">Supplier / Service</th>
                                <th className="p-4">Trip Reference</th>
                                <th className="p-4 w-32 text-right">Amount Due</th>
                                <th className="p-4 w-40 text-center">Payment Status</th>
                                <th className="p-4 w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {ledger.map((item, index) => {
                                const daysUntil = getDaysUntil(item.paymentDeadline);
                                const isUnpaid = item.paymentStatus === 'Unpaid';
                                const isUrgent = isUnpaid && daysUntil !== null && daysUntil <= 7;
                                const costToDisplay = item.actualInvoice > 0 ? item.actualInvoice : item.netCost;

                                return (
                                    <tr key={index} className={`transition-colors hover:bg-slate-50 ${isUrgent ? 'bg-red-50/50' : ''}`}>
                                        
                                        {/* Deadline Column with Urgent Highlighting */}
                                        <td className="p-4">
                                            {item.paymentDeadline ? (
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className={isUrgent ? 'text-red-500' : 'text-slate-400'} />
                                                    <div>
                                                        <p className={`text-sm font-bold ${isUrgent ? 'text-red-700' : 'text-slate-700'}`}>
                                                            {new Date(item.paymentDeadline).toLocaleDateString()}
                                                        </p>
                                                        {isUrgent && <p className="text-[10px] uppercase font-black text-red-500 animate-pulse">Due in {daysUntil} Days!</p>}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium italic">No deadline set</span>
                                            )}
                                        </td>

                                        {/* Supplier Details */}
                                        <td className="p-4">
                                            <p className="font-bold text-sm text-slate-900">{item.serviceName}</p>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">{item.serviceType}</p>
                                        </td>

                                        {/* Trip Link */}
                                        <td className="p-4">
                                            <p className="font-bold text-sm text-indigo-700 truncate max-w-[200px]" title={item.tripName}>{item.tripName}</p>
                                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {item.tripId}</p>
                                        </td>

                                        {/* Financials */}
                                        <td className="p-4 text-right">
                                            <p className="font-mono font-bold text-sm text-slate-900">{item.currency} {costToDisplay}</p>
                                            {item.actualInvoice > 0 && <p className="text-[9px] uppercase text-slate-400 font-bold">Based on Invoice</p>}
                                        </td>

                                        {/* Status Badge */}
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                item.paymentStatus === 'Fully Paid' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                item.paymentStatus === 'Deposit Paid' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                                {item.paymentStatus}
                                            </span>
                                        </td>

                                        {/* Quick Action */}
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => router.push(`/dashboard/travel-operations/${item.tripId}`)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Go to Trip Manifest"
                                            >
                                                <ArrowRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            
                            {ledger.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-slate-500 font-bold">No active payables found in the system.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}