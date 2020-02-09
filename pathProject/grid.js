
class Grid{
    constructor(columns,rows){
        this.columns = columns;
        this.rows = rows;

        this.grid = this.setUpGrid(new Array());

    }

    setUpGrid(g){
        for(var i = 0; i<this.columns*this.rows; i++){
            g.push(0);
        }
        return g;
    }

    //TODO: find better name
    placeAt(i,j){
        this.grid[i*this.columns+j] = 1;
    }

    printGrid(){
       console.log(this.grid);
    }
} 
