import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
    await dbConnect();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET!);
        const userId = decoded.id;

        const body = await request.json();
        const { name, email, password, currentPassword, avatar } = body;

        const user = await User.findById(userId).select('+password');

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Verify current password if changing password
        if (password) {
            if (!currentPassword) {
                return NextResponse.json({ success: false, error: 'Please provide current password to set a new one' }, { status: 400 });
            }
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return NextResponse.json({ success: false, error: 'Incorrect current password' }, { status: 401 });
            }
            user.password = password;
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        // If simple update, return user without password
        const updatedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            createdAt: user.createdAt
        };

        return NextResponse.json({ success: true, data: updatedUser });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
