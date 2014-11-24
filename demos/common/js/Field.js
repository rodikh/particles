(function () {
    'use strict';

    var Field = function (canvas, options) {
        if (!options) {
            options = {};
        }

        this.active = options.active !== false;
        this.position = options.position || {x: 700, y: 300};
        this.mass = options.mass || 100;

        this.drawPoint = options.drawPoint || true;
        this.drawField = options.drawField || true;
        this.color = options.color || this.mass < 0 ? "255,0,0" : "0,255,0";

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    };

    Field.prototype.draw = function () {
        if (this.drawPoint) {
            this.ctx.beginPath();
            this.ctx.arc(this.position.x, this.position.y, Math.abs(this.mass) / 50, 0, 2 * Math.PI, false);
            this.ctx.fillStyle = 'rgba('+ this.color +',1)';
            this.ctx.fill();
        }

        if (this.drawField) {
            radialGradient(this.ctx, this.position, 5, this.position, Math.abs(this.mass), 'rgba('+this.color+',0.3)', 'rgba('+this.color+',0.1)');
        }
    };

    window.Field = Field;

} ());
