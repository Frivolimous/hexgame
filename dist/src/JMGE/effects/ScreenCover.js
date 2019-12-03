import * as PIXI from 'pixi.js';
import { JMTween } from '../JMTween';
export class ScreenCover extends PIXI.Graphics {
    constructor(rect, color = 0) {
        super();
        this.onFadeComplete = (callback) => {
            this._onFadeComplete = callback;
            return this;
        };
        this.fadeIn = (duration, waitPre = 0, waitPost = 0) => {
            new JMTween(this).wait(waitPre).from({ alpha: 0 }).over(duration).onComplete(() => {
                if (waitPost) {
                    new JMTween({}).wait(waitPost).onWaitComplete(() => {
                        this.destroy();
                        if (this._onFadeComplete)
                            this._onFadeComplete();
                    }).start();
                }
                else {
                    this.destroy();
                    if (this._onFadeComplete)
                        this._onFadeComplete();
                }
            }).start();
            return this;
        };
        this.fadeOut = (duration, waitPre = 0, waitPost = 0) => {
            new JMTween(this).wait(waitPre).to({ alpha: 0 }).over(duration).onComplete(() => {
                if (waitPost) {
                    new JMTween({}).wait(waitPost).onWaitComplete(() => {
                        this.destroy();
                        if (this._onFadeComplete)
                            this._onFadeComplete();
                    }).start();
                }
                else {
                    this.destroy();
                    if (this._onFadeComplete)
                        this._onFadeComplete();
                }
            }).start();
            return this;
        };
        this.beginFill(color);
        this.drawRect(rect.x, rect.y, rect.width, rect.height);
    }
}
