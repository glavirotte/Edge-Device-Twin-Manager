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
            this.url = this.addArgumentsToURL(this.url, this.args);
            console.log(this.url);
        }
        if (this.method == 'POST') {
        }
        else if (this.method == 'GET') {
        }
    }
    /* Concatenates arguments from a hashMap to the URL*/
    addArgumentsToURL(url, args) {
        url += '?';
        args.forEach((values, keys) => {
            url += keys + '=' + values + '&';
        });
        return url;
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