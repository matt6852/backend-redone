import { BloggersRepository } from "../repositories/bloggers-repository";
import { BloggerType, BloggerTypeofDb } from "../types/bloggersTypes";
import { v4 as uuidv4 } from "uuid";

export class BloggerService {
  public bloggerRepository;
  constructor() {
    this.bloggerRepository = new BloggersRepository();
  }
  async createBlogger(blogger: BloggerType) {
    const newBlogger = { ...blogger, id: uuidv4() };
    const result = await this.bloggerRepository.createBlogger(newBlogger);
    return result;
  }
  async getAllBloggers(query: any) {
    const allBloggers = await this.bloggerRepository.getAllBloggerFromDB(query);
    return allBloggers;
  }
  async getSingleBlogger(bloggerId: any) {
    const singleBlogger = await this.bloggerRepository.getSingleBloggerFromDB(
      bloggerId
    );
    return singleBlogger;
  }
  async deleteSingleBlogger(bloggerId: any) {
    const deleteBlogger =
      await this.bloggerRepository.deleteSingleBloggerFromDB(bloggerId);
    return deleteBlogger;
  }
  async updateBlogger(updateBlogger: BloggerTypeofDb) {
    const updatedBlogger =
      await this.bloggerRepository.updateSingleBloggerFromDB(updateBlogger);
    return updatedBlogger;
  }
}
