const ipc=require('node-ipc'),
  Primus = require('primus'),
  http = require('http');

let spark = null;

const server = http.createServer(()=>{

}),
primus = new Primus(server, {transformer: 'uws'});

primus.on('connection', function (spk) {
  spark = spk;
  spark.write('hello connnection');
});

ipc.config.id   = 'ms';
ipc.config.retry= 1500;

ipc.serve(
    function(){
        ipc.server.on(
            'message',
            function(data,socket){
                ipc.log('got a message : '.debug, data);
                if(data.through === "ws"){
                  if(spark){
                    spark.write(data);
                  } else {
                    console.log("No one connect to WS");
                  }
                } else {
                  ipc.server.broadcast(
                      'message',
                      data
                  );
                }
            }
        );
        ipc.server.on(
            'socket.disconnected',
            function(socket, destroyedSocketID) {
                ipc.log('client ' + destroyedSocketID + ' has disconnected!');
            }
        );
    }
);

server.listen(8080, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  };

  console.log(`server is listening on 8080`);
})

ipc.server.start();
