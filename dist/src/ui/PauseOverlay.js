import * as PIXI from 'pixi.js';
import { JMTween } from '../JMGE/JMTween';
export class PauseOverlay extends PIXI.Container {
    constructor(bounds) {
        super();
        this.state = false;
        let background = new PIXI.Graphics();
        background.beginFill(0x333333, 0.3);
        background.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        let text = new PIXI.Text('- PAUSED -', { fill: 0xffff00, fontSize: 30, fontWeight: 'bold' });
        text.position.set((bounds.width - text.width) / 2, (bounds.height - text.height) / 2);
        this.addChild(background, text);
        // this.visible = false;
        this.alpha = 0;
    }
    changeState(b) {
        if (b !== this.state) {
            this.state = b;
            if (this.currentTween) {
                this.currentTween.stop();
            }
            if (b) {
                this.currentTween = new JMTween(this, 200).to({ alpha: 1 }).start().onComplete(() => this.currentTween = null);
            }
            else {
                this.currentTween = new JMTween(this, 200).to({ alpha: 0 }).start().onComplete(() => this.currentTween = null);
            }
        }
    }
}
