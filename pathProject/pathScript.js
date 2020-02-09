// import {Grid} from 'grid'

let canvas = document.getElementById("window");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const GRID_WIDTH = 80;
const GRID_HEIGHT = 60;
const CELL_WIDTH = canvas.width / GRID_WIDTH;
const CELL_HEIGHT = canvas.height / GRID_HEIGHT;

let g = new Grid(GRID_WIDTH, GRID_HEIGHT);

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

function getIndexFromCoord(x,y){

}

function displayGrid(){
    var cur;
    var coord;
    for(var i =0; i< GRID_HEIGHT; i++){
        for(var j=0; j< GRID_WIDTH; j++ ){
            
          cur = g.grid[getIndex(g,i,j)];
          console.log("in display: " +cur)
          if(cur==1){
            coord = getCoordFromIndices(i,j);
            ctx.fillRect(coord[0], coord[1], CELL_WIDTH, CELL_HEIGHT);
          }
        }
    }
}

function getIndex(g,i,j){
    return i*g.width+j;
}

var alt = true;
for(var i=0 ;i< g.width;i++){
    for(var j=0; j< g.height; j++){
       if(alt)
        g.placeAt(i,j);
        
       alt = !alt;
        
    }
}


g.printGrid();
displayGrid();
