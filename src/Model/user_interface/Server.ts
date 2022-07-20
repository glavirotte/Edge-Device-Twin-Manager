import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv"
import { Twin } from '../twin/Twin';
import { TwinProperties } from '../twin/TwinProperties';
import { Synchronizer } from '../Synchronizer';
const cors = require("cors")

interface Body {
    twin?:string
    id?:string
}

class Server {
    private synchronizer:Synchronizer
    private app:Express
    private port:Number
    private twins:Object[]

    constructor(port:Number, synchronizer:Synchronizer){
        this.twins = new Array()
        this.port = port
        this.synchronizer = synchronizer
        dotenv.config();
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}))
        this.app.use(cors())
        this.app.listen(this.port, () => {
            console.log(`⚡️[server]: Server is running at https://localhost:${this.port}`);
        })
        this.app.get("/",(req:Request, res:Response) => {
            res.send("<h1>You are on the root of the server !</h1>")
        })
        this.app.get("/devices",(req:Request, res:Response) => {
            this.synchronizer.getTwins().forEach((twin:Twin) => {
                this.addTwin(twin)
            })
            res.json(this.twins)
        })
        this.app.post("/register", async (req:Request, res:Response) =>{
            const body:Body = req.body
            const cameraID = body.id as unknown as string
            try {
            const twin:Twin = await synchronizer.createTwin(cameraID)
            this.addTwin(twin)
            res.status(200).send()
            } catch (error) {
                console.warn("Error while registering device", error)
                res.status(500).send()
            }
        })
    }

/*##################  Methods  #####################*/

    public addTwin(twin:Twin){
        var id = twin.getID()
        this.twins.push({"id":twin.reported.id, "serial":twin.reported.serialNumber})
        this.app.get('/devices', (req:Request, res:Response) => {
            const devices = this.twins
            res.json(devices)
        });
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
