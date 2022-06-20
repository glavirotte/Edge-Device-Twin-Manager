import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv"
import { Twin } from '../Twin';
const cors = require("cors")

interface Body {
    value:string
}

class Server {

    private app:Express
    private port:Number

    constructor(port:Number){
        this.port = port
        dotenv.config();
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}))
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
        id = "B8A44F3A4540"
        this.app.get('/devices/'+id, (req: Request, res: Response) => {
            res.json(twin);
        });
        this.app.post('/devices/'+id+'/light/switch', (req: Request, res: Response) => {
            const date:Body = req.body
            console.log("Asked for a light switch at", date.value)
            twin.proxyswitchLight = date.value
            res.status(201).send()
        });
        this.app.get('/devices/'+id+'/light/status', (req: Request, res: Response) => {
            const lightStatus = twin.getLightStatus()
            res.send('<p>'+lightStatus+'<p>')
        });
        this.app.get('/devices/'+id+'/connected', (req: Request, res: Response) => {
            const status = (twin.getDeviceState() === 0)?("Offline"):("Connected")
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