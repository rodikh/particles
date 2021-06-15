const Field = require('./Field.js');
const { distance } = require('./utils.js');

const MAX_SPEED = 10;

class Particle {


    constructor(point, velocity, bounds, options = {}) {
        this.mass = 1;
        this.hasField = false;
        this.gravity = 0;
        this.stayInBounds = false;
        this.boundsBehaviour = 'bounce';
        this.isDecaying = false;
        this.color = '255,255,255';
        this.initialVitality = 100;
        Object.assign(this, options);

        this.bounds = bounds;
        //position
        this.x = point.x;
        this.y = point.y;
        // velocity
        this.vx = velocity.x;
        this.vy = velocity.y;
        // acceleration
        this.ax = 0;
        this.ay = 0;
        this.vitality = this.initialVitality;

        if (this.hasField) {
            this.field = new Field(bounds, {position: {x: this.x, y: this.y}, mass: this.mass});
        }
    }

    update() {
        this.interactWithFields(Field.domain.all);
        this.move();

        if (this.stayInBounds) {
            this.enforceBounds();
        }

        if (this.isDecaying) {
            this.decay();
        }
    }

    enforceBounds() {
        if (this.x >= this.bounds.width) {
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

        if (this.y >= this.bounds.height) {
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
    }

    isInBounds() {
        return this.x < this.bounds.width && this.x >= 0 && this.y < this.bounds.height && this.y >= 0;
    }

    move() {
        // add acceleration to velocity
        this.vx = Math.min(Math.max(this.vx + this.ax, -MAX_SPEED), MAX_SPEED);
        this.vy = Math.min(Math.max(this.vy + this.ay, -MAX_SPEED), MAX_SPEED);

        // add velocity to position
        this.x += this.vx;
        this.y += this.vy;

        if (this.field) {
            this.field.position.x = this.x;
            this.field.position.y = this.y;
        }

        this.vy += this.gravity;
    }

    interactWithFields(fields) {
        if (!fields) {
            return;
        }

        // the starting acceleration to add all forces to
        let ax = 0;
        let ay = 0;

        fields.forEach(field => {
            // todo: use quadtree to get only relevant fields, instead of going over all fields
            if (field === this.field || field.active === false) {
                return;
            }

            // find the distance between the particle and the field
            const vectorX = field.position.x - this.x;
            const vectorY = field.position.y - this.y;

            const force = field.mass / Math.pow(distance(this, field.position), 3);
            ax += vectorX * force;
            ay += vectorY * force;
        });

        // update our particle's acceleration
        this.ax = ax;
        this.ay = ay;
    }

    decay() {
        return this.vitality--;
    }

    draw(ctx) {
        if (this.hasField) {
            this.field.draw(ctx);
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI, false);
        const alpha = this.vitality / 100;
        ctx.fillStyle = 'rgba('+ this.color +','+ alpha +')';
        ctx.fill();
    }
}

module.exports = Particle;