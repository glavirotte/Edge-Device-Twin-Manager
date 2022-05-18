import  { Request } from './Request';
import HttpClient, { HttpMethod } from 'urllib';
import { xml2json } from './Utils'
import { Application } from './Application'
import { User } from './User';


class Camera {
    id:string;
    ipAddress:string;
    data:JSON;
    user:User

    constructor(id:string, ipAddress:string){
        this.ipAddress = ipAddress;
        this.id = id;
        this.data = JSON.parse('{}');
        this.user = new User('', '')
    }

/*-------------------------Camera Methods-------------------------*/

    connect(user:User){
        this.user.username = user.getUsername()
        this.user.password = user.getPassword()
    }

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

    //Upload an application to the camera

    async uploadApplication(application:Application){  
        const protocol = 'http'
        const cameraIP = this.ipAddress
        const uri = 'axis-cgi/applications/upload.cgi'
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${cameraIP}/${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: this.user.username+':'+this.user.password,
            timeout:30000,
            files: application.getLocation()
        }
        const request = new Request(url, method, this.user.username, this.user.password, args, options)
        const response = await this.askCamera(request)

    }

    //Remove an application from the camera

    async removeApplication(application:Application){
        const protocol = 'http'
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
            digestAuth: this.user.username+':'+this.user.password,
            timeout:30000,
            files: application.getLocation()
        }
        const request = new Request(url, method, this.user.username, this.user.password, args, options)
        const response = await this.askCamera(request)
    }

    //Give the list of applications currently on the camera

    async listApplications(){
        const protocol = 'http'
        const cameraIP = this.ipAddress
        const uri = 'axis-cgi/applications/list.cgi'
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${cameraIP}/${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: this.user.username+':'+this.user.password,
            timeout: 5000,
        }
        const request = new Request(url, method, this.user.username, this.user.password, args, options)
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