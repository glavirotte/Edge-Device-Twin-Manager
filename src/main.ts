import fetch from 'node-fetch';

const CameraIP = '192.168.50.34'
const Path = ''
const url = `https://${CameraIP}/${Path}`

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
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    // const result: CameraResponse
    const result = (await response.json()) as CameraResponse;
    console.log('result is:\n', JSON.stringify(result, null, 4));
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