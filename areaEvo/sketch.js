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

let area = 10;

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
  mutationRate = 0.01;

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
    fill(90,90,90);
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


// room
//       wall 1
//       --------------------
// wall4 |                  | wall 2
//       |                  |
//       |                  |
//       |                    door
//       --------------------
//        wall 3
function generateRoom(w ,h, doorWidthPercent, leftPoint)
{
    var doorWall = floor(random(0,3))+1;
    console.log(doorWall)
    var doorWidth = 10;

    if (doorWall === 1 || doorWall == 3)
    {
        doorWidth = (doorWidthPercent/100) * w;
    }
    else
    {
        doorWidth = (doorWidthPercent/100) * h;
    }

    stroke (255);

    // wall 1
    var dw = doorWall === 1 ? doorWidth : 0;
    line(leftPoint[0],leftPoint[1], leftPoint[0] + w - dw, leftPoint[1]);
    // wall 2 
    dw = doorWall === 2 ? doorWidth : 0;
    line(leftPoint[0] + w, leftPoint[1], leftPoint[0] + w, leftPoint[1] + h - dw);
    // wall 3
    dw = doorWall === 3 ? doorWidth : 0;
    line( leftPoint[0] + w, leftPoint[1] + h , leftPoint[0] + dw, leftPoint[1] + h);
    dw = doorWall === 4 ? doorWidth : 0;
    line(leftPoint[0] , leftPoint[1] + h, leftPoint[0] , leftPoint[1] + dw);

}

function draw() {
    console.log("draw");
    var worldConstrains = [300,150];
    var middlePoint = [cW/2, cH/2];
    stroke (255,0,0);
    rect(middlePoint[0] - worldConstrains[0]/2, middlePoint[1] - worldConstrains[1]/2, worldConstrains[0], worldConstrains[1]);
    for (var i=0; i<4; ++i)
    {
        var w = floor(random(10,worldConstrains[0]));
        var ratio = floor(random(3,4)); / floor(random(2,4));
        var h = floor(random(10,worldConstrains[1]));

        var y = floor(random(middlePoint[1] - worldConstrains[1]/2, middlePoint[1] + worldConstrains[1]/2));
        var x = floor(random(middlePoint[0] - worldConstrains[0]/2, middlePoint[0] + worldConstrains[0]/2));
        generateRoom(w,h, 20/* percent */, [x,y]);
    }
    noLoop();
    // // Generate mating pool
    // population.naturalSelection();
    // //Create next generation
    // population.generate();
    // // Calculate fitness
    // population.calcFitness();

    // population.evaluate();

    // // If we found the target phrase, stop
    // if (population.isFinished()) {
    //     //println(millis()/1000.0);
    //     noLoop();
    // }

    // displayInfo();
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
