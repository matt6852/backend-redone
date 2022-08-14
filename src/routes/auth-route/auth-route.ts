import { authService } from "../../services/auth-service/auth-service";
import { Request, Response, Router } from "express";
import {
  isValidUser,
  userInputValidator,
} from "../../middlwares/users-middleware/users";
import { jwtAuthMiddleware } from "../../middlwares/auth/jwt-auth-middlware";

export const authRoute = Router({});
authRoute.post(
  "/login",
  isValidUser,
  userInputValidator,
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
authRoute.get(
  "/test",
  jwtAuthMiddleware,
  async (req: Request, res: Response) => {
    const user = req.user;
    res.send(user);
  }
);

export type LoginUserType = {
  login: string;
  password: string;
};
