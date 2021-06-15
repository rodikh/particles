const Particle = require('./Particle.js');

class ParticleEmitter {

    constructor(point, vector, bounds, options = {}) {
        this.maxVelocity = 0.3;
        this.fps = 60;
        this.gravity = 0;
        this.stayInBounds = false;
        this.isDecaying = false;
        this.color = '255,255,255';
        Object.assign(this, options);

        this.point = point;
        this.vector = vector;
        this.bounds = bounds;
        this.particles = [];

        setInterval(this.tick.bind(this), 1000 / this.fps);
    }

    /**
     * Creates random particles
     * @param point
     * @param vector
     * @param amount Amount of particles to create
     */
    createParticles(point, vector, amount) {
        for (let i = 0; i < amount; i++) {
            const velocity = {
                x: Math.random() * this.maxVelocity * 2 - this.maxVelocity + vector.x,
                y: Math.random() * this.maxVelocity * 2 - this.maxVelocity + vector.y
            };
            const particleOptions = {
                gravity: this.gravity,
                stayInBounds: this.stayInBounds,
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
        this.particles.forEach(particle => particle.draw(ctx));
    }

    /**
     * Global loop function, updates, moves and kills particles
     */
    tick() {
        this.createParticles(this.point, this.vector, 1);
        this.particles = this.particles.filter((particle, index)=>{
            particle.update();
            return particle.vitality > 0 || particle.isInBounds();
        });
    }
}

module.exports = ParticleEmitter;