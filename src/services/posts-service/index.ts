import { PostTypeForDb } from "./../../types/postsTypes";
import { PostType } from "../../types/postsTypes";
import { v4 as uuidv4 } from "uuid";
import { postsRepository } from "../../repositories/post-repository";

export const postsService = {
  async createPost(post: PostType) {
    const postForDb = {
      ...post,
      id: uuidv4(),
    };
    const result = await postsRepository.createPost(postForDb);
    return result;
  },
  async getAllPosts() {
    const allPosts = await postsRepository.getAllPostsFromDb();
    return allPosts;
  },
  async getSinglePost(postId: string) {
    const singlePost = await postsRepository.getAllSinglePostFromDb(postId);
    return singlePost;
  },
  async upDatePost(post: PostTypeForDb) {
    const singlePost = await postsRepository.updatePostFromDb(post);
    return singlePost;
  },
  async deletePost(postId: string) {
    const result = await postsRepository.deleteSinglePostFromDb(postId);
    return result;
  },
};
