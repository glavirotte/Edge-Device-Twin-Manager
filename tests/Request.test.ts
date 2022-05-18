import { Request } from '../src/Request'
import { HttpMethod } from 'urllib'

const protocol = 'https'
const username = 'root'
const password = 'root'
const url = 'https://httpbin.org/get'
const method: HttpMethod = 'GET'
const args:Map<string, string> = new Map()
args.set('id', 'camera1');
args.set('value', '20')
const options:urllib.RequestOptions = {
  method: method,
  rejectUnauthorized: false,
  // auth: "username:password" use it if you want simple auth
  digestAuth: username+':'+password,
  headers: {
  //'Content-Type': 'application/text'  use it if payload is text
  //'Content-Type': 'application/json' use it if payload is json 
  'Content-Type': 'application/xml'
  }
}

const request = new Request(url, method, username, password, args, options); // Create Request

describe('Testing addArgumentsToURL() method', () => {
  test('Final url should result in "https://...?arg1=value1&..."', () => {
    expect(request.addArgumentsToURL(url, args))
    .toBe("https://httpbin.org/get?id=camera1&value=20&");
  });
});