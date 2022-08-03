import { MongoClient } from "mongodb";
export const client = new MongoClient(process.env.MONGO_URI!);

export const bloggersCollection = client.db("bloggers").collection("bloggers");
export const postsCollection = client.db("posts").collection("posts");

export async function runDb() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    // await client.db("bloggers-posts").command({ ping: 1 });
    console.log("Connected successfully to mongo server");
  } catch {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
