const ipc = require('node-ipc');

ipc.config.id   = 'player';
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
                    {
                      from: "player",
                      message: "startup"
                    }
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
            'message',  //any event or message type your server listens for
            function(data){
                ipc.log('got a message from ms : '.debug, data);

            }
        );
    }
);
