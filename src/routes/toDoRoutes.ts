import express from 'express';
import { ToDoRepo } from '../repo/toDoRepo';
import { getMongoId } from '../utils/helpers';
const router = express.Router();

router.get("/", async (req, res) => {
    const { limit = 100, skip = 0 } = req.query || {} as any
    try {
        const toDos = await ToDoRepo.getToDos({limit,skip,query:{}});
        return res.json(toDos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    try {
        //@ts-ignore
        id = getMongoId(id) 
        const toDos = await ToDoRepo.getToDos({ query: { _id: id } });
        return res.json(toDos);
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
        const newTodo = await ToDoRepo.createToDo(payload);;
        return res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        let { id } = req.params;
        id = getMongoId(id) as any
        const toDos = await ToDoRepo.getToDos({ query: { _id: id } })
        if (!toDos?.length) {
            return res.status(404).json({ message: "Todo not found" });
        }
        //@ts-ignore
        if (req.userId != toDos[0].user.toString() ) {
            return res.status(401).json({ message: "Unauthorized operation" });
        }
        const body = req.body || {}
        const toDo = Object.assign({},toDos[0]) as any
        const newTodoObj = Object.assign(toDo._doc, body)
        //@ts-ignore
        newTodoObj.user = getMongoId(req.userId,id)
        const todo = await ToDoRepo.updateToDo(newTodoObj,id);
        
        if (todo) {
            res.json(todo);
        } else {
            res.status(404).json({ message: "Todo not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    id = getMongoId(id) as any
    const toDos = await ToDoRepo.getToDos({ query: { _id: id } })
    if (!toDos?.length) {
        return res.status(404).json({ message: "Todo not found" });
    }
    //@ts-ignore
    if (req.userId != toDos[0].user.toString()) {
        return res.status(401).json({ message: "Unauthorized operation" });
    }
    try {
        const todo = await ToDoRepo.deleteToDo(id);
        if (todo) {
            res.json({ message: "Todo deleted" });
        } else {
            res.status(404).json({ message: "Todo not found" });
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
        const posts = await ToDoRepo.getToDos({ limit, skip, query: { user: userId } });
        return res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router