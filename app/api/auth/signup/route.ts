import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { name, email, password } = await request.json();

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            // Generate Token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
                expiresIn: '30d',
            });

            // Set Cookie
            const cookieStore = await cookies();
            cookieStore.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/',
            });

            return NextResponse.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            }, { status: 201 });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid user data' }, { status: 400 });
        }

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
