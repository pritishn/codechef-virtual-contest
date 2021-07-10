function logThisIn(color, text) {
    switch(color){
        case 'black': console.log('\033[30m%s\033[0m',text);break;
        case 'red': console.log('\033[31m%s\033[0m',text);break;
        case 'green': console.log('\033[32m%s\033[0m',text);break;
        case 'yellow': console.log('\033[33m%s\033[0m',text);break;
        case 'blue': console.log('\033[34m%s\033[0m',text);break;
        case 'magenta': console.log('\033[35m%s\033[0m',text);break;
        case 'cyan': console.log('\033[36m%s\033[0m',text);break;
        case 'white': console.log('\033[37m%s\033[0m',text);break;
        default : console.log(text);
    }
}

module.exports = {logThisIn};