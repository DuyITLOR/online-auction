import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import http from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './socket';
import { routes } from './routes';
import './jobs/auctionEndJob';
import './config/passport';

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Define routes
routes(app);

// 🔹 Tạo HTTP server từ Express
const server = http.createServer(app);

// 🔹 Gắn Socket.IO
const feUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: feUrl,
    credentials: true,
  },
});

setupSocket(io);

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server + Socket running on port ${PORT}`);
});
