/**
 * Created by rodikh on 8/28/14.
 */

var GAMMA = 0.013;

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
