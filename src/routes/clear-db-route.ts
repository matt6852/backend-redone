import {
  bloggersCollection,
  commentsCollection,
  postsCollection,
  usersCollection,
} from "../db/db";
import { Request, Response, Router } from "express";

export const clearDBrouter = Router({});

clearDBrouter.delete("/all-data", async (req: Request, res: Response) => {
  try {
    await bloggersCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    await commentsCollection.deleteMany({});
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
