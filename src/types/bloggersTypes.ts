import { type } from "os";

export type BloggerType = {
  name: string;
  youtubeUrl: string;
};
export type BloggerTypeofDb = {
  name: string;
  youtubeUrl: string;
  id: string;
};

export type BloggersType = BloggerTypeofDb[];
