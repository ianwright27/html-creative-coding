// utility functions 
// const HALF_PI = Math.PI / 2;

// function cos(angle) {
//     return Math.cos(angle);
// }

// function sin(angle) {
//     return Math.sin(angle);
// }

// function atan2(y, x) {
//     return Math.atan2(y, x);
// }

// function floor(value) {
//     return Math.floor(value);
// }

// function int(value) {
//     return parseInt(value);
// }

// function round(value) {
//     return Math.round(value);
// } 

// function random() {
//     if (arguments.length === 0) {
//         // If no arguments provided, return a random number between 0 and 1
//         return Math.random();
//     } else if (arguments.length === 1) {
//         // If only one argument provided, it can be either an array or a maximum number
//         if (Array.isArray(arguments[0])) {
//             // If argument is an array, choose a random element from the array
//             var arr = arguments[0];
//             return arr[Math.floor(Math.random() * arr.length)];
//         } else {
//             // If argument is a single number, return a random number between 0 and that number
//             var max = arguments[0];
//             return Math.random() * max;
//         }
//     } else if (arguments.length === 2) {
//         // If two arguments provided, treat them as a range and return a random number within that range
//         var min = arguments[0];
//         var max = arguments[1];
//         return Math.random() * (max - min) + min;
//     }
// }



// random class 
class RandomClass {
    constructor() {
        this.randomFn = Math.random;
        this.floorFn = Math.floor;
    }

    // #1
    random() {
        return this.randomFn();
    }

    // overriding #1
    random(value) {
        return (this.randomFn() * value);
    }

    range(min, max) {
        return min + (this.randomFn() * (max - min))
    }

    list(list) {
        return list[this.floorFn((this.randomFn() * list.length))];
    }

    weightedRandom(prob) {
        let i, sum=0, r=this.random();
        for (i in prob) {
            sum += prob[i];
            if (r <= sum) return i;
        }
    }
}


// bead class 
class Bead {
    constructor (x, y, color) {
        this.x = x; 
        this.y = y; 
        this.color = color; 
    }

    draw() {
        var holder = $("<div>", {
            class: "beadObject", 
            css: { 
                // important 
                top: this.y - 10/2 + "px", 
                left: this.x - 10/2 + "px", 
            }
        }); 
        var parentElement = $("<div>", {
            class: "bead", 
            css: {
                backgroundColor: this.color, 
            }
        }); 
        var childElement = $("<div>", {
            class: "reflection", 
        }); 
        parentElement.append(childElement); 
        holder.append(parentElement); 
        $(".canvasArea").append(holder); 
    }
}


// particle class 
class Particle { 
    constructor(x, y) { 
        // data members
        this.random = new RandomClass(); 
        this.x = x; 
        this.y = y; 
        this.step_length = 1; 
        this.num_steps = 600; 
        // this.num_steps = int(random.range(5, 20)); 
        // this.num_steps = int(random.range(5, 10)); 
        this.step_count = 0; 
        this.stop_drawing = false; 
        this.prevx = 0; 
        this.prevy = 0; 

        // all about strings 
        this.xstop = 0; 
        this.ystop = 0;  
        this.minh = 252;
        this.maxh = this.minh + 50; 


        // call starter function
        this.pickColor(); 
        this.particleColor = ""; 

        // utility function
        this.random = new RandomClass();
    }


    pickColor(){ 
        this.color = COLORING_TECHNIQUE.apply(this.x, this.y);
    }


