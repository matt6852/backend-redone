import { usersCollection } from "../db/db";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Query, usersRepository } from "../repositories/users-repository";
import { LoginUserType } from "../routes/auth-route";
import { myCryptService } from "../application/codeAndDecodePassword";

const saltRounds = 10;
export const userService = {
  async createUser(user: UserType) {
    const { login, password } = user;
    const hashPassword = await myCryptService.codePassword(password);
    const newUser = {
      login,
      hashPassword,
      id: uuidv4(),
    };
    const result = await usersRepository.createUser(newUser);
    return result;

    // const match = await bcrypt.compare(password, hashPassword); compare password from DB
  },
  async getAllUsers(query: any) {
    const allUsers = await usersRepository.getUsers(query);
    return allUsers;
  },
  async deleteUser(userId: string) {
    const result = await usersRepository.deleteUserFromDB(userId);
    return result;
  },
  async findUser(loginUser: LoginUserType) {
    const result = await usersRepository.findUserFromDB(loginUser);
    return result;
  },
  async findUserById(id: string) {
    const result = await usersRepository.findUserByIdUserFromDB(id);
    return result;
  },
};

export type UserType = {
  login: string;
  password: string;
};
// export type UserTypeFromDb = {
//   login: string;
//   password: string;
// };
