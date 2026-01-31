import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import File from '@/models/File';

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: Params) {
    await dbConnect();
    const { id } = await context.params;

    try {
        const file = await File.findById(id);
        if (!file) {
            return NextResponse.json({ success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: file });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function PUT(request: Request, context: Params) {
    await dbConnect();
    const { id } = await context.params;

    try {
        const body = await request.json();
        const file = await File.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!file) {
            return NextResponse.json({ success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: file });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: Params) {
    await dbConnect();
    const { id } = await context.params;

    try {
        const file = await File.findById(id);
        if (!file) {
            return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
        }

        if (file.isTrashed) {
            // Already trashed -> Delete permanently
            await File.deleteOne({ _id: id });
        } else {
            // Not trashed -> Move to trash
            file.isTrashed = true;
            await file.save();
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
