"use strict";
/*#######################################################

This class describes and give methods to communicate
with a physical device on the local network

#########################################################*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const Request_1 = require("./Request");
const urllib_1 = __importDefault(require("urllib"));
const Utils_1 = require("./Utils");
class Device {
    constructor(id, ipAddress) {
        this.ipAddress = ipAddress;
        this.id = id;
        this.data = JSON.parse('{}');
        this.username = '';
        this.password = '';
    }
    /*-------------------------Device Methods-------------------------*/
    setLoginCredentials(username, password) {
        this.username = username;
        this.password = password;
    }
    // Get json object from a Request sent to the Device
    async askDevice(req) {
        try {
            // Send request to the Device
            const response = await urllib_1.default.request(req.getURL(), req.getOptions());
            let data;
            if (response.headers['content-type'] === 'text/xml') {
                data = await (0, Utils_1.xml2json)(response.data); // Parse xml to json
                console.log(JSON.stringify(data, null, 2)); // Print response data to the console
                this.data = data;
            }
            else if (response.headers['content-type'] === 'text/plain') {
                console.log(response.status.toString());
                console.log(response.data.toString());
            }
            return await data;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log('In askDevice -> error message: ', error.message);
                return error.message;
            }
            else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }
    //Install an application on the Device
    async installApplication(application) {
        const protocol = 'http';
        const DeviceIP = this.ipAddress;
        const uri = 'axis-cgi/applications/upload.cgi';
        const method = 'POST';
        const url = `${protocol}://${DeviceIP}/${uri}`;
        const args = new Map();
        const options = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: this.username + ':' + this.password,
            timeout: 30000,
            files: application.getLocation()
        };
        const request = new Request_1.Request(url, method, this.username, this.password, args, options);
        const response = await this.askDevice(request);
    }
    //Remove an application from the Device
    async removeApplication(application) {
        const protocol = 'http';
        const DeviceIP = this.ipAddress;
        const uri = 'axis-cgi/applications/control.cgi';
        const method = 'POST';
        const url = `${protocol}://${DeviceIP}/${uri}`;
        const args = new Map();
        args.set('package', application.getName());
        args.set('action', 'remove');
        const options = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: this.username + ':' + this.password,
            timeout: 30000,
            files: application.getLocation()
        };
        const request = new Request_1.Request(url, method, this.username, this.password, args, options);
        const response = await this.askDevice(request);
    }
    //Give the list of applications currently on the Device
    async listApplications() {
        const protocol = 'http';
        const DeviceIP = this.ipAddress;
        const uri = 'axis-cgi/applications/list.cgi';
        const method = 'POST';
        const url = `${protocol}://${DeviceIP}/${uri}`;
        const args = new Map();
        const options = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: this.username + ':' + this.password,
            timeout: 5000,
        };
        const request = new Request_1.Request(url, method, this.username, this.password, args, options);
        const response = await this.askDevice(request);
    }
    /*-------------------------Getters & Setters-------------------------*/
    getID() {
        return this.id;
    }
    getIPAddress() {
        return this.ipAddress;
    }
    getData() {
        return this.data;
    }
    displayData() {
        const json = JSON.stringify(this.data, null, 2);
        console.log(json);
        return json;
    }
}
exports.Device = Device;
