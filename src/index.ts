import "dotenv/config";
import { runDb } from "./db/db";
import express from "express";
import { bloggersRouter } from "./routes/bloggers/bloggers-route";
import { postsRouter } from "./routes/postsroute/posts-router";
import { userRoute } from "./routes/users/users-router";
import { authRoute } from "./routes/auth-route/auth-route";
import { commentsRouter } from "./routes/comments/comments-router";

const app = express();
const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("Hello");
});
app.use(express.json());

app.use("/bloggers", bloggersRouter);
app.use("/posts", postsRouter);
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/comments", commentsRouter);
const startServer = async () => {
  await runDb();
  app.listen(port, () => console.log(`App starts at port ${port}...`));
};
startServer();
