const ipc = require('node-ipc');
const childProc = require('child_process');

ipc.config.id   = 'rendering-agent';
ipc.config.retry= 1500;

ipc.connectTo(
    'ms',
    function(){
        ipc.of.ms.on(
            'connect',
            function(){
                ipc.log('## connected to ms ##'.rainbow, ipc.config.delay);
                ipc.of.ms.emit(
                    'message',  //any event or message type your server listens for
                    'hello'
                )
            }
        );
        ipc.of.ms.on(
            'disconnect',
            function(){
                ipc.log('disconnected from ms'.notice);
            }
        );
        ipc.of.ms.on(
            'message',
            function(data){
                console.log(data);
                ipc.log('got a message from ms : '.debug, data);
                if(data.from === "player") {
                  if(data.message === "startup") {
                    childProc.exec('open -a "Firefox" /tmp/presentation/presentation.html', (error, stdout, stderr)=>{
                      if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                      }
                      console.log(`stdout: ${stdout}`);
                      console.log(`stderr: ${stderr}`);
                    });
                  }
                }
            }
        );
    }
);
