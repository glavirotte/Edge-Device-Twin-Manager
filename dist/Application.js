"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
class Application {
    constructor(name, location) {
        this.name = name;
        this.location = location;
    }
    getName() {
        return this.name;
    }
    getLocation() {
        return this.location;
    }
}
exports.Application = Application;
