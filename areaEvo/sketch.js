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

const yPointCount = 3; // how many y axis grid points
const xPointCount = 4; // how many x axis grid points
const roomNumber = 3; // this means how many doors must be present
const maxSegmentsToRemove = 14 ;

const MapLegend = {
    VISITED : 2,
    BORDER : 1,
    UNVISITED : 0
};
let logicalCrossPoints = [];
let defaultFloorMap = [];

const DNAMap = {
    CLEAR : 0,
    WALL : 1,
    DOOR : 2
};
class Segment {
    constructor(startPoint, endPoint, mc)
    {
        this.sP = startPoint.slice(0);
        this.eP = endPoint.slice(0);
        
        this.mapCoord = mc.slice(0);
    }
};

let outerWallsDim = {};
let gridPoints = [];
let linesSegments = [];

function setup() {
    bestPhrase = createP("Best floorPlan:");
    bestPhrase.class("best");

    allDNAs = createP("All areas:");
    allDNAs.position(cW+10, 90);
    allDNAs.class("all");

    stats = createP("Stats");
    //stats.position(10,200);
    stats.class("stats");

    // create preview
    canvas = createCanvas(cW, cH);
    background(127);
    strokeWeight(0);
    stroke(255);
    fill(255, 255, 255, 0);

    //createCanvas(640, 360);
    popmax = 50;
    genMax = 10000;
    mutationRate = 0.01;


    outerWallsDim = generateOuterWalls();
    gridPoints = generateGridPoints(outerWallsDim.width, outerWallsDim.height);
    linesSegments = generateLineSegments(outerWallsDim, gridPoints);
    console.log(linesSegments);
    defaultFloorMap = generateDefaultFloorMap(gridPoints.xPoints.length, gridPoints.yPoints.length);
    console.log(defaultFloorMap);
    
    // Create a population with a target phrase, mutation rate, and population max
    population = new Population(linesSegments.length, mutationRate, popmax, genMax);
}

function generateDefaultFloorMap(xPCount,yPCount)
{
    var width = (xPCount * 2) + 1; // one pixel for grid point (wall) and one pixel for each "room" that uses it
    var height = (yPCount * 2) + 1;// one pixel for grid point (wall) and one pixel for each "room" that uses it
    var map = [];
    
    for (var i=0; i<width; ++i)
    {
        var row = [];
        for (var j=0; j<height; ++j)
        {
            row[j] = MapLegend.UNVISITED;
        }
        map.push(row.slice(0));
    }
 
    // fill in the borders
    for (var key in linesSegments)
    {
        var p = linesSegments[key].mapCoord;
        map[p[0]][p[1]] = MapLegend.BORDER;
    }

    for (var key in logicalCrossPoints)
    {
        var p = logicalCrossPoints[key];
        map[p[0]][p[1]] = MapLegend.BORDER;
    }
    
    return map;
}

// avoid those costly sqrt and pow methods
function localDist(segment)
{
    if (segment.sP[0] === segment.eP[0]) // vertical line
    {
        return Math.abs(segment.sP[1] - segment.eP[1]);
    }
    if (segment.sP[1] === segment.eP[1]) // vertical line
    {
        return Math.abs(segment.sP[0] - segment.eP[0]);
    }
    return 0;
}

function matrixCopy(mat)
{
    var map = [];
    
    for (var i=0; i<mat.length; ++i)
    {
        var row = [];
        for (var j=0; j<mat[i].length; ++j)
        {
            row[j] = mat[i][j];
        }
        map.push(row.slice(0));
    }
    return map;
}

function dnaClickHandler(event) {
    let elem = event.target;
    let text = elem.innerHTML;
    let index = parseInt(elem.getAttribute('id'),10);
    let dna = text.split(",").filter(function (part) { return !!part; });
    drawDNAGrid(dna,index);
}


