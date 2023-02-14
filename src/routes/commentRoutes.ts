import express from 'express';
import { commentKeysMiddleware } from '../middleware/requiredKeys';
import { CommentRepo } from '../repo/commentRepo';
import { getMongoId } from '../utils/helpers';
const router = express.Router();

router.post("/", commentKeysMiddleware,async (req, res) => {
    try {
        const payload = req.body || {}
        //@ts-ignore
        payload.user = getMongoId(req.userId)
        const comment = await CommentRepo.createComment(payload);;
        return res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/post/:postId", async (req, res) => {
    const { limit = 100, skip = 0 } = req.query || {} as any
    try {
        let { postId } = req.params;
        postId = getMongoId(postId) as any
        const toDos = await CommentRepo.getCommentsByPost({ limit, skip, postId });
        return res.json(toDos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router