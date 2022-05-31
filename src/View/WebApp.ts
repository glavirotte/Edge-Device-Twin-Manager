import express, { Express, Request, Response } from 'express';
import { document } from "Document"

dotenv.config();
const app: Express = express();
const port = 8000;
const twinDisplay = document.querySelector("#twin")  as HTMLInputElement | null;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});