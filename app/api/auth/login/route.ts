import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, password } = await request.json();

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
                expiresIn: '30d',
            });

            const cookieStore = await cookies();
            cookieStore.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
            });

            return NextResponse.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
