mouse=[];

function main(){
    var div, canvas, context, time, game;
    div = document.getElementById("game");    
    div.innerHTML='<canvas id="gameCanvas" width="600" height="400"  style="border:1px solid #000000;" ></canvas>';
    canvas= document.getElementById("gameCanvas");
    context = canvas.getContext("2d");
    canvas.addEventListener("mouseup", function(event){getPosition(event,canvas);}, false);
    canvas.oncontextmenu = function (e) {
	e.preventDefault();
    };
    game = initGame(canvas,context);
    time = Date.now();
    mainloop(game);
    return 0;
}

function getPosition (event,canvas){
    var x,y;
    x = event.x - canvas.offsetLeft;
    y = event.y - canvas.offsetTop;
    mouse.push({x:x,y:y,left:true})
}

function initGame(canvas,context){
    var x,y,ran;
    game = {context:context,
	    canvas:canvas,
	    fps:1,
	    objects:[],
	    outputs:[],
	    frame:0};    
    game.objects.push(makeBox(0,0,600,30,"#00FF00"));
    game.objects.push(makeBox(0,400-30,200,30,"#00FF00"));
    game.objects.push(makeBox(200,400-30,200,30,"#00FF00"));
    game.objects.push(makeBox(400,400-30,200,30,"#00FF00"));
    ran = randomXY(600,400-60,0,30);
    console.log(ran);
    game.objects.push(makeBox(ran.x,ran.y,30,30,"#FF0000"));
    return game;
}

function mainloop(game,ptime){
    var dt,time,start,inputs;
    start= Date.now()
    inputs = read();
    game = eval(game,inputs)
    game = print(game);
    time=Date.now();
    dt = time-start;
    window.setTimeout(
	function() {mainloop(game,time);},
	  1000/30 -dt
    );    
}

function read(){
    var ret;
    ret = mouse.pop();
    mouse=[];
    return ret;
}

function eval(game,inputs){
    game.objects.filter(hasAnimation).map(function(x){
	game.outputs.push(x.anim());});
    if(inputs!=undefined){
	game.outputs.push(function(game){console.log(inputs);});
	game.outputs.push(function(game){console.log(game.frame);});
	game.outputs.push(function(game){console.log(game.objects[0]);});
    }
    game.frame+=1;
    return game;
}

function print(game){
    game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.outputs.map(function(x){x(game);});
    game.outputs=[];
    return game;
};


function makeBox(x,y,w,h,colour){
    return { box:{x:x,y:y,h:h,w:w,colour:colour},
	     anim:function(){return colourdBox(this.box);},
	     onclick:function(x){return clickCheckBox(this.box);}
	   };
}

function hasAnimation(obj){
    if ('anim' in obj)
	return true;
    else
	return false;
}

function hasOnClick(obj){
    if ('onclick' in obj)
	return true;
    else
	return false;
}

// Check if box clicked
function clickCheckBox(box){
    return function(game,inputs){
	if(checkClick(inputs,
		      box.box.x,
		      box.box.y,
		      box.box.x + box.box.w,
		      box.box.y + box.box.h}){	    
	    
	}
	
	return game;
    };
}

function colourdBox(box){
    return function(game){
	game.context.fillStyle=box.colour;
	game.context.fillRect(box.x,box.y,box.w,box.h);
			  };
}

function randomXY(w,h,x,y){
    return {x:Math.random()*w+x,y:Math.random()*h+y};
}
