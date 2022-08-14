import jwt from "jsonwebtoken";

export const authJWT = {
  // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
  // return token;

  createToken(userId: string) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: "10h",
    });
    return token;
  },
  checkJWT(token: string) {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET!);
      return result;
    } catch (error) {
      console.log(error, "JWT token verify");
      return null;
    }
  },
};
