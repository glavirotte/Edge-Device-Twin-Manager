import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv"
import { Twin } from '../twin/Twin';
import { TwinProperties } from '../twin/TwinProperties';
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
const cors = require("cors")

interface Body {
    twin:string
}

interface IDiff{
    added:TwinProperties
    deleted:TwinProperties
    updated:TwinProperties
}

class Server {
    
    private app:Express
    private port:Number
    private twins:Twin[]

    constructor(port:Number){
        this.port = port
        this.twins = new Array<Twin>()
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
        
        this.app.get("/devices",(req:Request, res:Response) => {
            res.json(this.twins)
        })
    }

/*##################  Methods  #####################*/

    public addTwin(twin:Twin){
        var id = twin.getSerialNumber()
        this.twins.push(twin)
        this.app.get('/devices/'+id, (req: Request, res: Response) => {
            const dataToSend = twin.reported
            res.json(dataToSend);
        });

        this.app.post('/devices/'+id+'/desired', (req: Request, res: Response) => {
            const body:Body = req.body
            const desiredTwin = body.twin as unknown as TwinProperties

            twin.desired.effectivityDate = desiredTwin.effectivityDate  // Set the effectivity date before the other props to use it

            Object.assign(twin.desired, desiredTwin)
            res.status(200).send()
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
