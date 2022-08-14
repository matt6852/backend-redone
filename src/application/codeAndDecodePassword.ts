import bcrypt from "bcrypt";
const saltRounds = 10;

export const myCryptService = {
  async codePassword(password: string) {
    const result = await bcrypt.hash(password, saltRounds);
    return result;
  },
  async decodePassword(password: string, hasPassword: string) {
    const result = await bcrypt.compare(password, hasPassword);
    return result;
  },
};
