(function (Particle, QuadTree) {
    'use strict';


    var ParticleEngine = function (canvas, options) {
        if (!options) {
            options = {};
        }

        this.maxVelocity = options.maxVelocity || 1;
        this.particlesAmount = options.particlesAmount || 100;
        this.particles = [];
        this.fps = options.fps || 60;

        this.particleLines = true;
        this.useTree = true;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.createParticles(this.particlesAmount);

        var quadBounds = {x:0, y:0, width: canvas.width, height: canvas.height};

        this.quad = new QuadTree(0, quadBounds);

        setInterval(this.tick.bind(this), 1000 / this.fps);

    };

    /**
     * Creates random particles
     * @param amount Amount of particles to create
     */
    ParticleEngine.prototype.createParticles = function (amount) {
        var i;
        for (i = 0; i < amount; i++) {
            var point = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height
            };
            var velocity = {
                x: Math.random() * this.maxVelocity * 2 - this.maxVelocity,
                y: Math.random() * this.maxVelocity * 2 - this.maxVelocity
            };
            this.particles.push(new Particle(point, velocity, this.canvas));
        }
    };

    /**
     * Draws connecting lines between all particles withing MIN_DISTANCE of each other
     */
    ParticleEngine.prototype.draw = function () {
        var length = this.particles.length,
            i;

        var numChecks = 0;

        for (i = 0; i < length; i++) {
            this.particles[i].draw(this.ctx);
            var neighbours;
            if (this.useTree) {
                neighbours = this.quad.retreiveParticle(this.particles[i]);
            } else {
                neighbours = this.particles;
            }
            numChecks += neighbours.length;

            if (this.particleLines) {
                this.drawParticleLines(this.particles[i], neighbours);
            }
        }

        document.getElementById('numChecks').innerHTML = numChecks;

        if (this.gridLines && this.useTree) {
            this.quad.drawNodeGrid(this.ctx);
        }

        if (this.nodeConnections) {
            if (this.useTree) {
                this.quad.drawInnerConnections(this.ctx);
            } else {
                length = this.particles.length;
                var j,k;
                for (j = 0; j < length; j++) {
                    for (k = j; k < length; k++) {
                        drawine(this.particles[j], this.particles[k], 'red', ctx);
                    }
                }
            }
        }
    };


    /**
     * Global loop function, draws and moves particles
     */
    ParticleEngine.prototype.tick = function () {
        var length = this.particles.length,
            i;

        this.quad.clear();

        for (i = 0; i < length; i++) {
            this.particles[i].update();
            this.quad.insertParticle(this.particles[i]);
            if (this.particles[i].isDecaying && this.particles[i].vitality < 1) {
                this.particles.splice(i,1);
                i--;
                length--;
            }
        }
    };


    function distLine(p1, p2, canvas, ctx){
        var r = (p1.y / canvas.height) * 255;
        var g = (p2.x / canvas.width) * 255;
        var b = 3 * (p1.x + p1.y) / (canvas.width + canvas.height) * 255;

        r = (r < 60) ? 60 : r|r;
        g = (g < 60) ? 60 : g|g;
        b = (b < 120) ? 120 : b|b;

        var color = 'rgba(' + r + ',' + g + ',' + b + ', 1)';
        drawLine(p1, p2, color, ctx);
    }

    ParticleEngine.prototype.drawParticleLines = function (particle, neighbours) {
        var length = neighbours.length,
            i;

        for (i = 0; i < length; i++) {
            var dist = distance(particle, neighbours[i]);

            if (dist < 50) {
                distLine(particle, neighbours[i], this.canvas, this.ctx);
            }
        }
        return false;
    };

    window.ParticleEngine = ParticleEngine;

} (window.Particle, window.QuadTree));
