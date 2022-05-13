import fetch from 'node-fetch';
import https from 'https';
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const Protocol = 'https'
const Username = 'gaetan'
const Password = ''
const CameraIP = '192.168.50.34'
const Path = 'axis-cgi/applications/list.cgi'
const url = `${Protocol}://${CameraIP}/${Path}`

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

type Field = {};

type CameraResponse = {
  data: Field[];
};

async function getCameraData(req: Request){
  try {
    // const response: Response
    const response = await fetch(req.getURL(), {
      method: req.args[0],
      agent: httpsAgent,
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${Username}:${Password}`).toString('base64')
      }
    })

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    // const result: CameraResponse
    const result = (await response.json()) as string;
    // console.log('result is:\n', JSON.stringify(result, null, 4));
    console.log(result)
    return result;

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

const req = new Request(url, ['GET'])
getCameraData(req);