    mapPosition(obj) {
        // var strokeColors = ["#55f540", "#ff3b3b", "#ff3b3b", "#ff3b3b", "#fc38f9"];
        strokeWeight(0.5 * scale_); 
        // stroke(random(strokeColors)); 
        
        
        stroke("aqua"); 
        // up 
        line(obj.x, obj.y, obj.x, 0); 
        // down 
        line(obj.x, obj.y, obj.x, height); 
        
        stroke("green"); 
        // left 
        line(obj.x, obj.y, 0, obj.y); 
        // right 
        line(obj.x, obj.y, width, obj.y); 

        // testing the right 
        strokeWeight(1 * scale_); 
        stroke("#ff00fb"); // direction we are going (and which is supposed to be forwards) 
        line(obj.x, obj.y, obj.x + this.r + 300, 0); 
        // (0, 0, 0 + r, 0)
        strokeWeight(4 * scale_)
        point(obj.x, obj.y)
        console.log(get(obj.x + this.r, obj.y));
      
      }
    
    
    update(){
     
        // for (var i = 0; i < this.num_steps; ++i) {
        // if (this.stop_drawing == false) {
            // perform calculations
            var x_off = this.x - VECTOR_FIELD.left_x; 
            var y_off = this.y - VECTOR_FIELD.top_y; 
            var col_index = floor(x_off / VECTOR_FIELD.resolution); 
            var row_index = floor(y_off / VECTOR_FIELD.resolution); 

            // constrain to prevent undefined access to direct positions (which are just 0 or n) 
            col_index = constrain(col_index, 0, VECTOR_FIELD.cols-1); 
            row_index = constrain(row_index, 0, VECTOR_FIELD.rows-1); 

            var x_step = 0; 
            var y_step = 0; 


            // for the sake of phyllotaxis
            var distortPath = 1.567 * 0.5; 

            var spacing = 1.134912; 
            // spacing *= 0.9; 
        
                // store the previous coordinates
                this.prevx = this.x; 
                this.prevy = this.y; 

            if ((this.x > frameWidth && this.x < width - frameWidth) && 
                (this.y < height - frameWidth && this.y > frameWidth)) { 

        
                // obtain the vector
                var grid_angle = grid[col_index][row_index]; 

    
                if (center_of_rotation && VECTOR_FIELD.choice != "target") { 
                    // for the sake of pyllotaxis
                    // var angle = atan2( int((this.y)/resolution) - row_index, int((this.x)/resolution) - col_index);
                    var x_step = this.step_length * cos(grid_angle - HALF_PI * distortPath) * this.r * spacing; 
                    var y_step = this.step_length * sin(grid_angle - HALF_PI * distortPath) * this.r * spacing; 
                } else { 
                    // if this is true then we are drawing at the right place 
                    x_step = this.step_length * cos(grid_angle) * this.r * 1.05; 
                    y_step = this.step_length * sin(grid_angle) * this.r * 1.05; 
                } 
                
                let co = spacing; 
                // this.xstop = (x_step / 1) * 1.5;  
                // this.ystop = (y_step / 1) * 1.5; 
                var stretch =  map(this.r/scale_, 0.09, 0.8, 0.8, 0.95); 
                this.xstop = (x_step / 1) * 1.8;  
                this.ystop = (y_step / 1) * 1.8; 

                // generate new coordinates
                var new_x = this.x + x_step; 
                var new_y = this.y + y_step; 

                // collission status
                var collides = false; // by default
                    var particle = {x: new_x, y: new_y, r: this.r}; 
                    collides = collidesWithAnyCircle(particle, circles); 
                    // collides = collidesWithAnyCircle(particle, circles, true); 

                // collides = false; 
                if (collides) {
                    this.step_count = this.num_steps + 1; 
                    this.stop_drawing = true;
                    return;
                } 

                // determine the new coordinates
                this.x += x_step; 
                this.y += y_step; 

                var in_right_position = false;
                console.log(this.x, this.y)
                var color_area = get(this.x, this.y);
                if (
                    color_area[0] == red(BACKGROUND_COLOR) &&
                    color_area[1] == green(BACKGROUND_COLOR) &&
                    color_area[2] == blue(BACKGROUND_COLOR) && 
                    color_area[3] == 10 
                ) {
                    in_right_position = true;
                } 

                if (!collides && in_right_position) { 
                // if (!collides) { 
                    circles.push({x: this.x, y: this.y, r: this.r});
                    // draw 
                    BEAD_COUNT++; 
                    this.draw(); 
                } else { 
                    this.step_count = this.num_steps + 1; 
                    this.stop_drawing = true;
                    return; 
                }


            } else {
                

                // if the particle breaches the containment area
                this.step_count = this.num_steps + 1; 
                this.stop_drawing = true;

                return; 
                // break;
                // set the this.step_count beyond its limits to stop
            }


    }


