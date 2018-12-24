// The dna of the Area which is an array of directions
// 1 - right
// 2 - down
// 3 - left
// 4 - up
// each sequance of DNA block will indicate which direction to 
// put the next m^2 square in 
// example DNA 1,4,3,4,1
// 1st square at position 0,0 
// put the 2nd square to the right of the 1st 
// put the 3rd square above the 2nd
// put the 4th square to the left of the 3rd
// put the 5th square above the 4th
// put the 6th square to the right of the 5th
// NOTE: from this  description a DNA sequance can't have a 2 genes that 
// have opposite directions (4,2) or (1,3) since there will be overlap

// Constructor (makes a random DNA)
class DNA {
    constructor(dnaLen) 
    {
        // The genetic sequence
        this.genes = [];
        this.fitness = 0;
        this.DNABuild = new DNABuild();
        this.genes[0] = this.newDirection(0); 
        for (let i = 1; i < dnaLen; i++) {
            this.genes[i] = this.newDirection(this.genes[i-1]); // Pick from range of directions
        }
//      SQUARE DNA CODE:
//        var i=0;
//        for (; i < Math.sqrt(dnaLen)-1; ++i)
//        {
//            this.genes[i] = directions.RIGHT;
//        }
//        
//        for (var j=0; j < (Math.sqrt(dnaLen)/2)-1; ++j)
//        {
//            this.genes[i++] = directions.DOWN;
//            var here = i;
//            for (; i < here+Math.sqrt(dnaLen)-1; ++i)
//            {
//                this.genes[i] = directions.LEFT;
//            }
//            this.genes[i++] = directions.DOWN;
//            here = i;
//            for (; i < here+Math.sqrt(dnaLen)-1; ++i)
//            {
//                this.genes[i] = directions.RIGHT;
//            }
//        } 
//        if ( Math.sqrt(dnaLen) % 2 === 0)
//        {
//            this.genes[i++] = directions.DOWN;
//            var here = i;
//            for (; i < here+Math.sqrt(dnaLen)-1; ++i)
//            {
//                this.genes[i] = directions.LEFT;
//            }
//        }
    }
    
//    extractRestartIndex(gene)
//    {
//        return parseInt(gene.substr(1),10);
//    }
//    
//    // return an array of indexs in genes that doesn't include restart genes
//    getAllNonRestartGenes()
//    {
//        const REM_THIS = -1;
//        var dirGenesIndices = [];
//
//        for (var i in this.genes)
//        {
//            if ( Number.isInteger(this.genes[i]) )
//            {
//                dirGenesIndices.push(i);
//            }
//            else
//            {
//                var remIndex = this.extractRestartIndex(this.genes[i]);
//                dirGenesIndices[remIndex] = REM_THIS;
//                
//            }
//        }
//        
//        // remove all the indexes we already restared to
//        var finalResult = [];
//        for (var i in dirGenesIndices)
//        {
//            if ( dirGenesIndices[i] === REM_THIS )
//            {
//                continue;
//            }
//            finalResult.push( dirGenesIndices[i] );
//        }
//        return finalResult;
//    }
    
    /***
     * get a new random direction 
     * @param {Number} previousDirection the previous direction in the DNA sequence
     * @returns {Number} a random direction that is not the opposite direction of previousDirection
     */
    newDirection(previousDirection)
    {
//        if ( !Number.isInteger(previousDirection) ) // is a restart gene
//        {
//            var extractedIndex = this.extractRestartIndex(previousDirection);
//            // overwrite the prepreviousDirection with the direction indicated in the reset gene we got 
//            previousDirection = this.genes[extractedIndex]; //we assume that this gene can't be a restart gene
//            this.DNABuild.resetPoint(this.genes, previousDirection); //reset the point to make everything work as regular
//        }
        var randomPossibleDirections = this.DNABuild.getDirectionPossibilities(previousDirection);
        // if we're at a point that we can't go any furthur without crashing into other genes (blocks)
        // we put a special character in the DNA that symbolises we will continue running from another 
        // gene in the DNA (and not the pervious one as we did until now) example: R4 indicates that we
        // will calculate a direction array from the gene in the 4th index in the DNA
//        if (this.DNABuild.gaveUp)
//        {
//            // get random position in the DNA (assuming the DNA length > 1 otherwise how did we giveup?)
//            // select a random gene in the DNA that isn't a reset gene
//            var dirGenesIndices = this.getAllNonRestartGenes();
//            var randIndex = floor(random(0,dirGenesIndices.length));
//            console.log(this.genes);
//            console.log("randIndex "+randIndex);
//            console.log(dirGenesIndices);
//            return RESTART_CHAR + dirGenesIndices[randIndex];
//            
//        }
        var index = floor(random(0,randomPossibleDirections.length));//floor(random(0, 2048)) % randomPossibleDirections.length;
        return randomPossibleDirections[index];
    }

    // Converts character array to a String
    getDNAString() {
        var str = "";
        for (var i in this.genes)
        {
//            switch (this.genes[i])
//            {
//                case directions.RIGHT:
//                    str += "R";//IGHT";
//                    break;
//                case directions.LEFT:
//                    str += "L";//EFT";
//                    break;
//                case directions.UP:
//                    str += "U";//P";
//                    break;
//                case directions.DOWN:
//                    str += "D";//OWN";
//                    break;
//            }
                
            str += this.genes[i] + ",";
        }
        return str;
    }

