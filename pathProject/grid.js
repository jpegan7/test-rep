
class Grid{
    constructor(width,height){
        this.width = width;
        this.height = height;

        this.grid = this.setUpGrid(new Array());

    }

    setUpGrid(g){
        for(var i = 0; i<this.width*this.height; i++){
            g.push(0);
        }
        return g;
    }

    //TODO: find better name
    placeAt(i,j){
        this.grid[i*this.width+j] = 1;
    }

    printGrid(){
       console.log(this.grid);
    }
} 
