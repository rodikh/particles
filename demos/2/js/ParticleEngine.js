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

            var neighbours = this.quad.retreiveParticle(this.particles[i]);
            var isColliding = this.checkCollision(this.particles[i], neighbours);
            this.particles[i].draw(this.ctx);
        }

        this.quad.drawNodeGrid(this.ctx);
//        this.quad.drawInnerConnections(this.ctx);
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

    function distance(p1, p2) {
        var dist = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
        return dist;
    }

    function drawLine(p1, p2, dist, canvas, ctx){
        var r = (p1.y / canvas.height) * 255;
        var g = (p2.x / canvas.width) * 255;
        var b = 3 * (p1.x + p1.y) / (canvas.width + canvas.height) * 255;

        r = (r < 60) ? 60 : r|r;
        g = (g < 60) ? 60 : g|g;
        b = (b < 120) ? 120 : b|b;

        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ', 1)';
        ctx.beginPath();
        ctx.moveTo(p1.x,p1.y);
        ctx.lineTo(p2.x,p2.y);
        ctx.stroke();
    }

    function debugLine(p1, p2, color, ctx){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(p1.x,p1.y);
        ctx.lineTo(p2.x,p2.y);
        ctx.stroke();
    }

    ParticleEngine.prototype.checkCollision = function (particle, neighbours) {
        var length = neighbours.length,
            i;

        for (i = 0; i < length; i++) {
            var dist = distance(particle, neighbours[i]);

            if (dist < 50) {
                drawLine(particle, neighbours[i], dist, this.canvas, this.ctx);
            }
        }
        return false;
    };

    window.ParticleEngine = ParticleEngine;

} (window.Particle, window.QuadTree));
