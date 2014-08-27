(function () {
    'use strict';

    var QuadTree = function (level, bounds) {
        this.level = level;
        this.bounds = bounds;

        this.objects = [];
        this.nodes = [];

    };

    QuadTree.prototype.MAX_OBJECTS = 4;
    QuadTree.prototype.MAX_LEVELS = 5;
    QuadTree.prototype.PARTICLE_SIZE = 50;

    QuadTree.prototype.clear = function () {
        this.objects = [];
        this.nodes = [];
    };

    QuadTree.prototype.split = function () {
        var subWidth = this.bounds.width / 2;
        var subHeight = this.bounds.height / 2;
        var x = this.bounds.x;
        var y = this.bounds.y;

        this.nodes = [];
        this.nodes[0] = new QuadTree(this.level+1, {x: x, y:y, width: subWidth, height: subHeight});
        this.nodes[1] = new QuadTree(this.level+1, {x: x+subWidth, y:y, width: subWidth, height: subHeight});
        this.nodes[2] = new QuadTree(this.level+1, {x: x+subWidth, y:y+subHeight, width: subWidth, height: subHeight});
        this.nodes[3] = new QuadTree(this.level+1, {x: x, y:y+subHeight, width: subWidth, height: subHeight});
    };

    QuadTree.prototype.getIndex = function (particle) {
        var verticalMid = this.bounds.y + this.bounds.height / 2;
        var horizontalMid = this.bounds.x + this.bounds.width / 2;

        var topHalf = ((particle.y + this.PARTICLE_SIZE / 2 <= verticalMid) && (particle.y > this.bounds.y));
        var bottomHalf = (particle.y - this.PARTICLE_SIZE / 2 > verticalMid) && (particle.y < this.bounds.y + this.bounds.height);

        if (particle.x + this.PARTICLE_SIZE / 2 < horizontalMid ) {
            if (topHalf) {
                return 0;
            }

            if (bottomHalf) {
                return 3;
            }
        } else if (particle.x - this.PARTICLE_SIZE > horizontalMid) {
            if (topHalf) {
                return 1;
            }

            if (bottomHalf) {
                return 2;
            }
        }

        return -1;
    };

    QuadTree.prototype.insertParticle = function (particle) {
        this.insert(particle);
    };

    QuadTree.prototype.insert = function (particle) {
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

    };

    QuadTree.prototype.retreiveParticle = function (particle) {
        return this.retreive(particle);
    };

    QuadTree.prototype.retreive = function (particle) {
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
    };

    QuadTree.prototype.drawNodeGrid = function (ctx) {

        for (var i in this.nodes) {
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
    };

    QuadTree.prototype.drawInnerConnections = function (ctx) {
        for (var i in this.nodes) {
            this.nodes[i].drawInnerConnections(ctx);
        }

        var length = this.objects.length,
            j,k;
        for (j = 0; j < length; j++) {
            for (k = 0; k < length; k++) {
                var color;
                switch (this.level) {
                    case 0: color= 'red'; break;
                    case 1: color= 'green'; break;
                    case 2: color= 'blue'; break;
                    case 3: color= 'yellow'; break;
                }
                drawLine(this.objects[j], this.objects[k], color, ctx);
            }
        }
    };


    function text(x, y, text, ctx) {
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textBaseline = 'bottom';
        ctx.fillText(text, x, y);
    }


    window.QuadTree = QuadTree;

} ());
