
let random = new RandomClass(); 
let width = 800; 
let height = 800; 

let COLOR_SCHEMES; 
let COLOR_WEIGHT; 
let COLOR_PALETTE; 
let COLORING_TECHNIQUE; 
let COL_TECHNIQUE; 
let GRADIENT_FLIP; 
let BACKGROUND_COLOR; 
let STRINGS_COLOR = "#ffffff"; 
let DEFAULT_PALETTE = "Palette #1"; // name of the first palette
let chosenPalette; 
// rads 
let vertical_colors = []; 
let rowHeight = height * 0.05; // 5% 
let totalRows = random.floorFn(height / rowHeight); 
let horizontal_colors = []; 
let columnWidth = width * 0.05; // 5% 
let totalColumns = random.floorFn(height / columnWidth); 

// OTHER SETTINGS
// ---------------------------
let frameWidth = width * 0.04;
var rx = frameWidth + random.range(0, 1)* (width - (frameWidth*2));
var ry = frameWidth + random.range(0, 1)* (height - (frameWidth*2));
var rr = Math.random() * 300;
rx = width / 2;
ry = height / 2;
// flowfields
let grid = [];
let grid_data = []; 
/* 
  grid_data = [
      {
         'angle': int,
         'circles': []
      },
    ...
  ]

*/
let BEAD_COUNT = 0; 
let EXTRA_FILL = true; 
let VARY_CHANCE = random.range(0, 1); 
let CONSTANT_SIZE = true; 
let scale_ = 2; 
let circles = []; // utilized for collission detection
let particles = [];
let FLOWFIELD; 
let FLOWFIELD_TYPE; 
let RESOLUTION;
var FLOWFIELD_GENERATION = false;
let MIN_VALUE, MAX_VALUE; // important
let VECTOR_FIELD; // holds Flowfield object
var global_radius = 0.2 + random.range(0, 1)* (0.32 - 0.2); // for layout_flowfield
// flowfield test
let field;


function generateField() {
    // initialize flow field
    field = new FlowField(); 
    RESOLUTION = 10;
    VECTOR_FIELD = field; 
    // console.log("grid: ", field.grid);
    center_of_rotation = true; 
} 

function initiateFieldPopulation() {
    // measure time
    const startTime = new Date();

    // Introducing curves in the layouts
    // a vector field is required
    var n = 100;

    var size_factor = 1; 
    n *= 1.4; 
    for (var i = 0; i < n; ++i) {
      // we will be reducing a size factor 
      if (i < n * 0.25) {
        size_factor = 1;
      }
      else if (i > (n * 0.25) && i < (n * 0.5) ) {
        size_factor = 0.5; 
      }
      else if (i > (n * 0.5) && i < (n * 0.75) ) {
        size_factor = 0.75;
      }
      else { 
        // last quarter 
        size_factor = 0.25; 
      } 
      draw_curves(size_factor); 
      console.log("curve drawn")
      // draw_curves(); 
    } 

    // testCollission(circles);
    console.log('Bead Count: ' + BEAD_COUNT); 

    const endTime = new Date(); 
    var elapsed = (endTime - startTime) / 1000; 
    console.log("Elapsed: " + elapsed + " seconds"); 
} 

function draw_curves (size_factor) {
    {
        var side = 20;
        
        // gaussian distribution parameters
        var mean_factor = .5;
        var sd_factor = .5;
        
        var space_width = width - (frameWidth * 4);
        var space_height = height - (frameWidth * 4);
        
        var x = randomGaussian(space_width * 1 * mean_factor, space_width * 1 * sd_factor); 
        var y = randomGaussian(space_height * 1 * mean_factor, space_height * 1 * sd_factor); 

        
        
  
        var circle = {
            x: x + side/2, 
            y: y + side/2, 
            r: side/2 
        }; 
    
        var counter = 0; 
        var collides = collidesWithAnyCircle(circle, circles, true); 
        var inFrame = false;
    
        if (
            (x > frameWidth && x < width - frameWidth) && 
            (y < height - frameWidth && y > frameWidth)) 
        {
          inFrame = true;
        }
    
        if (collides || !inFrame) {
          return;
        } else {        
            var b = new Bead(x, y, "orange"); 
            b.draw()
    
            circle = {
                x: x + side/2, 
                y: y + side/2, 
                r: side/2 
            };
            circles.push(circle); 
    
            var p;
            var px = circle.x; 
            var py = circle.y; 

            // check location
            var in_right_position = false;
            var color_area = get(x, y); 
            if (
                color_area[0] == red(BACKGROUND_COLOR) &&
                color_area[1] == green(BACKGROUND_COLOR) &&
                color_area[2] == blue(BACKGROUND_COLOR) && 
                color_area[3] == 10 
            ) {
                in_right_position = true;
            } 
            console.log(x, y, in_right_position, color_area)


         if (inFrame && in_right_position) {
            // if (inFrame) {
              p = new Particle(x, y); 
              p.x = width/2; 
              p.y = height/2;

              var c =  COLORING_TECHNIQUE.apply(x, y); 
              p.particleColor = c; 
              
              particles.push(p); 
              console.log(p); 
            }
    
            for (var i = 0; i < particles.length; i++) {
              particles[i].draw();
              particles[i].update(); 
            }
        }
    
      }
}



