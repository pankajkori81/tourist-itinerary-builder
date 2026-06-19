import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import { TravelOperation } from '@/app/models/TravelOperation';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { tripId, services } = await request.json();

        if (!tripId || !services) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const result = await TravelOperation.updateOne({ tripId }, { services });

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}