    draw() { 

        if (this.stop_drawing == false) {
            
            var bead = new Bead(this.x, this.y, this.particleColor);  
            // bead.radius = this.r; 

            bead.draw();
            

        }
    }


}


/**/
// Coloring algorithms
class ColoringTechnique { 
    constructor () { 
        this.styles = [ 
            { 
                "name": "stripes", 
                "variations": ["horizontal", "vertical",/* "diagonal" */] 
            }, 
            { 
                "name": "weighted", 
                "variations": ["", "", ""] 
            }, 
            { 
                "name": "gradient", 
                "variations": ["horizontal", "vertical", "radial"] 
            }, 
            { 
                "name": "vector", 
                "variations": ["", "", ""] 
            } 
        ] 

        this.technique = {}; // empty object 
        this.variation = null; 
        
        this.random = new RandomClass(); 

        // boolean variables 
        this.pickedTechnique = false; 
        this.pickedVariation = false; 
    
        // first call 
        this.pick(); 
    }

    pick() { 
        this.technique = this.random.list(this.styles); 

        if (COL_TECHNIQUE == "stripes") this.technique = this.styles[0]; 
        if (COL_TECHNIQUE == "weighted") this.technique = this.styles[1]; 
        if (COL_TECHNIQUE == "gradient") this.technique = this.styles[2]; 
        if (COL_TECHNIQUE == "vector") this.technique = this.styles[3]; 
        
        /* debugging */
        // this.technique =  {
        //     "name": "gradient",
        //     "variations": ["horizontal", "vertical", "radial"]
        // }; 
        // this.technique =   {
        //     "name": "weighted", 
        //     "variations": []
        // } 
        // this.technique = {
        //     "name": "vector",
        //     "variations": []
        // };

        this.pickedTechnique = true;

        if (this.pickedTechnique) {
            /* handle variations here */ 
            if (this.technique.variations.length > 0) {
                /* pick variation */
                // console.log("chosen technique: " + this.technique)
                this.variation = this.random.list(this.technique.variations);
                
                /* debugging */
                // this.variation = "radial";
                // this.variation = "";
        
                this.pickedVariation = true;
            } else {
                this.variation = "";
            }

        }

        // while (this.pick)

    }

    assignTechnique(techniqueObj) {
        if (this.pickedTechnique || !this.pickedTechnique) {
            this.technique = techniqueObj;
            this.pickedTechnique = true;
        }

        /* after assigning the technique you're going to have to pick variations again */
        if (this.pickedTechnique) {
            /* handle variations here */ 
            if (this.technique.variations.length > 0) {
                /* pick variation */
                if (this.pickedVariation || !this.pickedVariation) {
                    this.variation = this.random.list(this.technique.variations);
                    this.pickedVariation = true;
                }
            }

        }

    }

