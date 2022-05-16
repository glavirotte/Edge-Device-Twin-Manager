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

const request = new Request(url, method, username, password, args); // Create Request

describe('Testing addArgumentsToURL() method', () => {
  test('Final url should result in "https://...?arg1=value1&..."', () => {
    expect(request.addArgumentsToURL(url, args))
    .toBe("https://httpbin.org/get?id=camera1&value=20&");
  });
});