import * as PIXI from 'pixi.js';
import * as Colors from '../others/Colors';
import { JMTween } from '../JMTween';
export class Laser extends PIXI.Graphics {
    constructor(origin, target, color = 0xffffff, thickness = 1, parent) {
        super();
        if (parent)
            parent.addChild(this);
        this.lineStyle(thickness * 2, Colors.adjustLightness(color, 0.3));
        this.moveTo(origin.x, origin.y);
        this.lineTo(target.x, target.y);
        this.lineStyle(thickness, color);
        this.lineTo(origin.x, origin.y);
        this.alpha = 2;
        new JMTween(this).to({ alpha: 0 }).over(500).onComplete(() => this.destroy()).start();
    }
}
