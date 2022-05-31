import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv"

dotenv.config();
const app: Express = express();
const port = 8000;

app.get('/', (req: Request, res: Response) => {
    res.json({"users":["alphagone", "shundern", "naomi"]});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});