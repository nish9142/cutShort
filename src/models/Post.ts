import mongoose, { Schema } from 'mongoose';

export interface IPost extends mongoose.Document {
  title: string;
  content: string;
  user: Schema.Types.ObjectId;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required:true },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps:true
});

postSchema.index({user:1})

export const Post = mongoose.model<IPost>('Post', postSchema);
