import { json } from "stream/consumers";

const xml2js = require('xml2js');
const fs = require('fs')

// Basic function that convert an xml string into a JSON object

function xml2json(xml:string){
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err:Error, result:JSON) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function loadJSON(address:string){
    var obj = JSON.parse(fs.readFileSync(address, 'utf8'));
    return obj
}

// Basic function that write an object into a JSON file

function writeJSON(obj:any, address:string){
    const data = JSON.stringify(obj, null, 4)
    fs.writeFile(address, data, (err:Error)=>{
        if(err){
            throw err;
        }else{
            console.log("JSON object saved at: "+ address)
        }
    })
}

export { xml2json, loadJSON, writeJSON }