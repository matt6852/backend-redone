import { postsCollection } from "../db/db";
import { PostTypeForDb } from "../types/postsTypes";

export const postsRepository = {
  async createPost(post: PostTypeForDb) {
    try {
      await postsCollection.insertOne(post, {
        forceServerObjectId: true,
      });
      return post;
    } catch (error) {
      return null;
    }
  },
  async getAllPostsFromDb(query: any) {
    const { PageNumber = 1, PageSize = 10 } = query;
    try {
      const allPosts = await postsCollection
        .find({}, { projection: { _id: 0 } })
        .skip(+PageSize * (+PageNumber! - 1))
        .limit(+PageSize)
        .toArray();
      const totalCount = await postsCollection.countDocuments({});
      const result = {
        pagesCount: Math.ceil(+totalCount / PageSize!),
        page: PageNumber,
        pageSize: PageSize,
        totalCount,
        items: allPosts,
      };
      return result;
    } catch (error) {
      return null;
    }
  },
  async getAllBloggersPostsFromDb(bloggerId: string, query: any) {
    const { PageNumber = 1, PageSize = 10 } = query;

    try {
      const allBloggerPosts = await postsCollection
        .find({ bloggerId }, { projection: { _id: 0 } })
        .skip(+PageSize * (+PageNumber - 1))
        .limit(+PageSize)
        .toArray();
      const totalCount = await postsCollection.countDocuments({
        bloggerId,
      });
      return {
        pagesCount: Math.ceil(+totalCount / PageSize!),
        page: PageNumber,
        pageSize: PageSize,
        totalCount,
        items: allBloggerPosts,
      };
    } catch (error) {
      return null;
    }
  },
  async getAllSinglePostFromDb(postId: string) {
    try {
      const singlePost = await postsCollection.findOne({ id: postId });
      return singlePost;
    } catch (error) {
      return null;
    }
  },

  async updatePostFromDb(post: PostTypeForDb) {
    try {
      const result = await postsCollection.findOneAndUpdate(
        { id: post.id, bloggerId: post.bloggerId },
        {
          $set: {
            ...post,
          },
        }
      );
      return result.value;
    } catch (error) {
      return null;
    }
  },
  async deleteSinglePostFromDb(postId: string) {
    try {
      const deletedPost = await postsCollection.deleteOne({
        id: postId,
      });
      return deletedPost.deletedCount === 1;
    } catch (error) {
      return null;
    }
  },
};
