import { IUser, User } from '../models/User';

interface FindUserInput{
  username?: string;
  _id?: string
}

export class UserRepo {
  static async upsertUser(data: Partial<IUser>): Promise<IUser> {
    return User.findOneAndUpdate({ username: data.username }, data, { upsert: true,new:true }).select("username _id");
  }

  static async findUserByUserNameOrId({ username, _id }: FindUserInput): Promise<IUser> {
    let user = null
    if (_id) {
      user = await User.findOne({ _id });
      return user
    }
    if (username) {
      user = await User.findOne({ username });
      return user
    }
    if (!user) throw new Error("User not found");
  }

  static async getUsers({ limit = 100, skip = 0, query = {} }): Promise<IUser[]> {
    return User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v")

  }


}
