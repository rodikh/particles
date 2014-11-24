(function () {
    'use strict';

    var MouseField = function (canvas, options) {
        if (!options) {
            options = {};
        }

        var self = this;
        this.canvas = canvas;
        this.field = new Field(canvas, {position: {x: -1000, y: -1000}, mass: -400, active: false});

        if (Particle.prototype.fields === undefined) {
            Particle.prototype.fields = [];
        }
        Particle.prototype.fields.push(self.field);

        this.canvas.addEventListener('mousemove', mouseMove.bind(this));

        if (options.gui) {
            if (!window.gui) {
                window.gui = new dat.GUI();
            }
            var folder = gui.addFolder('Mouse Field');
            folder.add(this.field, 'active');
            folder.add(this.field, 'mass', -400, 400);
        }
    };

    function mouseMove (evt) {
        this.field.position.x = evt.x;
        this.field.position.y = evt.y;
    }


    window.MouseField = MouseField;
} ());