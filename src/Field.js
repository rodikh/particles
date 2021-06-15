const { radialGradient } = require('./utils.js');

class Field {
    constructor(position, options = {}) {
        this.active = true;
        this.mass = 100;
        this.drawPoint = true;
        this.drawField = true;

        this.position = position;
        Object.assign(this, options);
        this.color = options.color || this.mass < 0 ? "255,0,0" : "0,255,0";

        // Todo: introduce field domains
        if (Field.fields === undefined) {
            Field.fields = [];
        }
        Field.fields.push(this);
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

module.exports = Field;