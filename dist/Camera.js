"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const Request_1 = require("./Request");
const urllib_1 = __importDefault(require("urllib"));
const Utils_1 = require("./Utils");
class Camera {
    constructor(id, ipAddress) {
        this.ipAddress = ipAddress;
        this.id = id;
        this.data = JSON.parse('{}');
    }
    /*-------------------------Camera Methods-------------------------*/
    // Get json object from a Request sent to the camera
    async askCamera(req) {
        try {
            // Send request to the camera
            const response = await urllib_1.default.request(req.getURL(), req.getOptions());
            const responseHeader = response.headers;
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
                console.log('In askCamera -> error message: ', error.message);
                return error.message;
            }
            else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    }
    async uploadApplication(application) {
        const protocol = 'http';
        const username = 'root';
        const password = 'root';
        const cameraIP = this.ipAddress;
        const uri = 'axis-cgi/applications/upload.cgi';
        const method = 'POST';
        const url = `${protocol}://${cameraIP}/${uri}`;
        const args = new Map();
        const options = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: username + ':' + password,
            timeout: 30000,
            files: application.getLocation()
        };
        const request = new Request_1.Request(url, method, username, password, args, options);
        const response = await this.askCamera(request);
        // .then((data:HttpClient.HttpClientResponse<any>) =>{console.log(data.status.toString())})
    }
    async removeApplication(application) {
        const protocol = 'http';
        const username = 'root';
        const password = 'root';
        const cameraIP = this.ipAddress;
        const uri = 'axis-cgi/applications/control.cgi';
        const method = 'POST';
        const url = `${protocol}://${cameraIP}/${uri}`;
        const args = new Map();
        args.set('package', application.getName());
        args.set('action', 'remove');
        const options = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: username + ':' + password,
            timeout: 30000,
            files: application.getLocation()
        };
        const request = new Request_1.Request(url, method, username, password, args, options);
        const response = await this.askCamera(request);
    }
    async listApplications() {
        const protocol = 'http';
        const username = 'root';
        const password = 'root';
        const cameraIP = this.ipAddress;
        const uri = 'axis-cgi/applications/list.cgi';
        const method = 'POST';
        const url = `${protocol}://${cameraIP}/${uri}`;
        const args = new Map();
        const options = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: username + ':' + password,
            timeout: 5000,
        };
        const request = new Request_1.Request(url, method, username, password, args, options);
        const response = await this.askCamera(request);
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
exports.Camera = Camera;
