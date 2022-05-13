"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const https_1 = __importDefault(require("https"));
const httpsAgent = new https_1.default.Agent({
    rejectUnauthorized: false,
});
const Protocol = 'https';
const Username = 'root';
const Password = 'root';
const CameraIP = '192.168.50.34';
const Path = 'axis-cgi/applications/list.cgi';
const url = `${Protocol}://${CameraIP}/${Path}`;
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
        const response = await (0, node_fetch_1.default)(req.getURL(), {
            method: req.args[0],
            agent: httpsAgent,
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${Username}:${Password}`).toString('base64')
            }
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        // const result: CameraResponse
        const result = (await response.json());
        // console.log('result is:\n', JSON.stringify(result, null, 4));
        console.log(result);
        return result;
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
