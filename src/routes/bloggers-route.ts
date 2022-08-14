import { type } from "os";
import {
  isValidPost,
  isValidPostForSingleBlogger,
  postInputValidator,
} from "../middlwares/posts";
import { postsService } from "../services/posts-service";
import {
  BloggerType,
  BloggerTypeofDb as BloggerTypeofDb,
} from "../types/bloggersTypes";
import { authBasic } from "../middlwares/basic-auth-middlware";
import { bloggerService } from "../services/bloggers-service";
import { isValidBlogger, bloggerInputValidator } from "../middlwares/bloggers";
import { Request, Response, Router } from "express";
import { WithId } from "mongodb";

export const bloggersRouter = Router({});

bloggersRouter.post(
  "/",
  authBasic,
  isValidBlogger,
  bloggerInputValidator,
  async (req: Request, res: Response) => {
    const { name, youtubeUrl } = req.body;
    const newBlogger = {
      name,
      youtubeUrl,
    };
    const creationResult = await bloggerService.createBlogger(newBlogger);
    if (!creationResult) return res.status(400);
    res.status(201).json(creationResult);
    return;
  }
);
bloggersRouter.get("/", async (req: Request, res: Response) => {
  const query = req.query ?? null;
  const allBloggers = await bloggerService.getAllBloggers(query);
  res.status(200).json(allBloggers);
});
bloggersRouter.get("/:bloggerId", async (req: Request, res: Response) => {
  const { bloggerId } = req.params;
  const singleBlogger = await bloggerService.getSingleBlogger(bloggerId);
  if (!singleBlogger) return res.sendStatus(404);
  return res.status(200).json(singleBlogger);
});
bloggersRouter.get("/:bloggerId/posts", async (req: Request, res: Response) => {
  const query = req.query;
  const { bloggerId } = req.params;
  const singleBlogger = await bloggerService.getSingleBlogger(bloggerId);
  if (!singleBlogger) return res.sendStatus(404);
  const postsForBlogger = await postsService.getAllBloggerPosts(
    bloggerId,
    query
  );
  return res.status(200).json(postsForBlogger);
});
bloggersRouter.delete(
  "/:bloggerId",
  authBasic,
  async (req: Request, res: Response) => {
    const { bloggerId } = req.params;
    const deleteBlogger = await bloggerService.deleteSingleBlogger(bloggerId);
    if (!deleteBlogger) return res.sendStatus(404);
    return res.sendStatus(204);
  }
);
bloggersRouter.put(
  "/:bloggerId",
  authBasic,
  isValidBlogger,
  bloggerInputValidator,
  async (req: Request, res: Response) => {
    const { bloggerId } = req.params;
    const { name, youtubeUrl } = req.body;
    const update = {
      id: bloggerId,
      name,
      youtubeUrl,
    };
    const updateBlogger = await bloggerService.updateBlogger(update);
    if (!updateBlogger) return res.sendStatus(404);
    return res.sendStatus(204);
  }
);
bloggersRouter.post(
  "/:bloggerId/posts",
  authBasic,
  isValidPostForSingleBlogger,
  postInputValidator,
  async (req: Request, res: Response) => {
    const { bloggerId } = req.params;
    const singleBlogger = await bloggerService.getSingleBlogger(bloggerId);
    if (!singleBlogger) return res.sendStatus(404);
    const newPost = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      bloggerId,
      bloggerName: singleBlogger.name,
    };
    const result = await postsService.createPost(newPost);
    if (!result?.id) return res.sendStatus(400);
    return res.status(201).json(newPost);
  }
);

export type Query = {
  SearchNameTerm: string | undefined;
  PageNumber: number | undefined;
  PageSize: number | undefined;
};
