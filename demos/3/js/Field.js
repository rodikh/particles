(function (Particle) {
    'use strict';

    var Field = function (canvas, options) {
        if (!options) {
            options = {};
        }

        this.position = options.position || {x: 700, y: 300};
        this.mass = options.mass || 100;
        this.color = options.color || this.mass < 0 ? "255,0,0" : "0,255,0";

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    };

    Field.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = 'rgba('+ this.color +',1)';
        this.ctx.fill();
    };

    window.Field = Field;

} (window.Particle));
