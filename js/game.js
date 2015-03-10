// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
};
stoneImage.src = "images/stone.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {
	speed: 100 // movement in pixels per second
};
var princess = {};
var stones = [5];
var cont  = 0;
var princessesCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	
	// Throw the princess somewhere on the screen randomly
	do{
		princess.x = 32 + (Math.random() * (canvas.width - 96));
		princess.y = 32 + (Math.random() * (canvas.height - 96));
	}while(touchStone(princess));
	
	// Throw the monster somewhere on the screen randomly
	monster.x = 32;
	monster.y = 32;
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if (((hero.y -(hero.speed * modifier)) > 32) && !touchStone(hero)){
			hero.y -= hero.speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		if (((hero.y +(hero.speed * modifier)) < 416) && !touchStone(hero)){
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		if (((hero.x -(hero.speed * modifier)) > 32) && !touchStone(hero)){
			hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown) { // Player holding right
		if (((hero.x +(hero.speed * modifier)) < 448) && !touchStone(hero)){
			hero.x += hero.speed * modifier;
		}
	}
	if (hero.x - monster.x > 0)
		monster.x += monster.speed*modifier;
	else
		monster.x -= monster.speed*modifier;
	if (hero.y - monster.y > 0)
		monster.y += monster.speed*modifier;
	else
		monster.y -= monster.speed*modifier;

	//Hero caught
	if (
		hero.x <= (monster.x + 16)
		&& monster.x <= (hero.x + 16)
		&& hero.y <= (monster.y + 16)
		&& monster.y <= (hero.y + 32)
	) {
		window.alert("Game over");
		window.clearInterval(interval);
	}
	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		if((princessesCaught % 10)== 0){
			monster.speed += 14;
			if (cont < 5){
			// Throw the stone somewhere on the screen randomly
				var stone = {};
				stone.x = 32 + (Math.random() * (canvas.width - 96));
				stone.y = 32 + (Math.random() * (canvas.height - 96));
				stones[cont] = stone;
				cont++;
				stoneReady = true;
			}	
		}
		reset();
	}
};

var touchStone = function (person){
	var i;
	for (i = 0; i < cont; i++){
		if (
		person.x <= (stones[i].x + 16)
		&& stones[i].x <= (person.x + 16)
		&& person.y <= (stones[i].y + 16)
		&& stones[i].y <= (person.y + 32)
	) {
		return true;
	}else
		return false;
	}

}

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (stoneReady) {
		var i;
		for (i = 0; i < cont; i++){
			ctx.drawImage(stoneImage, stones[i].x, stones[i].y);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
var interval = setInterval(main, 1); // Execute as fast as possible
