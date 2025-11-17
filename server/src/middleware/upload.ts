import * as multer from "multer";

export const upload = multer.default({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
