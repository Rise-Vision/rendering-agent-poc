const primus = Primus.connect("http://localhost:8080");


primus.on('open', function open() {
  console.log('Connection is alive and kicking');
});

primus.on('data', function message(data) {
  console.log('Received a new message from the server', data);
  const tweets = document.getElementById("tweets");
  if (data.message) {
      tweets.innerHTML = data.message + "<br><br>" +tweets.innerHTML;
  }
});
