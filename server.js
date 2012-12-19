var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')

app.listen(8090);

function handler (req, res) {
	fs.readFile(__dirname + '/index.html',
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}

			res.writeHead(200);
			res.end(data);
		});
}


var screens = [], balls = [], ballPos = [];

io.sockets.on('connection', function (socket) {
	
	console.log(balls);
	//Add Client to screens array
	screens.push(socket);

	if(screens.length > 0){

		var screenId = 0;
		//Keep moving the ball 60 times a sec
		setInterval(function(){

			//find screen id
			//screenId = ball.x/playground.width;

			for(var i = 0 ; i < screens.length; i++){
				ballPos = [];
				for(var j = 0; j < balls.length; j++){
					ballPos.push({
						x: balls[j].x - (i * playground.width),
						y: balls[j].y,
						color: balls[j].color
					});
				}
				
				screens[i].emit( 'ballmove',{
					screen: i,
					balls: ballPos
					
				});

			}
			//Animate the ball
			animate();
		}, 1000 / 60);
	}

	socket.on('addBall', function(){

		balls.push(new ball());
	});

	socket.on('disconnect', function(){
		removeByElement(screens, socket.sessionId);
	});

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
var playground = {
	width : 1000,
    height : 700 //* screens.length
};

function ball(){


	this.init = function(){

		this.x= Math.floor(Math.random() * playground.width ) + 10;
		this.y = Math.floor(Math.random() * playground.height ) + 10;
		this.dx = Math.floor(Math.random() * 10) + 2;
		this.dy = Math.floor(Math.random() * 10) + 2;
		this.r = 10;
		this.color = getRandomColor();
	}

	this.move = function() {

		if ((this.x - this.r) < 0 || (this.x + this.r) > playground.width * screens.length) {
			this.dx = -1 * this.dx;
		}
		if ((this.y - this.r) < 0 || (this.y + this.r) > playground.height) {
			this.dy = -1 * this.dy;
		}

		this.x += this.dx;
		this.y += this.dy;

	};

	this.init();
};


/**
 *simulate animation
 */
 function animate() {

  //Move the ball
  for(i in balls){
  	balls[i].move();
  }
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

function getRandomColor() {
    return "#"+((1<<24)*Math.random()|0).toString(16);
}



balls.push(new ball());

