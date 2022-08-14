import { NextFunction, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";

export const commentInputValidator = (
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
export const isValidComment = [
  body("content").isString().isLength({ max: 300, min: 20 }),
];
