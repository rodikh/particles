const Field = require('./Field.js');

class MouseField {
    constructor(canvas, options = {}) {
        this.field = new Field({x: -1000, y: -1000}, {mass: -400});

        if (Field.fields === undefined) {
            Field.fields = [];
        }
        Field.fields.push(this.field);

        canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    }

    mouseMove (evt) {
        const rect = evt.target.getBoundingClientRect();
        this.field.position.x = evt.clientX - rect.left;
        this.field.position.y = evt.clientY - rect.top;
    }
}

module.exports = MouseField;