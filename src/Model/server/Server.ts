import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv"
const cors = require("cors")

class Server {

    private app:Express
    private port:Number

    constructor(port:Number){
        dotenv.config();
        this.app = express();
        this.port = port
        this.app.use(cors())

        this.app.get('/', (req: Request, res: Response) => {
            res.json({"users":["alphagone", "shundern", "naomi"]});
        });
        
        this.app.get('/light/status', (req: Request, res: Response) => {
        });
        
        this.app.listen(this.port, () => {
          console.log(`⚡️[server]: Server is running at https://localhost:${this.port}`);
        });
    }

    public getApp():Express{
        return this.app
    }
    public getPort():Number{
        return this.port
    }

}

export { Server }
