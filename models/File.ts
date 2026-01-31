import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFile extends Document {
    name: string;
    content: string;
    type: string;
    owner: mongoose.Types.ObjectId;
    isPublic: boolean;
    isTrashed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FileSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a file name'],
            maxlength: [60, 'Name cannot be more than 60 characters'],
        },
        content: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        isTrashed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent overwriting the model if it's already compiled, but allow overwriting in dev for HMR
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.File;
}

const File: Model<IFile> =
    mongoose.models.File || mongoose.model<IFile>('File', FileSchema);

export default File;
