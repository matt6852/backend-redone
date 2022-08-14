import { NextFunction, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";
import { bloggerService } from "../../services/blogger-service/bloggers-service";

export const postInputValidator = (
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

export const isValidPost = [
  body("title").isString().isLength({ max: 30 }).trim().not().isEmpty().bail(),
  body("shortDescription")
    .isString()
    .isLength({ max: 100 })
    .trim()
    .not()
    .isEmpty()
    .bail(),
  body("content")
    .isString()
    .isLength({ max: 1000 })
    .trim()
    .not()
    .isEmpty()
    .bail(),
  body("bloggerId").not().isEmpty().bail(),
];
export const isValidPostForSingleBlogger = [
  body("title").isString().isLength({ max: 30 }).trim().not().isEmpty().bail(),
  body("shortDescription")
    .isString()
    .isLength({ max: 100 })
    .trim()
    .not()
    .isEmpty()
    .bail(),
  body("content")
    .isString()
    .isLength({ max: 1000 })
    .trim()
    .not()
    .isEmpty()
    .bail(),
  // body("bloggerId").not().isEmpty().bail(),
];

export const isBloggerExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { bloggerId } = req.body;
  const isBloggerExist = await bloggerService.getSingleBlogger(bloggerId);
  if (!isBloggerExist) {
    res.status(400).json({
      errorsMessages: {
        message: "Invalid value",
        field: "bloggerId",
      },
    });
    return;
  }
  req.body = { ...req.body, bloggerName: isBloggerExist.name };

  next();
};
