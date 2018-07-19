//Evolution settings
var mutationrate = eval(prompt("mutation rate"));//Best: .3
var ch = eval(prompt("mutation chance"));//Best: .3
var pr = eval(prompt("passing rate"));//Best: 5
var popsize;
var population = [];
var gen = 0;
//Net settings
var inputNo = 4;
var hidden = 4;
var output = 2;
//helpers
var over = false;
var b = true;
var pipes = [new Pipe(600),new Pipe(900)];
var lst = [];
var bird;

function preload(){
	bird = loadImage("images/bird.png");
}
function setup(){
	imageMode(CENTER);
	createCanvas(600,400);
	popsize = 100;
	for(var i = 0;i<popsize;i++){
		population.push([generate(inputNo,hidden,output),new Player()]);
	}
	lst = population;
}
function draw(){
	var nxt = [];
	if(!over){
		background('#7EC0EE');
		for(i = 0;i<2;i++){
			pipes[i].x += pipes[i].v;
			if(pipes[i].x <= 0){
				pipes.splice(i,1);
				pipes.push(new Pipe(600));
			}
			rect(pipes[i].x,0,10,pipes[i].gap);
			rect(pipes[i].x,pipes[i].gap+100,10,300 - pipes[i].gap);
		}
		population.forEach(function(e){
			//ellipse(50,e[1].y,10,10);
			image(bird, 50,e[1].y,50,50);
			e[1].score++;
			//Draw player
			if(pipes[0].x <= 50 && pipes[0].x >= 40){
				if(e[1].y > pipes[0].gap+85 || e[1].y < pipes[0].gap+15){
					if(b){
						nxt.push(e);
					}
					population.splice(population.indexOf(e),1);
				}
			}
			if(e[1].y >= 400){
				e[1].y = 399;
			}
			if(e[1].y <= 0){
				e[1].y = 1;
			}
			if(e[1].y == 1||e[1].y == 399){
				e[1].score--;	
			}
			//Death condition
			e[1].y += e[1].v;
			e[1].v += e[1].g;
			var t = activate([e[1].y/400,e[1].v/5,pipes[0].gap/400,1],e[0]);
			if(t.indexOf(Math.max.apply(null,t)) == 0){
				e[1].flap();
			}
		});
		if(population.length <= pr){
			//threshold to go to next gen
			b = true;
		}
		if(population.length == 0){
			pipes = [new Pipe(600),new Pipe(900)];
			if(nxt.length == 0){
				population = nextGen(lst,popsize,mutationrate,ch);
			}else{
				population = nextGen(nxt,popsize,mutationrate,ch);
				lst = nxt;
			}
			b = false;
		}
	}
}
function activate(input,net){
	//Net activation
	var h = [];
	for(var i = 0;i<hidden;i++){
		var tmp = 0;
		for(var j = 0;j<inputNo;j++){
			tmp += input[j]*net[0][j+inputNo*i];
		}
		h.push(tmp);
	}
	var out = [];
	for(var i = 0;i<output;i++){
		var tmp = 0;
		for(var j = 0;j<hidden;j++){
			tmp += h[j]*net[1][j+hidden*i];
		}
		out.push(tmp);
	}
	return out;
}
function nextGen(seed,p,rate,chance){
	//Geberates next gen
	gen++;
	console.log(gen);
	var nxtgen = [];
	var totalscore = 0;
	seed.forEach(function(e){
		totalscore += e[1].score;
	});
	seed.forEach(function(e){
		for(var i = 0;i < e[1].score*p/totalscore + 1;i++){
			var offspring = [];
			e[0].forEach(function(components){
				r = []
				components.forEach(function(value){
					var mod = value*2*Math.random()*rate+1-rate;
					if(Math.random()<chance){
						r.push(mod);
					}else{
						r.push(value);	
					}		
				});
				offspring.push(r);
			});
			nxtgen.push([offspring,new Player()]);
		}
	});
	return nxtgen;
}
function generate(inp,h,o){
	//Generates random nets
	var r1 = [];
	var r2 = [];
	for(var i = 0;i<inp * h;i++){
		r1.push(Math.random()*2-1);	
	}
	for(var i = 0;i<h * o;i++){
		r2.push(Math.random()*2-1);	
	}
	return [r1,r2];
}
function keyTyped(){
	//Pause
	if(key == 'x'){
		over = !over;
	}
}
function Player(){
	this.score = 0;
	this.y = 300;
	this.v = 0;
	this.g = 0.1;
	this.flap = function(){
		this.v -= 5;
	}
}
function Pipe(x){
	this.x = x;
	this.v = -1;
	this.gap = Math.random()*300;
}





