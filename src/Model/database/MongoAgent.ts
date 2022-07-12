import { MongoClient, Collection, Db, DeleteResult} from "mongodb"
import { ITwin } from "../interfaces/ITwin"
import { Twin } from "../twin/Twin"

class MongoAgent{
    private uri:string
    private client:MongoClient
    private databaseName:string
    private collectionName:string
    private db:Db
    private storedTwinsID:string[]

    constructor(login:string, password:string, databaseName:string){
        this.databaseName = databaseName
        this.collectionName = databaseName
        this.storedTwinsID = new Array<string>()
        this.uri = `mongodb://${login}:${password}@localhost:27017/${databaseName}`
        this.client = new MongoClient(this.uri)
        this.client.connect()
        this.db = this.client.db(this.databaseName)
    }

    public ping(){
        this.db.command({ ping: 1 }).then(() => console.log("Connected to database:",this.databaseName,"and collection:",this.databaseName, "!")); //ping Table
    }

    public async find(obj:Object, projection:Object, collectionName:string):Promise<any[]>{
        const collection:Collection<Twin> = this.db.collection(collectionName)
        const twins:any[] = await collection.find(obj, projection).toArray() as unknown as ITwin[]
        return twins //TODO: control response !
    }
    public async insert(twin:Twin, collectionName:string){
        if(!this.storedTwinsID.includes(twin.reported.id)){ // Check if device is already stored
            const collection:Collection<Twin> = this.db.collection(collectionName)
            const ack = (await collection.insertOne(twin))
            if(ack.acknowledged === true){
                this.storedTwinsID.push(twin.reported.id)
            }
            return ack
        }else{
            const ack = await this.update(twin, collectionName)
            return ack
        }
    }

    public async update(twin:Twin, collectionName:string){
        let query = {"reported.id":twin.reported.id}    // Use serial number instead ?
        const collection:Collection<Twin> = this.db.collection(collectionName)
        const ack = (await collection.updateOne(query, { $set: {reported:twin.reported} }))  //TODO: control response !
        return ack
    }

    public async deleteOne(twinID:string, collectionName:string){
        let query = {"reported.id":twinID}
        const collection:Collection<Twin> = this.db.collection(collectionName)
        const ack = (await collection.deleteOne(query))  //TODO: control response !
        return ack
    }

    public setStoredTwins(storedTwinsID:Array<Twin>){
        storedTwinsID.forEach(element => {
            this.storedTwinsID.push(element.reported.id)
        });
    }
    public getStoredTwinsID():Array<string>{
        return this.storedTwinsID
    }
}


export {MongoAgent}