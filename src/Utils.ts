const xml2js = require('xml2js');

function xml2json(xml:string):any{
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

export { xml2json }