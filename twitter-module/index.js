const Twitter = require('twitter');
const fs = require('fs');
const ipc = require('node-ipc');

const client = new Twitter(JSON.parse(fs.readFileSync('./config/config.json', 'utf8')));

ipc.config.id   = 'twitter-module';
ipc.config.retry= 1500;
let interval = null;
ipc.connectTo(
    'ms',
    function(){
        ipc.of.ms.on(
            'connect',
            function(){
                ipc.log('## connected to ms ##'.rainbow, ipc.config.delay);
                ipc.of.ms.emit(
                    'message',
                    'hello'
                )


                  client.stream('statuses/filter', {track: 'javascript'}, function(stream) {
                    stream.on('data', function(event) {
                      console.log(event && event.text);
                      ipc.of.ms.emit(
                          'message',
                          {
                              from    : ipc.config.id,
                              message : JSON.stringify(event.text),
                              through: "ws"
                          }
                      )
                    });

                    stream.on('error', function(error) {
                      throw error;
                    });
                  });

            }
        );
        ipc.of.ms.on(
            'disconnect',
            function(){
                ipc.log('disconnected from ms'.notice);
                clearInterval(interval);
            }
        );
        ipc.of.ms.on(
            'message',
            function(data){
                ipc.log('got a message from ms : '.debug, data);
            }
        );

        // 10 minutes
    }
);
