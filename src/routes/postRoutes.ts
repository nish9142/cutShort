import express from 'express';
import { PostRepo } from '../repo/PostRepo';
import { getMongoId } from '../utils/helpers';
const router = express.Router();

router.get("/", async (req, res) => {
    const { limit = 100, skip = 0 } = req.query || {} as any
    try {
        const posts = await PostRepo.getPosts({ limit, skip, query: {} });
        return res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    try {
        //@ts-ignore
        id = getMongoId(id)
        const posts = await PostRepo.getPosts({ query: { _id: id } });
        return res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const payload = req.body || {}
        //@ts-ignore
        payload.user = getMongoId(req.userId)
        console.log({ user: payload.user })
        const newPost = await PostRepo.createPost(payload);;
        return res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        let { id } = req.params;
        id = getMongoId(id) as any
        const Posts = await PostRepo.getPosts({ query: { _id: id } })
        if (!Posts?.length) {
            return res.status(404).json({ message: "Post not found" });
        }
        //@ts-ignore
        if (req.userId != Posts[0].user.toString()) {
            return res.status(401).json({ message: "Unauthorized operation" });
        }
        const body = req.body || {}
        const post = Object.assign({}, Posts[0]) as any
        const newPostObj = Object.assign(post._doc, body)
        console.log({ post, newPostObj })
        //@ts-ignore
        newPostObj.user = getMongoId(req.userId)
        const Post = await PostRepo.updatePost(newPostObj,id);
        if (Post) {
            res.json(Post);
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    id = getMongoId(id) as any
    const Posts = await PostRepo.getPosts({ query: { _id: id } })
    if (!Posts?.length) {
        return res.status(404).json({ message: "Post not found" });
    }
    //@ts-ignore
    if (req.userId != Posts[0].user.toString()) {
        return res.status(401).json({ message: "Unauthorized operation" });
    }
    try {
        const Post = await PostRepo.deletePost(id);
        if (Post) {
            res.json({ message: "Post deleted" });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/users/:userId", async (req, res) => {
    const { limit = 100, skip = 0 } = req.query || {} as any
    try {
        let { userId } = req.params;
        userId = getMongoId(userId) as any
        const posts = await PostRepo.getPosts({ limit, skip, query: {user:userId } });
        return res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router