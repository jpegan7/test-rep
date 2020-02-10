// import {Grid} from 'grid'

//prevents right click menus
document.addEventListener('contextmenu', event => event.preventDefault());

let canvas = document.getElementById("window");
var ctx = canvas.getContext("2d");

canvas.width =1200;
canvas.height = 600;
const NUM_COLUMNS = 100;
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



let heldDown = false;
let button = 0;

function mouseDown(e){
    button = e.button;
    heldDown = true;
    draw(e);
}

function mouseUp(e){
    heldDown = false;
}

window.addEventListener('mousedown', mouseDown);
window.addEventListener('mouseup', mouseUp);
window.addEventListener('mousemove', function(e){if(gameField.mode==0) draw(e)});


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

    console.log("index: " +index);
    var i =Math.floor(index/(NUM_COLUMNS));
    var j =index - i * NUM_COLUMNS; 

    return [i,j];
}


function displayGrid(){
    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw screen
    var cur;
    var coord;
    for(var i =0; i< NUM_ROWS; i++){
        for(var j=0; j< NUM_COLUMNS; j++ ){
          cur = gameField.grid[getIndex(i,j)];
          if(cur){
            coord = getCoordFromIndices(i,j);
            if(cur == 1)
                ctx.fillStyle = "#000000";
            else if(cur == 2)
                ctx.fillStyle = "#FF5733";
            else if(cur == 3)
                ctx.fillStyle = "#0080FF";
            else if(cur==4)
                ctx.fillStyle = "#FFFF33";
            
            ctx.fillRect(coord[0], coord[1], CELL_WIDTH, CELL_HEIGHT);
            }
        }
    }
}

function getIndex(i,j){
    return i*NUM_COLUMNS+j;
}


function visitCell(i,j){

    // console.log("columns: " + NUM_COLUMNS + ", rows: " + NUM_ROWS);
    // console.log("indices " +i +", " + j);

    if(i >= 0 && i <= NUM_ROWS-1 && j >= 0 && j <= NUM_COLUMNS-1){
        var cell = gameField.grid[getIndex(i,j)];
    
        if(cell == 3){
            clearInterval(id);
            displayGrid();
            alert("Found it!");
            return true; 
        }else if(cell == 0){
            gameField.grid[getIndex(i,j)] = 4;
           // console.log("visited:" + getIndex(i,j) + " cell="+cell);
            displayGrid();
            return false;

        }
    }
    return false;
}

let id;

function startSearch(alg){
     id = setInterval(alg, 100);
}

var nodes = new Array();

function bfs(startIndex){
    var tempIndex;
    var newNodes = new Array();

    newNodes.push(startIndex);

    for(var i=0; i < NUM_COLUMNS*NUM_ROWS; i++){
        if(gameField.grid[i] == 4) newNodes.push(i);
    }

    
    //filter out nodes we've already checked
    newNodes = newNodes.filter(num => !nodes.includes(num));

    nodes = nodes.concat(newNodes);

    if (newNodes.length == 0){
        clearInterval(id);
    }else{
        //Check for flag
        for(var k=0; k< newNodes.length; k++){
            tempIndex = newNodes[k];
            //check if inside grid
            var indices = getIndicesFromIndex(tempIndex);
            var i = indices[0];
            var j = indices[1];
                //check above
                if (visitCell(i-1, j)) return true;

                //check beside
                if (visitCell(i,j-1)) return true;
                if (visitCell(i,j+1)) return true;
            
                //check below
                if (visitCell(i+1,j)) return true;
        
            }
    }

    
}

