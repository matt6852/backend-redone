import { authService } from "../services/auth-service";
import { Request, Response, Router } from "express";
import {
  isValidUser,
  isValidUserLogin,
  userInputValidator,
} from "../middlwares/users";
import { antiDDoSMiddleware } from "../middlwares/auth-middleware";

export const authRoute = Router({});
authRoute.post(
  "/login",
  isValidUserLogin,
  userInputValidator,
  antiDDoSMiddleware,
  async (req: Request, res: Response) => {
    const { login, password, email } = req.body;
    const loginUser: LoginUserType = {
      login,
      password,
      email,
    };
    const token = await authService.login(loginUser);
    // console.log(result, "result");
    if (!token) return res.sendStatus(401);

    res.send({ token });
  }
);
authRoute.post(
  "/registration",
  isValidUser,
  userInputValidator,
  antiDDoSMiddleware,
  async (req: Request, res: Response) => {
    const { login, password, email } = req.body;
    const regUser: LoginUserType = {
      login,
      password,
      email,
    };
    const result = await authService.registrationUser(regUser);
    if (result) return res.sendStatus(204);
  }
);
authRoute.post(
  "/registration-confirmation",
  antiDDoSMiddleware,
  async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code) {
      return res.send({
        errorsMessages: [
          {
            message: "Invalid value",
            field: "code",
          },
        ],
      });
    }
    const result = await authService.confirmEmail(code);
    if (result) return res.sendStatus(204);
  }
);
authRoute.post(
  "/registration-email-resending",
  antiDDoSMiddleware,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.send({
        errorsMessages: [
          {
            message: "Invalid value",
            field: "email",
          },
        ],
      });
    }
    const result = await authService.resendRegistration(email);
    // console.log(result, "Route");

    if (result) {
      return res.sendStatus(204);
    }
    res.sendStatus(400);
  }
);

export type LoginUserType = {
  login: string;
  password: string;
  email: string;
};
