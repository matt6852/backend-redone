import "dotenv/config";
import { runDb } from "./db";
import express from "express";
import { bloggersRouter } from "./routes/bloggers/bloggers-route";
import { postsRouter } from "./routes/postsroute/posts-router";

const app = express();
const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("Hello");
});
app.use(express.json());

app.use("/bloggers", bloggersRouter);
app.use("/posts", postsRouter);
const startServer = async () => {
  await runDb();
  app.listen(port, () => console.log(`App starts at port ${port}...`));
};
startServer();
