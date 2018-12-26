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

    // remove all the pixels that are cross points between segments
    var crossPixels = gridPoints.xPoints.length * gridPoints.yPoints.length;
    
    /*since we add the number of valid doors(roomNumbers) to the fitness score we should add them here too*/
    return mapSize - segmentsPixels - crossPixels + roomNumber;
    
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
            if (genes[index] === DNAMap.CLEAR || genes[index] === DNAMap.DOOR)
            {
                var p = linesSegments[index].mapCoord;
                this.map[p[0]][p[1]] = MapLegend.UNVISITED;
            }
        }
        this.floodFill = new FloodFill(this.map,true);
        
    }
    
    calcScore()
    {
        var geneScore = this.genes.reduce(function(acc,val){ return acc + val; });
        if (geneScore < 7) {return 0;}
        
        var score = this.floodFill.getFloodFillScore(0,0);
        var doorCorrectness = this.getDoorPlacementCorrectness(score);
        return score + doorCorrectness;
    }
    
    getMap()
    {
        return this.map;
    }

    // check which door placement is a part of a room
    // i.e. if it is surrounded with walls 
    getDoorPlacementCorrectness(availableSpaces)
    {
        var score = 0;
        for (var i in this.genes)
        {
            var index = parseInt(i,10);
            if (this.genes[index] === DNAMap.DOOR)
            {
                var p = linesSegments[index].mapCoord;
                if (this.isDoorCorrect(p[0],p[1],availableSpaces))
                {
                    score++;
                }
            }
        }
        return score;
    }

    isDoorCorrect(i,j,maxScore)
    {
        var localMap = matrixCopy(this.map);
        localMap[i][j] = MapLegend.BORDER;
        var localFloodFill = new FloodFill(localMap,false); 
        var scoreSum = 0;
        if (j % 2 === 0) //verical point
        {
            scoreSum = localFloodFill.getFloodFillScore(i-1,j);
            localFloodFill.replaceMap(localMap);
            scoreSum += localFloodFill.getFloodFillScore(i+1,j);
        }
        else // horizontal point
        {
            scoreSum = localFloodFill.getFloodFillScore(i,j-1);
            localFloodFill.replaceMap(localMap);
            scoreSum += localFloodFill.getFloodFillScore(i,j+1);
        }
        
        // if the scoreSum is more than maxScore then the door we are checking
        // is not a part of a valid room
        return maxScore >= scoreSum;
    }
    
}