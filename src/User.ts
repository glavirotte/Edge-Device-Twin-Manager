import { Camera } from "./Camera"

class User {
    
    username:string
    password:string

    constructor(username:string, password:string){
        this.username = username
        this.password = password
    }

    login(camera:Camera){
        camera.connect(this)
    }

    getUsername(){
        return this.username
    }
    getPassword(){
        return this.password
    }
}

export { User }