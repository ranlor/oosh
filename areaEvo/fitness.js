/**
 * here we will calculate the fitness of a DNA strain
 * 
 * each dna strain will be converted to a graph of coordinates with edges connect 
 * to each adjacent node that is not furthur than one unit scale (1m) 
 * each vertex wieght is dependent on the amount of edges it has
 * the overall fitness of the DNA is the sum of all it's vertices weights
 * 
 * a graph with more than one node in the same coordinats will be unfit (fitness = 0)
 */

// perfect Fintness is the maximum graph weight possible given a geneCount
// which is a square shape
function perfectFitness(geneCount)
{
    // note: it is assumed that geneCount is the power of 2 of some number (since we're using squared meters for area)
    var sideCount = Math.sqrt(geneCount);
    
    // square corners each have only 3 neighbors and there are 4 corners in a square
    var cornersWeightsSum = 4 * 3;
    
    // sides of the square have at most (without corners) 5 weight and there are 4 sides in a square
    var side = sideCount - 2; // subtract corners
    var sideWeightSum =  (side * 5) * 4;
    
    // the reset of the vertex weights each will have a weight of 8
    var innerCount = geneCount - 4 /*corners*/ - (side * 4) /*4 sides (without corners)*/;
    var innerWeightSum = innerCount * 8;
    
    return cornersWeightsSum + sideWeightSum + innerWeightSum;
}

class Fitness
{
    constructor(genes) 
    {
        this.DIST = 1;
        this.coordsHash = {};
        this.genes = genes;
        this.coordGenes = [];
        this.vertScore = [];
        this.relativeDeltas = [
            [this.DIST,0],
            [0,this.DIST],
            [-this.DIST,0],
            [0,-this.DIST],
            [this.DIST,this.DIST],
            [-this.DIST,-this.DIST],
            [this.DIST,-this.DIST],
            [-this.DIST,this.DIST]
        ];
    }
    
    turnToKey(point)
    {
        return "("+point[0]+","+point[1]+")";
    }
    
//    getGeneCoordIndexFromGeneIndex(geneIndex)
//    {
//        // calculate the delta between the indices of both arrays
//        var resetGeneCount = 0; //these are the delta between the 2 arrays
//        for (var i=0; i<geneIndex; ++i)
//        {
//            if ( !Number.isInteger(this.genes[i]) )
//            {
//                resetGeneCount++;
//            }
//        }
////        console.log("gene Index: " + geneIndex +", resetGene Count: "+resetGeneCount+", geneCoordIndex: "+(geneIndex - resetGeneCount) + ", geneCoords Length " + this.coordGenes.length);
//        console.log("Fitness : ",this.genes);
//        return (geneIndex - resetGeneCount);
//    }
//    
    calcScore()
    {
        // first pass: turn genes to coordinates start at origin 0,0 and check for loops
        var point = [0,0];
        this.coordsHash[this.turnToKey(point)] = 0;
        this.coordGenes = [];
        this.coordGenes[0] = point;
        
        for (var i in this.genes)
        {
            var gene = parseInt(this.genes[i],10);
            switch (gene)
            {
                case directions.DOWN:
                    point[1] += this.DIST; 
                    break;
                case directions.UP:
                    point[1] -= this.DIST; 
                    break;
                case directions.RIGHT:
                    point[0] += this.DIST; 
                    break;
                case directions.LEFT:
                    point[0] -= this.DIST; 
                    break;
//                default : // we get a rest gene we reset the point and continue
//                    var extractedIndex = parseInt(this.genes[i].substr(1),10); 
//                    // get the index offset between genes and coordGenes
//                    var coordGeneIndex = this.getGeneCoordIndexFromGeneIndex(extractedIndex);
//                    // reset the relative point to the point in the reset gene's index
//                    point = this.coordGenes[coordGeneIndex].slice(0);
//                    continue; // skip the rest of the loop

            }
            var key = this.turnToKey(point);
            // if we encounter the same point we already inserted then
            // we have a DNA with a loop, it's fitness is zero (unfit)
            if (this.coordsHash.hasOwnProperty(key))
            {
                return 0;
            }
            
            this.coordsHash[key] = 0;
            this.coordGenes.push(point.slice(0));
        }
        // second pass: sum all the weights of the vertex
        this.secondPass();
        
        var vertexWeightSum = 0;
        for (var i in this.vertScore)
        {
             if (this.vertScore[i] < 3) //punish any corridors
            {
                vertexWeightSum *= 0.5;
            }
            else
            {
                vertexWeightSum += this.vertScore[i];
            }
        }
        
        return vertexWeightSum;
    }
    
    secondPass()
    {
        for (var i in this.coordGenes)
        {
            var vertexWeight = 0;
            var point = this.coordGenes[i];
            //check all 8 sides
            for (var j in this.relativeDeltas)
            {
                var delta = this.relativeDeltas[j].slice(0);
                var adjectPoint = [point[0] + delta[0], point[1] + delta[1]];
                var key = this.turnToKey(adjectPoint);
                if (this.coordsHash.hasOwnProperty(key))
                {
                    vertexWeight++;
                }
            }
            this.vertScore[i] = vertexWeight;
            
        }
    }
}