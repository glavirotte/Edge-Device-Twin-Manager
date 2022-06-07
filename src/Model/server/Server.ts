import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv"
import { Twin } from '../Twin';
const cors = require("cors")

class Server {

    private app:Express
    private port:Number

    constructor(port:Number){
        this.port = port

        dotenv.config();
        this.app = express();
        this.app.use(cors())
        this.app.listen(this.port, () => {
            console.log(`⚡️[server]: Server is running at https://localhost:${this.port}`);
        });
        this.app.get("/",(req:Request, res:Response) => {
            res.send("<h1>You are on the root of the server !</h1>")
        })
    }

/*##################  Methods  #####################*/

    public addTwinProxy(twin:Twin){
        var id = twin.getID()
        id = "B8A44F3A42AB"
        this.app.get('/devices/'+id, (req: Request, res: Response) => {
            res.json(twin);
        });
        this.app.get('/devices/'+id+'/light/switch', (req: Request, res: Response) => {
            twin.proxyswitchLight = true
            res.send("light switched")
        });
        this.app.get('/devices/'+id+'/light/status', (req: Request, res: Response) => {
            const lightStatus = twin.getLightStatus()
            res.send('<p>'+lightStatus+'<p>')
        });
        this.app.get('/devices/'+id+'/connected', (req: Request, res: Response) => {
            const status = (twin.getState() === 0)?("Offline"):("Connected")
            res.send('<p>'+status+'<p>')
        });
    }


/*#############  Getters and Setters  ###############*/

    public getApp():Express{
        return this.app
    }
    public getPort():Number{
        return this.port
    }

}

export { Server }
