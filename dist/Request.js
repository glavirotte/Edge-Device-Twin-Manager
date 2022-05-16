"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
// Class that defines request
class Request {
    constructor(url, method, username, password, args) {
        this.url = url;
        this.username = username;
        this.password = password;
        this.method = method;
        this.args = args;
        if (this.args.size > 0) {
            this.addArgumentsToURL();
        }
        if (this.method == 'POST') {
        }
        if (this.method == 'GET') {
            console.log("equal");
        }
        if (this.method === 'GET') {
            console.log("equal");
        }
    }
    /* Concatenates arguments from a hashMap to the URL*/
    addArgumentsToURL() {
        this.url += '?';
        this.args.forEach((values, keys) => {
            this.url += values + '=' + keys + '&';
        });
    }
    /* Getters & setters */
    getURL() {
        return this.url;
    }
    getMethod() {
        return this.method;
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
    getargs() {
        return this.args;
    }
}
exports.Request = Request;
