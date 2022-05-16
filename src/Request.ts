import { HttpMethod } from 'urllib';

// Class that defines request
class Request {
  url: string;
  username: string
  password: string
  method: HttpMethod
  args: Map <string, string>

  constructor(url:string, method:HttpMethod, username:string, password:string, args:Map<string, string>){
    this.url = url;
    this.username = username;
    this.password = password;
    this.method = method;
    this.args = args;

    if(this.args.size > 0){
      this.addArgumentsToURL();
    }
    if(this.method == 'POST'){

    }else if(this.method == 'GET'){

    }
  }

  /* Concatenates arguments from a hashMap to the URL*/
  addArgumentsToURL(){
    this.url += '?'
    this.args.forEach((values, keys) => {
      this.url += values+'='+keys+'&';
    });
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
  
}

export { Request }