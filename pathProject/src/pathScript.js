// import {Grid} from 'grid'

//prevents right click menus
document.addEventListener('contextmenu', event => event.preventDefault());

let canvas = document.getElementById("window");
var ctx = canvas.getContext("2d");

canvas.width =1200;
canvas.height = 600;
const NUM_COLUMNS = 200;
const NUM_ROWS = Math.floor(NUM_COLUMNS/(canvas.width/canvas.height));;

const CELL_WIDTH = Math.floor(canvas.width / NUM_COLUMNS);
const CELL_HEIGHT = Math.floor(canvas.height / NUM_ROWS);

//Re-size canvas to fit with grid - might wanna remove if grid display is reconfigured
canvas.width = NUM_COLUMNS*CELL_WIDTH;
canvas.height = NUM_ROWS*CELL_HEIGHT;

const MOUSE_X_OFFSET = (window.innerWidth - canvas.width) / 2;
const MOUSE_Y_OFFSET = 0;//(window.innerHeight - canvas.height) / 2;


let gameField = new Grid(NUM_COLUMNS, NUM_ROWS);


//keep track of what type of object user wants to create
let wButton = document.getElementById("wall");
wButton.onclick = function() {gameField.mode=0};
let nButton = document.getElementById("node");
nButton.onclick = function() {gameField.mode=1};
let fButton = document.getElementById("flag");
fButton.onclick = function() {gameField.mode=2;};

let sButton = document.getElementById("start");
sButton.onclick = function() {startSearch(newbfs)};

let rButton = document.getElementById("reset");
rButton.onclick = function(){
    gameField.reset(); 
    nodes = new Array(); 
    pathQueue = new Array(); 
    clearInterval(id);
    searchHasStarted = false;
    displayGrid()
};


class Path {
    constructor(index, prev) {
        this.index = index;
        this.prev = prev;
    }
}



let searchHasStarted = false;

let heldDown = false;
let button = 0;

function mouseDown(e){
    button = e.button;
    heldDown = true;
    if(!searchHasStarted)
        draw(e);
}

function mouseUp(e){
    heldDown = false;
}

window.addEventListener('mousedown', mouseDown);
window.addEventListener('mouseup', mouseUp);
window.addEventListener('mousemove', function(e){if(!searchHasStarted && gameField.mode==0) draw(e)});


function draw(e) {
    if(!heldDown) return;

    var indices = getIndicesFromCoord(e.clientX,e.clientY);

    var i = Math.floor(indices[0]);
    var j = Math.floor(indices[1]);

    if(i < 0 || i >= NUM_ROWS || j < 0 || j>=NUM_COLUMNS) return;

    var index = getIndex(i,j);

    if(button==2){
        if(gameField.grid[index] == 0) return;
        gameField.removeAt(i,j);
    }else{
        if(gameField.grid[index]) return;
        gameField.placeAt(i,j); 
    }

    displayGrid();
}
 

function getIndex(i,j){
    return i*NUM_COLUMNS+j;
}

/**
 * Returns coordinates for top left corner of cell at i, j
 * @param {*} i 
 * @param {*} j 
 */
function getCoordFromIndices(i,j){
    var x = j * CELL_WIDTH;
    var y = i * CELL_HEIGHT;
    return [x,y];
}

function getIndicesFromCoord(x,y){
    x = x - MOUSE_X_OFFSET;
    y = y-MOUSE_Y_OFFSET;

    var j = x/CELL_WIDTH;
    var i = y/CELL_HEIGHT;
    return [i,j];
}

function getIndicesFromIndex(index){

 //   console.log("index: " +index);
    var i =Math.floor(index/(NUM_COLUMNS));
    var j =index - i * NUM_COLUMNS; 

    return [i,j];
}


function displayGrid(){
    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("called");
    //draw screen
    var cur;
    var coord;
    for(var i =0; i< NUM_ROWS; i++){
        for(var j=0; j< NUM_COLUMNS; j++ ){
          cur = gameField.grid[getIndex(i,j)];
          if(cur){
            coord = getCoordFromIndices(i,j);
            if(cur == 1) // Walls
                ctx.fillStyle = "#000000";
            else if(cur == 2) // Beginning search node
                ctx.fillStyle = "#FF5733";
            else if(cur == 3) // Flag
                ctx.fillStyle = "#0080FF";
            else if(cur==4) // Search nodes
                ctx.fillStyle = "#FFFF33";
            else if(cur==5) // Final path
                ctx.fillStyle = "#68FF33";
            
            ctx.fillRect(coord[0], coord[1], CELL_WIDTH, CELL_HEIGHT);
            }
        }
    }
}

function displayPath(path){
    var current = gameField.finalPath;

    while(current.prev!=null){
       // console.log(current);
        gameField.grid[current.index] = 5;
        current = current.prev;
    }

    displayGrid();

}


let id;
let pathQueue =  new Array();

function startSearch(alg){
    if(searchHasStarted) return;
    searchHasStarted = true;
    pathQueue.push(new Path(gameField.startNodeIndex, null));
    if(gameField.startNodeIndex != -1 && gameField.flagIndex != -1)
        id = setInterval(alg, .0001);

}

function displayNewNode(i,j){

    var coords = getCoordFromIndices(i,j)

    ctx.fillStyle = "#FFFF33";
    ctx.fillRect(coords[0], coords[1], CELL_WIDTH, CELL_HEIGHT);
    
}

function newVisitCell(i,j,path){

    if(i >= 0 && i <= NUM_ROWS-1 && j >= 0 && j <= NUM_COLUMNS-1){
        var index =getIndex(i,j);
        var cell = gameField.grid[index];
    
        if(cell == 3){
            clearInterval(id);
            displayGrid();
            //alert("Found it!");
            gameField.finalPath = path;
            displayPath();
            return true; 
        }else if(cell == 0){
            gameField.grid[index] = 4;
            pathQueue.unshift(new Path(index, path));
            displayNewNode(i,j);
            return false;

        }
    }
    return false;
}

let nodes = new Array();

function newbfs(){
    var path = pathQueue.pop();
    
    var index = path.index;

    nodes.push(index);

    var indices = getIndicesFromIndex(index);
    var i = indices[0];
    var j = indices[1];
    
    //check above
    if (newVisitCell(i-1, j, path)) return true;

    //check right
    if (newVisitCell(i, j+1, path)) return true;

        //check below
    if (newVisitCell(i+1, j, path)) return true;
    
    //check left
    if (newVisitCell(i,j-1, path)) return true;
}
