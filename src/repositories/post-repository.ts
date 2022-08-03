import { postsCollection } from "../db";
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
  async getAllPostsFromDb() {
    try {
      const allPosts = await postsCollection
        .find({}, { projection: { _id: 0 } })
        .toArray();
      return allPosts;
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
