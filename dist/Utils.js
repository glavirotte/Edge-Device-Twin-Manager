"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xml2json = void 0;
const xml2js = require('xml2js');
function xml2json(xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}
exports.xml2json = xml2json;
