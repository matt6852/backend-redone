import { Request } from "express";

declare global {
  declare namespace Express {
    export interface Request {
      user: any;
    }
  }
}
