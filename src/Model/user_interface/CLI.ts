import * as readline from 'readline'
import { Twin } from '../Twin';

class CLI{

    constructor(){

        this.listenToUserInput()
    }

    private listenToUserInput(){
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
            
        });
        function recursiveAsyncReadLine(twinProxy:Twin) {
            rl.question('What do you want to do ?', (answer) => {
                switch(answer.toLowerCase()) {
                    case 'list':
                        console.log()
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
    }
}