    apply(x, y) {
        // apply colors based on x, y coordinates
        
        let _floor = this.random.floorFn;

        /**/
        if (this.technique.name == "vector") {
            // console.log(VECTOR_FIELD.grid)
            var x_off = x - VECTOR_FIELD.left_x; 
            var y_off = y - VECTOR_FIELD.top_y; 
            var col_index = int(x_off / VECTOR_FIELD.resolution); 
            var row_index = int(y_off / VECTOR_FIELD.resolution); 
            col_index = constrain(col_index, 0, VECTOR_FIELD.cols-1); 
            row_index = constrain(row_index, 0, VECTOR_FIELD.rows-1); 
            // console.log("VECTOR FIELD", VECTOR_FIELD);
            // var grid_val = VECTOR_FIELD.grid[col_index][row_index];
            var grid_val = grid[col_index][row_index];
            var distortion = 1; 
            var distortionProb = this.random.random();
            distortionProb = 0.8;

            // distortion can depend on layout type and variation
            // eg. with circuit flowfields, we don't need distortions
            if (VECTOR_FIELD.choice == "circuit") {
                distortion = 1;
            } else {

                if (distortionProb < 0.5) {

                    distortion = constrain(noise(x, y) * PI, 0.8, 1.1); 
                } else {

                    // distortion = random(0.8, 1.1); 
                    distortion = this.random.range(0.8, 1.1);  
                    // distortion = 0.8;
                }

            }
            
            // distortion = constrain(distortion, 0, 1);

            grid_val *= distortion; 
            var minValue = VECTOR_FIELD.minValue; 
            var maxValue = VECTOR_FIELD.maxValue; 
            var colorIndex = int(map(grid_val, minValue, maxValue, 0, COLOR_PALETTE.length-1)); 
            colorIndex = constrain(colorIndex, 0, COLOR_PALETTE.length-1); 
            return COLOR_PALETTE[colorIndex]; 

        }

        if (this.technique.name == "weighted") {
            
            let index = floor(weightedRandom(COLOR_WEIGHT));
            
            var counter = 0;
            while (index == undefined ||  isNaN(index)) {
                
                if (counter > 1000) {
                    index = floor(random(COLOR_PALETTE.length - 1));
                    break;
                }  else {
                    counter++;
                }
                
                index = floor(weightedRandom(COLOR_WEIGHT));
                index = constrain(index, 0, (COLOR_PALETTE.length - 1) );
            }
            index = constrain(index, 0, (COLOR_PALETTE.length - 1) );
            return COLOR_PALETTE[index];
        }

        /**/
        if (this.technique.name == "gradient") {
            

            if (this.variation == "vertical") {
                // map according to y
                let index = map(y, 0, height, 0, (COLOR_PALETTE.length - 1) );
                index = floor(index);
                index = constrain(index, 0, (COLOR_PALETTE.length - 1) );
                return COLOR_PALETTE[index];
            }
            if (this.variation == "horizontal") {
                // map according to x
                let index = map(x, 0, width, 0, (COLOR_PALETTE.length - 1) );
                index = floor(index);
                index = constrain(index, 0, (COLOR_PALETTE.length - 1) );
                return COLOR_PALETTE[index];
            }
            if (this.variation == "radial") {

                /* eucledian distance */
                var ed = sqrt(sq(width/2 - x) + sq(height/2 - y));
                
                /* original distance */
                var od = sqrt ( sq(width/2 - 0) + sq(height / 2 - 0) );

                /* debugging */
                // console.log("eucledian: " + ed); 
                // console.log("original: " + od); 

                let fromGradient = new Gradient(COLOR_PALETTE, ed, 0, od); 
                let color = fromGradient.pickColor();
                /* debugging */
                // console.log("radial color: "+ color)
                return color;
            }

        }


        /**/
        if (this.technique.name == "stripes") {

            let variation = this.random.list(this.technique.variations);

            if (variation == "horizontal") {
                // pass
                let _color = "";
                let col_index = constrain(floor(x / columnWidth), 0, (totalColumns - 1));
                let rem = floor((col_index % COLOR_PALETTE.length));
                let val = new Value(0, COLOR_PALETTE.length - 1, 1);
                val.value = rem;
                val.sub();
                _color = COLOR_PALETTE[val.value];

                return _color;
            }

            if (variation == "vertical") {
                // pass

                let _color = "";
                let col_index = constrain(floor(y / rowHeight), 0, (totalRows - 1));
                let rem = floor((col_index % COLOR_PALETTE.length));
                let val = new Value(0, COLOR_PALETTE.length - 1, 1);
                val.value = rem;
                val.sub();
                _color = COLOR_PALETTE[val.value];

                return _color;
            }

            if (variation == "diagonal") {
                // pass
                return "#efefef"
            }


        }

    }

}


