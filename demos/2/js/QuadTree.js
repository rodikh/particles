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
        this.nodes.push(new QuadTree(this.level+1, {x: x, y:y, width: subWidth, height: subHeight}));
        this.nodes.push(new QuadTree(this.level+1, {x: x+subWidth, y:y, width: subWidth, height: subHeight}));
        this.nodes.push(new QuadTree(this.level+1, {x: x+subWidth, y:y+subHeight, width: subWidth, height: subHeight}));
        this.nodes.push(new QuadTree(this.level+1, {x: x, y:y+subHeight, width: subWidth, height: subHeight}));
    };

    QuadTree.prototype.getIndex = function (rect) {
        var verticalMid = this.bounds.y + this.bounds.height / 2;
        var horizontalMid = this.bounds.x + this.bounds.width / 2;

        var topHalf = (rect.y + rect.height < verticalMid);
        var bottomHalf = (rect.y > verticalMid);

//        console.log('rect index',horizontalMid);

        if (rect.x + rect.width < horizontalMid ) {
            if (topHalf) {
                return 0;
            }

            if (bottomHalf) {
                return 3;
            }
        } else if (rect.x > horizontalMid) {
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
        var offset = 10;
        var rect = {x: particle.x - offset, y: particle.y - offset, width: offset * 2, height: offset * 2};
        this.insert(rect);
    };

    QuadTree.prototype.insert = function (rect) {
        if (this.nodes.length) {
            var index = this.getIndex(rect);

            if (index !== -1) {
                return this.nodes[index].insert(rect);
            }
        }

        this.objects.push(rect);

        if (this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
            if (this.nodes.length === 0) {
                this.split();
            }

            var i = 0;
            while (i < this.objects.length) {
                var index = this.getIndex(this.objects[i]);
                if (index !== -1) {
//                    console.log('inserting into child');
                    this.nodes[index].insert(this.objects.splice(i,1));
                } else {
                    i++;
                }
            }
        }

    };

    QuadTree.prototype.retreiveParticle = function (particle) {
        var offset = 10;
        var rect = {x: particle.x - offset, y: particle.y - offset, width: offset * 2, height: offset * 2};
//        console.log('rect',rect);
        return this.retreive(rect);
    };

    QuadTree.prototype.retreive = function (rect) {
        var index = this.getIndex(rect);
        var rtObjects = [];
        if (index !== -1 && this.nodes.length) {
            rtObjects = this.nodes[index].retreive(rect);
        }

        rtObjects = rtObjects.concat(this.objects);

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
        }
    };

    window.QuadTree = QuadTree;

} ());
