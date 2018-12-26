

class FloodFill
{
    constructor(map)
    {
        this.matrix = matrixCopy(map);
        this.width = this.matrix.length;
        this.height = this.matrix[0].length;
        this.count = 0;
    }
    
    getFloodFillScore()
    {
        this.count = 0;
        this.floodFill(0,0);
        this.paintIt();
        return this.count;
    }
    
    paintIt()
    {
        push();
        strokeWeight(0);
        for (var i=0; i<this.width; ++i)
        {
            for (var j=0; j<this.height; ++j)
            {
                switch (this.matrix[i][j])
                {
                    case MapLegend.VISITED:
                        fill(255,0,0);
                        break;
                    case MapLegend.UNVISITED:
                        fill(255,255,255);
                        break;
                    case MapLegend.BORDER:
                        fill(0,0,255);
                        break;
                }
                rect(i*5,j*5,5,5);
            }
        }
        pop();
    }
    
    floodFill(x,y)
    {
        if (x >= this.width) { return; }
        if (y >= this.height) { return; }
        if (x < 0) { return; }
        if (y < 0) { return; }
        
        if (this.matrix[x][y] === MapLegend.VISITED || 
            this.matrix[x][y] === MapLegend.BORDER)
        {
            return;
        }

        this.count++;

        this.matrix[x][y] = MapLegend.VISITED;
        this.floodFill(x, y + 1);
        this.floodFill(x, y - 1);
        this.floodFill(x - 1, y);
        this.floodFill(x + 1, y);
    }
}