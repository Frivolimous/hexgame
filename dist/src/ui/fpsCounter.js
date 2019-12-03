import * as PIXI from 'pixi.js';
import { JMTicker } from '../JMGE/events/JMTicker';
export class FPSCounter extends PIXI.Container {
    constructor() {
        super();
        this.onTick = (ms) => {
            this.counter.text = String(Math.round(ms));
        };
        let back = new PIXI.Graphics().beginFill(0x999999).lineStyle(2).drawRect(0, 0, 100, 50);
        this.counter = new PIXI.Text();
        this.addChild(back, this.counter);
        JMTicker.add(this.onTick);
    }
}
