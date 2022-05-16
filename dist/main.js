"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const urllib_1 = __importDefault(require("urllib"));
const xml2js = require('xml2js');
/*-----------------Just for testing----------------*/
const protocol = 'https';
const username = 'root';
const password = 'root';
const cameraIP = '192.168.50.34';
const path = 'axis-cgi/applications/list.cgi';
const method = 'GET';
const url = `${protocol}://${cameraIP}/${path}`;
/*--------------------------------------------------*/
// Class that defines request
class Request {
    constructor(url, method, username, password) {
        this.url = url;
        this.username = username;
        this.password = password;
        this.method = method;
    }
    getURL() {
        return this.url;
    }
    getMethod() {
        return this.method;
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
}
// Get json object from a Request sent to the camera
async function getCameraData(req) {
    try {
        // const response: Response
        const options = {
            method: req.getMethod(),
            rejectUnauthorized: false,
            // auth: "username:password" use it if you want simple auth
            digestAuth: req.getUsername() + ':' + req.getPassword(),
            headers: {
                //'Content-Type': 'application/text'  use it if payload is text
                //'Content-Type': 'application/json' use it if payload is json 
                'Content-Type': 'application/xml'
            }
        };
        // Callback function that handles response from camera
        const responseHandler = (err, data, res) => {
            if (err) {
                console.log(err);
            }
            console.log(res.statusCode);
            console.log(res.headers);
            console.log(data.toString());
            //Parse xml from response and generate a json object
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }
                // `result` is a JavaScript object
                // convert it to a JSON string
                const json = JSON.stringify(result, null, 4);
                // log JSON string
                console.log(json);
            });
        };
        // Send request to the camera
        urllib_1.default.request(req.getURL(), options, responseHandler);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            return error.message;
        }
        else {
            console.log('unexpected error: ', error);
            return 'An unexpected error occurred';
        }
    }
}
const req = new Request(url, method, username, password);
getCameraData(req);
