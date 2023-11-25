import express, { Application, Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
const app: Application = express();
//const port = 3000;

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

export default app;
