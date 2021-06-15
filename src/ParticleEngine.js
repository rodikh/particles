const { distance, drawLine } = require('./utils.js');
const Particle = require('./Particle.js');
const QuadTree = require('./QuadTree.js');

class ParticleEngine {

    constructor(bounds, options = {}) {
        this.particlesAmount = 100;
        this.maxLineDistance = 50;
        this.maxVelocity = 1;
        this.fps = 60;
        this.stayInBounds = true;
        this.color = '255,255,255';
        this.particleLines = false;
        this.useTree = false;
        this.gridLines = false;
        this.nodeConnections = false;

        Object.assign(this, options);

        this.particles = [];
        this.bounds = bounds;

        this.createParticles(this.particlesAmount);

        if (QuadTree) {
            const quadBounds = {x:0, y:0, width: bounds.width, height: bounds.height};
            this.quad = new QuadTree(0, quadBounds, {itemSize: this.maxLineDistance * 2});
        }

        setInterval(this.tick.bind(this), 1000 / this.fps);
    }

    /**
     * Creates random particles
     * @param amount Amount of particles to create
     */
    createParticles(amount) {
        for (let i = 0; i < amount; i++) {
            const point = {
                x: Math.random() * this.bounds.width,
                y: Math.random() * this.bounds.height
            };
            const velocity = {
                x: Math.random() * this.maxVelocity * 2 - this.maxVelocity,
                y: Math.random() * this.maxVelocity * 2 - this.maxVelocity
            };
            const particleOptions = {
                stayInBounds: this.stayInBounds,
                color: this.color
            };

            this.particles.push(new Particle(point, velocity, this.bounds, particleOptions));
        }
    }

    /**
     * Draws connecting lines between all particles withing MIN_DISTANCE of each other
     */
    draw(ctx) {
        let numChecks = 0;
        this.particles.forEach(particle => {
            particle.draw(ctx);
            if (this.particleLines) {
                numChecks += this.drawParticleLines(particle, ctx);
            }
        });

        if (this.particleLines) {
            // todo: pass logger to constructor, logger can be console or dom or whatever.
            const consoleDiv = document.getElementById('numChecks');
            if (consoleDiv) {
                consoleDiv.innerHTML = numChecks;
            }
        }

        if (this.quad && this.gridLines && this.useTree) {
            this.quad.drawNodeGrid(ctx);
        }

        if (this.nodeConnections) {
            if (this.quad && this.useTree) {
                this.quad.drawInnerConnections(ctx);
            } else {
                const length = this.particles.length;;
                for (let j = 0; j < length; j++) {
                    for (let k = j + 1; k < length; k++) {
                        drawLine(this.particles[j], this.particles[k], 'red', ctx);
                    }
                }
            }
        }
    }

    /**
     * Global loop function, draws and moves particles
     */
    tick() {
        if (this.quad) {
            this.quad.clear();
        }

        this.particles = this.particles.filter(particle => {
            particle.update();
            if (this.quad) {
                this.quad.insert(particle);
            }
            return particle.vitality > 0 || particle.isInBounds();
        });
    }

    drawParticleLines(particle, ctx) {
        let neighbours;
        if (this.quad && this.useTree) {
            neighbours = this.quad.retreiveParticle(particle);
        } else {
            neighbours = this.particles;
        }

        neighbours.forEach(neighbour => {
            const dist = distance(particle, neighbour);
            if (dist < this.maxLineDistance) {
                distLine(particle, neighbour, dist / this.maxLineDistance, this.bounds, ctx);
            }
        });
        return neighbours.length;
    }
}

function distLine(p1, p2, distRatio, bounds, ctx){
    let r = 100 + (p1.y / bounds.height) * 155;
    let g = 100 + (p2.x / bounds.width) * 155;
    let b = 3 * (p1.x + p1.y) / (bounds.width + bounds.height) * 255;

    r |= r;
    g |= g;
    b = (b < 120) ? 120 : b|b;
    let alpha = Math.min(1 - distRatio, 0.4);

    const color = `rgba(${r},${g},${b},${alpha})`;
    drawLine(p1, p2, color, ctx);
}

module.exports = ParticleEngine;