/**/
// Flowfield
class FlowField {
    constructor() {
        this.random = new RandomClass(); 

        // basic
        this.resolution = 10 * scale_; 
        RESOLUTION = this.resolution;
        this.left_x = int(width * -0.1); 
        this.right_x = int(width * 1.1); 
        this.top_y = int(height * -0.1); 
        this.bottom_y = int(height * 1.1); 
        this.cols = int((this.right_x - this.left_x) / this.resolution); 
        this.rows = int((this.bottom_y - this.top_y) / this.resolution); 
        this.grid = []; 
        this.distortPath = this.random.range(0.1, 0.3); 

        // more definitions 
        /*
            normal -> normal field
            circuit -> circuit field
            rotation -> has a center of rotation at given x, y
        */
        this.fields = ["smooth", "geometric", "target", "infinite"]; 


        this.choice = ""; 
        this.values = []; 
        this.minValue = 0; 
        this.maxValue = 0; 

        // more features eg center of rotation
        this.centerProb = 0.2; 
        this.centerLimit = 0.3; 
        this.x1 = width / 2 + (frameWidth * 2);
        this.y1 = height / 2 + (frameWidth * 2); 

        this.x2 = random.range(0.2*width, 0.8*width) + (frameWidth * 2);
        this.y2 = random.range(0.2*height, 0.8*height) + (frameWidth * 2); 
        
        this.x3 = random.range(0.1*width, 0.9*width) + (frameWidth * 2);
        this.y3 = random.range(0.1*height, 0.9*height) + (frameWidth * 2); 
        
        this.x4 = random.range(0.1*width, 0.9*width) + (frameWidth * 2);
        this.y4 = random.range(0.1*height, 0.9*height) + (frameWidth * 2); 


        // technical analysis 
        this.visual = false; 
    
        // methods to call
        this.pick(); // --> this.generate(); 
    }

    pick() {
        let prob = { 
            0: 0.5, 
            1: 0.3, 
            2: 0.2,
            3: 0.1,
        } 
        let index = int(weightedRandom(prob)); 

        // index = 2; 
        // index = random([3]);
        if (FLOWFIELD_TYPE == "smooth") index = 0;
        if (FLOWFIELD_TYPE == "geometric") index = 1;
        if (FLOWFIELD_TYPE == "target") index = 2;
        if (FLOWFIELD_TYPE == "infinite") index = 3;

        this.choice = this.fields[index]; 

        /*debugging - know the chosen flowfield */
        // console.log("flowfield type: " + this.choice);

        
        this.generate();
    }

    pickSpecificField(fieldId) {
        var index = fieldId - 1;
        this.choice = this.fields[index];
        this.generate();
    }

