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
    console.log("error here", token);

    const { userId: id } = authJWT.checkJWT(token);
    if (id) {
      req.user = await userService.findUserById(id);
      return next();
    }
  } catch (error) {
    console.log(error);

    res.sendStatus(401);
  }
};
