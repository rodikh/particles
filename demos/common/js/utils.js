/**
 * Created by rodikh on 8/28/14.
 */

//var GAMMA = 6.67384 * Math.pow(10,-11);
var GAMMA = 4.302 * Math.pow(10,-3);

function distance(p1, p2) {
    var dist = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    return dist;
}

function drawLine(p1, p2, color, ctx){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(p1.x,p1.y);
    ctx.lineTo(p2.x,p2.y);
    ctx.stroke();
}

function radialGradient (ctx, p1, r1, p2, r2, color1, color2) {
    var grd = ctx.createRadialGradient(p1.x, p1.y, r1, p2.x, p2.y, r2);
    grd.addColorStop(0, color1);
    grd.addColorStop(1, color2);
    ctx.fillStyle = grd;
    ctx.arc(p1.x, p1.y, r2, 0, 2 * Math.PI);
    ctx.fill();
}

function resizeCanvas() {
    if (typeof tick === 'undefined') {
        return;
    }

    canvas.width = window.innerWidth;
//  canvas.height = window.innerHeight;
    tick();
}
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();
