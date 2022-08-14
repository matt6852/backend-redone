import { LoginUserType } from "../routes/auth-route";
import { userService } from "./users-service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { myCryptService } from "../application/codeAndDecodePassword";
export const authService = {
  async login(loginUser: LoginUserType) {
    const user = await userService.findUser(loginUser);
    // const match = await bcrypt.compare(loginUser.password, user.hashPassword);
    if (user?._id) {
      const match = await myCryptService.decodePassword(
        loginUser.password,
        user.hashPassword
      );
      if (match) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
        return token;
      }
    }
    return null;
  },
};
