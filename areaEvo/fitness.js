/**
 * fitness of a subject will be calculated by bucket filling the floor
 * the whole floor gets filled then we know that we don't have closed off
 * rooms in the floor 
 * the fitness of a subject is determined by the number of pixel it was able
 * to fill in
 * the perfect fitness (1) is when you filled all the pixels in the floor 
 * so all the rooms in the floor are accsessible
 */

// perfect fitness is all pixels are filled in the floor
// (removing the pixels covered by walls)
function perfectFitness(genes)
{
    var mapSize = defaultFloorMap.length * defaultFloorMap[0].length;
    var segmentsPixels = 0;
    // remove all the pixels covered by the walls that are still standing (according to the DNA)
    for (var i in genes)
    {
        if (genes[i] === 1)
        {
            segmentsPixels++;
        }
    }
    
    return mapSize - segmentsPixels;
    
}

class Fitness
{
    constructor(genes) 
    {
        this.genes = genes;
        this.map = matrixCopy(defaultFloorMap);
        // remove all the walls turned off in the genes from the map
        for (var i in genes)
        {
            var index = parseInt(i,10);
            if (genes[index] === 0)
            {
                var p = linesSegments[index].mapCoord;
                this.map[p[0]][p[1]] = MapLegend.UNVISITED;
            }
        }
        this.floodFill = new FloodFill(this.map);
        
    }
    
    calcScore()
    {
        return this.floodFill.getFloodFillScore();
    }
    
    getMap()
    {
        return this.map;
    }
    
}