import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../utils/constants';
const authMiddleware = (req: Request<{}>, res: Response, next: any) => {
  try {
    const bearerHeader = req?.headers?.authorization!;
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, JWT_SECRET_KEY);
    const jwtData: any = jwt.decode(bearerToken, {
      complete: true,
      json: true,
    });
    if (!jwtData?.payload?.userId) {
      throw new Error('Invalid user');
    }
    //@ts-ignore
    req.userId = jwtData.payload.userId;
    next();
  } catch (error) {
    res.status(403).send({ error: 'Invalid token or token expired' });
  }
};

export default authMiddleware;
