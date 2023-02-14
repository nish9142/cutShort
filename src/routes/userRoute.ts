import express from 'express';
import { UserRepo } from '../repo/userRepo';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY, SALT_ROUNDS } from '../utils/constants';
import { signUpKeysMiddleware } from '../middleware/requiredKeys';
import bcrypt from 'bcrypt';

const router = express.Router();


router.get("/users", async (req, res) => {
  const { limit = 100, skip = 0 } = req.query || {} as any
  try {
    const users = await UserRepo.getUsers({ limit, skip, query: {} });
    return res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/users/:id", async (req, res) => {
  let { id } = req.params;
  try {
    //@ts-ignore
    id = getMongoId(id)
    const user = await UserRepo.getUsers({ query: { _id: id } });
    return res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/signup', signUpKeysMiddleware, async (req, res) => {
  try {
    const payload = req.body || {};
    payload.username = payload.username.toLowerCase();
    payload.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
    const user = await UserRepo.upsertUser(payload);
    return res.json(user);
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error?.message });
  }
});

router.post('/login', signUpKeysMiddleware, async (req, res) => {
  try {
    const payload = req.body || {};
    payload.username = payload.username.toLowerCase();
    const user = await UserRepo.findUserByUserNameOrId({username:payload.username});
    const isInvalidPassword = user?.password
      ? !(await bcrypt.compare(payload.password, user?.password))
      : true;
    if (!user || isInvalidPassword) {
      throw new Error('Invalid username or password');
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);
    return res.json({ token });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error?.message });
  }
});

export default router;
