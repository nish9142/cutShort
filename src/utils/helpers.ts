import { Request, Response,NextFunction } from 'express';
import mongoose from 'mongoose';

export const allRequiredKeysPresent =
  (requiredKeys: string[]) => (req: Request, res: Response,next:NextFunction ) => {
    const payload = req.body || {};
    for (let key of requiredKeys) {
      if (!payload[key]) {
        res.status(403).send({ error: 'Required key(s) missing' });
        throw new Error('Required key(s) missing');
      }
    }
    next()
  };

export const getMongoId = (id?:string) => {
  return id ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId();
  }
