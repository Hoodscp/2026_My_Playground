import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import File from '@/models/File';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    await dbConnect();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');
        let userId = null;

        if (token) {
            try {
                const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET!);
                userId = decoded.id;
            } catch (e) {
                // Token invalid, treat as guest
            }
        }

        const { searchParams } = new URL(request.url);
        const trashOnly = searchParams.get('trash') === 'true';

        let query: any = userId
            ? { $or: [{ owner: userId }, { isPublic: true }] }
            : { isPublic: true };

        // Trash logic
        if (trashOnly) {
            // Only my trashed files
            if (!userId) { // Guest can't see trash
                return NextResponse.json({ success: true, data: [] });
            }
            query = { owner: userId, isTrashed: true };
        } else {
            // Normal view: Exclude trashed files
            query.isTrashed = { $ne: true };
        }

        console.log('GET Files Query:', JSON.stringify(query, null, 2));

        const files = await File.find(query).sort({ updatedAt: -1 });
        console.log('Found Files:', files.length);
        return NextResponse.json({ success: true, data: files });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await dbConnect();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
        }

        let userId;
        try {
            const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET!);
            userId = decoded.id;
        } catch (e) {
            return NextResponse.json({ success: false, error: 'Token invalid' }, { status: 401 });
        }

        const body = await request.json();
        console.log('File Create Body:', body);
        console.log('User ID:', userId);

        // Add owner to body
        const fileData = { ...body, owner: userId };
        console.log('File Data to Save:', fileData);

        const file = await File.create(fileData);
        return NextResponse.json({ success: true, data: file }, { status: 201 });
    } catch (error: any) {
        console.error('File Create Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