    generate() {
        /* generate values */
        if (this.choice == "smooth") {
            let startxoff = round(this.random.range(100, 1000), 4); 
            startxoff = 200;

            let xoff = 0;
            let yoff = 0;
            let inc = 0;
            // inc = 0.0331;
            // inc = 0.00131;
            // inc = round(this.random.random(0.2, 0.3), 4);
            // inc = this.random.range(0.001, 0.05); 
            inc = round(this.random.range(0.03, 0.3), 4); 
            // inc = 0.018763407645214416; 
            
            // console.log("inc: "+ inc);


            // settings
            var scale = 0.369; 
            // scale = 0.069; 
            
            let _noiseScale = 0.69;  
            _noiseScale = 0.069;
            let _noiseSeed = this.random.random(1000); 
            let _noiseDetail = 10; 
            let _noiseDetailFallOff = round(this.random.range(0.05, 0.3), 4); 
            noiseSeed(_noiseSeed); 
            noiseDetail(_noiseDetail, _noiseDetailFallOff); 

            
            for (let column = 0; column < this.cols; column++) {
                xoff = startxoff;
                grid[column] = [];
                grid_data[column] = [];
                for (let row = 0; row < this.rows; row++) {
                    // let noise_val = noise(xoff * _noiseScale, yoff * _noiseScale);
                    let noise_val = noise(xoff * _noiseScale, yoff * _noiseScale);
                    // let noise_val = noise(xoff * scale, yoff * scale);
                    let angle = noise_val * TWO_PI * 4;

                    grid[column][row] = angle;
                    // this.grid[column][row] = angle;
                    grid_data[column][row] = {
                        angle: angle,
                        circles: []
                    };
                    this.values.push(angle);
                    xoff += inc;
                }
                yoff += inc;
                // console.log(`inc: ${inc} \t xoff: ${xoff}\t yoff: ${yoff}`)
            }

        }


        if (this.choice == "infinite") {
            let xoff = 0;
            let yoff = 0;
            let inc = 0;
            inc = 0.0331;
            // inc = round(this.random.random(0.03, 0.3), 4);

            // settings
            let _noiseScale = 0.69; 
            let _noiseSeed = this.random.random(1000); 
            let _noiseDetail = 10; 
            let _noiseDetailFallOff = round(this.random.range(0.05, 0.3), 4); 
            noiseSeed(_noiseSeed); 
            noiseDetail(_noiseDetail, _noiseDetailFallOff); 

            var angOne = 0; // angle 
            var angTwo = 0; 
            var angThree = 0 ;
            var angFour = 0; 
            var combinedAngle = 0; 

            for (let column = 0; column < this.cols; column++) {
                xoff = 0;
                grid[column] = [];
                grid_data[column] = [];
                for (let row = 0; row < this.rows; row++) {
                    // let noise_val = noise(xoff * _noiseScale, yoff * _noiseScale);
                    // let angle = noise_val * TWO_PI * 3;

                    if (this.centerProb < this.centerLimit) {
                        var r = this.resolution; 
                        angOne = atan2( int((this.y1)/r) - row, int((this.x1)/r) - column);
                        angTwo = atan2( int((this.y2)/r) - row, int((this.x2)/r) - column);
                        angThree = atan2( int((this.y3)/r) - row, int((this.x3)/r) - column); 
                        angFour = atan2( int((this.y4)/r) - row, int((this.x4)/r) - column); 
                    }

                    combinedAngle = angOne + angTwo + angThree + angFour; 
                    grid[column][row] = combinedAngle;
                    // this.grid[column][row] = angle;
                    grid_data[column][row] = {
                        angle: combinedAngle,
                        circles: []
                    };
                    this.values.push(combinedAngle);
                    xoff += inc;
                }
                yoff += inc;
                // console.log(`inc: ${inc} \t xoff: ${xoff}\t yoff: ${yoff}`)
            }

        }

        if (this.choice == "target") {

            // center of rotation
            this.centerx = width / 2 + (frameWidth * 2);
            this.centery = height / 2 + (frameWidth * 2);

            let xoff = 0;
            let yoff = 0;
            let inc = 0.03;

            // settings
            let _noiseScale = 0.1005;
            let _noiseSeed = this.random.random(1000);
            let _noiseDetail = this.random.random(1000);
            let _noiseDetailFallOff = round(this.random.range(0.05, 0.3), 4);
            noiseSeed(_noiseSeed);
            noiseDetail(_noiseDetail, _noiseDetailFallOff);

            
            for (let column = 0; column < this.cols; column++) {
                xoff = 0;
                grid[column] = [];
                grid_data[column] = [];
                for (let row = 0; row < this.rows; row++) {
                    let noise_val = noise(xoff * _noiseScale, yoff * _noiseScale);
                    let angle = atan2( int(this.centery/this.resolution) - row, int(this.centerx/this.resolution) - column );

                    grid[column][row] = angle;
                    // this.grid[column][row] = angle; 
                    grid_data[column][row] = {
                        angle: angle,
                        circles: []
                    };
                    this.values.push(angle);
                    xoff += inc;
                }
                yoff += inc;
            }

        }



        if (this.choice == "geometric") {

            let xoff = 0;
            let yoff = 0;
            let inc = round(this.random.range(0.03, 0.069), 4); 
            inc = round(this.random.range(0.1, 0.2), 4); 
            inc = 0.15;
            // inc = round(this.random.range(0.01, 0.1), 4); 

            // settings
            let _noiseScale = Math.round(this.random.range(1.8, 2), 4);
            let _noiseSeed = this.random.random(100);
            let _noiseDetail = Math.round(this.random.range(2.5, 6.9), 4);
            let _noiseDetailFallOff = this.random.range(0.65, 0.78);
            
            noiseDetail(_noiseDetail, _noiseDetailFallOff);
            noiseSeed(_noiseSeed);

            
            for (let column = 0; column < this.cols; column++) {
                xoff = 0;
                grid[column] = [];
                grid_data[column] = [];
                for (let row = 0; row < this.rows; row++) {
                    // let noise_val = round(noise(xoff * 0.5, yoff * 0.005) * 2 * TWO_PI * _noiseScale);
                    var noise_val1 = Math.round((noise(xoff * 0.05, yoff * 0.05) * TWO_PI * _noiseScale), 0);

                    // let angle = noise_val;
                    let angle = noise_val1;

                    grid[column][row] = angle; 
                    // this.grid[column][row] = angle; 
                    grid_data[column][row] = {
                        angle: angle,
                        circles: []
                    };
                    this.values.push(angle);
                    xoff += inc;
                }
                yoff += inc;
            }
        }


        // find min and max values (once)
        
        this.minValue = getMin(this.values); 
        this.maxValue = getMax(this.values); 
    }

