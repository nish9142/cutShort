import mongoose, { Schema } from 'mongoose';

export interface IComment extends mongoose.Document {
    content: string;
    post: Schema.Types.ObjectId
    user: Schema.Types.ObjectId;
}

const commentSchema = new Schema<IComment>({
    content:{ type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
}, {
    timestamps: true
});

commentSchema.index({ user: 1 })
commentSchema.index({ post: 1 })

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
