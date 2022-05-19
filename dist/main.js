"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./Application");
const Device_1 = require("./Device");
const DeviceManager_1 = require("./DeviceManager");
const cameraIP = '192.168.50.34';
const appLocation = '../App_dev/Loitering_Guard/AXIS_Loitering_Guard_2_3_2.eap';
const app = new Application_1.Application('loiteringguard', appLocation);
const camera = new Device_1.Device('camera1', cameraIP); // instanciate Device object
const deviceManager = new DeviceManager_1.DeviceManager();
deviceManager.registerDevice(camera);
// camera.listApplications();
// camera.installApplication(app);
// camera.removeApplication(app);
const cam = deviceManager.getDevice('camera');
if (cam != undefined) {
    cam.listApplications();
}
