import { Request, Response, Router } from "express";
import { jwtAuthMiddleware } from "../middlwares/jwt-auth-middlware";
import { commentInputValidator, isValidComment } from "../middlwares/comments";
import { commentsService } from "../services/comments-service";

export const commentsRouter = Router({});

commentsRouter.put(
  "/:commentId",
  jwtAuthMiddleware,
  isValidComment,
  commentInputValidator,
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.sendStatus(403);
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = await commentsService.findCommentById(commentId);
    if (!comment) return res.sendStatus(404);
    const find = {
      commentId,
      userId: user.id,
      content,
    };
    const result = await commentsService.findCommentByIdAndUserId(find);

    if (!result) return res.sendStatus(403);
    return res.sendStatus(204);
  }
);
commentsRouter.get("/:commentId", async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const comment = await commentsService.findCommentById(commentId);
  if (!comment) return res.sendStatus(404);
  return res.status(200).send(comment);
});
commentsRouter.delete(
  "/:commentId",
  jwtAuthMiddleware,
  async (req: Request, res: Response) => {
    const user = req.user;
    const { commentId } = req.params;

    const comment = await commentsService.findCommentById(commentId);

    if (!comment) return res.sendStatus(404);
    const data = {
      commentId,
      userId: user.id,
    };
    const deleted = await commentsService.deleteComment(data);
    if (!deleted) return res.sendStatus(403);
    return res.sendStatus(204);
  }
);
