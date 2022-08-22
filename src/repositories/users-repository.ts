import { LoginUserType } from "../routes/auth-route";
import { UserType } from "../services/users-service";
import { usersCollection } from "../db/db";

export const usersRepository = {
  async createUser(user: any) {
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
    const user = await usersCollection.findOne({
      "accountData.login": loginUser.login,
    });

    return user;
  },
  async findUserByEmailOrLogin(findUser: LoginUserType) {
    const user = await usersCollection.findOne({
      $or: [
        { "accountData.email": findUser.email },
        { "accountData.login": findUser.login },
      ],
    });

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
  async createUserByEmail(user: any) {
    const result = await usersCollection.insertOne(user, {
      forceServerObjectId: true,
    });
    console.log(result, "created new User");
    return user;
  },
  async findUserByCode(code: any) {
    const user = await usersCollection.findOneAndUpdate(
      { "emailConfirmation.confirmCode": code },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );

    if (user) {
      return user.value;
    }
    return null;
  },
  async findUserByEmail(email: any) {
    // console.log(email, "email");

    const result = await usersCollection.findOne(
      // { "accountData.email": email }
      {
        $and: [
          { "accountData.email": email },
          { "emailConfirmation.isConfirmed": false },
        ],
      }
    );
    // console.log(result, "result");

    if (!result) return null;
    return result;
  },
  async resendConfirmCode(newUser: any) {
    const user = await usersCollection.findOneAndUpdate(
      { id: newUser.id },
      { $set: newUser }
    );

    if (user) {
      return user.value;
    }
    return null;
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
