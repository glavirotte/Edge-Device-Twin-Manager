"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./Application");
const Camera_1 = require("./Camera");
const cameraIP = '192.168.50.34';
const appLocation = '../App_dev/Loitering_Guard/AXIS_Loitering_Guard_2_3_2.eap';
const app = new Application_1.Application('loiteringguard', appLocation);
const camera = new Camera_1.Camera('camera1', cameraIP); // Create Camera object
camera.listApplications();
// camera.uploadApplication(app);
// camera.removeApplication(app);
