// import {Grid} from 'grid'

let canvas = document.getElementById("window");
var ctx = canvas.getContext("2d");

canvas.width =600;//window.innerWidth;
canvas.height = 600; //window.innerHeight;
const NUM_COLUMNS = 51;
const NUM_ROWS = 51;
//NUM_COLUMNS/(canvas.width/canvas.height);
const CELL_WIDTH = canvas.width / NUM_COLUMNS;
const CELL_HEIGHT = canvas.height / NUM_ROWS;

let g = new Grid(NUM_COLUMNS, NUM_ROWS);

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
    for(var i =0; i< NUM_ROWS; i++){
        for(var j=0; j< NUM_COLUMNS; j++ ){
          cur = g.grid[getIndex(i,j)];
          if(cur==1){
            coord = getCoordFromIndices(i,j);
            ctx.fillRect(coord[0], coord[1], CELL_WIDTH-1, CELL_HEIGHT-1);
          }
        }
    }
}

function getIndex(i,j){
    return i*NUM_COLUMNS+j;
}

var alt = true;
for(var i=0 ;i< g.rows;i++){
    for(var j=0; j< g.columns; j++){
       if(alt)
        g.placeAt(i,j);
        
       alt = !alt;
        
    }
}


g.printGrid();
displayGrid();
