(function (Particle) {
    'use strict';

    var ParticleEmitter = function (canvas, options) {
        if (!options) {
            options = {};
        }

        this.EmitterParticle = function (point, velocity, bounds) {
            Particle.call(this, point, velocity, bounds);
        };

        this.EmitterParticle.prototype = Object.create(Particle.prototype);
        this.EmitterParticle.prototype.hasGravity = false;
        this.EmitterParticle.prototype.hasBounds = false;
        this.EmitterParticle.prototype.isDecaying = options.isDecaying || false;
        this.EmitterParticle.prototype.color = '255,255,255';

        if (options.particleColor) {
            this.EmitterParticle.prototype.color = options.particleColor;
        }

        this.maxVelocity = options.maxVelocityRandom || 0.3;
        this.point = options.point || {x: 50, y: 50};
        this.vector = options.vector || {x: 3, y: 0};
        this.particles = [];
        this.fps = options.fps || 60;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        setInterval(this.tick.bind(this), 1000 / this.fps);
    };


    /**
     * Creates random particles
     * @param amount Amount of particles to create
     */

    ParticleEmitter.prototype.createParticles = function (point, vector, amount) {
        var i;
        for (i = 0; i < amount; i++) {
            var velocity = {
                x: Math.random() * this.maxVelocity * 2 - this.maxVelocity + vector.x,
                y: Math.random() * this.maxVelocity * 2 - this.maxVelocity + vector.y
            };
            this.particles.push(new this.EmitterParticle(point, velocity, this.canvas));
        }
    };

    /**
     * Draws connecting lines between all particles withing MIN_DISTANCE of each other
     */
    ParticleEmitter.prototype.draw = function () {
        var length = this.particles.length,
            i;

        for (i = 0; i < length; i++) {
            this.particles[i].draw(this.ctx);
        }
    };

    /**
     * Global loop function, draws and moves particles
     */
    ParticleEmitter.prototype.tick = function () {
        var length = this.particles.length,
            i;

        this.createParticles(this.point, this.vector, 1);

        for (i = 0; i < length; i++) {
            this.particles[i].update();
            if (this.particles[i].vitality < 1) {
                this.particles.splice(i,1);
                i--;
                length--;
            }
        }
    };

    window.ParticleEmitter = ParticleEmitter;

} (window.Particle));
