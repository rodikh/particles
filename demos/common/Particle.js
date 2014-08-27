(function () {
    'use strict';

    var Particle = function (point, velocity, bounds) {
        this.x = point.x;
        this.y = point.y;

        this.vx = velocity.x;
        this.vy = velocity.y;

        this.ax = 0;
        this.ay = 0;

        this.vitality = this.initialVitality;
        this.bounds = bounds;
    };

    Particle.prototype.hasGravity = false;
    Particle.prototype.gravity = 0.02;
    Particle.prototype.hasBounds = true;
    Particle.prototype.isDecaying = false;
    Particle.prototype.color = '255,255,255';
    Particle.prototype.initialVitality = 100;


    Particle.prototype.update = function () {
        this.interactWithFields(this.fields);
        this.move();

        if (this.hasBounds) {
            this.checkBounds();
        }

        if (this.isDecaying) {
            this.decay();
        }
    };

    Particle.prototype.checkBounds = function () {
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
    };

    Particle.prototype.move = function () {
        // add accelleration to velocity
        this.vx += this.ax;
        this.vy += this.ay;

        // add velocity to position
        this.x += this.vx;
        this.y += this.vy;

        if (this.hasGravity) {
            this.vy += this.gravity;
        }
    };


    Particle.prototype.interactWithFields = function (fields) {
        if (!fields) {
            return;
        }

        var length = fields.length,
            i;
        // our starting acceleration this frame
        var ax = 0;
        var ay = 0;

        // for each passed field
        for (i = 0; i < length; i++) {
            var field = fields[i];

            // find the distance between the particle and the field
            var vectorX = field.position.x - this.x;
            var vectorY = field.position.y - this.y;

            // calculate the force via MAGIC and HIGH SCHOOL SCIENCE!
            var force = field.mass / Math.pow(vectorX*vectorX+vectorY*vectorY,1.5);

            // add to the total acceleration the force adjusted by distance
            ax += vectorX * force;
            ay += vectorY * force;
        }

        // update our particle's acceleration
        this.ax = ax;
        this.ay = ay;
    };

    Particle.prototype.decay = function () {
        return this.vitality--;
    };

    Particle.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI, false);
        var alpha = this.vitality / 100;
        ctx.fillStyle = 'rgba('+ this.color +','+ alpha +')';
        ctx.fill();
    };

    window.Particle = Particle;

} ());
