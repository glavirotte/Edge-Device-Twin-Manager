import  { Request } from './Request';
import HttpClient, { HttpMethod } from 'urllib';
import { xml2json } from './Utils'
import { Application } from './Application'
import { resourceLimits } from 'worker_threads';


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
    
    async askCamera(req: Request){
        try {        
        // Send request to the camera
        const response = await HttpClient.request(req.getURL(), req.getOptions())
        let data:any;

        if(response.headers['content-type'] === 'text/xml'){
            data = await xml2json(response.data)  // Parse xml to json
            console.log(JSON.stringify(data, null, 2))  // Print response data to the console
            this.data = data
        }else if(response.headers['content-type'] === 'text/plain'){
            console.log(response.status.toString())
            console.log(response.data.toString())
        }
        return await data;

        } catch (error) {
            if (error instanceof Error) {
                console.log('In askCamera -> error message: ', error.message);
                return error.message;
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }

    async uploadApplication(application:Application){
        const protocol = 'http'
        const username = 'root'
        const password = 'root'
        const cameraIP = this.ipAddress
        const uri = 'axis-cgi/applications/upload.cgi'
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${cameraIP}/${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: username+':'+password,
            timeout:30000,
            files: application.getLocation()
        }
        const request = new Request(url, method, username, password, args, options)
        const response = await this.askCamera(request)
            // .then((data:HttpClient.HttpClientResponse<any>) =>{console.log(data.status.toString())})

    }

    async removeApplication(application:Application){
        const protocol = 'http'
        const username = 'root'
        const password = 'root'
        const cameraIP = this.ipAddress
        const uri = 'axis-cgi/applications/control.cgi'
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${cameraIP}/${uri}`
        const args:Map<string, string> = new Map()
        args.set('package', application.getName())
        args.set('action', 'remove')
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: username+':'+password,
            timeout:30000,
            files: application.getLocation()
        }
        const request = new Request(url, method, username, password, args, options)
        const response = await this.askCamera(request)
    }

    async listApplications(){
        const protocol = 'http'
        const username = 'root'
        const password = 'root'
        const cameraIP = this.ipAddress
        const uri = 'axis-cgi/applications/list.cgi'
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${cameraIP}/${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: username+':'+password,
            timeout: 5000,
        }
        const request = new Request(url, method, username, password, args, options)
        const response = await this.askCamera(request)
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