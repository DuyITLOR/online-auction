import "dotenv/config";
import express from "express";
import cors from "cors";
import { routes } from "./routes";
import passport from "passport";
import "./jobs/auctionEndJob";
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
