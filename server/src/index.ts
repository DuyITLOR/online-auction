import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoute';
import { routes } from './routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRouter);

// Define routes
routes(app);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
