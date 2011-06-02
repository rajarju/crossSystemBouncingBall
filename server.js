/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * server js file
 */
var http = require('http'),
url = require('url'),
fs = require('fs'),
io = require('socket.io'),
sys = require(process.binding('natives').util ? 'util' : 'sys'),
server;



//Create HTTP Server
server = http.createServer(function(request, response){
  //parse the relatice path
  var path = url.parse(request.url).pathname;

  switch(path){
    case '/' :
    case '/index.html' :
      fs.readFile(__dirname + '/index.html', function(err, data){
        if(err){
          response.write(err);
          response.end();
        //return send404(response);
        }
        else{
          response.writeHead(200, {
            'Content-Type': 'text/html'
          });
          response.write(data);
          response.end();
        }
      });
      break;
    case '/scripts.js':
      fs.readFile(__dirname + path, function(err, data){
        if(err){
          response.write(err);
          response.end();
        //return send404(response);
        }
        else{
          response.writeHead(200, {
            'Content-Type': 'text/javascript'
          });
          response.write(data);
          response.end();
        }
      });
      break;
    default:
      send404(response);
  }

});
server.listen(8090);

/****************************************************
 * Socket Connections
 */


//Buffer is used to store the log
var io = io.listen(server),screens = [], balls = [];

io.on('connection', function(client){

  screens.push(client);
  if(screens.length > 0){
    setInterval(function(){
      for(var i = 0 ; i < screens.length; i++){
        screens[i].send({
          screen: i,
          ball:{
            x: ball.x - (1000*i),
            y: ball.y
          }
        });
      }
      animate();
    }, 1000 / 60);
  }


  //Add Client to the screen list
  
  //console.log(client.sessionId);
  client.on('message', function(message){
    
    });
  client.on('disconnect', function(){
    removeByElement(screens, client.sessionId);
  })

//check if there are any screens connected
  

});



/*****************************************************
 * Helper Functions
 */
var send404 = function(response){
  response.writeHead(404);
  response.write('404');
  response.end();
};


/**
 * Animations function
 */
//The total size of playground
var playground;

var ball = {
  x: 10,
  y: 10,
  dx: 4,
  dy: 4,
  r: 10,
  move: function() {

    if ((this.x - this.r) < 0 || (this.x + this.r) > playground.width) {
      this.dx = -1 * this.dx;
    }
    if ((this.y - this.r) < 0 || (this.y + this.r) > playground.height) {
      this.dy = -1 * this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

  }  
};


/**
 *simulate animation
 */
function animate() {
  //Dev hack
  //screens
  //Calculate the playground size based on screens
  playground = {
    width : 1000 * screens.length,
    height : 600 //* screens.length
  }
  //Move the ball
  ball.move();
//Send new data

}

/**
 * array remove element
 */
function removeByElement(arrayName,arrayElement)
{
  for(var i=0; i<arrayName.length;i++ )
  {
    if(arrayName[i].sessionId == arrayElement)
      arrayName.splice(i,1);
  }
}

function findIndex(arrayName, value){
  var ctr = "";
  for (var i=0; i < arrayName.length; i++) {
    // use === to check for Matches. ie., identical (===), ;
    if (arrayName[i].sessionId == value) {
      return i;
    }
  }
  return ctr;
}