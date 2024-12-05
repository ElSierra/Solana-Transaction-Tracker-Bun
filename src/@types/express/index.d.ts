import * as express from "express";
import { IUser } from "../../services/auth";

declare module "express" {
  export interface Request {
    user?: IUser;
  }
}
