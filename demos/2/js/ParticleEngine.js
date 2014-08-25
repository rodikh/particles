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

        setInterval(this.tick.bind(this), 1000 / this.fps);

        var quadBounds = {x:0, y:0, width: canvas.width, height: canvas.height};
        this.quad = new QuadTree(0, quadBounds);
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

        for (i = 0; i < length; i++) {
            var collides = this.quad.retreiveParticle(this.particles[i]);

            var options = {
                color: (collides.length) ? '255,0,0' : '255,255,255'
            };
//            this.particles[i].draw(this.ctx, options);
            this.particles[i].draw(this.ctx);
        }

        this.quad.drawNodeGrid(this.ctx);
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

    window.ParticleEngine = ParticleEngine;

} (window.Particle, window.QuadTree));