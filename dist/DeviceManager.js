"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceManager = void 0;
const Twin_1 = require("./Twin");
const username = 'root';
const password = 'root';
class DeviceManager {
    constructor() {
        this.username = username;
        this.password = password;
        this.devices = new Map();
    }
    registerDevice(device) {
        const deviceTwin = new Twin_1.Twin(device);
        this.devices.set(device, deviceTwin);
        device.setLoginCredentials(username, password);
    }
    /*------------------ Getters & Setters ------------------------ */
    getDevice(id) {
        for (let [device, twin] of this.devices) {
            if (device.getID() == id) {
                return device;
            }
        }
        return undefined;
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
}
exports.DeviceManager = DeviceManager;
