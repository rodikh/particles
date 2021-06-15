import { radialGradient } from "./utils.js";

export default class Field {
    active = true;
    mass = 100;
    drawPoint = true;
    drawField = true;

    constructor(position, options = {}) {
        this.position = position || {x: 700, y: 300};
        Object.assign(this, options);
        this.color = options.color || this.mass < 0 ? "255,0,0" : "0,255,0";
    }

    draw(ctx) {
        if (this.drawPoint) {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, Math.abs(this.mass) / 50, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(' + this.color + ',1)';
            ctx.fill();
        }

        if (this.drawField) {
            radialGradient(ctx, this.position, 5, this.position, Math.abs(this.mass), 'rgba(' + this.color + ',0.3)', 'rgba(' + this.color + ',0.1)');
        }
    }
}