// palettes 
let palettes = [

    {
        name: 'Palette #1',
        prpbability : 1,
        backgrounds : ["#1a1a1a"],
        palette : ["#38c5f0", "#31c4bf", "#4d2617","#fc4d0d",  "#cc141b", "#fcbe03", "#f1e0c5", "#000000","#036d06" ], 
        stringColor: [STRINGS_COLOR], 
      }, 
        {
        name: 'Palette #2', 
        probability: 1, 
        backgrounds: ["#1a1a1a"], 
        palette: ["#fcbe03", "#cc141b","#3939e5", "#f1e0c5", "#000000" ], 
        stringColor: [STRINGS_COLOR], 
      },
    
        {
        name: 'Palette #3',
        probability : 1,
        backgrounds : ["#1a1a1a"],
        palette : [ "#cc141b","#000000", "#fc4d0d","#4d2617","#fcbe03", ], 
        stringColor: [STRINGS_COLOR], 
      },
        {
        name: 'Palette #4',
        probability : 1,
        backgrounds : ["#1a1a1a"],
        palette : ["#036d06", "#fc4d0d", "#4d2617",], 
        stringColor: [STRINGS_COLOR], 
      },
      {
        name: 'Palette #5',
        probability: 1,
        backgrounds: ["#1a1a1a"],
        palette : ["#036d06","#fcbe03", "#cc141b","#230b99", "#f1e0c5","#fc4d0d" ], 
        stringColor: [STRINGS_COLOR], 
        
      },
       {
        name: 'Palette #6',
        probability: 1,
        backgrounds: ["#38241c"],
        palette : [ "#230b99", "#b3863e", "#3939e5" ], 
        stringColor: [STRINGS_COLOR], 
        
      },
        {
        name: 'Palette #7',
        prpbability : 1,
        backgrounds : ["#1a1a1a"],
        palette : ["#b3863e", " #8f0715", "#230b99"], 
        stringColor: [STRINGS_COLOR], 
      },
    
        {
        name: 'Palette #8',
        prpbability : 1,
        backgrounds : ["#1a1a1a"],
        palette : ["#000000", "#38c5f0","#8f0715"], 
        stringColor: [STRINGS_COLOR], 
      }, 
      
      {
        name: 'Palette #9', 
        probability: 1, 
        backgrounds: ["#38241c"], 
        palette: [  "#38c5f0","#fc4d0d", "#cc141b", "#fcbe03" ], 
        stringColor: [STRINGS_COLOR], 
      },
      
        {
        name: 'Palette #10', 
        probability: 1, 
        backgrounds: ["#1a1a1a"], 
        palette: [ "#cc141b", "#000000","#fcbe03","#036d06" ], 
        stringColor: [STRINGS_COLOR], 
      },
        {
        name: 'Palette #11', 
        probability: 1, 
        backgrounds: ["#1a1a1a"], 
        palette: [ "#000000", "#38c5f0", "#fcbe03","#036d06" ], 
        stringColor: [STRINGS_COLOR], 
      },
        
      {
        name: 'Palette #12', 
        probability: 1, 
        backgrounds: ["#181326"], 
        palette: [ "#440a65", "#b3863e", "#f547bb","#f1e0c5" ], 
        stringColor: [STRINGS_COLOR], 
      },
        {
        name: 'Palette #13', 
        probability: 1, 
        backgrounds: ["#1a1a1a"], 
        palette: [ "#fcbe03", "#000000", "#b3863e", "#fc4d0d", "#cc141b","#f1e0c5", "#4d2617" ], 
        stringColor: [STRINGS_COLOR], 
      },
      {
        name: 'Palette #14', 
        probability: 1, 
        backgrounds: ["#38241c"], 
        palette: [  "#38c5f0","#3939e5", "#230b99"], 
        stringColor: [STRINGS_COLOR], 
      },
      {
        name: 'Palette #15', 
        probability: 1, 
        backgrounds: ["#1a1a1a"], 
        palette: [  "#cc141b","#f1e0c5", "#000000", "#b3863e"], 
        stringColor: [STRINGS_COLOR], 
      },
        {
        name: 'Palette #16', 
        probability: 1, 
        backgrounds: ["#38241c"], 
        palette: [  "#4d2617","#f1e0c5", "#230b99", "#b3863e"], 
        stringColor: [STRINGS_COLOR], 
      },
          {
        name: 'Palette #17', 
        probability: 1, 
        backgrounds: ["#38241c"], 
        palette: [ "#fff112","#b2d907", "#036d06"], 
        stringColor: [STRINGS_COLOR], 
      },
          {
        name: 'Palette #18', 
        probability: 1, 
        backgrounds: ["#38241c"], 
        palette: [ "#31c4bf","#fc4d0d", "#230b99", "#f1e0c5"], 
        stringColor: [STRINGS_COLOR], 
      },
          {
        name: 'Palette #19', 
        probability: 1, 
        backgrounds: ["#1a1a1a"], 
        palette: [ "#cc141b", "#fc4d0d", "#f1e0c5", "#464640"], 
        stringColor: [STRINGS_COLOR], 
      },   
]
  

  // COLOR
  {
    /* debugging */ 
    // var c_ = new TestColor2(); 
    chosenPalette = random.list(palettes); 
    COLOR_PALETTE = chosenPalette.palette; // assigned with datGUI 
    BACKGROUND_COLOR = random.list(chosenPalette.backgrounds);
 
    COLORING_TECHNIQUE = new ColoringTechnique(); 
    COLOR_WEIGHT = generateWeights(COLOR_PALETTE.length); 
  
    if (COLORING_TECHNIQUE.technique == "rad") { 
      // might need efficiency here
      let specific_variation = _random.list(COLORING_TECHNIQUE.technique.variations);
      console.log("specific variation: " + specific_variation)
      if (specific_variation == "horizontal") {
        // column
        let column = 0;
        let index = 0; // palette
        // horizontal_colors
        while (column != totalColumns) {
            if (index != (COLOR_PALETTE.length - 1) ) {
                let columnColorObj = {};
                columnColorObj.index = column;
                columnColorObj.color = COLOR_PALETTE[index]; 
                horizontal_colors.push(columnColorObj);
                index++;
            } else {
                index = 0;
            }
            column++;
        }
      }
      
      if (specific_variation == "vertical") {
        // rows
        let row = 0;
        let index = 0; // palette
        // horizontal_colors
        while (row != totalRows) {
            if (index != (COLOR_PALETTE.length - 1) ) {
                let rowColorObj = {};
                rowColorObj.index = row;
                rowColorObj.color = COLOR_PALETTE[index];
                vertical_colors.push(rowColorObj);
                index++;
            } else {
                index = 0;
            }
            row++;
        }
      }
  
      if (specific_variation == "diagonal") {
        // pass
      }
  
    }
  
  }


  
 // functionalities 

 // generate random weights 
