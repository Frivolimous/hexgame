import * as PIXI from 'pixi.js';
import { ColorGradient } from '../others/Colors';
export class Charge extends PIXI.Graphics {
    constructor(endRadius = 10, time = 30, color = 0xff0000) {
        super();
        this.endRadius = endRadius;
        this.time = time;
        this.count = -1;
        this.running = false;
        this.redraw = () => {
            // let color=this.gradient.getColorAt(Math.random()*0.5+0.5);
            if (Math.random() < 0.5) {
                var color = this.gradient1.getColorAt(Math.random() * 0.5 + 0.5);
            }
            else {
                color = this.gradient2.getColorAt(Math.random() * 0.5 + 0.5);
            }
            this.clear();
            this.beginFill(color);
            this.drawCircle(0, 0, this.endRadius * this.count / this.time);
        };
        this.endCharge = () => {
            if (this.callback)
                this.callback();
            this.callback = null;
            this.count = -1;
            this.clear();
            this.running = false;
        };
        this.gradient1 = new ColorGradient(0, color);
        this.gradient2 = new ColorGradient(0xffffff, color);
    }
    startCharge(callback) {
        this.count = 0;
        this.callback = callback;
        this.redraw();
        this.running = true;
    }
    update(speed) {
        if (this.count === -1)
            return;
        if (this.count < this.time) {
            this.count += speed;
            this.redraw();
        }
        else {
            this.endCharge();
        }
    }
}
