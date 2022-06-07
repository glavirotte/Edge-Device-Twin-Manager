import { HttpMethod } from 'urllib';

// Class that defines a request

class Request {
    private url: string
    private username: string
    private password: string
    private method: HttpMethod
    private args: Map <string, string>
    private options:urllib.RequestOptions

    public constructor(url:string, method:HttpMethod, username:string, password:string, args:Map<string, string>, options:urllib.RequestOptions){
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
    private addArgumentsToURL(url:string, args:Map<string, string>):string{
      url += '?'
      args.forEach((values, keys) => {
        url += keys+'='+values+'&';
      });
      return url
    }

    /* Getters & setters */

    public getURL() : string {
      return this.url;
    }
    public getMethod() : HttpMethod {
      return this.method;
    }
    public getUsername() : string {
      return this.username;
    }
    public getPassword() : string {
      return this.password;
    }
    public getargs() : Map<string, string>{
      return this.args;
    }
    public getOptions():urllib.RequestOptions{
      return this.options;
    }
    
}

export { Request }