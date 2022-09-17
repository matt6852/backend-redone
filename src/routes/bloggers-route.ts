import {
  isValidPostForSingleBlogger,
  postInputValidator,
} from "../middlwares/posts";
import { postsService } from "../services/posts-service";

import { authBasic } from "../middlwares/basic-auth-middlware";
import { BloggerService } from "../services/bloggers-service";
import { isValidBlogger, bloggerInputValidator } from "../middlwares/bloggers";
import { Request, Response, Router } from "express";

export const bloggersRouter = Router({});
class BloggersController {
  private bloggerService: BloggerService;
  constructor() {
    this.bloggerService = new BloggerService();
  }
  async createBlogger(req: Request, res: Response) {
    const { name, youtubeUrl } = req.body;
    const newBlogger = {
      name,
      youtubeUrl,
    };
    const creationResult = await this.bloggerService.createBlogger(newBlogger);
    if (!creationResult) return res.status(400);
    res.status(201).json(creationResult);
    return;
  }
  async getAllBloggers(req: Request, res: Response) {
    const query = req.query ?? null;
    const allBloggers = await this.bloggerService.getAllBloggers(query);
    res.status(200).json(allBloggers);
  }
  async getSingleBlogger(req: Request, res: Response) {
    const { bloggerId } = req.params;
    const singleBlogger = await this.bloggerService.getSingleBlogger(bloggerId);
    if (!singleBlogger) return res.sendStatus(404);
    return res.status(200).json(singleBlogger);
  }
  async getAllBloggersPosts(req: Request, res: Response) {
    const query = req.query;
    const { bloggerId } = req.params;
    const singleBlogger = await this.bloggerService.getSingleBlogger(bloggerId);
    if (!singleBlogger) return res.sendStatus(404);
    const postsForBlogger = await postsService.getAllBloggerPosts(
      bloggerId,
      query
    );
    return res.status(200).json(postsForBlogger);
  }
  async deleteBlogger(req: Request, res: Response) {
    const { bloggerId } = req.params;
    const deleteBlogger = await this.bloggerService.deleteSingleBlogger(
      bloggerId
    );
    if (!deleteBlogger) return res.sendStatus(404);
    return res.sendStatus(204);
  }
  async updateSingleBlogger(req: Request, res: Response) {
    const { bloggerId } = req.params;
    const { name, youtubeUrl } = req.body;
    const update = {
      id: bloggerId,
      name,
      youtubeUrl,
    };
    const updateBlogger = await this.bloggerService.updateBlogger(update);
    if (!updateBlogger) return res.sendStatus(404);
    return res.sendStatus(204);
  }
  async createBloggerPost(req: Request, res: Response) {
    const { bloggerId } = req.params;
    const singleBlogger = await this.bloggerService.getSingleBlogger(bloggerId);
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
}

const bloggersController = new BloggersController();

bloggersRouter.post(
  "/",
  authBasic,
  isValidBlogger,
  bloggerInputValidator,
  bloggersController.createBlogger.bind(bloggersController)
);
bloggersRouter.get(
  "/",
  bloggersController.getAllBloggers.bind(bloggersController)
);
bloggersRouter.get(
  "/:bloggerId",
  bloggersController.getSingleBlogger.bind(bloggersController)
);
bloggersRouter.get(
  "/:bloggerId/posts",
  bloggersController.getAllBloggersPosts.bind(bloggersController)
);
bloggersRouter.delete(
  "/:bloggerId",
  authBasic,
  bloggersController.deleteBlogger.bind(bloggersController)
);
bloggersRouter.put(
  "/:bloggerId",
  authBasic,
  isValidBlogger,
  bloggerInputValidator,
  bloggersController.updateSingleBlogger.bind(bloggersController)
);
bloggersRouter.post(
  "/:bloggerId/posts",
  authBasic,
  isValidPostForSingleBlogger,
  postInputValidator,
  bloggersController.getAllBloggersPosts.bind(bloggersController)
);

export type Query = {
  SearchNameTerm: string | undefined;
  PageNumber: number | undefined;
  PageSize: number | undefined;
};
