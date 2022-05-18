import { Application } from './Application'
import { Camera } from "./Camera"
import { User } from './User'

const cameraIP = '192.168.50.34'
const username:string = 'root'
const password:string = 'root'
const appLocation = '../App_dev/Loitering_Guard/AXIS_Loitering_Guard_2_3_2.eap'
const app = new Application('loiteringguard', appLocation)

const camera = new Camera('camera1', cameraIP) // Create Camera object
const user = new User(username, password)
user.login(camera)

camera.listApplications();
// camera.uploadApplication(app);
// camera.removeApplication(app);