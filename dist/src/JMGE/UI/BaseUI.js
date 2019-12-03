import * as JMBUI from '../JMBUI';
import * as _ from 'lodash';
import { ScreenCover } from '../effects/ScreenCover';
import { JMInteractionEvents } from '../events/JMInteractionEvents';
export class BaseUI extends JMBUI.BasicElement {
    constructor(UIConfig) {
        super(UIConfig);
        this.navIn = () => { };
        this.navOut = () => { };
        this.dispose = () => {
            this.finishDispose();
        };
        this.finishDispose = () => {
            JMInteractionEvents.WINDOW_RESIZE.removeListener(this.onResize);
            this.destroy();
        };
        this.positionElements = (e) => { };
        this.navBack = (fadeTiming) => {
            if (!this.previousUI) {
                return;
            }
            if (this.saveCallback) {
                this.saveCallback(() => {
                    this.finishNav(this.previousUI, fadeTiming, true);
                });
            }
            else {
                this.finishNav(this.previousUI, fadeTiming, true);
            }
        };
        this.navForward = (nextUI, previousUI, fadeTiming) => {
            nextUI.previousUI = previousUI || this;
            if (this.saveCallback) {
                nextUI.saveCallback = this.saveCallback;
                this.saveCallback(() => {
                    this.finishNav(nextUI, fadeTiming);
                });
            }
            else {
                this.finishNav(nextUI, fadeTiming);
            }
        };
        this.onResize = (e) => {
            this.previousResize = e;
            if (this.parent) {
                this.positionElements(e);
            }
        };
        this.finishNav = (nextUI, fadeTiming, andDispose) => {
            fadeTiming = _.defaults(fadeTiming || {}, dFadeTiming);
            let screen = new ScreenCover(this.previousResize.outerBounds, fadeTiming.color).onFadeComplete(() => {
                this.navOut();
                this.parent.addChild(nextUI);
                this.parent.removeChild(this);
                nextUI.navIn();
                if (this.previousResize) {
                    nextUI.onResize(this.previousResize);
                }
                let screen2 = new ScreenCover(this.previousResize.outerBounds, fadeTiming.color).fadeOut(fadeTiming.fadeOut);
                nextUI.addChild(screen2);
                if (andDispose) {
                    this.dispose();
                }
            }).fadeIn(fadeTiming.fadeIn, fadeTiming.delay, fadeTiming.delayBlank);
            this.addChild(screen);
        };
        JMInteractionEvents.WINDOW_RESIZE.addListener(this.onResize);
        // this.positionElements(resize);
    }
}
const dFadeTiming = {
    color: 0,
    delay: 0,
    fadeIn: 300,
    delayBlank: 100,
    fadeOut: 300,
};
