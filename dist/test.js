"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const urllib_1 = __importDefault(require("urllib"));
const url = 'https://postman-echo.com/digest-auth';
class Request {
    constructor(url, args) {
        this.url = url;
        this.args = args;
    }
    getURL() {
        return this.url;
    }
}
async function getCameraData(req) {
    try {
        // const response: Response
        const options = {
            method: 'GET',
            rejectUnauthorized: false,
            // auth: "username:password" use it if you want simple auth
            digestAuth: "postman:password",
            headers: {
                //'Content-Type': 'application/xml'  use it if payload is xml
                //'Content-Type': 'application/json' use it if payload is json 
                'Content-Type': 'application/text'
            }
        };
        const responseHandler = (err, data, res) => {
            if (err) {
                console.log(err);
            }
            console.log(res.statusCode);
            console.log(res.headers);
            console.log(data);
        };
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
const req = new Request(url, ['GET']);
getCameraData(req);
