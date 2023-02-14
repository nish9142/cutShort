import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  isCompleted: boolean;
  user: Schema.Types.ObjectId;
}

const todoSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps:true
});

todoSchema.index({user:1})

export const Todo: Model<ITodo> = mongoose.model<ITodo>('Todo', todoSchema);
