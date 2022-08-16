import { NextFunction, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";
const regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const userInputValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = errors.array({ onlyFirstError: true }).map((e) => {
      return {
        message: e.msg,
        field: e.param,
      };
    });
    return res.status(400).json({ errorsMessages: err });
  }
  return next();
};

export const isValidUser = [
  body("login").isString().isLength({ max: 10, min: 3 }),
  body("email").matches(regEmail),
  body("password").isString().isLength({ max: 26, min: 6 }),
];
