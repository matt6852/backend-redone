import { authService } from "../../services/auth-service/auth-service";
import { Request, Response, Router } from "express";
import {
  isValidUser,
  userInputValidator,
} from "../../middlwares/users-middleware/users";
import { antiDDoSMiddleware } from "../../middlwares/auth/auth-middleware";

export const authRoute = Router({});
authRoute.post(
  "/login",
  isValidUser,
  userInputValidator,
  antiDDoSMiddleware,
  async (req: Request, res: Response) => {
    const { login, password } = req.body;
    const loginUser: LoginUserType = {
      login,
      password,
    };
    const result = await authService.login(loginUser);
    console.log(result, "result");

    res.send({ data: { result } });
  }
);

export type LoginUserType = {
  login: string;
  password: string;
};
