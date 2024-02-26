var co; 

function setup() { 
    createCanvas($(".canvasArea").width(), $(".canvasArea").height()); 


    co = hexToRgb(BACKGROUND_COLOR); 
    background(co.r, co.g, co.b, 10); 

    console.log(BACKGROUND_COLOR) 
    
    generateField(); 
    initiateFieldPopulation(); 
    noLoop(); 
}

function draw() {
}

function hexToRgb(hex) {
    // Remove '#' if present
    hex = hex.replace(/^#/, '');

    // Parse hex values
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    // Return RGB values as an object
    return { r: r, g: g, b: b };
}
