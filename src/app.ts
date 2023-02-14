import express from 'express';
import authMiddleware from './middleware/auth';
import usersRoute from './routes/userRoute';
import toDoRouter from './routes/toDoRoutes';
import postRouter from './routes/postRoutes'
import commentRouter from './routes/commentRoutes'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//public routes
app.get("/", (req, res) => {
    res.send({ online: true })
})
app.use(usersRoute);

app.use(authMiddleware);
//private routes
app.use('/todos', toDoRouter);
app.use('/posts',postRouter)
app.use('/comments',commentRouter )



export default app;
