import { assert } from 'console';
import { HttpMethod } from 'urllib';

// Class that defines a request

class Request {
  url: string;
  username: string;
  password: string;
  method: HttpMethod;
  args: Map <string, string>;
  options:urllib.RequestOptions;

  constructor(url:string, method:HttpMethod, username:string, password:string, args:Map<string, string>, options:urllib.RequestOptions){
    this.url = url;
    this.username = username;
    this.password = password;
    this.method = method;
    this.args = args;
    this.options = options

    if(this.args.size > 0){
      this.url = this.addArgumentsToURL(this.url, this.args);
    }
  }

  /* Concatenates arguments from a hashMap to the URL*/
  addArgumentsToURL(url:string, args:Map<string, string>):string{
    url += '?'
    args.forEach((values, keys) => {
      url += keys+'='+values+'&';
    });
    return url
  }

  /* Getters & setters */

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
  getargs() : Map<string, string>{
    return this.args;
  }
  getOptions():urllib.RequestOptions{
    return this.options;
  }
  
}

export { Request }