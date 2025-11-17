import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoute';
import { routes } from './routes';
import productRouter from './routes/productRoute';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/', userRouter);
app.use('/api/', productRouter);

// Define routes
routes(app);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
