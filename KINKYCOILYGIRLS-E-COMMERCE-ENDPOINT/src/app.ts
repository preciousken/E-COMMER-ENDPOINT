import { config } from 'dotenv';
config();
import express, { Application, Request, Response } from 'express';

const app: Application = express();

const PORT: Number = Number(process.env.PORT) || 2500;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(require('cors')());

import './databases/pizzarus';

app.listen(PORT, () => {
  console.log(`
Connection has been established successfully.
App is listening on port ${PORT}...
http://localhost:${PORT}`);
});

import index from './routes/index';
index(app);

// 404 Error Handler
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    error: 'And Just Like That, You Completely Lost Your Way 😥',
  });
});
