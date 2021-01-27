var SIZE = 5;

var TABLE_ENTRY_WIDTH = 50;
var TABLE_ENTRY_HEIGHT = 25;
var TABLE_START_X = 50;
var TABLE_START_Y = 80;

var PROCESS_WIDTH = 25;
var PROCESS_HEIGHT = 25;
var PROCESS_START_X = 300;
var PROCESS_START_Y = 250;

var SIGN_START_X = 300;
var SIGN_START_Y = 100;
var SIGN_WIDTH = 40;
var SIGN_HEIGHT = 40;

var INSERT_X = 200;
var INSERT_Y = 50;

var FOREGROUND_COLOR = "#000055"
var BACKGROUND_COLOR = "#AAAAFF"
var TEXT_COLOR = "#283FC2"
var INITIAL_BACKGROUND = "#2F71E3"
var END_COLOR = "#FFFFFF"

function sjf(am, w, h)
{
	this.init(am, w, h);
}

sjf.prototype = new Algorithm();
sjf.prototype.constructor = sjf;
sjf.superclass = Algorithm.prototype;

sjf.prototype.init = function(am, w, h)
{

	sjf.superclass.init.call(this, am, w, h);	
	this.addControls();	
	this.nextIndex = 0;
    this.commands = [];

    this.arrive = new Array(SIZE);
    this.run = new Array(SIZE);
    this.totaltime = 0;
    this.complish = new Array(SIZE);
    this.hasrun = false;

    this.setup();

}

sjf.prototype.addControls =  function()
{
    this.controls = [];
    
    this.startButton = addControlToAlgorithmBar("Button", "start");
	this.startButton.onclick = this.startCallback.bind(this);
	this.controls.push(this.startButton);

	this.newButton = addControlToAlgorithmBar("Button", "new");
	this.newButton.onclick = this.newCallback.bind(this);
	this.controls.push(this.newButton);
}

sjf.prototype.setup = function(){
    this.commands = [];
    this.nextIndex = 0;
    this.programID = new Array(SIZE);
    this.arriveID = new Array(SIZE);
    this.runID = new Array(SIZE);
    this.signID = new Array(SIZE);

    for (var i = 0; i < SIZE; i++)
	{		
		this.programID[i] = this.nextIndex++;
		this.arriveID[i] = this.nextIndex++;
		this.runID[i] = this.nextIndex++;
    }
    
    for(let i = 0; i < SIZE; i ++){
        this.signID[i] = this.nextIndex++;
    }

    for(var i = 0; i < SIZE; i ++){
        this.cmd("CreateRectangle",this.programID[i], 'P' + (i+1), TABLE_ENTRY_WIDTH, TABLE_ENTRY_HEIGHT, TABLE_START_X, TABLE_START_Y + i*TABLE_ENTRY_HEIGHT);
        this.cmd("SetTextColor",this.programID[i],TEXT_COLOR);
        this.cmd("CreateRectangle",this.arriveID[i],"",TABLE_ENTRY_WIDTH, TABLE_ENTRY_HEIGHT, TABLE_START_X + TABLE_ENTRY_WIDTH, TABLE_START_Y + i*TABLE_ENTRY_HEIGHT);
        this.cmd("CreateRectangle",this.runID[i],"",TABLE_ENTRY_WIDTH, TABLE_ENTRY_HEIGHT, TABLE_START_X+2*TABLE_ENTRY_WIDTH, TABLE_START_Y + i*TABLE_ENTRY_HEIGHT);
        
        this.cmd("CreateRectangle",this.signID[i], 'P' + (i+1), SIGN_WIDTH, SIGN_HEIGHT, SIGN_START_X + i*SIGN_WIDTH, SIGN_START_Y);
        //this.cmd("Set")
    }

    this.cmd("CreateLabel", this.nextIndex++, "process", TABLE_START_X, TABLE_START_Y  - TABLE_ENTRY_HEIGHT);
	this.cmd("CreateLabel", this.nextIndex++, "arrive", TABLE_START_X + TABLE_ENTRY_WIDTH, TABLE_START_Y  - TABLE_ENTRY_HEIGHT);
    this.cmd("CreateLabel", this.nextIndex++, "run", TABLE_START_X + 2 * TABLE_ENTRY_WIDTH, TABLE_START_Y  - TABLE_ENTRY_HEIGHT);
    
    this.cmd("CreateRectangle",this.signID[i], 'P' + (i+1), SIGN_WIDTH, SIGN_HEIGHT, SIGN_START_X, TABLE_START_Y + i*TABLE_ENTRY_HEIGHT);


    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.randomizeArray();
}


