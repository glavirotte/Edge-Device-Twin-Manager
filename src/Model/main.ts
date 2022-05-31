import { DeviceManager } from './DeviceManager'
import { Twin } from './Twin'
import * as readline from 'readline';

const cameraIP = '192.168.50.34'
const deviceManager = new DeviceManager()

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function recursiveAsyncReadLine(twinProxy:Twin) {
    rl.question('Do you want to switch the light? [y/n] ', (answer) => {
        switch(answer.toLowerCase()) {
            case 'y':
                twinProxy.proxySwitchLight = true
                break;
            case 'n':
                console.log('Sorry! :(')
                break;
            default:
                console.log('Invalid answer!')
                break;
        }
        return recursiveAsyncReadLine(twinProxy); //Calling this function again to ask new question
        }
    )
}

deviceManager.createTwin(cameraIP)
    .then((twinProxy:Twin) => {recursiveAsyncReadLine(twinProxy)})
