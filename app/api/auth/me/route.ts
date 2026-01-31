import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
    await dbConnect();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authorized, no token' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET!);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: 'Not authorized, token failed' }, { status: 401 });
    }
}
