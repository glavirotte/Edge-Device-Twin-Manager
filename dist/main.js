"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = require("./Request");
const protocol = 'https';
const username = 'root';
const password = 'root';
const cameraIP = '192.168.50.34';
const path = 'axis-cgi/applications/list.cgi';
const method = 'GET';
// const url = `${protocol}://${cameraIP}/${path}`
const url = 'https://httpbin.org/get';
const args = new Map();
args.set('value', '30');
const req = new Request_1.Request(url, method, username, password, args);
(0, Request_1.getCameraData)(req);
