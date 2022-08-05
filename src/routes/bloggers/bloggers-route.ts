import { authBasic } from "./../../middlwares/aurh/basic-auth-middlware";
import { bloggerService } from "./../../services/blogger-service/index";
import {
  isValidBlogger,
  bloggerInputValidator,
} from "./../../middlwares/bloggers-middlware/index";
import { Request, Response, Router } from "express";

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
  const allBloggers = await bloggerService.getAllBloggers();
  res.status(200).json(allBloggers);
});
bloggersRouter.get("/:bloggerId", async (req: Request, res: Response) => {
  const { bloggerId } = req.params;
  const singleBlogger = await bloggerService.getSingleBlogger(bloggerId);
  if (!singleBlogger) return res.sendStatus(404);
  return res.status(200).json(singleBlogger);
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
