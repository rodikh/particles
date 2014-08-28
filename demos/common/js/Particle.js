(function () {
    'use strict';

    var MAX_SPEED = Infinity;

    var Particle = function (point, velocity, bounds, options) {
        if (!options) {
            options = {};
        }

        this.x = point.x;
        this.y = point.y;

        this.vx = velocity.x;
        this.vy = velocity.y;

        this.ax = 0;
        this.ay = 0;

        this.vitality = this.initialVitality;
        this.bounds = bounds;

        this.mass = options.mass || 1;

        if (this.hasField) {
            this.field = new Field(bounds, {position: {x: this.x, y: this.y}, mass: this.mass});
            if (!Particle.prototype.fields) {
                Particle.prototype.fields = [];
            }
            Particle.prototype.fields.push(this.field);
        }
    };

    Particle.prototype.hasField = false;
    Particle.prototype.hasGravity = false;
    Particle.prototype.gravity = 0.02;
    Particle.prototype.hasBounds = false;
    Particle.prototype.boundsBehaviour = 'bounce';
    Particle.prototype.isDecaying = false;
    Particle.prototype.color = '255,255,255';
    Particle.prototype.initialVitality = 100;


    Particle.prototype.update = function () {
        this.interactWithFields(this.fields);
        this.move();

        if (this.hasBounds) {
            this.stayInBounds();
        }

        if (this.isDecaying) {
            this.decay();
        }
    };

    Particle.prototype.stayInBounds = function () {
        if (this.x > this.bounds.width) {
            if (this.boundsBehaviour === 'bounce') {
                this.vx = -this.vx;
                this.x = this.bounds.width;
            } else {
                this.x = 0;
            }
        } else if (this.x < 0) {
            if (this.boundsBehaviour === 'bounce') {
                this.vx = -this.vx;
                this.x = 0;
            } else {
                this.x = this.bounds.width;
            }
        }

        if (this.y > this.bounds.height) {
            if (this.boundsBehaviour === 'bounce') {
                this.vy = -this.vy;
                this.y = this.bounds.height;
            } else {
                this.y = 0;
            }
        } else if (this.y < 0) {
            if (this.boundsBehaviour === 'bounce') {
                this.vy = -this.vy;
                this.y = 0;
            } else {
                this.y = this.bounds.height;
            }

        }
    };

    Particle.prototype.isInBounds = function () {
        if (this.x > this.bounds.width) {
            return false;
        } else if (this.x < 0) {
            return false;
        }

        if (this.y > this.bounds.height) {
            return false;
        } else if (this.y < 0) {
            return false;
        }

        return true;
    };

    Particle.prototype.move = function () {
        // add accelleration to velocity
        this.vx += this.ax;
        this.vy += this.ay;

        if (Math.abs(this.vx) > MAX_SPEED) {
            if (this.vx > 0) {
                this.vx = MAX_SPEED;
            } else {
                this.vx = -MAX_SPEED;
            }
        }

        if (Math.abs(this.vy) > MAX_SPEED) {
            if (this.vy > 0) {
                this.vy = MAX_SPEED;
            } else {
                this.vy = -MAX_SPEED;
            }
        }

        // add velocity to position
        this.x += this.vx;
        this.y += this.vy;

        if (this.field) {
            this.field.position.x = this.x;
            this.field.position.y = this.y;
        }

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
            if (field === this.field) {
               continue;
            }

            // find the distance between the particle and the field
            var vectorX = field.position.x - this.x;
            var vectorY = field.position.y - this.y;

            var force = field.mass / Math.pow(distance(this, field.position), 3);
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
