"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xml2json = void 0;
const xml2js = require('xml2js');
function xml2json(data) {
    //Parse xml from response and generate a json object
    xml2js.parseString(data, (err, json) => {
        if (err) {
            throw err;
        }
        // result is a JavaScript object
        // convert it to a JSON string
        console.log(json);
        return json;
    });
}
exports.xml2json = xml2json;
