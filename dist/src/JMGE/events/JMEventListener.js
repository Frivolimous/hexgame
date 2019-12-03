import * as _ from 'lodash';
export class JMEventListener {
    constructor(onlyLastListener, onlyLastEvent) {
        this.onlyLastListener = onlyLastListener;
        this.onlyLastEvent = onlyLastEvent;
        this.listeners = [];
        this.once = [];
        this.events = [];
        this.active = false;
        this.clear = () => {
            this.listeners = [];
            this.once = [];
            this.events = [];
            this.active = false;
        };
        this.process = () => {
            this.active = false;
            while (this.events.length > 0) {
                let event = this.events.shift();
                let listeners = _.clone(this.listeners);
                listeners.forEach(output => output(event));
                while (this.once.length > 0) {
                    this.once.shift()(event);
                }
            }
        };
    }
    addListener(output) {
        if (this.onlyLastListener) {
            this.listeners = [output];
        }
        else {
            this.listeners.push(output);
        }
    }
    removeListener(output) {
        let i = this.listeners.indexOf(output);
        if (i >= 0) {
            this.listeners.splice(i, 1);
        }
    }
    addOnce(output) {
        this.once.push(output);
    }
    publish(event) {
        // console.log('publish', event, this.active);
        this.events.push(event);
        if (!this.active) {
            requestAnimationFrame(this.process);
            this.active = true;
        }
    }
}
