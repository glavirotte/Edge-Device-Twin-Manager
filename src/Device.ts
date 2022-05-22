/*#######################################################  

This class describes and give methods to communicate 
with a physical device on the local network

#########################################################*/

import  { Request } from './Request';
import HttpClient, { HttpMethod } from 'urllib';
import { xml2json } from './Utils'
import { Application } from './Application'
import { loadJSON } from './Utils'
import { IURIs } from './interfaces/IURIs'
import { IResponse } from './interfaces/IResponse'

class Device{

    private id:string
    private ipAddress:string
    private username:string
    private password:string
    private URIs:IURIs

    public constructor(ipAddress:string){
        this.ipAddress = ipAddress;
        this.id = {} as string;
        this.username = {} as string
        this.password = {} as string
        this.URIs = loadJSON('./src/Data_Storage/URIs.json')
    }

/*-------------------------Device Methods-------------------------*/

    // Get json object from a Request sent to the Device
    
    private async askDevice(req: Request):Promise<IResponse | undefined>{
        try {

        // Send request to the Device
        const res = await HttpClient.request(req.getURL(), req.getOptions())
        var response:IResponse = {} as IResponse

        if(res.headers['content-type'] === 'text/xml'){
            var data = {} as any;
            data = await xml2json(res.data)  // Parse xml to json
            response=  JSON.parse(JSON.stringify(data))

        }else if(res.headers['content-type'] === 'text/plain'){
            if(res.status != 200){
                throw new Error('Error with request ! Status code: '+res.status.toString())
            }
            console.log(res.status.toString())
            console.log(res.data.toString())

        }else if(res.headers['content-type'] === 'application/json;charset=utf8'){
            response = JSON.parse(res.data.toString())
        }

        return response

        } catch (error) {
            if (error instanceof Error) {
                console.log('In askDevice -> error message: ', error.message);
            } else {
                console.log('unexpected error: ', error);
            }
        }
    }

    public async getDeviceInfo():Promise<IResponse | undefined>{
        const protocol = 'http'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.basicdeviceinfo
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion":"1.0", "method":"getAllProperties"}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request)

        if(response !== undefined){
            return response
        }
        return response
    }

    // Request to get the list of Applications currently installed on the device

    public async listApplications(){
        const protocol = 'https'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.list
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
            timeout: 5000,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        await this.askDevice(request)
    }

    // Install an application on the Device
    
    public async installApplication(application:Application){  
        const protocol = 'https'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.upload
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
            timeout:30000,
            files: application.getLocation()
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        await this.askDevice(request)
        await this.listApplications()
    }

    // Remove an application from the Device

    public async removeApplication(application:Application){
        const protocol = 'https'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.control
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        args.set('package', application.getName())
        args.set('action', 'remove')
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
            timeout:30000,
            files: application.getLocation()
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        await this.askDevice(request)
        await this.listApplications()
    }

/*-------------------------Getters & Setters-------------------------*/

    public getID(): string{
        return  this.id
    }
    public getIPAddress():string{
        return this.ipAddress;
    }
    public setLoginCredentials(username:string, password:string){
        this.username = username
        this.password = password
    }
    public setID(id:string){
        this.id = id
    }
}

export { Device }