import { commentInputValidator, isValidComment } from "../middlwares/comments";

import {
  isBloggerExist,
  isValidPost,
  postInputValidator,
} from "../middlwares/posts";
import { Request, Response, Router } from "express";
import { postsService } from "../services/posts-service";
import { authBasic } from "../middlwares/basic-auth-middlware";
import { jwtAuthMiddleware } from "../middlwares/jwt-auth-middlware";
import { commentsService } from "../services/comments-service";

export const postsRouter = Router({});

postsRouter.post(
  "/",
  authBasic,
  isValidPost,
  postInputValidator,
  isBloggerExist,
  async (req: Request, res: Response) => {
    const newPost = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      bloggerId: req.body.bloggerId,
      bloggerName: req.body.bloggerName,
    };
    const result = await postsService.createPost(newPost);
    if (!result?.id) return res.sendStatus(400);
    return res.status(201).json(result);
  }
);
postsRouter.get("/", async (req: Request, res: Response) => {
  const query = req.query;
  const getAllPosts = await postsService.getAllPosts(query);
  return res.status(200).json(getAllPosts);
});
postsRouter.get("/:postId", async (req: Request, res: Response) => {
  const { postId } = req.params;
  const singlePost = await postsService.getSinglePost(postId);
  if (!singlePost) return res.sendStatus(404);
  return res.status(200).json(singlePost);
});

postsRouter.put(
  "/:postId",
  authBasic,
  isValidPost,
  postInputValidator,
  isBloggerExist,
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const updatedPost = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      bloggerId: req.body.bloggerId,
      bloggerName: req.body.bloggerName,
      id: postId,
    };
    const result = await postsService.upDatePost(updatedPost);
    if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
  }
);
postsRouter.delete(
  "/:postId",
  authBasic,
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const result = await postsService.deletePost(postId);
    if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
  }
);

postsRouter.get("/:postId/comments", async (req: Request, res: Response) => {
  const { postId } = req.params;
  const query = req.query;
  const singlePost = await postsService.getSinglePost(postId);
  if (!singlePost) return res.sendStatus(404);
  const result = await commentsService.getComments(postId, query);
  return res.status(201).send(result);
});
postsRouter.post(
  "/:postId/comments",
  jwtAuthMiddleware,
  isValidComment,
  commentInputValidator,
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { content } = req.body;
    const user = req.user;
    const singlePost = await postsService.getSinglePost(postId);
    if (!singlePost) return res.sendStatus(404);
    const newComment = {
      content,
      userId: user.id,
      userLogin: user.login,
      addedAt: new Date(),
      postId,
    };
    const result = await commentsService.createComment(newComment);
    return res.status(201).send(result);
  }
);
