// the DNA is a representation of segments in the floor
// each index in the DNA referes to one of the line segments (a.k.a walls) in the floor
// each value of the DNA can be true, or false 
// true means keep the line segment , false means to remove it
// i.e.
// if we have a DNA of size 4 with |0,1,0,1| 
// we know that we need to remove the segments with id 0 and 2
// and keep the segments 1 and 3
// Addendum: add doors to the DNA, value of 2 will indicate a door
// and will marked as a removed segment in the flood fill map

// Constructor (makes a random DNA)
class DNA {
    constructor(dnaLen) 
    {
        // The genetic sequence
        this.genes = [];
        this.fitness = 0;
        this.DNABuild = new DNABuild();
        this.remCount = 0;
        this.doorCount = 0;
        for (let i = 0; i < dnaLen; i++) {
            this.genes[i] = this.doWeKeepIt(); // do we keep the segment?
        }
    }
    
    doWeKeepIt()
    {
        var chances = [0,0,1,1,1,2,2,2,2]; // greater chance to get a door
        var answer = floor(random(0,2048)) % chances.length;
        answer = chances[answer];
        
        if (this.doorCount >= roomNumber)
        {
            answer = floor(random(0,2048)) % 2;
        }
        else
        {
            
        }
        if (this.remCount >= maxSegmentsToRemove)
        {
            return 1;
        }
        this.doorCount++;
        this.remCount++;
        return answer;
    }

    // Converts character array to a String
    getDNAString() {
        return this.genes.join();
    }

    calcFitness() {
        var fitness = new Fitness(this.genes);
        this.fitness = fitness.calcScore(); 
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
        
        // how many segments removed in child
        var c = 0;
        for (var i in child.genes)
        {
            if (child.genes[i] === 0)
            {
                c++;
            }
        }

        if (c > maxSegmentsToRemove)
        {
            for (var i in child.genes)
            {
                if (child.genes[i] === 0)
                {
                    child.genes[i] = 1;
                    c--;
                }
                if (c <=0 )
                {
                    break;
                }
            }
        }
        return child;
    }

    mutate(mutationRate) {
        for (let i = 1; i < this.genes.length; i++) {
            if (random(1) < mutationRate) { //if we mutate, we toggle the  gene
                this.genes[i] = this.genes[i] === 1 ? 0 : 1;
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