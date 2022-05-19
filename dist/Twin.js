"use strict";
/*#######################################################

This class represent the current known state of the Device
with the applications installed

#########################################################*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Twin = void 0;
class Twin {
    constructor(device) {
        this.device = device;
        this.json = JSON.parse('{}');
    }
    getTwin() {
        return this.json;
    }
}
exports.Twin = Twin;
