import { NextFunction, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";

const reg = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/;
const regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const bloggerInputValidator = (
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
    res.status(400).json({ errorsMessages: err });
  } else {
    next();
  }
};

export const isValidBlogger = [
  body("name").isString().isLength({ max: 15 }).trim().not().isEmpty().bail(),
  body("youtubeUrl").matches(reg).isLength({ max: 100 }).bail(),
];
