import  { Request } from "./Request";
import httpClient from 'urllib';
import {xml2json} from './Utils'


class Camera {
    id:string;
    ipAddress:string;
    data:any;

    constructor(id:string, ipAddress:string){
        this.ipAddress = ipAddress;
        this.id = id;
        this.data = {};
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
        // httpClient.request(req.getURL(), options, responseHandler)
        const result = await httpClient.request(req.getURL(), options)
        this.data = xml2json(result.data)
        return this.data;

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