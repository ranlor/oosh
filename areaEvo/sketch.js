// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Genetic Algorithm, Evolving Shakespeare

// Demonstration of using a genetic algorithm to perform a search

// setup()
//  # Step 1: The Population
//    # Create an empty population (an array or ArrayList)
//    # Fill it with DNA encoded objects (pick random values to start)

// draw()
//  # Step 1: Selection
//    # Create an empty mating pool (an empty ArrayList)
//    # For every member of the population, evaluate its fitness based on some criteria / function,
//      and add it to the mating pool in a manner consistant with its fitness, i.e. the more fit it
//      is the more times it appears in the mating pool, in order to be more likely picked for reproduction.

//  # Step 2: Reproduction Create a new empty population
//    # Fill the new population by executing the following steps:
//       1. Pick two "parent" objects from the mating pool.
//       2. Crossover -- create a "child" object by mating these two parents.
//       3. Mutation -- mutate the child's DNA based on a given probability.
//       4. Add the child object to the new population.
//    # Replace the old population with the new population
//
//   # Rinse and repeat


let popmax;
let mutationRate;
let population;
const cW = 800;
const cH = 600;
let canvas;

let bestPhrase;
let allDNAs;
let stats;

let exceptionalPairThreshold = 0.9;

let area = 2;

const RESTART_CHAR = 'R';
const directions = {
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    UP: 4
};

function setup() {
  bestPhrase = createP("Best floorPlan:");
  bestPhrase.class("best");

  allDNAs = createP("All areas:");
  allDNAs.position(600, 10);
  allDNAs.class("all");

  stats = createP("Stats");
  //stats.position(10,200);
  stats.class("stats");

  // create preview
  canvas =  createCanvas(cW,cH);
  background(127);
  strokeWeight(2);
  stroke(255);
  fill(255,255,255,128);

  //createCanvas(640, 360);
  popmax = 100;
  genMax = 1000;
  mutationRate = 0.05;

  // Create a population with a target phrase, mutation rate, and population max
  population = new Population(area, mutationRate, popmax, genMax);
  
  
}

const DIST = 20;
function drawRect(centerPoint, index, score)
{
    textSize(11);
    rect(centerPoint[0] - (DIST/2), centerPoint[1] - (DIST/2), DIST, DIST);
    strokeWeight(0);
    fill(0,0,0);
    text(index+"", centerPoint[0] - (DIST/2), centerPoint[1] - (DIST/2), DIST, DIST);
    strokeWeight(2);
    fill(255,255,255,128);
}

function drawScore(centerPoint, score)
{
    fill(128,128,0);
    text(score+"", (centerPoint[0]*DIST) + (cW / 2), (centerPoint[1]*DIST) + (cH / 2), DIST, DIST);
    strokeWeight(2);
    fill(255,255,255,128);
}

function drawDNAGrid(dna)
{
    var fitness = new Fitness(dna);
    fitness.calcScore();
    var okay = fitness.vertScore.length > 0;
    background(127);
    var point = [(cW / 2) , (cH / 2)];
    
    drawRect(point,0);
    if (okay)
    {
        drawScore(fitness.coordGenes[0],fitness.vertScore[0]);
    }
    
    for (var i in dna)
    {
        let dir = window.parseInt(dna[i],10);
        let index = window.parseInt(i,10);
        switch (dir)
        {
            case directions.DOWN:
                point[1] += DIST; 
                break;
            case directions.UP:
                point[1] -= DIST; 
                break;
            case directions.RIGHT:
                point[0] += DIST; 
                break;
            case directions.LEFT:
                point[0] -= DIST; 
                break;
            
        }
        
        drawRect(point,index+1);
        if (okay)
        {
            drawScore(fitness.coordGenes[index],fitness.vertScore[index]);
        }
        
    }
    
    
}

function dnaClickHandler(event)
{
    let elem = event.target;
    let text = elem.innerHTML;
    let dna = text.split(",").filter(function (part) { return !!part; });
    drawDNAGrid(dna);
}

function draw() {
    // Generate mating pool
    population.naturalSelection();
    //Create next generation
    population.generate();
    // Calculate fitness
    population.calcFitness();

    population.evaluate();

    // If we found the target phrase, stop
    if (population.isFinished()) {
        //println(millis()/1000.0);
        noLoop();
    }

    displayInfo();
}

function addClickEvent()
{
    let elems = document.getElementsByClassName("dnaSel");
    
    if (elems.length < 1) {return;}
    
    for (var i in elems)
    {
        elems[i].addEventListener('click',dnaClickHandler);
    }
}

function removeClickEvent()
{
    let elems = document.getElementsByClassName("dnaSel");
    
    if (elems.length < 1) {return;}
    
    for (var i in elems)
    {
        elems[i].removeEventListener('click',dnaClickHandler);
    }
}

function displayInfo() {
    // Display current status of population
    let answer = population.getBest();
    let fitness = population.getBestFitnessScore();
    
    bestPhrase.html("Best area:<br>"+ fitness + " <span class='dnaSel'>" + answer + "</span>");

    let statstext = "total generations:     " + population.getGenerations() + "<br>";
    statstext += "average fitness:       " + nf(population.getAverageFitness()) + "<br>";
    statstext += "total population:      " + popmax + "<br>";
    statstext += "mutation rate:         " + floor(mutationRate * 100) + "%<br/>";
    statstext += "Perfect Score:         " + perfectFitness(area*area);
    stats.html(statstext);

    // clear event listeners
    
    //removeClickEvent();
    
    allDNAs.html("All areas:<br>" + population.allDNAs());
    
    // add event listeners
    
    if (population.isFinished()) {
        addClickEvent();
    }
    
    drawDNAGrid(answer.split(",").filter(function (part) { return !!part; }));
}
