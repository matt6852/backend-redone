import { BloggerTypeforDb } from "./../types/bloggersTypes";
import { bloggersCollection } from "../db";
import { BloggerType } from "../types/bloggersTypes";

export const bloggerRepository = {
  async createBlogger(blogger: BloggerTypeforDb) {
    try {
      await bloggersCollection.insertOne(blogger, {
        forceServerObjectId: true,
      });
      return blogger;
    } catch (error) {
      return null;
    }
  },
  async getAllBloggerFromDB() {
    try {
      const allBloggers = await bloggersCollection
        .find({}, { projection: { _id: 0 } })
        .toArray();
      return allBloggers;
    } catch (error) {
      return null;
    }
  },
  async getSingleBloggerFromDB(bloggerId: string) {
    try {
      const singleBlogger = await bloggersCollection.findOne({ id: bloggerId });
      return singleBlogger;
    } catch (error) {
      return null;
    }
  },
  async deleteSingleBloggerFromDB(bloggerId: string) {
    try {
      const deleteBlogger = await bloggersCollection.deleteOne({
        id: bloggerId,
      });
      console.log(deleteBlogger);

      return deleteBlogger.deletedCount === 1;
    } catch (error) {
      return null;
    }
  },
  async updateSingleBloggerFromDB(updateBlogger: BloggerTypeforDb) {
    try {
      const result = await bloggersCollection.findOneAndUpdate(
        { id: updateBlogger.id },
        {
          $set: {
            name: updateBlogger.name,
            youtubeUrl: updateBlogger.youtubeUrl,
          },
        }
      );
      return result.value;
    } catch (error) {
      return null;
    }
  },
};
