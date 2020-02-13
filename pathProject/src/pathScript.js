//vertical space above canvas
let margin = 10; 

//prevents right click menus
document.addEventListener('contextmenu', event => event.preventDefault());

let canvas = document.getElementById("window");
var ctx = canvas.getContext("2d");

canvas.width =1200;
canvas.height = 600;

const NUM_COLUMNS = 100;
const NUM_ROWS = Math.floor(NUM_COLUMNS/(canvas.width/canvas.height));

const CELL_WIDTH = Math.floor(canvas.width / NUM_COLUMNS);
const CELL_HEIGHT = Math.floor(canvas.height / NUM_ROWS);

//Re-size canvas to fit with grid - might wanna remove if grid display is reconfigured
canvas.width = NUM_COLUMNS*CELL_WIDTH;
canvas.height = NUM_ROWS*CELL_HEIGHT;

const MOUSE_X_OFFSET = (window.innerWidth - canvas.width) / 2;
const MOUSE_Y_OFFSET = margin;//(window.innerHeight - canvas.height) / 2;

//Create our grid
let gameField = new Grid(NUM_COLUMNS, NUM_ROWS);

//keep track of what type of object user wants to create
let wButton = document.getElementById("wall");
wButton.onclick = function() {gameField.mode=0};
let nButton = document.getElementById("node");
nButton.onclick = function() {gameField.mode=1};
let fButton = document.getElementById("flag");
fButton.onclick = function() {gameField.mode=2;};

//Define buttons
let sButton = document.getElementById("start");
sButton.onclick = function() {if(gameField.flagIndex  !=-1 && gameField.startNodeIndex != -1)startSearch()};

let rButton = document.getElementById("reset");
rButton.onclick = function(){
    gameField.reset(); 
    nodes = new Array(); 
    pathSet = new Array(); 
    pathSetCurrent = new Array();
    searchHasStarted = false;
    numCellsVisited = 0;
    
    clearInterval(intervalID);
    displayGrid()
};

let cButton = document.getElementById("clear");
cButton.onclick = function(){
    gameField.clearSearch(); 
    nodes = new Array(); 
    pathSet = new Array(); 
    pathSetCurrent = new Array();
    searchHasStarted = false;
    numCellsVisited = 0;

    clearInterval(intervalID);
    displayGrid()
};

//Dropdown menu to select the algorithm
let algSelect = document.getElementById("algorithms");

let numCellsVisited = 0;
let nodes = new Array();
let pathSet =  new Array();

let searchHasStarted = false;
let animationSpeed = 10;
let intervalID;

let heldDown = false;
let button = 0;

window.addEventListener('mousedown', mouseDown);
window.addEventListener('mouseup', mouseUp);
window.addEventListener('mousemove', function(e){if(!searchHasStarted && gameField.mode==0) draw(e)});


function mouseDown(e){
    button = e.button;
    heldDown = true;
    if(!searchHasStarted)
        draw(e);
}


function mouseUp(e){
    heldDown = false;
}


class Path {
    constructor(index, prev) {
        this.index = index;
        this.prev = prev;
    }

    getPathLength(){
        var cur = this;
        var count = 0;
        while(cur.prev!=null){
            cur = cur.prev;
            count++;
        }
        return count;

    }
}


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


function getCoordFromIndices(i,j){
    var x = j * CELL_WIDTH;
    var y = i * CELL_HEIGHT;
    return [x,y];
}


function getIndicesFromCoord(x,y){
    x = x - MOUSE_X_OFFSET;
    y = y - MOUSE_Y_OFFSET;

    var j = x/CELL_WIDTH;
    var i = y/CELL_HEIGHT;
    return [i,j];
}


function getIndicesFromIndex(index){

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
        gameField.grid[current.index] = 5;
        current = current.prev;
    }

    displayGrid();

}


function startSearch(){
    var arg;
    switch(algSelect.value){
        case "bfs": alg = bfs;
            break;
        case "dfs": alg = dfs;
            break;
    }

    if(searchHasStarted) return;
    searchHasStarted = true;
    pathSet.push(new Path(gameField.startNodeIndex, null));
    nodes.push(gameField.startNodeIndex);
    if(gameField.startNodeIndex != -1 && gameField.flagIndex != -1)
        intervalID = setInterval(alg, animationSpeed); 

}


function displayNewNode(i,j){

    var coords = getCoordFromIndices(i,j)

    ctx.fillStyle = "#FFFF33";
    ctx.fillRect(coords[0], coords[1], CELL_WIDTH, CELL_HEIGHT);
    
}

//can be updated to include diagonal neighbors
function getNeighborIndices(i,j){
    return [[i-1,j],[i,j+1],[i+1,j],[i,j-1]];
}


