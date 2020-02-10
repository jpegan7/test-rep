class Grid{
    constructor(columns,rows){
        this.columns = columns;
        this.rows = rows;

        this.grid = this.setUpGrid(new Array());
        this.mode = 0;
        this.algorithm = "BFS";

        this.startNodeIndex = -1;
        this.flagIndex = -1;

    }

    setUpGrid(g){
        for(var i = 0; i<this.columns*this.rows; i++){
            g.push(0);
        }
        return g;
    }

    //Dynamically chooses what to place
    placeAt(i,j){
        if(this.mode==0)
            this.placeWallAt(i,j);
        else if(this.mode == 1)
            this.placeNodeAt(i,j);
        else if(this.mode == 2)
            this.placeFlagAt(i,j)
    }

    placeWallAt(i,j){
        this.grid[i*this.columns+j] = 1;
    }

    placeNodeAt(i,j){
        this.grid[i*this.columns+j] = 2;
        
        if(this.startNodeIndex != -1)
            this.grid[this.startNodeIndex] = 0;

        this.startNodeIndex = i*this.columns+j;
    }

    placeFlagAt(i,j){
        this.grid[i*this.columns+j] = 3;

        if(this.flagIndex != -1)
            this.grid[this.flagIndex] = 0;

        this.flagIndex = i*this.columns+j;
    }

    removeAt(i,j){
        var val = this.grid[i*this.columns+j];

        if(val == 2) this.hasStartNode = false;
        else if(val == 3) this.hasFlag = false;


        this.grid[i*this.columns+j] = 0;
        
    }
} 
