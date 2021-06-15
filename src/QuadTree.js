import {drawLine} from "./utils.js";

export default class QuadTree {
    constructor(level, bounds, options = {}) {
        this.options = options; // for child creation

        this.level = level;
        this.bounds = bounds;

        this.itemSize = options.itemSize || 50;

        this.objects = [];
        this.nodes = [];
        this.MAX_OBJECTS = 4;
        this.MAX_LEVELS = 5;
    }

    clear() {
        this.objects = [];
        this.nodes = [];
    }

    split() {
        const subWidth = this.bounds.width / 2;
        const subHeight = this.bounds.height / 2;
        const x = this.bounds.x;
        const y = this.bounds.y;

        this.nodes = [];
        this.nodes[0] = new QuadTree(this.level+1, {x: x, y:y, width: subWidth, height: subHeight}, this.options);
        this.nodes[1] = new QuadTree(this.level+1, {x: x+subWidth, y:y, width: subWidth, height: subHeight}, this.options);
        this.nodes[2] = new QuadTree(this.level+1, {x: x+subWidth, y:y+subHeight, width: subWidth, height: subHeight}, this.options);
        this.nodes[3] = new QuadTree(this.level+1, {x: x, y:y+subHeight, width: subWidth, height: subHeight}, this.options);
    }

    getIndex(particle) {
        const verticalMid = this.bounds.y + this.bounds.height / 2;
        const horizontalMid = this.bounds.x + this.bounds.width / 2;

        const topHalf = (particle.y + this.itemSize / 2 <= verticalMid);
        const bottomHalf = (particle.y - this.itemSize / 2 > verticalMid);

        if (particle.x + this.itemSize / 2 < horizontalMid) {
            if (topHalf) {
                return 0;
            }

            if (bottomHalf) {
                return 3;
            }
        } else if (particle.x - this.itemSize > horizontalMid) {
            if (topHalf) {
                return 1;
            }

            if (bottomHalf) {
                return 2;
            }
        }

        return -1;
    }

    insert(particle) {
        if (this.nodes.length) {
            var index = this.getIndex(particle);

            if (index !== -1) {
                return this.nodes[index].insert(particle);
            }
        }

        this.objects.push(particle);

        if (this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
            if (this.nodes.length === 0) {
                this.split();
            }

            var i = 0;
            while (i < this.objects.length) {
                var index = this.getIndex(this.objects[i]);
                if (index !== -1) {
                    this.nodes[index].insert(this.objects.splice(i,1)[0]);
                } else {
                    i++;
                }
            }
        }

    }

    retreiveParticle(particle) {
        return this.retreive(particle);
    }

    retreive(particle) {
        var index = this.getIndex(particle);
        var rtObjects = [];
        if (index !== -1 && this.nodes.length) {
            rtObjects = this.nodes[index].retreive(particle);
        }

        if (this.objects.length) {
            var i, length = this.objects.length;
            for (i = 0; i < length; i++) {
                rtObjects.push(this.objects[i]);
            }
        }


        return rtObjects;
    }

    drawNodeGrid(ctx) {
        for (let i in this.nodes) {
            this.nodes[i].drawNodeGrid(ctx);
        }
        if (this.nodes.length) {
            ctx.strokeStyle = 'rgba(255,255,255,1)';
            ctx.beginPath();
            ctx.moveTo(this.bounds.x + this.bounds.width / 2, this.bounds.y);
            ctx.lineTo(this.bounds.x + this.bounds.width / 2, this.bounds.y + this.bounds.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.bounds.x, this.bounds.y + this.bounds.height / 2);
            ctx.lineTo(this.bounds.x + this.bounds.width, this.bounds.y + this.bounds.height / 2);
            ctx.stroke();

            text(this.bounds.x + 5, this.bounds.y + (15 * this.level) + 15, this.nodes[0].objects.length, ctx);
            text(this.bounds.x + this.bounds.width / 2 + 5, this.bounds.y + (15 * this.level) + 15, this.nodes[1].objects.length, ctx);
            text(this.bounds.x + this.bounds.width / 2 + 5, this.bounds.y + this.bounds.height / 2 + (15 * this.level) + 15, this.nodes[2].objects.length, ctx);
            text(this.bounds.x + 5, this.bounds.y + this.bounds.height / 2 + (15 * this.level) + 15, this.nodes[3].objects.length, ctx);

        }
    }

    drawInnerConnections(ctx) {
        this.nodes.forEach(node => node.drawInnerConnections(ctx))

        let length = this.objects.length,
            j, k;
        for (j = 0; j < length; j++) {
            for (k = j; k < length; k++) {
                let color;
                switch (this.level) {
                    case 0: color= 'red'; break;
                    case 1: color= 'green'; break;
                    case 2: color= 'blue'; break;
                    case 3: color= 'yellow'; break;
                }
                drawLine(this.objects[j], this.objects[k], color, ctx);
            }
        }
    }
}


function text(x, y, text, ctx) {
    ctx.fillStyle = '#fff';
    ctx.font = '12px sans-serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, x, y);
}

