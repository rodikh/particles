(function (Particle, QuadTree) {
    'use strict';


    var ParticleEngine = function (canvas, options) {
        if (!options) {
            options = {};
        }

        this.EngineParticle = function (point, velocity, bounds) {
            return Particle.call(this, point, velocity, bounds);
        };

        this.EngineParticle.prototype = Object.create(Particle.prototype);
        this.EngineParticle.prototype.hasBounds = options.hasBounds || true;
        this.EngineParticle.prototype.color = '255,255,255';

        this.maxVelocity = options.maxVelocity || 1;
        this.particlesAmount = options.particlesAmount || 100;
        this.particles = [];
        this.fps = options.fps || 60;
        this.linesMaxLength = options.linesMaxLength || 50;

        this.particleLines = options.particleLines || false;
        this.useTree = options.useTree || false;
        this.gridLines = options.gridLines || false;
        this.nodeConnections = options.nodeConnections || false;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.createParticles(this.particlesAmount);

        var quadBounds = {x:0, y:0, width: canvas.width, height: canvas.height};

        if (QuadTree) {
            this.quad = new QuadTree(0, quadBounds, {itemSize: this.linesMaxLength * 2});
        }

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
            this.particles.push(new this.EngineParticle(point, velocity, this.canvas));
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
            if (this.particleLines) {
                numChecks += this.drawParticleLines(this.particles[i]);
            }
        }

        if (this.particleLines) {
            var consoleDiv = document.getElementById('numChecks');
            if (consoleDiv) {
                consoleDiv.innerHTML = numChecks;
            }
        }

        if (this.quad && this.gridLines && this.useTree) {
            this.quad.drawNodeGrid(this.ctx);
        }

        if (this.nodeConnections) {
            if (this.quad && this.useTree) {
                this.quad.drawInnerConnections(this.ctx);
            } else {
                length = this.particles.length;
                var j,k;
                for (j = 0; j < length; j++) {
                    for (k = j; k < length; k++) {
                        drawLine(this.particles[j], this.particles[k], 'red', ctx);
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

        if (this.quad) {
            this.quad.clear();
        }

        for (i = 0; i < length; i++) {
            this.particles[i].update();
            if (this.quad) {
                this.quad.insertParticle(this.particles[i]);
            }
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

    ParticleEngine.prototype.drawParticleLines = function (particle) {
        var neighbours;
        if (this.quad && this.useTree) {
            neighbours = this.quad.retreiveParticle(particle);
        } else {
            neighbours = this.particles;
        }

        var length = neighbours.length,
            i;

        for (i = 0; i < length; i++) {
            var dist = distance(particle, neighbours[i]);

            if (dist < this.linesMaxLength) {
                distLine(particle, neighbours[i], this.canvas, this.ctx);
            }
        }
        return neighbours.length;
    };

    window.ParticleEngine = ParticleEngine;

} (window.Particle, window.QuadTree));
