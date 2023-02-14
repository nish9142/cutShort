import { IPost, Post } from '../models/Post';
import { getMongoId } from '../utils/helpers';

interface PostFilters {
    limit?: number;
    skip?: number;
    query: { [k: string]: string }
}

export class PostRepo {
    static async updatePost(data: Partial<IPost>,id:any): Promise<IPost> {
        const filter =  { _id: id} 
        return Post.findOneAndUpdate(filter, data, { upsert: true, new: true }).select("-__v");
    }

    static async createPost(data: Partial<IPost>): Promise<IPost> {
        return Post.create(data)
    }

    static async getPosts({ limit = 100, skip = 0, query = {} }): Promise<IPost[]> {
        return Post.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-__v")

    }

    static async deletePost(id: string) {
        return Post.findByIdAndDelete(id)
    }
}
