import { Router } from "express";
import { getUserIdByEmail } from "../controllers/userController";

const router = Router();

router.post("/getId", getUserIdByEmail);

export default router;