function generateWeights(n) {
    let weights = {};
    let total = 0;
    // Generate n random numbers between 0 and 1
    let values = Array.from({length: n}, () => Math.random());
    // Sort the values in ascending order
    values.sort((a, b) => a - b);
    // Assign weights proportional to the values
    for (let i = 0; i < n; i++) {
      let weight = i == n - 1 ? 1 - total : values[i+1] - values[i];
      weights[i] = weight;
      total += weight;
    }
    return weights;
  }
  

// weighted random 
function weightedRandom(probabilities) {
    let totalProbability = 0;
    let randomValue = Math.random();

    // Loop through the probabilities object and calculate the total probability
    for (let index in probabilities) {
        totalProbability += probabilities[index];
    }

    // Loop through the probabilities object again and determine the index with the highest probability
    let cumulativeProbability = 0;
    for (let index in probabilities) {
        cumulativeProbability += probabilities[index] / totalProbability;
        if (randomValue <= cumulativeProbability) {
        return index;
        }
    }

    // Return the last index if no index was returned in the loop (e.g., when probabilities do not add up to 1)
    return String(index); 
}

// // constrain function
// function constrain(value, min, max) {
//     if (value < min) {
//         return min;
//     } else if (value > max) {
//         return max;
//     } else {
//         return value;
//     }
// }

// collission detection function 
function collidesWithAnyCircle(circle, circles, extreme_check) {
    
    if (extreme_check != undefined) { 
      // pass 
    } 
    
    // var threshold = 3.2; 
    // threshold = 1.6;
    threshold = -2; 
    var collidesWithSelf = false;
    for (var i = 0; i < circles.length; i++) 
    { 
        let match = circles[i]; 
        const radiiSum = circle.r/2 + match.r/2 + threshold; 
        if (radiiSum >= distance(circle, match)) { 
            return true; 
        } 
    } 
    return false; 
}

// get max in array
function getMax(arr) {
    let len = arr.length;
    let max = -Infinity;

    while (len--) {
        max = arr[len] > max ? arr[len] : max;
    }
    return max;
}

// get min in array
function getMin(arr){
        
    let minElement = arr[0];
    for (let i = 1; i < arr.length; ++i) {
        if (arr[i] < minElement) {
            minElement = arr[i];
        }
    }

    return minElement;
}


// distance formula (between point a & b)
function distance(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    return dist;
}

