import { Comment, IComment } from '../models/Comment';
import { IUser, User } from '../models/User';

interface FindUserInput {
    username?: string;
    _id?: string
}

export class CommentRepo {
    static async createComment(data: Partial<IComment>): Promise<IComment> {
        return Comment.create(data)
    }

    static async getCommentsByPost({ limit = 100, skip = 0, postId }): Promise<IComment[]> {
        return Comment.find({post:postId})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-__v")

    }

}
