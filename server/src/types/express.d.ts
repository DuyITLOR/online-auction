import { JwtPayload } from "jsonwebtoken";
import * as Multer from "multer";

export interface JwtPayloadCustom extends JwtPayload {
  id: string;
  email: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadCustom;

      file?: Multer.File;
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}
