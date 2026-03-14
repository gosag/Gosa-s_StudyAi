// src/types/express.d.ts
import { IUser } from "../models/userSchema";

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}