sjf.prototype.randomizeArray = function()
{
    this.commands = new Array();
    this.arrive[0] = 0;
    this.run[0] = Math.floor(5 + Math.random()*3);
    this.cmd("SetText", this.arriveID[0], 0);	
    this.cmd("SetText", this.runID[0], this.run[0]);
    this.totaltime += this.run[0];									
	for (var i = 1; i < SIZE; i++)
	{
		this.arrive[i] =  this.arrive[i-1] + Math.floor(1 + Math.random()*2);        
        this.cmd("SetText", this.arriveID[i], this.arrive[i]);										
    }
    for (var i = 1; i < SIZE; i++)
	{
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


sjf.prototype.startCallback = function()
{
    this.implementAction(this.start.bind(this),"");
}

sjf.prototype.newCallback = function()
{
    this.animationManager.resetAll();
    this.nextIndex = 0;
    this.commands = [];

    this.arrive = new Array(SIZE);
    this.run = new Array(SIZE);
    this.totaltime = 0;
    this.hasrun = false;
    this.complish = new Array(SIZE);
    this.setup();
}

sjf.prototype.start = function(){
    // if(this.hasrun)
    //     return;

    this.commands = new Array();
    for(let i = 0; i < SIZE; i ++){
        this.complish[i] = false;
    }

    this.complish[0] = true;
    let time = 0;
    let nextprocess = 1;
    this.cmd("SetBackgroundColor",this.signID[0],INITIAL_BACKGROUND);

    while(time < this.totaltime){
        //1.寻找最短的剩余时间任务,获得其索引
        let index = 0;
        for(let i = 0; i < SIZE; i ++){
            if(this.complish[i]){
                index = i;
                break;
            }
        }
        for(let i = 0; i < SIZE; i ++){
            if(this.complish[i] && this.run[i] < this.run[index]){
                index = i;
            }
        }   
        //2.1运行
        //2.2运行过后判断是否存在新进任务
        this.cmd("SetHighlight", this.signID[index], 1);

        while(this.run[index] > 0){
            this.cmd("CreateRectangle", this.nextIndex, 'P' + (index+1), PROCESS_WIDTH, PROCESS_HEIGHT, INSERT_X, INSERT_Y);
            this.cmd("SetForegroundColor", this.nextIndex, FOREGROUND_COLOR);
            this.cmd("SetBackgroundColor", this.nextIndex, BACKGROUND_COLOR);
            this.cmd("Step");
            var nextXPos = PROCESS_START_X + time * PROCESS_WIDTH
            var nextYPos = PROCESS_START_Y + index * PROCESS_HEIGHT;
            this.cmd("Move", this.nextIndex, nextXPos, nextYPos);
            this.cmd("Step");
            this.nextIndex++;
            this.run[index]--;
            time ++;
            if(this.run[index] === 0){
                this.complish[index] = false;
                this.cmd("SetBackgroundColor",this.signID[index],END_COLOR);
            }
            if(nextprocess < SIZE && this.arrive[nextprocess] === time){
                this.complish[nextprocess] = true;
                this.cmd("SetBackgroundColor",this.signID[nextprocess],INITIAL_BACKGROUND);
                nextprocess ++;
                break;
            }            
        }
        this.cmd("SetHighlight", this.signID[index], 0);
        this.hasrun = true;
    }
    return this.commands;
}


sjf.prototype.reset = function()
{
    this.nextIndex = 0;
    this.commands = [];

    this.arrive = new Array(SIZE);
    this.run = new Array(SIZE);
    // this.runprocess = new Array(SIZE);
    // this.runprocess.push(0);
    // this.curprocesses = 0;
    this.totaltime = 0;
    this.hasrun = false;
    this.complish = new Array(SIZE);
}

sjf.prototype.disableUI = function()
{
	for (let i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = true;
	}
}

sjf.prototype.enableUI = function()
{
	for (let i = 0; i < this.controls.length; i++)
	{
		this.controls[i].disabled = false;
	}
    if(this.hasrun)
        this.controls[0].disabled = true;
}

var currentAlg;
function init()
{
	var animManag = initCanvas();
	currentAlg = new sjf(animManag, canvas.width, canvas.height);
}