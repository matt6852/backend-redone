import { type } from "os";
import { NextFunction, Request, Response } from "express";

export const authBasic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers.authorization;
  if (!headers) return res.sendStatus(401);
  const token = headers.split(" ")[1];
  const [login, password] = Buffer.from(token, "base64")
    .toString("ascii")
    .split(":");
  if (login === checkBasicAuth.login && password === checkBasicAuth.password)
    return next();
  return res.sendStatus(401);
};
type BasicAuth = {
  login: string;
  password: string;
};

const checkBasicAuth: BasicAuth = {
  login: "admin",
  password: "qwerty",
};
