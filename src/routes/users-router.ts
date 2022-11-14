import { Request, Response, Router } from "express";
import { authBasic } from "../middlwares/basic-auth-middlware";
import { isValidUser, userInputValidator } from "../middlwares/users";
import { userService } from "../services/users-service";
export const userRoute = Router();
userRoute.post(
  "/",
  authBasic,
  isValidUser,
  userInputValidator,
  async (req: Request, res: Response) => {
    const { login, password, email } = req.body;
    console.log("user created");
    const result = await userService.createUser({ login, password, email });
    if (!result) return res.sendStatus(400);
    return res.status(201).json(result);
  }
);
userRoute.get("/", async (req: Request, res: Response) => {
  console.log("get all users");
  const query = req.query ?? null;
  const result = await userService.getAllUsers(query);
  res.send(result);
});
userRoute.delete("/:userId", authBasic, async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await userService.deleteUser(userId);
  if (!result) return res.sendStatus(404);
  return res.sendStatus(204);
});
