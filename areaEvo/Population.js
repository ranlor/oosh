class Population {

    constructor(segmentsCount, mutationRate, maxPop, maxGen) {

        this.population; // Array to hold the current population
        this.matingPool; // ArrayList which we will use for our "mating pool"
        this.generations = 0; // Number of generations
        this.finished = false; // Are we finished evolving?
        this.mutationRate = mutationRate; // Mutation rate
        this.maxGenerations = maxGen;

        this.best = "";
        
        this.population = [];
        for (let i = 0; i < maxPop; i++) {
            this.population[i] = new DNA(segmentsCount);
        }
        this.matingPool = [];
        this.calcFitness();
    }

    // Fill our fitness array with a value for every member of the population
    calcFitness() {
        for (let i = 0; i < this.population.length; i++) {
            this.population[i].calcFitness();
        }
    }

    // Generate a mating pool
    naturalSelection() {
        // Clear the ArrayList
        this.matingPool = [];

        // find max fitness in population
        let maxFitness = 0;
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].fitness > maxFitness) {
                maxFitness = this.population[i].fitness;
            }
        }

        // Based on fitness, each member will get added to the mating pool a certain number of times
        // a higher fitness = more entries to mating pool = more likely to be picked as a parent
        // a lower fitness = fewer entries to mating pool = less likely to be picked as a parent
        for (let i = 0; i < this.population.length; i++) {

            let fitness = map(this.population[i].fitness, 0, maxFitness, 0, 1);
            let n = floor(fitness * 100); // Arbitrary multiplier, we can also use monte carlo method
            for (let j = 0; j < n; j++) { // and pick two random numbers
                this.matingPool.push(this.population[i]);
            }
        }
    }

    // Compute average fitness for the population
    getAverageFitness() {
        let total = 0;
        for (let i = 0; i < this.population.length; i++) {
            total += this.population[i].fitness;
        }
        return total / (this.population.length);
    }

    // Create a new generation
    generate() {
        if (this.matingPool.length === 0)
        {
            this.finished = true;
            return;
        }
        // Refill the population with children from the mating pool
        for (let i = 0; i < this.population.length; i++) {
            let a = floor(random(this.matingPool.length));
            let b = floor(random(this.matingPool.length));
            let partnerA = this.matingPool[a];
            let partnerB = this.matingPool[b];
            let childNum = 3;
//        if (partnerA.fitness >= exceptionalPairThreshold ||
//            partnerB.fitness >= exceptionalPairThreshold )
//        {
//            childNum = 10;
//            console.log("familiy");
//        }

            for (let j = 0; j < childNum; ++j)
            {
                let child = partnerA.crossover(partnerB);
                child.mutate(this.mutationRate);
                this.population[i] = child;
            }
        }
        this.generations++;
    }

    getBest() {
        return this.population[this.best].getDNAString();
    }
    
    getBestFitnessScore() {
        return this.population[this.best].fitness;
    }
    
    // Compute the current "most fit" member of the population
    evaluate() {
        let worldrecord = 0.0;
        let index = 0;
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].fitness > worldrecord) {
                index = i;
                worldrecord = this.population[i].fitness;
            }
        }

        this.best = index;
        if (worldrecord >= perfectFitness(this.population[index].genes) || this.generations > this.maxGenerations) {
            this.finished = true;
        }
    }

    isFinished() {
        return this.finished;
    }

    getGenerations() {
        return this.generations;
    }

    allDNAs() {
        let everything = "";

        let displayLimit = min(this.population.length, 50);


        for (let i = 0; i < displayLimit; i++) {
            everything += "<span class='dnaSel' id="+i+"> " + this.population[i].getDNAString() + "</span> "+ this.population[i].fitness +"<br>";
        }
        return everything;
    }
}