var SIZE = 5;

var TABLE_ENTRY_WIDTH = 50;
var TABLE_ENTRY_HEIGHT = 25;
var TABLE_START_X = 50;
var TABLE_START_Y = 80;

var PROCESS_WIDTH = 25;
var PROCESS_HEIGHT = 25;
var PROCESS_START_X = 300;
var PROCESS_START_Y = 250;

var QUEUE_WIDTH = 200;
var QUEUE_HEIGHT = 30;
var QUEUE_INITIAL_X = 400;
var QUEUE_INITIAL_Y = 50;
var INTERSPACE = 30;
var ELEMENT_INITIAL_X = 250;
var ELEMENT_WIDTH = 40;

var CPU_WIDTH = 50;
var CPU_HEIGHT = 150;
var CPU_INITIAL_X = 550;
var CPU_INITIAL_Y = 110;

var INSERT_X = 200;
var INSERT_Y = 50;

var FOREGROUND_COLOR = "#000055"
var BACKGROUND_COLOR = "#AAAAFF"
var TEXT_COLOR = "#283FC2"
var INITIAL_BACKGROUND = "#2F71E3"
var END_COLOR = "#FFFFFF"


function RRQueue(am, w, h)
{
	this.init(am, w, h);
}

RRQueue.prototype = new Algorithm();
RRQueue.prototype.constructor = RRQueue;
RRQueue.superclass = Algorithm.prototype;

RRQueue.prototype.init = function(am, w, h)
{
	RRQueue.superclass.init.call(this, am, w, h);
	this.addControls();
	this.nextIndex = 0;
	this.commands = [];

	this.arrive = new Array(SIZE);
	this.run = new Array(SIZE);
	this.totaltime = 0;
	this.hasrun = false;

	this.setup();
}

RRQueue.prototype.addControls = function(){
	this.controls = [];

	this.startButton = addControlToAlgorithmBar("Button", "start");
	this.startButton.onclick = this.startCallback.bind(this);
	this.controls.push(this.startButton);

	this.newButton = addControlToAlgorithmBar("Button", "new");
	this.newButton.onclick = this.newCallback.bind(this);
	this.controls.push(this.newButton);
}

