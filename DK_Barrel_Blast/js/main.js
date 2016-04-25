//Use enchant.js Library.
enchant();

//On page load.
window.onload = function () 
{ 
	var game = new Game(320, 400);
	//Preload files.
	game.preload('res/dk.gif',
				 'res/barrel.png',
				 'res/forest.jpg',
             	 'res/irate8.mp3',
             	 'res/lose.mp3');

	game.fps = 30;
	game.scale = 1; 
	game.onload = function()	
	{
		// Check if game loaded properly. 
		console.log("Load Game Check.");
		var scene = new SceneGame();
		game.pushScene(scene);
	}
	game.start();
	window.scrollTo(0, 0);

	// SceneGame class.
	var SceneGame = Class.create(Scene, 
	{    
	    initialize: function() 
	    {
	        var game, label, bg, dk, barrelGroup;
	        Scene.apply(this);
	        game = Game.instance; 
			label = new Label('SCORE<br>0');
			label.x = 9;
			label.y = 32;      
			label.color = 'white';
			label.font = '1.5em strong';
			label.textAlign = 'center';
			label._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
			this.scoreLabel = label;       
	        bg = new Sprite(320,400);
	        bg.image = game.assets['res/forest.jpg'];
			dk = new DKong();
			dk.x = game.width/2 - dk.width/2; 
			dk.y = 290;
			this.dk = dk;
			barrelGroup = new Group(); 
			this.barrelGroup = barrelGroup;
	        this.addChild(bg); 
	        this.addChild(barrelGroup); 
	        this.addChild(dk);   
	        this.addChild(label);
			this.addEventListener(Event.TOUCH_START,this.handleTouchControl);
			this.addEventListener(Event.ENTER_FRAME, this.update);
			this.generateBarrelTimer = 0;
			this.scoreTimer = 0;
			this.score = 0; 
			this.bgm = game.assets['res/irate8.mp3'];
			this.bgm.play();
	    },
	    handleTouchControl: function (screen) 
	    {
	    	var laneWidth, lane;
	    	laneWidth = 320/3;
	    	lane = Math.floor(screen.x/laneWidth); 
	    	lane = Math.max(Math.min(2,lane),0);
	    	this.dk.switchLane(lane);
		},
		update: function(screen) 
		{
			this.scoreTimer += screen.elapsed * 0.002;
			if (this.scoreTimer >= 1) 
			{
			    this.setScore(this.score + 1);
			    this.scoreTimer -= 1;
			}
	    	this.generateBarrelTimer += screen.elapsed * 0.002;
	   		if (this.generateBarrelTimer >= 1) 
	   		{
	        	var barrel;
	        	this.generateBarrelTimer -= 1;
	        	barrel = new Barrel(Math.floor(Math.random()*3));
				this.barrelGroup.addChild(barrel);
	    	}
			for (var i = this.barrelGroup.childNodes.length - 1; i >= 0; i--) 
			{ 
		    	var barrel;
		    	barrel = this.barrelGroup.childNodes[i]; 
		    	if (barrel.intersect(this.dk)){	    		
		    		var game = Game.instance;
		    		game.assets['res/lose.mp3'].play();
		    		this.barrelGroup.removeChild(barrel); 
		    		this.bgm.stop();
					game.replaceScene(new SceneGameOver(this.score));        
		    		break;
				}
			} 
			if (this.bgm.currentTime >= this.bgm.duration )
			{
		    	this.bgm.play();
			}
		},
		setScore: function (value) 
		{
	    	this.score = value;
	    	this.scoreLabel.text = 'SCORE<br>' + this.score;
		}
	});

	//Donkey Kong Class
	var DKong = Class.create(Sprite, 
	{ 
	    initialize: function() 
	    {
	        Sprite.apply(this,[46, 41]);
	        this.image = Game.instance.assets['res/dk.gif'];
	        this.animationDuration = 0;
	        this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
	    },
	    updateAnimation: function (screen) 
	    { 
	    this.animationDuration += screen.elapsed * 0.001;    
	    	if (this.animationDuration >= 0.25) {
	        	this.frame = (this.frame + 1) % 2;
	        	this.animationDuration -= 0.25;
	    	}
		},
		switchLane: function(lane)
		{    
	    	var targetLane = 160 - this.width/2 + (lane-1)*90;
	    	this.x = targetLane;
		}
	});

	// Barrel Class
	var Barrel = Class.create(Sprite, 
	{
	    initialize: function(lane) 
	    { 
	        Sprite.apply(this,[47, 47]);
	        this.image  = Game.instance.assets['res/barrel.png'];     
	        this.rotationSpeed = 0;
	        this.setLane(lane);
	        this.addEventListener(Event.ENTER_FRAME, this.update);
	    },
	    setLane: function(lane) 
	    {
			var game, distance;
			game = Game.instance;      
			distance = 90; 
			this.rotationSpeed = Math.random() * 100 - 80;
	    	this.x = game.width/2 - this.width/2 + (lane - 1) * distance;
	    	this.rotation = Math.floor( Math.random() * 360 );    
		},
		update: function(screen) 
		{ 
			var ySpeed, game;
			game = Game.instance;
	    	ySpeed = 250;
			this.y += ySpeed * screen.elapsed * 0.001; 
			this.rotation += this.rotationSpeed * screen.elapsed * 0.001;           
	    	if (this.y > game.height) {
	        	this.parentNode.removeChild(this);        
	    	}
		}	
	});
	
	// SceneGameOver class
	var SceneGameOver = Class.create(Scene, 
	{
	    initialize: function(score) 
	    {
	        var gameOverLabel, scoreLabel; 
	        Scene.apply(this);
	        this.backgroundColor = 'black';
			gameOverLabel = new Label("GAME OVER <br><br> Click Screen to Restart");
			gameOverLabel.x = 8;
			gameOverLabel.y = 128;
			gameOverLabel.color = 'white';		
			gameOverLabel.font = '2.5em strong';		
			gameOverLabel.textAlign = 'center'; 
			scoreLabel = new Label('SCORE<br>' + score);
			scoreLabel.x = 9;
			scoreLabel.y = 32;      
			scoreLabel.color = 'white';
			scoreLabel.font = '1.5em strong';
			scoreLabel.textAlign = 'center';
			this.addChild(gameOverLabel);
			this.addChild(scoreLabel);
			this.addEventListener(Event.TOUCH_START, this.touchToRestart);
		},
		touchToRestart: function(screen) 
		{
	    	var game = Game.instance;
	    	game.replaceScene(new SceneGame());
		}	
	});
};