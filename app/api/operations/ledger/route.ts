import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import { TravelOperation } from '@/app/models/TravelOperation';

// Prevent Next.js from caching financial data
export const dynamic = 'force-dynamic'; 

export async function GET() {
    try {
        await dbConnect();
        
        // Fetch all operations
        const operations = await TravelOperation.find({}).lean();
        
        const masterLedger: any[] = [];

        // Flatten the data: Extract every service from every trip into one list
        operations.forEach((op: any) => {
            if (op.services && Array.isArray(op.services)) {
                op.services.forEach((service: any) => {
                    // Only push items that actually cost money
                    if (service.netCost > 0 || service.supplierInvoiceAmount > 0) {
                        masterLedger.push({
                            tripId: op.tripId,
                            tripName: op.tripName,
                            serviceType: service.serviceType,
                            serviceName: service.serviceName,
                            status: service.status,
                            paymentStatus: service.paymentStatus || 'Unpaid',
                            paymentDeadline: service.paymentDeadline ? new Date(service.paymentDeadline) : null,
                            currency: service.currency || 'USD',
                            netCost: service.netCost || 0,
                            actualInvoice: service.supplierInvoiceAmount || 0,
                        });
                    }
                });
            }
        });

        // Sort the list so the most urgent payment deadlines are at the top
        masterLedger.sort((a, b) => {
            if (!a.paymentDeadline) return 1; // Push items with no deadline to the bottom
            if (!b.paymentDeadline) return -1;
            return a.paymentDeadline.getTime() - b.paymentDeadline.getTime();
        });

        return NextResponse.json({ success: true, ledger: masterLedger }, { status: 200 });

    } catch (error) {
        console.error('Ledger Aggregation Error:', error);
        return NextResponse.json({ error: 'Failed to generate financial ledger' }, { status: 500 });
    }
}