import { authJWT } from "../application/jwtToken";
import { NextFunction, Request, Response } from "express";
import { userService } from "../services/users-service";

export const jwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      return res.sendStatus(401);
    }
    const token = req.headers.authorization.split(" ")[1];
    console.log(token, "error here");

    const { userId } = authJWT.checkJWT(token);
    if (userId) {
      req.user = await userService.findUserById(userId);
      return next();
    }
  } catch (error) {
    console.log(error);

    res.sendStatus(401);
  }
};
