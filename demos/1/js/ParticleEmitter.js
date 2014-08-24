(function (Particle) {
    'use strict';


    function ExploderParticle (point, velocity, bounds) {
        Particle.call(this, point, velocity, bounds);
    }

    ExploderParticle.prototype = Object.create(Particle.prototype);
    ExploderParticle.prototype.hasGravity = true;
    ExploderParticle.prototype.hasBounds = false;
    ExploderParticle.prototype.isDecaying = true;


    var ParticleExploder = function (canvas, options) {
        if (!options) {
            options = {};
        }

        this.maxVelocity = options.maxVelocity || 1;
        this.particlesAmount = options.particlesAmount || 100;
        this.particles = [];
        this.fps = options.fps || 60;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.canvas.onclick = function (evt) {
            exploder.explode(evt);
        }
    };

    ParticleExploder.prototype.explode = function (point) {
        this.createParticles(point, this.particlesAmount);
        if (!this.interval) {
            this.interval = setInterval(this.tick.bind(this), 1000 / this.fps);
        }
    };

    /**
     * Creates random particles
     * @param amount Amount of particles to create
     */

    ParticleExploder.prototype.createParticles = function (point, amount) {
        var i;
        for (i = 0; i < amount; i++) {
            var velocity = {
                x: Math.random() * this.maxVelocity * 2 - this.maxVelocity,
                y: Math.random() * this.maxVelocity * 2 - this.maxVelocity
            };
            this.particles.push(new ExploderParticle(point, velocity, this.canvas));
        }
    };

    /**
     * Draws a single particle
     */
    ParticleExploder.prototype.drawParticle = function (particle){
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, 1, 0, 2 * Math.PI, false);
        var alpha = particle.vitality / 100;
        this.ctx.fillStyle = 'rgba(255,255,255,'+ alpha +')';
        this.ctx.fill();
    };

    /**
     * Draws connecting lines between all particles withing MIN_DISTANCE of each other
     */
    ParticleExploder.prototype.draw = function () {
        var length = this.particles.length,
            i;

        for (i = 0; i < length; i++) {
            this.drawParticle(this.particles[i]);
        }
    };

    /**
     * Global loop function, draws and moves particles
     */
    ParticleExploder.prototype.tick = function () {
        var length = this.particles.length,
            i;

        for (i = 0; i < length; i++) {
            this.particles[i].move();
            if (this.particles[i].vitality < 1) {
                this.particles.splice(i,1);
                i--;
                length--;
            }
        }
//        this.draw();

        if (this.particles.length === 0) {
            clearInterval(this.interval);
            this.interval = false;
        }
    };

    window.ParticleExploder = ParticleExploder;

} (window.Particle));
