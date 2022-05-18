import { Application } from './Application'
import { Camera } from "./Camera"

const cameraIP = '192.168.50.34'
const appLocation = '../App_dev/Loitering_Guard/AXIS_Loitering_Guard_2_3_2.eap'
const app = new Application('loiteringguard', appLocation)

const camera = new Camera('camera1', cameraIP) // Create Camera object
camera.listApplications();
// camera.uploadApplication(app);
// camera.removeApplication(app);