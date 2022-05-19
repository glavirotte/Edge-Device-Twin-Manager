import { json } from "stream/consumers";

const xml2js = require('xml2js');
const fs = require('fs')

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