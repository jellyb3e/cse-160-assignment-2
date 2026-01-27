// COLORS
const brown = [140, 94, 65];
const dark_brown = [117, 75, 48];
const darker_brown = [89, 59, 40];
const light_brown = [168, 126, 99];
const dark_dark_brown = [48, 39, 33];
const black = [0,0,0];
const sky_blue = [159, 184, 199];
const grass_green = [75, 99, 76];
const shadow_green = [62, 87, 63];
const shadow_dark_brown = [105, 65, 40];
const shadow_sky_blue = [138, 166, 184];
const shadow_darker_brown = [79, 51, 34];

class Squirrel {
    constructor(showing = false) {
        this.showingInitials = showing;
    }
    // canvas goes from -1 to 1
    render() {
        // background
        setColor(sky_blue);
        drawRect([-10,-3],[10,10]);
        setColor(grass_green);
        drawRect([-10,-10],[10,-3]);

        // shadows
        setColor(shadow_green);
        drawRect([-7,-5],[-5,-4]);
        drawRect([2,-6],[9,-4]);
        drawRect([9,-5],[10,-4]);

        // head base
        setColor(brown);
        drawRect([-3,0],[3,4])
        drawRect([-2,4],[2,5]);
        drawRect([3,1],[4,3]);
        drawRect([1,5],[3,6]);
        drawRect([-1,5],[0,6]);

        // head details
        setColor(black);
        drawRect([-3,3],[-2,4]);
        drawRect([0,2],[1,3]);

        // tail
        setColor(darker_brown);
        drawRect([3,-4],[6,-2]);
        drawRect([6,-3],[7,-2]);
        drawRect([6,-2],[8,1]);
        drawRect([5,0],[7,4]);
        drawRect([6,2],[8,5]);
        drawRect([8,3],[9,4]);

        // body base
        setColor(dark_brown);
        drawRect([-4,-6],[2,0]);
        drawRect([-5,-4],[-4,-2]);
        drawRect([2,-5],[3,0]);
        drawRect([3,-3],[4,-1]);

        // body detail
        setColor(light_brown);
        drawRect([-3,-4],[0,-1]);
        drawRect([-2,-5],[-1,-4]);

        // feet & arms
        setColor(brown);
        drawRect([-4,-6],[-2,-5]);
        drawRect([-1,-6],[1,-5]);

        // acorn
        setColor(darker_brown);
        drawRect([-9,-3],[-6,-2]);
        drawRect([-8,-2],[-7,-1]);
        drawRect([-7,-1],[-6,0]);
        setColor(brown);
        drawRect([-9,-4],[-6,-3]);
        drawRect([-8,-5],[-7,-4]);

        // initials
        showInitials(this.showingInitials);
    }
}

// draws a rectangle using 2 tris given bottom left and top right coords
function drawRect(x1y1,x2y2) {
    const adj = 1/10.0;  // I am making a 20x20 image!

    drawTriangle([x1y1[0]*adj,x1y1[1]*adj,x1y1[0]*adj,x2y2[1]*adj,x2y2[0]*adj,x1y1[1]*adj]);
    drawTriangle([x2y2[0]*adj,x2y2[1]*adj,x1y1[0]*adj,x2y2[1]*adj,x2y2[0]*adj,x1y1[1]*adj]);
}

function setColor(color) {
    gl.uniform4f(u_FragColor,color[0]/255,color[1]/255,color[2]/255,1.0);
}

function showInitials(value) {
    // arms
    setColor((value) ? black : brown);
    drawRect([-3,-3],[-2,-1]);
    drawRect([0,-4],[1,-2]);
    // nose
    if (!value) setColor(dark_dark_brown);
    drawRect([-4,1],[-1,2]);
    drawRect([-3,0],[-2,1]);
    // rest of letters
    // J
    if (!value) setColor(shadow_dark_brown);
    drawRect([-3,-1],[-2,0]);
    drawRect([-4,-4],[-3,-3]);
    drawRect([-5,-3],[-4,-2]);
    // M
    drawRect([0,-2],[1,0]);
    drawRect([1,-2],[2,-1]);
    drawRect([2,-3],[3,-2]);
    drawRect([3,-2],[4,-1]);
    if (!value) setColor(shadow_sky_blue);
    drawRect([4,-2],[5,0]);
    if (!value) setColor(shadow_darker_brown);
    drawRect([4,-4],[5,-2]);
}