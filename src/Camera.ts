import  { Request } from './Request';
import HttpClient from 'urllib';
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
        // Send request to the camera
        const response = await HttpClient.request(req.getURL(), req.getOptions())
        const responseHeader = response.headers
        let data:any;

        if(response.headers['content-type'] === 'text/xml'){
            data = await xml2json(response.data)  // Parse xml to json
            console.log(JSON.stringify(data, null, 2))  // Print response data to the console
            this.data = data
        }

        return data;

        } catch (error) {
            if (error instanceof Error) {
                console.log('In getCameraData -> error message: ', error.message);
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