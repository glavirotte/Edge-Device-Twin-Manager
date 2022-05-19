"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    login(camera) {
        camera.connect(this);
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
}
exports.User = User;
