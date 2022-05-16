import  { Request } from "./Request";
import httpClient from 'urllib';
import {xml2json} from './Utils'


class Camera {
    id:string;
    ipAddress:string;
    data:JSON;

    constructor(id:string, ipAddress:string){
        this.ipAddress = ipAddress;
        this.id = id;
        this.data = JSON.parse('{}');
    }

/*-------------------------Camera Methods-------------------------*/

    // Get json object from a Request sent to the camera
    
    async getCameraData(req: Request){
        try {
        // const response: Response
        // @TODO, move to Request class
        const options:urllib.RequestOptions = {
            method: req.getMethod(),
            rejectUnauthorized: false,
            // auth: "username:password" use it if you want simple auth
            digestAuth: req.getUsername()+':'+req.getPassword(),
            headers: {
            //'Content-Type': 'application/text'  use it if payload is text
            //'Content-Type': 'application/json' use it if payload is json 
            'Content-Type': 'application/xml'
            }
        };
        
        // Send request to the camera
        const result = await httpClient.request(req.getURL(), options)
        const json:any = await xml2json(result.data)
        console.log(JSON.stringify(json, null, 2))
        this.data = json
        return json;

        } catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message);
                return error.message;
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }

   

/*-------------------------Getters & Setters-------------------------*/

    getID(): string{
        return  this.id
    }
    getIPAddress():string{
        return this.ipAddress;
    }
    getData():any{
        return this.data;
    }
    displayData():string{
        const json = JSON.stringify(this.data, null, 2);
        console.log(json);
        return json;
    }
}

export { Camera }