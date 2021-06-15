import Particle from "./Particle.js";

export default class ParticleExploder {
    particlesAmount = 100;
    maxVelocity = 1;
    fps = 60;
    gravity = 0;
    stayInBounds = true;
    isDecaying = true;
    color = '255,255,0';

    constructor(bounds, canvas, options = {}) {
        Object.assign(this, options);

        this.bounds = bounds;
        this.particles = [];

        canvas.onclick = (evt) => {
            const point = {x: evt.x - canvas.offsetLeft, y: evt.y - canvas.offsetTop};
            this.explode(point);
        }
    }

    explode(point) {
        this.createParticles(point, this.particlesAmount);
        if (!this.interval) {
            this.interval = setInterval(this.tick.bind(this), 1000 / this.fps);
        }
    }

    /**
     * Creates random particles
     * @param amount Amount of particles to create
     */

    createParticles(point, amount) {
        var i;
        for (i = 0; i < amount; i++) {
            var velocity = {
                x: Math.random() * this.maxVelocity * 2 - this.maxVelocity,
                y: Math.random() * this.maxVelocity * 2 - this.maxVelocity
            };
            const particleOptions = {
                gravity: this.gravity,
                stayInBounds: this.stayInBounds,
                bounds: this.bounds,
                isDecaying: this.isDecaying,
                color: this.color
            };
            this.particles.push(new Particle(point, velocity, this.bounds, particleOptions));
        }
    }


    /**
     * Draws connecting lines between all particles withing MIN_DISTANCE of each other
     */
    draw(ctx) {
        var length = this.particles.length,
            i;

        for (i = 0; i < length; i++) {
            this.particles[i].draw(ctx);
        }
    }

    /**
     * Global loop function, draws and moves particles
     */
    tick() {
        this.particles = this.particles.filter((particle, index)=>{
            particle.update();
            return particle.vitality > 0 || particle.isInBounds();
        });

        if (this.particles.length === 0) {
            clearInterval(this.interval);
            this.interval = false;
        }
    }
}
