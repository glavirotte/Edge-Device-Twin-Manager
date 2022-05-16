const xml2js = require('xml2js');
import { HttpClientResponse } from 'urllib'

function xml2json(data:string | HttpClientResponse<any>){
    //Parse xml from response and generate a json object
    const json = xml2js.parseString(data, (err:Error, json:JSON) => {
    if(err) {
        throw err;
    }
    // result is a JavaScript object
    // convert it to a JSON string
    const str = JSON.stringify(json, null, 2);
    console.log(str);
    });
    console.log(json)
}

export { xml2json }