RRQueue.prototype.setup = function(){
	this.commands = [];
	this.nextIndex = 0;

	this.programID = new Array(SIZE);
	this.arriveID = new Array(SIZE);
	this.runID = new Array(SIZE);
	this.qElementID = new Array(SIZE);

	for (let i = 0; i < SIZE; i++)
	{
		this.programID[i] = this.nextIndex++;
		this.arriveID[i] = this.nextIndex++;
		this.runID[i] = this.nextIndex++;
		this.qElementID[i] = this.nextIndex++;
	}


	for(let i = 0; i < SIZE; i ++){
		this.cmd("CreateRectangle",this.programID[i], 'P' + (i+1), TABLE_ENTRY_WIDTH, TABLE_ENTRY_HEIGHT, TABLE_START_X, TABLE_START_Y + i*TABLE_ENTRY_HEIGHT);
		this.cmd("SetTextColor",this.programID[i],TEXT_COLOR);
		this.cmd("CreateRectangle",this.arriveID[i],"",TABLE_ENTRY_WIDTH, TABLE_ENTRY_HEIGHT, TABLE_START_X + TABLE_ENTRY_WIDTH, TABLE_START_Y + i*TABLE_ENTRY_HEIGHT);
		this.cmd("CreateRectangle",this.runID[i],"",TABLE_ENTRY_WIDTH, TABLE_ENTRY_HEIGHT, TABLE_START_X+2*TABLE_ENTRY_WIDTH, TABLE_START_Y + i*TABLE_ENTRY_HEIGHT);
	}

	this.cmd("CreateLabel", this.nextIndex++, "process", TABLE_START_X, TABLE_START_Y  - TABLE_ENTRY_HEIGHT);
	this.cmd("CreateLabel", this.nextIndex++, "arrive", TABLE_START_X + TABLE_ENTRY_WIDTH, TABLE_START_Y  - TABLE_ENTRY_HEIGHT);
	this.cmd("CreateLabel", this.nextIndex++, "run", TABLE_START_X + 2 * TABLE_ENTRY_WIDTH, TABLE_START_Y  - TABLE_ENTRY_HEIGHT);

	this.cmd("CreateRectangle",this.nextIndex++,"",QUEUE_WIDTH, 0, QUEUE_INITIAL_X , QUEUE_INITIAL_Y - QUEUE_HEIGHT/2);
	this.cmd("CreateRectangle",this.nextIndex++,"",QUEUE_WIDTH, 0, QUEUE_INITIAL_X , QUEUE_INITIAL_Y + QUEUE_HEIGHT/2);
	this.cmd("CreateLabel", this.nextIndex++, "first-order time:1", QUEUE_INITIAL_X, QUEUE_INITIAL_Y - QUEUE_HEIGHT);


	this.cmd("CreateRectangle",this.nextIndex++,"",QUEUE_WIDTH, 0, QUEUE_INITIAL_X , QUEUE_INITIAL_Y + (QUEUE_HEIGHT + INTERSPACE)- QUEUE_HEIGHT/2);
	this.cmd("CreateRectangle",this.nextIndex++,"",QUEUE_WIDTH, 0, QUEUE_INITIAL_X , QUEUE_INITIAL_Y + (QUEUE_HEIGHT + INTERSPACE)+ QUEUE_HEIGHT/2);
	this.cmd("CreateLabel", this.nextIndex++, "second-order time:2", QUEUE_INITIAL_X, QUEUE_INITIAL_Y + (QUEUE_HEIGHT + INTERSPACE) - QUEUE_HEIGHT);


	this.cmd("CreateRectangle",this.nextIndex++,"",QUEUE_WIDTH, 0, QUEUE_INITIAL_X , QUEUE_INITIAL_Y + 2*(QUEUE_HEIGHT + INTERSPACE)- QUEUE_HEIGHT/2);
	this.cmd("CreateRectangle",this.nextIndex++,"",QUEUE_WIDTH, 0, QUEUE_INITIAL_X , QUEUE_INITIAL_Y + 2*(QUEUE_HEIGHT + INTERSPACE)+ QUEUE_HEIGHT/2);
	this.cmd("CreateLabel", this.nextIndex++, "third-orde time:4", QUEUE_INITIAL_X, QUEUE_INITIAL_Y + 2*(QUEUE_HEIGHT + INTERSPACE) - QUEUE_HEIGHT);


	this.cmd("CreateLabel", this.nextIndex++, "CPU", CPU_INITIAL_X , CPU_INITIAL_Y - PROCESS_HEIGHT);

	//this.cmd("CreateRectangle",this.nextIndex++,"CPU",CPU_WIDTH, CPU_HEIGHT, CPU_INITIAL_X , CPU_INITIAL_Y);

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.randomizeArray();
}

RRQueue.prototype.randomizeArray = function(){
	this.commands = [];
	this.arrive[0] = 0;
	this.run[0] = Math.floor(5 + Math.random()*3);
	this.cmd("SetText", this.arriveID[0], 0);
	this.cmd("SetText", this.runID[0], this.run[0]);
	this.totaltime += this.run[0];
	for (let i = 1; i < SIZE; i++)
	{
		this.arrive[i] =  this.arrive[i-1] + Math.floor(1 + Math.random()*2);
		this.cmd("SetText", this.arriveID[i], this.arrive[i]);
		this.run[i] = Math.floor(1 + Math.random()*5);
		this.cmd("SetText", this.runID[i], this.run[i]);
		this.totaltime += this.run[i];
	}

	for(let i = 0; i < SIZE; i ++){
		this.cmd("CreateLabel", this.nextIndex++, "p"+ (i+1), PROCESS_START_X - PROCESS_WIDTH, PROCESS_START_Y + i*PROCESS_HEIGHT);
	}

	this.cmd("CreateRectangle",this.nextIndex++, "", 0, (SIZE+1)*PROCESS_HEIGHT, PROCESS_START_X - PROCESS_WIDTH/2, PROCESS_START_Y + 2*PROCESS_HEIGHT);
	this.cmd("CreateRectangle",this.nextIndex++, "", (this.totaltime)*PROCESS_WIDTH, 0, PROCESS_START_X + (this.totaltime-1)*PROCESS_WIDTH/2, PROCESS_START_Y + 5*PROCESS_HEIGHT);

	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
}

