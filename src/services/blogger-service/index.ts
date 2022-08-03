import { bloggerRepository } from "./../../repositories/bloggers-repository";
import { BloggerType, BloggerTypeforDb } from "./../../types/bloggersTypes";
import { v4 as uuidv4 } from "uuid";
export const bloggerService = {
  async createBlogger(blogger: BloggerType) {
    const newBlogger = { ...blogger, id: uuidv4() };
    const result = await bloggerRepository.createBlogger(newBlogger);
    return result;
  },
  async getAllBloggers() {
    const allBloggers = await bloggerRepository.getAllBloggerFromDB();
    return allBloggers;
  },
  async getSingleBlogger(bloggerId: any) {
    const singleBlogger = await bloggerRepository.getSingleBloggerFromDB(
      bloggerId
    );
    return singleBlogger;
  },
  async deleteSingleBlogger(bloggerId: any) {
    const deleteBlogger = await bloggerRepository.deleteSingleBloggerFromDB(
      bloggerId
    );
    return deleteBlogger;
  },
  async updateBlogger(updateBlogger: BloggerTypeforDb) {
    const updatedBlogger = await bloggerRepository.updateSingleBloggerFromDB(
      updateBlogger
    );
    return updatedBlogger;
  },
};