    /**
     * fitness calculations will turn the directions into a cloud of 
     * coordinates with a distance of 1 between each coordinates,
     * a score will be calculated by nighbour count, i.e. the DNA sequence 
     * that procudes the most neighbors will get a higher fitness score
     * if the DNA sequence has a loop (i.e. the same coordinates more than 
     * once) the fitness score will be zero
     * @returns {undefined}
     */ 
    calcFitness() {
//        let score = 0;
//        for (let i = 0; i < this.genes.length; i++) {
//            if (this.genes[i] == target.charAt(i)) {
//                score++;
//            }
//        }
//        this.fitness = score / target.length;
        var fitness = new Fitness(this.genes);
        this.fitness = fitness.calcScore(); // more complicated fintness is not implemented yet
    }

    // DNA SPLICING
    crossover(partner) {
        // A new child
        let child = new DNA(this.genes.length);

        let midpoint = floor(random(this.genes.length)); // Pick a midpoint

        // Half from one, half from the other
        // this may cause a lot of children that are unfit
        for (let i = 0; i < this.genes.length; i++) 
        {
            if (i > midpoint) 
            {
                child.genes[i] = this.genes[i];
            } 
            else
            {
                child.genes[i] = partner.genes[i];
            }
        }
        
        return child;
    }

    // Based on a mutation probability, picks a new random character
    mutate(mutationRate) {
        for (let i = 1; i < this.genes.length; i++) {
            if (random(1) < mutationRate) {
                var mutatedDirection = this.newDirection(this.genes[i-1]);
//                if ((mutatedDirection+"").substr(0,1) === RESTART_CHAR)
//                {
//                    continue; //skip mutation on genes that don't have any new direction to take
//                }
                this.genes[i] = this.newDirection(this.genes[i-1]);
            }
        }
    }
}

/*

//external newDNAValues method used by other code
function newDNAValues()
{
    // using crypto random values to avoid clustering(?)
    var array = new Uint32Array(5);
    window.crypto.getRandomValues(array);
    var dna = [];
    for (let i=0;i<5;++i)
    {
        a[i] = new Number(array[i]/2);
        a[i] = floor(a[i]);
    }
}

// Constructor (makes a random DNA)
class DNA {
    constructor(genes) {
        // The genetic sequence
        if (genes)
        {
            this.genes = genes;
        }
        else
        {
            this.genes = newDNAValues();
        }
        this.initialGenes = this.genes;
        this.fitness = 0;
        this.stringThing = target.join(",");
        this.searchIn = "";
        this.rando = new Rando(...this.genes);
    }

    // Converts character array to a String
    getPhrase()
    {
        let result = (this.fitness*100) + " ::  ";
        for (let i = 0; i < target.length; i++) {
            let num = (this.rando.getRando() % BASE);

            result += num + ",";
        }
        this.rando.resetSeed();
        return result;
    }

    isItAnyGood()
    {
        let it = 15;
        let itLen = 100;
        let buckets = new Array(64);
        buckets = buckets.fill(0,0);
        this.searchIn = "";
        
        for (let j=0;j<it;++j)
        {
            for (let i=0; i < itLen; ++i)
            {
                let v = (this.rando.getRando() % BASE);
                buckets[v] += 1;
                this.searchIn += v + ","; 
            }
        }
        
        let zeroCount = 0;
        buckets.map(function(x) {
            if (x === 0) {zeroCount++;}
        });
        
        return 1 - (zeroCount/64);
    }

    // Fitness function (returns floating point % of "correct" characters)
    calcFitness(target) {
        let score = 0;
        let saveSeries = [];
       
        //create the representation of the genes
        for (let i = 0; i < target.length; i++) {
            let geneResult = (this.rando.getRando() % BASE);
//            saveSeries.push(geneResult);
            if (geneResult === target[i]) {
                score++;
            }
//            else
//            {
//                break;
//            }
        }
//        
//        let testOne = this.isItAnyGood();
//        this.rando.resetSeed();
//        if (testOne > 0.5) //has repetition
//        {
//            if (this.searchIn.indexOf(this.stringThing) != -1)
//            {
//                this.fitness = 1.5;
//                return;
//            }
//        }
//        this.fitness = testOne*0.9;
        
        
        this.fitness = score / target.length;
        
//        if (this.fitness === 1)
//        {
//            throw Error("How? " +this.genes.join(","));
//        }
    }

    // Crossover
    crossover(partner, childNum) {
        // A new child
        let genes = new Array(0,0,0,0,0);

        let whichParent = floor(random(2)); // 0 = this parent, 1 = partner parent
        genes = whichParent > 0 ? partner.genes : this.genes;
        // then according to the childNum we take the value from the other parent
        genes[childNum] = whichParent > 0 ? this.genes[childNum] : partner.genes[childNum];
        
        return new DNA(genes);
    }

  // Based on a mutation probability, picks a new random character
    mutate(mutationRate)
    {
        let mutationDNA = newDNAValues();
        for (let i = 0; i < this.genes.length; ++i)
        {
            if (random(1) < mutationRate) 
            {
                this.genes[i] = mutationDNA[i];
            }
        }
    }
}

*/