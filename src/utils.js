//const GAMMA = 6.67384 * Math.pow(10,-11);
const GAMMA = 4.302 * Math.pow(10,-3);

export function distance(p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}

export function drawLine(p1, p2, color, ctx){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(p1.x,p1.y);
    ctx.lineTo(p2.x,p2.y);
    ctx.stroke();
}

export function radialGradient (ctx, p1, r1, p2, r2, color1, color2) {
    const grd = ctx.createRadialGradient(p1.x, p1.y, r1, p2.x, p2.y, r2);
    grd.addColorStop(0, color1);
    grd.addColorStop(1, color2);
    ctx.fillStyle = grd;
    ctx.arc(p1.x, p1.y, r2, 0, 2 * Math.PI);
    ctx.fill();
}
