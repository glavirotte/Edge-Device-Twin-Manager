"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const urllib_1 = __importDefault(require("urllib"));
const Utils_1 = require("./Utils");
class Camera {
    constructor(id, ipAddress) {
        this.ipAddress = ipAddress;
        this.id = id;
        this.data = {};
    }
    /*-------------------------Camera Methods-------------------------*/
    // Get json object from a Request sent to the camera
    async getCameraData(req) {
        try {
            // const response: Response
            // @TODO, move to Request class
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
            // Send request to the camera
            // httpClient.request(req.getURL(), options, responseHandler)
            const result = await urllib_1.default.request(req.getURL(), options);
            this.data = (0, Utils_1.xml2json)(result.data);
            return this.data;
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
