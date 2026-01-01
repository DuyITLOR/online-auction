import * as Multer from 'multer';
import { User as PrismaUser } from '@prisma/client';
import { JwtPayloadCustom } from '../middleware/authentication';

declare global {
  namespace Express {
    interface User extends PrismaUser {}

    interface Request {
      file?: Multer.File;
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}

export {};