RRQueue.prototype.startCallback = function(){
	this.implementAction(this.start.bind(this),"");
}

RRQueue.prototype.newCallback = function() {
	this.animationManager.resetAll();
	this.nextIndex = 0;
	this.commands = [];

	this.arrive = new Array(SIZE);
	this.run = new Array(SIZE);
	this.totaltime = 0;
	this.hasrun = false;

	this.setup();
}

RRQueue.prototype.start = function(){

	this.commands = [];

	this.firstOrder = [];
	this.secondOrder = [];
	this.thirdOrder = [];

	let time = 0;
	this.firstOrder.push(0);

	this.enqueuenum1 = 0;
	this.enqueuenum2 = 0;
	this.enqueuenum3 = 0;

	this.cmd("CreateRectangle", this.qElementID[0], "P1", PROCESS_WIDTH, PROCESS_HEIGHT, ELEMENT_INITIAL_X, QUEUE_INITIAL_Y);
	// this.cmd("SetForegroundColor", this.nextIndex, FOREGROUND_COLOR);
	// this.cmd("SetBackgroundColor", this.nextIndex, BACKGROUND_COLOR);
	this.cmd("Step");
	let nextXPos = PROCESS_START_X - PROCESS_WIDTH/2 + (5 - 0)*ELEMENT_WIDTH;
	let nextYPos = QUEUE_INITIAL_Y; //一级队列的高度
	this.cmd("Move", this.qElementID[0], nextXPos, nextYPos);
	this.cmd("Step");

	let nextprocess = 1;


	//this.cmd("CreateRectangle", this.nextIndex++, this.totaltime , PROCESS_WIDTH, PROCESS_HEIGHT, INSERT_X, INSERT_Y);

	while(time < this.totaltime){		
		let curTimeSlice = 0;
		let curqueue = 0;
		let curprocess = 0;
		if(this.firstOrder.length !== 0){
			curprocess = this.firstOrder.shift();
			curTimeSlice = 1;
			curqueue = 1;
			//this.cmd("CreateRectangle", this.nextIndex++, curprocess , PROCESS_WIDTH, PROCESS_HEIGHT, INSERT_X, INSERT_Y);
		}
		else if(this.secondOrder.length !== 0){
			curprocess = this.secondOrder.shift();
			curTimeSlice = 2;
			curqueue = 2;
		}
		else{
			curprocess = this.thirdOrder.shift();
			curTimeSlice = 4;
			curqueue = 3;
		}


		let nextXPos = CPU_INITIAL_X;
		let nextYPos = CPU_INITIAL_Y;
		this.cmd("Move", this.qElementID[curprocess], nextXPos, nextYPos);
		this.cmd("Step");


		while(true){
			let breakjudge = false;

			this.cmd("CreateRectangle", this.nextIndex, 'P' + (curprocess+1), PROCESS_WIDTH, PROCESS_HEIGHT, INSERT_X, INSERT_Y);
			this.cmd("SetForegroundColor", this.nextIndex, FOREGROUND_COLOR);
			this.cmd("SetBackgroundColor", this.nextIndex, BACKGROUND_COLOR);
			this.cmd("Step");
			let nextXPos = PROCESS_START_X + time * PROCESS_WIDTH
			let nextYPos = PROCESS_START_Y + curprocess * PROCESS_HEIGHT;
			this.cmd("Move", this.nextIndex, nextXPos, nextYPos);
			this.cmd("Step");
			this.nextIndex++;

			time ++;
			curTimeSlice --;
			this.run[curprocess] --;

			if(this.run[curprocess] === 0){
				this.cmd("Delete", this.qElementID[curprocess]);
				breakjudge = true;
			}
			//时间片耗尽，调队
			if(curTimeSlice === 0 && this.run[curprocess] !== 0){
				if(curqueue === 3){
					this.thirdOrder.push(curprocess);
					//this.cmd("Move", this.qElementID[curprocess], QUEUE_INITIAL_X, QUEUE_INITIAL_Y);
					//this.cmd("Step");

					let nextXPos = PROCESS_START_X - PROCESS_WIDTH/2 + (5 - this.getQueueLength(curqueue))*ELEMENT_WIDTH;
					let nextYPos = QUEUE_INITIAL_Y + (INTERSPACE + QUEUE_HEIGHT) * (curqueue - 1);
					this.cmd("Move", this.qElementID[curprocess], nextXPos, nextYPos);
					this.cmd("Step");
				}
				else{
					if(curqueue === 1){
						this.secondOrder.push(curprocess);
						curqueue = 2;
					}
					else{
						this.thirdOrder.push(curprocess);
						curqueue = 3;
					}

					//this.cmd("Move", this.qElementID[curprocess], 900, 200);
					//this.cmd("Step");
					let nextXPos = PROCESS_START_X - PROCESS_WIDTH/2 + (5 - this.getQueueLength(curqueue))*ELEMENT_WIDTH;
					let nextYPos = QUEUE_INITIAL_Y + (INTERSPACE + QUEUE_HEIGHT) * (curqueue - 1);
					this.cmd("Move", this.qElementID[curprocess], nextXPos, nextYPos);
					this.cmd("Step");
				}
				breakjudge = true;
			}

			if(nextprocess < SIZE && this.arrive[nextprocess] === time){
				this.firstOrder.push(nextprocess);
				//cmd 加入
				this.cmd("CreateRectangle", this.qElementID[nextprocess], 'p' + (nextprocess+1), PROCESS_WIDTH, PROCESS_HEIGHT, ELEMENT_INITIAL_X, QUEUE_INITIAL_Y);
				// this.cmd("SetForegroundColor", this.nextIndex, FOREGROUND_COLOR);
				// this.cmd("SetBackgroundColor", this.nextIndex, BACKGROUND_COLOR);
				this.cmd("Step");
				let nextXPos = PROCESS_START_X - PROCESS_WIDTH/2 + (5 - this.getQueueLength(1))*ELEMENT_WIDTH;
				let nextYPos = QUEUE_INITIAL_Y;
				this.cmd("Move", this.qElementID[nextprocess], nextXPos, nextYPos);
				this.cmd("Step");

				nextprocess ++;
				breakjudge = true;

				if(curTimeSlice !== 0 && this.run[curprocess] !== 0){
					//this.cmd("Move", this.qElementID[curprocess], QUEUE_INITIAL_X, QUEUE_INITIAL_Y);
					//this.cmd("Step");
					if(curqueue === 2) this.secondOrder.push(curprocess);
					else this.thirdOrder.push(curprocess);
					let nextXPos = PROCESS_START_X - PROCESS_WIDTH/2 + (5 - this.getQueueLength(curqueue))*ELEMENT_WIDTH;
					let nextYPos = QUEUE_INITIAL_Y + (INTERSPACE + QUEUE_HEIGHT) * (curqueue - 1);
					this.cmd("Move", this.qElementID[curprocess], nextXPos, nextYPos);
					this.cmd("Step");
				}
			}

			if(breakjudge)
				break;
		}
		this.hasrun = true;
	}
	return this.commands
}

RRQueue.prototype.getQueueLength = function (curqueue){
	if(curqueue === 1){
		return this.enqueuenum1++;
	}
	else if(curqueue === 2){
		return this.enqueuenum2++;
	}
	else{
		return this.enqueuenum3++;
	}
}

RRQueue.prototype.reset = function()
{
	this.nextIndex = 0;
	this.commands = [];

	this.arrive = new Array(SIZE);
	this.run = new Array(SIZE);
	this.totaltime = 0;
}

RRQueue.prototype.disableUI = function()
{
	for (let i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}
RRQueue.prototype.enableUI = function()
{
	for (let i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}
	if(this.hasrun){
		this.controls[0].disabled = true;
	}
}
let currentAlg;
function init()
{
	let animManag = initCanvas();
	currentAlg = new RRQueue(animManag, canvas.width, canvas.height);
}