function generateOuterWalls() {
    var worldConstrains = [cW - 10, cH - 10];
    var minumumWorldConstrains = [400, 400];
    var w = floor(random(minumumWorldConstrains[0], worldConstrains[0]));
    var h = floor(random(minumumWorldConstrains[1], worldConstrains[1]));
    var middlePoint = [cW / 2, cH / 2];
    // top left point, width, height
    return {
        'topLeftpoint': [middlePoint[0] - w / 2, middlePoint[1] - h / 2],
        'width': w,
        'height': h
    };
}

function generateLinearPoints(length, padding, count) {
    var points = {};
    var num = padding;
    for (var i = 0; i < count; ++i) {
        var endRange = num + (length / 2);
        if (endRange > length - padding) { endRange = length - padding; }
        if (num + padding < endRange) {
            num = floor(random(num, endRange));
            points[num + ""] = num; // to avoid happing duplicate points
            num += 60; // add padding to ensure the next point won't be too close
        }
    }
    // console.log(length, padding, count, Object.values(points));
    return Object.values(points); // get an array from a set
}

/**
 * 
 * @param {int} w outer wall width
 * @param {int} h outer wall height
 */
function generateGridPoints(w, h) {
    const PADDING_PERCENT = 10;
    var paddingValueW = (w / 100) * PADDING_PERCENT;
    var paddingValueH = (h / 100) * PADDING_PERCENT;

    var yGridPoints = generateLinearPoints(h, paddingValueH, yPointCount);
    var xGridPoints = generateLinearPoints(w, paddingValueW, xPointCount);

    return {
        'xPoints': xGridPoints,
        'yPoints': yGridPoints
    };
}

// turn relative point to absolute point in the pixel space
function rel2abs(point)
{
    return [
        point[0] + outerWallsDim.topLeftpoint[0],
        point[1] + outerWallsDim.topLeftpoint[1]
    ];
}

// the order this method and generateDefaultFloorMap method add segments
// is important, change one of them you'll need to change the other
function generateLineSegments(constraints, gridPoints)
{
    var segmentLines = [];
    var initialPoint = rel2abs([0,0]);
    var finishPoint = rel2abs([ constraints.width, constraints.height ]);
    
    var startPoint = initialPoint.slice(0);
    var endPoint = [];
    var logicalCoord  = [0,0];
    for (var xKey in gridPoints.xPoints)
    {
        logicalCoord[0]++; //skip x empty space
        for (var yKey in gridPoints.yPoints)
        {
            endPoint = rel2abs([ gridPoints.xPoints[xKey], gridPoints.yPoints[yKey] ]);
            //create vertical segment
            segmentLines.push(new Segment(
                [ endPoint[0] , startPoint[1] ],
                endPoint,
                // logical map coordinates
                logicalCoord
            ));
            logicalCoord[1]++; //skip y empty space
            //create Horizontal segment
            segmentLines.push(new Segment(
                [ startPoint[0], endPoint[1] ],
                endPoint,
                // logical map coordinates
                [ logicalCoord[0] - 1, logicalCoord[1] ]
            ));
            logicalCrossPoints.push(logicalCoord.slice(0));
            logicalCoord[1]++; //skip y empty space
            startPoint[1] = endPoint[1];
        }
        
        // add the last segment that reach the south wall
        segmentLines.push(new Segment(
            endPoint,
            [ endPoint[0] , finishPoint[1] ],
            // logical map coordinates
            logicalCoord
        ));
        
        // reset the points
        startPoint[1] = initialPoint[1];
        startPoint[0] = endPoint[0];
        logicalCoord[1] = 0;
        logicalCoord[0]++; //skip x empty space
    }
    
    //add all the segments that reach the east wall
    var lastXPoint = gridPoints.xPoints[ gridPoints.xPoints.length - 1 ];
    for (var yKey in gridPoints.yPoints)
    {
        startPoint = rel2abs([ lastXPoint, gridPoints.yPoints[yKey] ]);
        endPoint = rel2abs([ constraints.width, gridPoints.yPoints[yKey] ]);
        logicalCoord[1]++; //skip y empty space
        //create Horizontal segment
        segmentLines.push(new Segment(
                startPoint,
                endPoint,
                logicalCoord
            ));
        logicalCoord[1]++; //skip y empty space
    }
    
    return segmentLines;
}

