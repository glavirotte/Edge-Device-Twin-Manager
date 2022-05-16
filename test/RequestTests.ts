import httpClient, { HttpMethod } from 'urllib';
import http from 'http'
const xml2js = require('xml2js');

/*-----------------Just for testing----------------*/
const protocol = 'https'
const username = 'root'
const password = 'root'
const cameraIP = '192.168.50.34'
const path = 'axis-cgi/applications/list.cgi'
const method = 'GET'
const url = `${protocol}://${cameraIP}/${path}`
const args:string[] = []
/*--------------------------------------------------*/

// Class that defines request
class Request {
  url: string;
  username: string
  password: string
  method: HttpMethod
  args: string[];

  constructor(url: string, method:HttpMethod, username:string, password: string, args: string[]){
    this.url = url;
    this.username = username;
    this.password = password;
    this.method = method;
    this.args = args;
  }

  getURL() : string {
    return this.url;
  }
  getMethod() : HttpMethod {
    return this.method;
  }
  getUsername() : string {
    return this.username;
  }
  getPassword() : string {
    return this.password;
  }
  getargs() : string[]{
    return this.args;
  }
}


// Get json object from a Request sent to the camera
async function getCameraData(req: Request){
  try {
    // const response: Response
    const options:urllib.RequestOptions = {
      method: req.getMethod(),
      rejectUnauthorized: false,
      // auth: "username:password" use it if you want simple auth
      digestAuth: req.getUsername()+':'+req.getPassword(),
      headers: {
         //'Content-Type': 'application/text'  use it if payload is text
         //'Content-Type': 'application/json' use it if payload is json 
        'Content-Type': 'application/xml'
      }
    };

    // Callback function that handles response from camera
    const responseHandler = (err: Error, data: any, res: http.IncomingMessage) => {
      if (err) {
        console.log(err);
      }
      console.log(res.statusCode);
      console.log(res.headers);
      console.log(data.toString());

      //Parse xml from response and generate a json object
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

    // Send request to the camera
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

const req = new Request(url, method, username, password, args);
getCameraData(req);

export {Request, getCameraData}