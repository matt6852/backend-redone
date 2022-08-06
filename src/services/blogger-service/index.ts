import { bloggerRepository } from "./../../repositories/bloggers-repository";
import { BloggerType, BloggerTypeofDb } from "./../../types/bloggersTypes";
import { v4 as uuidv4 } from "uuid";
import { Query } from "../../routes/bloggers/bloggers-route";
export const bloggerService = {
  async createBlogger(blogger: BloggerType) {
    const newBlogger = { ...blogger, id: uuidv4() };
    const result = await bloggerRepository.createBlogger(newBlogger);
    return result;
  },
  async getAllBloggers(query: any) {
    const allBloggers = await bloggerRepository.getAllBloggerFromDB(query);
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
  async updateBlogger(updateBlogger: BloggerTypeofDb) {
    const updatedBlogger = await bloggerRepository.updateSingleBloggerFromDB(
      updateBlogger
    );
    return updatedBlogger;
  },
};
