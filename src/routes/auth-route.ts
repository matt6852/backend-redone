import { authService } from "../services/auth-service";
import { Request, Response, Router } from "express";
import { isValidUser, userInputValidator } from "../middlwares/users";
import { antiDDoSMiddleware } from "../middlwares/auth-middleware";

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
    const token = await authService.login(loginUser);
    // console.log(result, "result");
    if (!token) return res.sendStatus(401);

    res.send({ token });
  }
);
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
    const token = await authService.login(loginUser);
    // console.log(result, "result");
    if (!token) return res.sendStatus(401);

    res.send({ token });
  }
);

export type LoginUserType = {
  login: string;
  password: string;
};