    visualize (canvas) {
        if (this.visual) {
            // visual representation of the flow field
            for(let column = 0; column < this.cols; column++) {
                for (var row = 0; row < this.rows; row++) {
                    // visual representation
                    var rotationAngle = grid[column][row];
                    // console.log(rotationAngle);
                    var vector_angle = p5.Vector.fromAngle(rotationAngle);
                    
                    // canvas.stroke("#efefefef")
                    canvas.stroke("#ffffff")
                    canvas.strokeWeight(2);

                    canvas.push();
                    var res = this.resolution;
                    canvas.stroke("#ffffff");
                    canvas.translate(row * res, column * res);
                    
                    // draw base rectangle
                    canvas.stroke("#4e788a");
                    canvas.fill("#00000000");
                    canvas.rect(0, 0, res, res);

                    canvas.rotate(vector_angle.heading());
                    canvas.line(0, 0, this.resolution, 0);
                    canvas.pop();
        
                    // canvas.stroke("#efefef");
                    // canvas.strokeWeight(2);
                    // canvas.point((column * this.resolution) + this.resolution/2, (row * this.resolution) + this.resolution/2);
                }
            }
        }
    }
    

    analyze_values () {
        FLOWFIELD = this.values;

        let min_ = getMin(this.values);
        let max_ = getMax(this.values);

        for (var i = 0; i < this.values.length; ++i) {
            var temp = this.values[i];
            this.values[i] = map(temp, min_, max_, 0, 1);
        }

        MIN_VALUE = min_;
        MAX_VALUE = max_;
        FLOWFIELD = this.values;
    }



}


/**/
// Utility class
class Value {
    constructor (start, end, inc) {
        this.start = start;
        this.end = end;
        this.inc = inc;
        this.value = 0;
    }

    add() {
        if (this.value < this.end) {
            this.value += this.inc;
        } else {
            this.value = this.start;
        }     
    }

    sub() {
        if (this.value > 0) {
            this.value -= this.inc;
        } else {
            this.value = this.end;
        }
    }


    print() {
        console.log(this.value);
    }

}