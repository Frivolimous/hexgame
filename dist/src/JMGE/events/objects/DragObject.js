import * as PIXI from 'pixi.js';
export class DragObject {
    constructor(object, onMove, onRelease, onDown, offset) {
        this.object = object;
        this.onRelease = onRelease || this.nullFunc;
        this.onDown = onDown || this.nullFunc;
        this.onMove = onMove || this.nullFunc;
        this.offset = offset;
    }
    setOffset(x, y) {
        this.offset = new PIXI.Point(x, y);
    }
    nullFunc(object, e) {
        return true;
    }
    ;
    release(e) {
        let m = this.onRelease(this.object, e);
        this.object.selected = !m;
        return m;
    }
    move(e) {
        return this.onMove(this.object, e);
    }
    down(e) {
        let m = this.onDown(this.object, e);
        this.object.selected = !m;
        return m;
    }
}
