const Field = require('./Field.js');

class MouseField {
    constructor(canvas, options = {}) {
        this.field = new Field({x: -1000, y: -1000}, {mass: -400});
        canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    }

    mouseMove (evt) {
        const rect = evt.target.getBoundingClientRect();
        this.field.position.x = evt.clientX - rect.left;
        this.field.position.y = evt.clientY - rect.top;
    }
}

module.exports = MouseField;