function paintGrid(constraints, gridPoints) {
    for (var key in gridPoints.yPoints) {
        var y = constraints.topLeftpoint[1] + gridPoints.yPoints[key];
        var x = constraints.topLeftpoint[0];
        line(x, y, x + constraints.width, y);
    }

    for (var key in gridPoints.xPoints) {
        var x = constraints.topLeftpoint[0] + gridPoints.xPoints[key];
        var y = constraints.topLeftpoint[1];
        line(x, y, x , y + constraints.height);
    }
}

function drawStatusText(msg)
{
    push();
    strokeWeight(0);
    fill(0,0,0);
    text(msg, 10, 10);
    pop();
}

function draw() {
    background(127);
    stroke(0, 0, 200);
    strokeWeight(2);
    rect(outerWallsDim.topLeftpoint[0], outerWallsDim.topLeftpoint[1], outerWallsDim.width, outerWallsDim.height);
//    paintGrid(outerWallsDim, gridPoints);
    drawStatusText(pmouseX + "," + pmouseY);
    // // Generate mating pool
    population.naturalSelection();
    //Create next generation
    population.generate();
    // Calculate fitness
    population.calcFitness();

    population.evaluate();
//    noLoop();

    // If we found the target phrase, stop
    if (population.isFinished()) 
    {
        noLoop();
    }

    displayInfo();
}

function addClickEvent() {
    let elems = document.getElementsByClassName("dnaSel");

    if (elems.length < 1) { return; }

    for (var i in elems) {
        if (typeof elems[i].addEventListener !== "undefined") 
        { 
            elems[i].addEventListener('click', dnaClickHandler);
        }
    }
}

function removeClickEvent() {
    let elems = document.getElementsByClassName("dnaSel");

    if (elems.length < 1) { return; }

    for (var i in elems) {
        elems[i].removeEventListener('click', dnaClickHandler);
    }
}

function drawDNAGrid(dna,index)
{
    background(127);
    // paint outline of the full segments
    stroke(0, 0, 200);
    strokeWeight(2);
    rect(outerWallsDim.topLeftpoint[0], outerWallsDim.topLeftpoint[1], outerWallsDim.width, outerWallsDim.height);
    push();
    stroke(0, 0, 200,40);
    paintGrid(outerWallsDim, gridPoints);
    colorMode(HSB,100);
    for (var i in linesSegments)
    {
        var ii = parseInt(i,10);
        var v = parseInt(dna[ii],10);
        if (v === DNAMap.WALL)
        {
            stroke(parseInt(i,10), 100, 100);
            let seg = linesSegments[i];
            line(seg.sP[0], seg.sP[1], seg.eP[0], seg.eP[1]);
        }
        if (v === DNAMap.DOOR) 
        {
            let seg = linesSegments[i];
            stroke(0, 100, 0);
            line(seg.sP[0], seg.sP[1], seg.eP[0], seg.eP[1]);
        }
    }
    pop();
    if (index >= 0)
    {
        population.popCopy[index].calcFitness();
    }
}

function displayInfo() {
    // Display current status of population
    let answer = population.getBest();
    let fitness = population.getBestFitnessScore();

    bestPhrase.html("Best subject:<br>" + fitness + " <span class='dnaSel' id='0'>" + answer + "</span>");

    let statstext = "total generations:     " + population.getGenerations() + "<br>";
    statstext += "average fitness:       " + nf(population.getAverageFitness()) + "<br>";
    statstext += "total population:      " + popmax + "<br>";
    statstext += "mutation rate:         " + floor(mutationRate * 100) + "%<br/>";
    statstext += "Perfect Score:         " + perfectFitness([]);
    stats.html(statstext);

    // clear event listeners

    //removeClickEvent();

    allDNAs.html("All subjects:<br>" + population.allDNAs());

    // add event listeners

    if (population.isFinished()) {
        addClickEvent();
    }

    drawDNAGrid(answer.split(",").filter(function (part) { return !!part; }),0);
}
