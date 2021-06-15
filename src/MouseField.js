import Field from "./Field.js";

export default class MouseField {
    constructor(canvas, options = {}) {
        this.field = new Field({x: -1000, y: -1000}, {mass: -400});

        if (Field.fields === undefined) {
            Field.fields = [];
        }
        Field.fields.push(this.field);

        canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    }

    mouseMove (evt) {
        this.field.position.x = evt.offsetX;
        this.field.position.y = evt.offsetY;
    }
}
