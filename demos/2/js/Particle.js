(function () {
    'use strict';

    var Particle = function (point, velocity, bounds) {
        this.x = point.x;
        this.y = point.y;

        this.vx = velocity.x;
        this.vy = velocity.y;

        this.vitality = 100;
        this.bounds = bounds;
    };

    Particle.prototype.hasGravity = false;
    Particle.prototype.gravity = 0.02;
    Particle.prototype.hasBounds = true;
    Particle.prototype.isDecaying = false;
    Particle.prototype.color = '255,255,255';

    Particle.prototype.update = function () {
        // add velocity to position
        this.x += this.vx;
        this.y += this.vy;

        if (this.hasGravity) {
            this.vy += this.gravity;
        }

        if (this.hasBounds) {
            // check bounds
            if (this.x > this.bounds.width) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = this.bounds.width;
            }

            if (this.y > this.bounds.height) {
                this.y = 0;
            } else if (this.y < 0) {
                this.y = this.bounds.height;
            }
        }

        if (this.isDecaying) {
            this.decay();
        }
    };

    Particle.prototype.draw = function (ctx, options) {
        if (!options) {
            options = {};
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI, false);
        var alpha = this.vitality / 100;
        var color = options.color || this.color;
        ctx.fillStyle = 'rgba('+ color +','+ alpha +')';
        ctx.fill();
    };

    Particle.prototype.decay = function () {
        return this.vitality--;
    };

    window.Particle = Particle;

} ());
