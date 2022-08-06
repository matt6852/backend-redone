import { BloggerTypeofDb } from "./../types/bloggersTypes";
import { bloggersCollection } from "../db";
import { BloggerType } from "../types/bloggersTypes";
import { Query } from "../routes/bloggers/bloggers-route";

export const bloggerRepository = {
  async createBlogger(blogger: BloggerTypeofDb) {
    try {
      await bloggersCollection.insertOne(blogger, {
        forceServerObjectId: true,
      });
      return blogger;
    } catch (error) {
      return null;
    }
  },
  async getAllBloggerFromDB(query: Query) {
    const { SearchNameTerm, PageNumber = 1, PageSize = 10 } = query;
    const searchQuery: any = {};
    if (SearchNameTerm) {
      searchQuery.name = { $regex: SearchNameTerm };
    }
    try {
      const allBloggers = await bloggersCollection
        .find(searchQuery, { projection: { _id: 0 } })
        .skip(+PageSize * (+PageNumber - 1))
        .limit(+PageSize)
        .toArray();
      const totalCount = await bloggersCollection.countDocuments(searchQuery);
      const result = {
        pagesCount: Math.ceil(+totalCount / +PageSize),
        page: +PageNumber,
        pageSize: +PageSize,
        totalCount,
        items: allBloggers,
      };
      return result;
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
  async updateSingleBloggerFromDB(updateBlogger: BloggerTypeofDb) {
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
