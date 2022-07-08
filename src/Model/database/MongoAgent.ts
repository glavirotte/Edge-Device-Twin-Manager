import { MongoClient, Collection, Db, WithId} from "mongodb"
import { ITwin } from "../interfaces/ITwin"
import { Twin } from "../twin/Twin"

class MongoAgent{
    private uri:string
    private client:MongoClient
    private databaseName:string
    private collectionName:string
    private db:Db

    constructor(login:string, password:string, databaseName:string){
        this.databaseName = databaseName
        this.collectionName = databaseName
        this.uri = `mongodb://${login}:${password}@localhost:27017/${databaseName}`
        this.client = new MongoClient(this.uri)
        this.client.connect()
        this.db = this.client.db(this.databaseName)
    }

    public ping(){
        this.db.command({ ping: 1 }).then(() => console.log("Connected to database:",this.databaseName,"and collection:",this.databaseName, "!")); //ping Table
    }

    public async find(obj:Object, collectionName:string):Promise<ITwin>{
        const collection:Collection<Twin> = this.db.collection(collectionName)
        const twins:ITwin[] = await collection.find(obj).toArray() as unknown as ITwin[]
        console.log("Result:", twins);
        return twins[0]
    }
    public async insert(twin:Twin, collectionName:string){
        const collection:Collection<Twin> = this.db.collection(collectionName)
        collection.insertOne(twin)
    }

    public async update(obj:Object, collectionName:string){
        // const collection:Collection<Twin> = this.db.collection(collectionName)
        // const twins:ITwin[] = await collection.find(obj).toArray() as unknown as ITwin[]
        // console.log("Result:", twins);
        // return twins[0]
    }
}


export {MongoAgent}