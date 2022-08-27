import { authService } from "../services/auth-service";
import { Request, Response, Router } from "express";
import {
  isCodeExist,
  isValidUser,
  isValidUserLogin,
  userInputValidator,
} from "../middlwares/users";
import {
  antiDDoSMiddleware,
  isLoginOrEmailExists,
} from "../middlwares/auth-middleware";
import { is } from "date-fns/locale";

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

    return res.status(200).send({ token });
  }
);
authRoute.post(
  "/registration",
  isValidUser,
  userInputValidator,
  isLoginOrEmailExists,
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
  isCodeExist,
  userInputValidator,
  antiDDoSMiddleware,
  async (req: Request, res: Response) => {
    // const { code } = req.query;
    const codeFromBody = req.body.code;
    // console.log(code, "code");
    // console.log(codeFromBody, "codeFromBody");
    // // if (code) {
    //   const result = await authService.confirmEmail(code);
    //   console.log(result, "result");

    //   if (result) return res.sendStatus(204);
    //   return res.status(400).send({
    //     errorsMessages: [
    //       {
    //         message: "Invalid value",
    //         field: "code",
    //       },
    //     ],
    //   });
    // }
    if (codeFromBody) {
      const result = await authService.confirmEmail(codeFromBody);
      console.log(result, "result");

      if (result) return res.sendStatus(204);
      // return res.status(400).send({
      //   errorsMessages: [
      //     {
      //       message: "Invalid value",
      //       field: "code",
      //     },
      //   ],
      // });
    }

    // if (!code && !codeFromBody) {
    //   return res.status(400).send({
    //     errorsMessages: [
    //       {
    //         message: "Invalid value",
    //         field: "code",
    //       },
    //     ],
    //   });
    // }
  }
);
authRoute.post(
  "/registration-email-resending",
  antiDDoSMiddleware,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
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
    return res.status(400).send({
      errorsMessages: [
        {
          message: "Invalid value",
          field: "email",
        },
      ],
    });
  }
);

export type LoginUserType = {
  login: string;
  password: string;
  email: string;
};
