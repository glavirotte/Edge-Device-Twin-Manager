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
        this.data = JSON.parse('{}');
    }
    /*-------------------------Camera Methods-------------------------*/
    // Get json object from a Request sent to the camera
    async getCameraData(req) {
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
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log('In getCameraData -> error message: ', error.message);
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
