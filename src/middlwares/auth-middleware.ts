import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth-service";

type HackerType = {
  ip: string;
  url: string;
  date: number;
};
const hackersArr: HackerType[] = [];
// import { authService } from "../domain/users-service";
export interface BaseAuthData {
  login: string;
  password: string;
}
export const antiDDoSMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;
  const baseUrl = req.baseUrl;
  const path = req.route.path;
  const clientUri = baseUrl + path;

  console.log(ip, clientUri);
  console.log(req.headers["user-agent"]);
  const ddosArr = hackersArr.filter(
    (h) => h.ip === ip && h.url === clientUri && h.date > Date.now() - 10 * 1000
  );
  if (ddosArr.length > 4) {
    res.sendStatus(429);
    return;
  }
  hackersArr.push({ date: Date.now(), ip, url: clientUri });

  next();
};

export const isLoginOrEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { login, password, email } = req.body;
  const isExists = await authService.isUserExists({ login, email, password });
  if (isExists) {
    if (
      isExists.accountData.email === email &&
      isExists.accountData.login === login
    )
      return res.status(400).send({
        errorsMessages: [
          {
            message: "Invalid value",
            field: "login",
          },
          {
            message: "Invalid value",
            field: "email",
          },
        ],
      });
    if (isExists.accountData.login === login)
      return res.status(400).send({
        errorsMessages: [
          {
            message: "Invalid value",
            field: "login",
          },
        ],
      });
    if (isExists.accountData.email === email)
      return res.status(400).send({
        errorsMessages: [
          {
            message: "Invalid value",
            field: "email",
          },
        ],
      });
  } else {
    return next();
  }
};
