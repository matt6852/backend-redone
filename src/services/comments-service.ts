import { v4 as uuidv4 } from "uuid";
import { commentsRepository } from "../repositories/comments-repository";

export const commentsService = {
  async createComment(newComment: any) {
    const commentWithId = {
      ...newComment,
      id: uuidv4(),
    };

    const result = await commentsRepository.createComment(commentWithId);
    // console.log(result);

    return {
      content: result.content,
      userId: result.userId,
      userLogin: result.userLogin,
      addedAt: result.addedAt,
      id: result.id,
    };
  },
  async getComments(id: string, query: any) {
    const result = await commentsRepository.getComments(id, query);
    return result;
  },
  async findCommentById(id: string) {
    const result = await commentsRepository.findCommentByIdFromDB(id);
    if (result) {
      return {
        id: result.id,
        content: result.content,
        userId: result.userId,
        userLogin: result.userLogin,
        addedAt: result.addedAt,
      };
    }
    return result;
  },
  async findCommentByIdAndUserId(data: any) {
    const result = await commentsRepository.findCommentByIdAndUserIdFromDB(
      data
    );
    return result;
  },
  async deleteComment(data: any) {
    const result = await commentsRepository.deleteCommentFromDb(data);
    return result;
  },
};
