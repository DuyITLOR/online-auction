import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoute";
import { routes } from "./routes";
import productRouter from "./routes/productRoute";
import categoryRouter from "./routes/categoryRoute";
import passport from "passport";
require("./config/passport");

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Define routes
routes(app);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
