import httpClient from 'urllib';
import http from 'http'
const xml2js = require('xml2js');

const protocol = 'https'
const username = 'root'
const password = 'root'
const cameraIP = '192.168.50.34'
const path = 'axis-cgi/applications/list.cgi'
const method = 'GET'
const url = `${protocol}://${cameraIP}/${path}`

class Request {
  url: string;
  args: string[];

  constructor(url: string, args: string[]){
    this.url = url;
    this.args = args;
  }

  getURL() : string {
    return this.url;
  }
}

async function getCameraData(req: Request){
  try {
    // const response: Response
    const options:urllib.RequestOptions = {
      method: method,
      rejectUnauthorized: false,
      // auth: "username:password" use it if you want simple auth
      digestAuth: `${username}:${password}`,
      headers: {
         //'Content-Type': 'application/xml'  use it if payload is xml
         //'Content-Type': 'application/json' use it if payload is json 
        'Content-Type': 'application/xml'
      }
    };

    const responseHandler = (err: Error, data: any, res: http.IncomingMessage) => {
      if (err) {
        console.log(err);
      }
      console.log(res.statusCode);
      console.log(res.headers);
      console.log(data.toString());

      xml2js.parseString(data, (err:Error, result:JSON) => {
        if(err) {
            throw err;
        }
        // `result` is a JavaScript object
        // convert it to a JSON string
        const json = JSON.stringify(result, null, 4);
      
        // log JSON string
        console.log(json);
      });
      
    }

    httpClient.request(req.getURL(), options, responseHandler)

  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

const req = new Request(url, [])
getCameraData(req);