function cellIsValid(i,j){
    return (i >= 0 && i <= NUM_ROWS-1 && j >= 0 && j <= NUM_COLUMNS-1 && !nodes.includes(getIndex(i,j)) && gameField.grid[getIndex(i,j)]!=1);
}


function visitCell(i,j,path){

        var index =getIndex(i,j);
        var cell = gameField.grid[index];
        numCellsVisited++;
    
        if(cell == 3){
            clearInterval(intervalID);
            gameField.finalPath = path.prev;
            displayPath();

            document.getElementById("pathLength").innerHTML = path.getPathLength();
            document.getElementById("totalCells").innerHTML = numCellsVisited-1; // -1 since we dont count start node

            return true; 

        }else if(cell == 0){
            gameField.grid[index] = 4;
            displayNewNode(i,j);
            return false;

        }
}


function bfs(){

    if(pathSet.length == 0){
        clearInterval(intervalID);
        return false;
    }

    var path = pathSet.pop();
    var index = path.index;

    var indices = getIndicesFromIndex(index);
    var i = indices[0];
    var j = indices[1];

    if(visitCell(i,j,path)) return true;

    var nIndex;
    var neighbors = getNeighborIndices(i,j);

    //Check all neighbors
    for(nIndices of neighbors){
        if(cellIsValid(nIndices[0], nIndices[1])){
            nIndex = getIndex(nIndices[0], nIndices[1]);
            pathSet.unshift(new Path(nIndex, path));
            nodes.push(nIndex);
        }

    }
   
}


function dfs(){
    if(pathSet.length == 0){
        clearInterval(intervalID);
        return false;
    }

    var path = pathSet.pop();

    //DFS adds paths as it goes, and those paths may become obsolete as the algorithm runs
    //We avoid all obsolete paths in a while loop to avoid unwanted time between animation steps
    while(gameField.grid[path.index] == 4){
        console.log(path.index);
        path = pathSet.pop();
    }
    
    var index = path.index;

    nodes.push(index);

    var indices = getIndicesFromIndex(index);
    var i = indices[0];
    var j = indices[1];

    if(visitCell(i,j,path)) return true;


    var nIndex;
    var neighbors = getNeighborIndices(i,j).reverse();
    
    //Check all neighbors
    for(nIndices of neighbors){
        if(cellIsValid(nIndices[0], nIndices[1])){
            nIndex = getIndex(nIndices[0], nIndices[1]);
            pathSet.push(new Path(nIndex, path));
        }
        
    }

}


function getCost(i1,j1,i2,j2){
    return Math.abs(i1 - i2) + Math.abs(j1 - j2);
}

function aStar(){
    if(pathSet.length == 0){
        clearInterval(intervalID);
        return false;
    }

    var path = pathSet.pop();

    var thisIndex = path.thisIndex;

    var thisIndices = getIndicesFromIndex(thisIndex);

    var i = thisIndices[0];
    var j = thisIndices[1];

    var startIndices = getIndicesFromIndex(gameField.startNodeIndex);
    var si = startIndices[0];
    var sj = startIndices[1];

    var startIndices = getIndicesFromIndex(gameField.flagIndex);
    var fi = startIndices[0];
    var fj = startIndices[1];

    var fCost;



}


//Old version that was faster, wont work now but might wanna make a new fast version
//function bfsOld(){
    //     var path;
    //     var index;
    //     var i;
    //     var j;
       
    //    while(pathSet.length > 0){
        
    //         path = pathSet.pop();
        
    //         index = path.index;
        
    //         nodes.push(index);
        
    //         indices = getIndicesFromIndex(index);
    //         i = indices[0];
    //         j = indices[1];
    
            
    
    
    //         //Check up
    //         switch(visitCell(i-1, j, path)){
    //             //Found the flag!
    //             case 1: return true;
    //                 break;
    //             //New possible path
    //             case 0: pathSetCurrent.unshift(new Path(getIndex(i-1,j), path));
    //                 break;
    //             //Not valid path
    //             case -1: break;
    //         }
    
    //         //Check right
    //         switch(visitCell(i, j+1, path)){
    //             case 1: return true;
    //                 break;
    //             case 0: pathSetCurrent.unshift(new Path(getIndex(i,j+1), path));
    //                 break;
    //             case -1: break;
    //         }
    
    //         //Check down
    //         switch(visitCell(i+1, j, path)){
    //             case 1: return true;
    //                 break;
    //             case 0: pathSetCurrent.unshift(new Path(getIndex(i+1,j), path));
    //                 break;
    //             case -1: break;
    //         }
    
    //         //Check left
    //         switch(visitCell(i, j-1, path)){
    //             case 1: return true;
    //                 break;
    //             case 0: pathSetCurrent.unshift(new Path(getIndex(i,j-1), path));
    //                 break;
    //             case -1: break;
    //         }
    
    //     }
    
    //     pathSet = pathSetCurrent;
    //     pathSetCurrent = new Array();
    
    // }