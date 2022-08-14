import { LoginUserType } from "../routes/auth-route";
import { UserType } from "../services/users-service";
import { usersCollection } from "../db/db";

export const usersRepository = {
  async createUser(user: UserTypeForDB) {
    const createdUser = await usersCollection.insertOne(user, {
      forceServerObjectId: true,
    });
    if (!createdUser.acknowledged) {
      return null;
    }
    return {
      id: user.id,
      login: user.login,
    };
  },
  async findUserFromDB(loginUser: LoginUserType) {
    const user = await usersCollection.findOne({ login: loginUser.login });
    return user;
  },
  async getUsers(query: Query) {
    const { PageNumber = 1, PageSize = 10 } = query;
    const allUsers = await usersCollection
      .find({}, { projection: { _id: 0, hashPassword: 0 } })
      .skip(+PageSize * (+PageNumber - 1))
      .limit(+PageSize)
      .toArray();
    const totalCount = await usersCollection.countDocuments({});
    const result = {
      pagesCount: Math.ceil(+totalCount / +PageSize),
      page: +PageNumber,
      pageSize: +PageSize,
      totalCount,
      items: allUsers,
    };
    return result;
  },
  async deleteUserFromDB(userId: string) {
    const result = await usersCollection.deleteOne({ id: userId });
    console.log(result, "DELETED User");
    return result.deletedCount === 1;
  },
  async findUserByIdUserFromDB(userId: string) {
    const result = await usersCollection.findOne({ id: userId });
    console.log(result, "findOne User");
    return result;
  },
};

export type UserTypeForDB = {
  login: string;
  hashPassword: string;
  id: string;
};

export type Query = {
  PageNumber: number | undefined;
  PageSize: number | undefined;
};
