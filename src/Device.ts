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
import { DeviceManager } from './DeviceManager';
import { IResponse } from './interfaces/IResponse'

class Device {
    private id:string
    private ipAddress:string
    private username:string
    private password:string
    private URIs:IURIs
    private deviceManager:DeviceManager

    public constructor(id:string, ipAddress:string){
        this.ipAddress = ipAddress;
        this.id = id;
        this.username = {} as string
        this.password = {} as string
        this.URIs = loadJSON('./src/Data_Storage/URIs.json')
        this.deviceManager = {} as DeviceManager
    }

/*-------------------------Device Methods-------------------------*/

    // Get json object from a Request sent to the Device
    
    private async askDevice(req: Request){
        try {

        // Send request to the Device
        const res = await HttpClient.request(req.getURL(), req.getOptions())
        var data = {} as any;

        if(res.headers['content-type'] === 'text/xml'){
            data = await xml2json(res.data)  // Parse xml to json
            const response:IResponse = JSON.parse(JSON.stringify(data))
            this.deviceManager.updateDeviceTwin(this, response)

        }else if(res.headers['content-type'] === 'text/plain'){
            console.log(res.status.toString())
            console.log(res.data.toString())
        }

        } catch (error) {
            if (error instanceof Error) {
                console.log('In askDevice -> error message: ', error.message);
                return error.message;
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }

    // Install an application on the Device
    
    public async installApplication(application:Application){  
        const protocol = 'http'
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

    }

    // Remove an application from the Device

    public async removeApplication(application:Application){
        const protocol = 'http'
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
    }

    // Give the list of applications currently on the Device

    public async listApplications(){
        const protocol = 'http'
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
        this.askDevice(request)
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
    public setDeviceManager(deviceManager:DeviceManager){
        this.deviceManager = deviceManager
    }
}

export { Device }