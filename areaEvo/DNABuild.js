/* 
 * this class will remember all the steps a certain dna strain has done
 * until a certain point and will return an array of possible directions
 * the next gene in the dna can be made of so there isn't an overlap in the
 * dna strain
 */

class DNABuild
{
    constructor()
    {
        this.DIST = 1;
        this.hashTable = {};
        this.point = [0,0];
        this.gaveUp = false;
    }
    
    toKey(p)
    {
        return p[0]+","+p[1];
    }
//    
//    resetPoint(genes, indexToResetThePointTo)
//    {
//        this.point[0,0];
//        for (var i=0; i<indexToResetThePointTo; ++i)
//        {
//            this.advancePoint(genes[i]);
//        }
//    }
    
    advancePoint(direction)
    {
        switch (direction)
        {
            case directions.DOWN:
                this.point[1] += this.DIST;
                break;
            case directions.UP:
                this.point[1] -= this.DIST;
                break;
            case directions.RIGHT:
                this.point[0] += this.DIST;
                break;
            case directions.LEFT:
                this.point[0] -= this.DIST;
                break;

        }
    }
    
    addToHash(direction)
    {
        this.advancePoint(direction);
        var key = this.toKey(this.point);
        
//        if (this.hashTable.hasOwnProperty(key) && !this.gaveUp)
//        {
//            throw new Error("Shoudn't happen since we always take a direction that does not cause a loop");
//            return 0;
//        }
        
        if (!this.hashTable.hasOwnProperty(key))
        {
            this.hashTable[key] = 0;
        }
    }
    
    getDirectionPossibilities(previousDirection)
    {
        this.gaveUp = false;
        var fullDirections = [ directions.RIGHT, directions.DOWN, directions.LEFT, directions.UP ];
        if (Object.keys(this.hashTable).length === 0)
        {
            this.hashTable[this.toKey(this.point)] = 0;
            return fullDirections;
        }
        
        this.addToHash(previousDirection);
        var randomPossibleDirections = [];
        
        // check which directions won't cause a loop
        for (var i in directions)
        {
            var newPoint = this.point.slice(0);
            switch (directions[i])
            {
                case directions.DOWN:
                    newPoint[1] += this.DIST;
                    break;
                case directions.UP:
                    newPoint[1] -= this.DIST;
                    break;
                case directions.RIGHT:
                    newPoint[0] += this.DIST;
                    break;
                case directions.LEFT:
                    newPoint[0] -= this.DIST;
                    break;

            }
            var key = this.toKey(newPoint);
            
            // if no one is in the coordinate then the direction is free add the direction to the direction array
            if (!this.hashTable.hasOwnProperty(key))
            {
                randomPossibleDirections.push(directions[i]);
            }
        }
        
        if (randomPossibleDirections.length === 0) 
        {
            // fuck it , the it be unfit and die
            this.gaveUp = true;
            return fullDirections;
        }
        
        return randomPossibleDirections;
    }
}

