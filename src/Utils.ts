const xml2js = require('xml2js');

function xml2json(data:string){
    //Parse xml from response and generate a json object
    xml2js.parseString(data, (err:Error, json:JSON) => {
    if(err) {
        throw err;
    }
    // result is a JavaScript object
    // convert it to a JSON string
    console.log(json)
    return json;
    });
}

export { xml2json }