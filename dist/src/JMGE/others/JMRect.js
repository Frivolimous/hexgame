import * as PIXI from 'pixi.js';
export class JMRect extends PIXI.Rectangle {
    set(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    setLeft(n) {
        this.width += this.x - n;
        this.x = n;
    }
    setRight(n) {
        this.width += n - this.right;
    }
    setTop(n) {
        this.height -= n - this.y;
        this.y = n;
    }
    setBot(n) {
        this.height += n - this.top;
    }
}
