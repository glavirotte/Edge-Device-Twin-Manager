import  { Request } from "./Request";
import httpClient from 'urllib';
import http from 'http'
const xml2js = require('xml2js');

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
    
        // Callback function that handles response from camera
        const responseHandler = (err: Error, data: any, res: http.IncomingMessage) => {
            if (err) {
            console.log(err);
            }
            console.log(res.statusCode);
            console.log(res.headers);
            console.log(data.toString());
    
            //Parse xml from response and generate a json object
            xml2js.parseString(data, (err:Error, result:JSON) => {
            if(err) {
                throw err;
            }
            // result is a JavaScript object
            // convert it to a JSON string
            this.data = result
            this.displayData()
            return result;
            });
            
        }
    
        // Send request to the camera
        httpClient.request(req.getURL(), options, responseHandler)

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