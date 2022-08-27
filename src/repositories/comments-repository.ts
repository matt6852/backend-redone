import { commentsCollection } from "../db/db";

export const commentsRepository = {
  async createComment(comment: any) {
    try {
      const insertOne = await commentsCollection.insertOne(comment, {
        forceServerObjectId: true,
      });

      return comment;
    } catch (error) {
      return null;
    }
  },
  async findCommentByIdFromDB(id: any) {
    try {
      const comment = await commentsCollection.findOne({ id });
      return comment;
    } catch (error) {
      return null;
    }
  },
  async findCommentByIdAndUserIdFromDB(data: any) {
    const { userId, commentId, content } = data;
    try {
      const comment = await commentsCollection.findOneAndUpdate(
        { $and: [{ id: commentId }, { userId }] },
        { $set: { content } }
      );
      return comment.value;
    } catch (error) {
      return null;
    }
  },
  async deleteCommentFromDb(data: any) {
    const { userId, commentId } = data;
    try {
      const result = await commentsCollection.deleteOne({
        $and: [{ id: commentId }, { userId }],
      });
      return result.deletedCount === 1;
    } catch (error) {
      return null;
    }
  },
  async getComments(id: string, query: any) {
    const { PageNumber = 1, PageSize = 10 } = query;

    try {
      const comments = await commentsCollection
        .find({ postId: id }, { projection: { _id: 0, postId: 0 } })
        .skip(+PageSize * (+PageNumber - 1))
        .limit(+PageSize)
        .toArray();
      const totalCount = await commentsCollection.countDocuments();
      const result = {
        pagesCount: Math.ceil((+totalCount - 1) / +PageSize),
        page: +PageNumber,
        pageSize: +PageSize,
        totalCount: +totalCount - 1,
        items: comments,
      };

      return result;
    } catch (error) {
      return null;
    }
  },
};
