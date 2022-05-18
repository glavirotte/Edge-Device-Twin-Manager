"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Camera_1 = require("./Camera");
const Request_1 = require("./Request");
const protocol = 'http';
const username = 'root';
const password = 'root';
const cameraIP = '192.168.50.34';
const path = 'axis-cgi/applications/list.cgi';
const method = 'POST';
const url = `${protocol}://${cameraIP}/${path}`;
const args = new Map();
const applicationsFolder = './Applications/';
const file = 'helloworld';
const options = {
    method: method,
    rejectUnauthorized: false,
    // auth: "username:password" use it if you want simple auth
    digestAuth: username + ':' + password,
    headers: {
        //'Content-Type': 'application/text'  use it if payload is text
        //'Content-Type': 'application/json' use it if payload is json 
        'Content-Type': 'application/xml'
    },
    // files: applicationsFolder
};
const camera = new Camera_1.Camera('camera1', cameraIP); // Create Camera object
const request = new Request_1.Request(url, method, username, password, args, options); // Create Request
camera.getCameraData(request); // Query to Camera
