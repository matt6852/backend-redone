import { usersRepository } from "./../repositories/users-repository";
import { LoginUserType } from "../routes/auth-route";
import { userService } from "./users-service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { myCryptService } from "../application/codeAndDecodePassword";
import { add } from "date-fns";
import { emailManager } from "../application/emailManager";
export const authService = {
  async login(loginUser: LoginUserType) {
    const user = await userService.findUser(loginUser);
    console.log(user, "user Auth service");

    // const match = await bcrypt.compare(loginUser.password, user.hashPassword);
    if (user?._id) {
      const match = await myCryptService.decodePassword(
        loginUser.password,
        user.accountData.password
      );
      if (match && user.emailConfirmation.isConfirmed) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
        return token;
      }
    }
    return null;
  },
  async registrationUser(user: LoginUserType) {
    const { login, password, email } = user;

    const hashPassword = await myCryptService.codePassword(password);
    const newUser = {
      id: uuidv4(),
      accountData: {
        login,
        email: email,
        password: hashPassword,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: false,
      },
    };
    const regisUser = await usersRepository.createUserByEmail(newUser);
    try {
      const result = await emailManager.sendEmail(regisUser);
      if (!result) return null;
      return regisUser;
    } catch (error) {
      return null;
    }
  },
  async confirmEmail(code: any) {
    const result = await usersRepository.findUserByCode(code);
    // console.log(result);
    return result;
  },
  async resendRegistration(email: any) {
    const foundUser = await usersRepository.findUserByEmail(email);
    if (!foundUser) return null;
    // console.log(foundUser);
    const resentUser = {
      id: foundUser.id,
      accountData: {
        login: foundUser.accountData.login,
        email: foundUser.accountData.email,
        password: foundUser.accountData.password,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: false,
      },
    };
    // return resentUser;

    const result = await usersRepository.resendConfirmCode(resentUser);
    try {
      const result = await emailManager.sendEmail(resentUser);
      if (!result) return null;
      return result;
    } catch (error) {
      return null;
    }
  },
  async isUserExists(user: any) {
    const result: any = await usersRepository.findUserByEmailOrLogin(user);
    // console.log(result);
    return result;
  },
};
