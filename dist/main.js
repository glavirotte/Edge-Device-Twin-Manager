"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Camera_1 = require("./Camera");
const Request_1 = require("./Request");
const protocol = 'https';
const username = 'root';
const password = 'root';
const cameraIP = '192.168.50.34';
const path = 'axis-cgi/applications/list.cgi';
const method = 'GET';
const url = `${protocol}://${cameraIP}/${path}`;
const args = new Map();
const camera = new Camera_1.Camera('camera1', cameraIP); // Create Camera object
const request = new Request_1.Request(url, method, username, password, args); // Create Request
camera.getCameraData(request); // Query to Camera
