let running = false;
let tweens = [];
let _add = (tween) => {
    tweens.push(tween);
    _tryRun();
};
let _remove = (tween) => {
    let index = tweens.indexOf(tween);
    if (index >= 0) {
        tweens.splice(index, 1);
    }
};
let _tryRun = () => {
    if (!running && tweens.length > 0) {
        running = true;
        requestAnimationFrame(_tick);
    }
};
let _tick = (time) => {
    running = false;
    tweens.forEach(tween => tween.tickThis(time));
    if (!running && tweens.length > 0) {
        running = true;
        requestAnimationFrame(_tick);
    }
};
export class JMTween {
    constructor(object, totalTime = 200) {
        this.object = object;
        this.totalTime = totalTime;
        this.running = false;
        this.properties = [];
        this.onUpdate = (callback) => {
            this.onUpdateCallback = callback;
            return this;
        };
        this.onComplete = (callback) => {
            this.onCompleteCallback = callback;
            return this;
        };
        this.onWaitComplete = (callback) => {
            this.onWaitCompleteCallback = callback;
            return this;
        };
        this.yoyo = (b = true) => {
            this._Yoyo = b;
            return this;
        };
        this.stop = () => {
            this.running = false;
            _remove(this);
            return this;
        };
        this.complete = (time) => {
            this.properties.forEach(property => {
                // @ts-ignore
                this.object[property.key] = property.end;
            });
            if (this._Yoyo) {
                this.reverseProps();
                this.startTime = time;
                this.endTime = this.startTime + (this.totalTime || 0);
            }
            else {
                this.running = false;
                _remove(this);
                this.tickThis = () => { };
                if (this.onCompleteCallback)
                    this.onCompleteCallback(this.object);
                if (this.nextTween) {
                    this.nextTween.reset();
                    this.nextTween.start();
                    this.nextTween.tickThis(time);
                }
            }
            return this;
        };
        this.reset = () => {
            this.tickThis = this.firstTick;
            if (this.waitTime)
                this.hasWait = true;
            return this;
        };
        this.wait = (time) => {
            this.waitTime = time;
            this.hasWait = true;
            return this;
        };
        this.over = (time) => {
            this.totalTime = time;
            return this;
        };
        this.start = () => {
            this.running = true;
            this.properties.forEach(property => {
                if (property.to || property.to === 0) {
                    // @ts-ignore
                    property.start = this.object[property.key] || 0;
                    property.end = property.to;
                }
                else if (property.from || property.from === 0) {
                    property.start = property.from;
                    // @ts-ignore
                    property.end = this.object[property.key] || 0;
                }
                if (property.isColor) {
                    property.incR = Math.floor(property.end / 0x010000) - Math.floor(property.start / 0x010000);
                    property.incG = Math.floor((property.end % 0x010000) / 0x000100) - Math.floor((property.start % 0x010000) / 0x000100);
                    property.incB = Math.floor(property.end % 0x000100) - Math.floor(property.start % 0x000100);
                }
                else {
                    property.inc = property.end - property.start;
                }
                // @ts-ignore
                this.object[property.key] = property.start;
            });
            _add(this);
            return this;
        };
        this.to = (props, eased = true) => {
            for (let key of Object.keys(props)) {
                // @ts-ignore
                this.properties.push({ key, eased, to: props[key] });
            }
            return this;
        };
        this.from = (props, eased = true) => {
            for (let key of Object.keys(props)) {
                // @ts-ignore
                this.properties.push({ key, eased, from: props[key] });
            }
            return this;
        };
        this.colorTo = (props, eased = true) => {
            for (let key of Object.keys(props)) {
                // @ts-ignore
                this.properties.push({ key, eased, to: props[key], isColor: true });
            }
            return this;
        };
        this.colorFrom = (props, eased = true) => {
            for (let key of Object.keys(props)) {
                // @ts-ignore
                this.properties.push({ key, eased, from: props[key], isColor: true });
            }
            return this;
        };
        this.easing = (func) => {
            this._Easing = func;
            return this;
        };
        this.firstTick = (time) => {
            if (this.hasWait) {
                this.startTime = time + this.waitTime;
            }
            else {
                this.startTime = time;
            }
            this.endTime = this.startTime + (this.totalTime || 0);
            this.tickThis = this.tailTick;
        };
        this.tailTick = (time) => {
            if (this.hasWait && time > this.startTime) {
                this.hasWait = false;
                if (this.onWaitCompleteCallback)
                    this.onWaitCompleteCallback(this.object);
            }
            if (time > this.endTime) {
                this.complete(time);
            }
            else if (time > this.startTime) {
                let raw = (time - this.startTime) / this.totalTime;
                let eased = this._Easing ? this._Easing(raw) : raw;
                this.properties.forEach(property => {
                    let percent = property.eased ? eased : raw;
                    if (property.isColor) {
                        // @ts-ignore
                        this.object[property.key] = Math.round(property.start +
                            Math.floor(property.incR * percent) * 0x010000 +
                            Math.floor(property.incG * percent) * 0x000100 +
                            Math.floor(property.incB * percent));
                    }
                    else {
                        // @ts-ignore
                        this.object[property.key] = property.start + property.inc * percent;
                    }
                });
                if (this.onUpdateCallback)
                    this.onUpdateCallback(this.object);
            }
        };
        this.reverseProps = () => {
            this.properties.forEach(property => {
                let start = property.start;
                property.start = property.end;
                property.end = start;
                if (property.isColor) {
                    property.incR = Math.floor(property.end / 0x010000) - Math.floor(property.start / 0x010000);
                    property.incG = Math.floor((property.end % 0x010000) / 0x000100) - Math.floor((property.start % 0x010000) / 0x000100);
                    property.incB = Math.floor(property.end % 0x000100) - Math.floor(property.start % 0x000100);
                }
                else {
                    property.inc = property.end - property.start;
                }
            });
        };
        this.tickThis = this.firstTick;
    }
    chain(nextObj, totalTime) {
        this.nextTween = new JMTween(nextObj, totalTime);
        return this.nextTween;
    }
    chainTween(tween) {
        this.nextTween = tween;
        return tween;
    }
}
export const JMEasing = {
    Linear: {
        None: (k) => {
            return k;
        },
    },
    Quadratic: {
        In: (k) => {
            return k * k;
        },
        Out: (k) => {
            return k * (2 - k);
        },
        InOut: (k) => {
            k *= 2;
            if (k < 1) {
                return 0.5 * k * k;
            }
            return -0.5 * (--k * (k - 2) - 1);
        },
    },
    Cubic: {
        In: (k) => {
            return k * k * k;
        },
        Out: (k) => {
            return --k * k * k + 1;
        },
        InOut: (k) => {
            k *= 2;
            if (k < 1) {
                return 0.5 * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k + 2);
        },
    },
    Quartic: {
        In: (k) => {
            return k * k * k * k;
        },
        Out: (k) => {
            return 1 - (--k * k * k * k);
        },
        InOut: (k) => {
            k *= 2;
            if (k < 1) {
                return 0.5 * k * k * k * k;
            }
            return -0.5 * ((k -= 2) * k * k * k - 2);
        },
    },
    Quintic: {
        In: (k) => {
            return k * k * k * k * k;
        },
        Out: (k) => {
            return --k * k * k * k * k + 1;
        },
        InOut: (k) => {
            k *= 2;
            if (k < 1) {
                return 0.5 * k * k * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        },
    },
    Sinusoidal: {
        In: (k) => {
            return 1 - Math.cos(k * Math.PI / 2);
        },
        Out: (k) => {
            return Math.sin(k * Math.PI / 2);
        },
        InOut: (k) => {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        },
    },
    Exponential: {
        In: (k) => {
            return k === 0 ? 0 : Math.pow(1024, k - 1);
        },
        Out: (k) => {
            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
        },
        InOut: (k) => {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            k *= 2;
            if (k < 1) {
                return 0.5 * Math.pow(1024, k - 1);
            }
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        },
    },
    Circular: {
        In: (k) => {
            return 1 - Math.sqrt(1 - k * k);
        },
        Out: (k) => {
            return Math.sqrt(1 - (--k * k));
        },
        InOut: (k) => {
            k *= 2;
            if (k < 1) {
                return -0.5 * (Math.sqrt(1 - k * k) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        },
    },
    Elastic: {
        In: (k) => {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
        },
        Out: (k) => {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
        },
        InOut: (k) => {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            k *= 2;
            if (k < 1) {
                return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
            }
            return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
        },
    },
    Back: {
        In: (k) => {
            let s = 1.70158;
            return k * k * ((s + 1) * k - s);
        },
        Out: (k) => {
            let s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;
        },
        InOut: (k) => {
            let s = 1.70158 * 1.525;
            k *= 2;
            if (k < 1) {
                return 0.5 * (k * k * ((s + 1) * k - s));
            }
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        },
    },
    Bounce: {
        In: (k) => {
            return 1 - JMEasing.Bounce.Out(1 - k);
        },
        Out: (k) => {
            if (k < (1 / 2.75)) {
                return 7.5625 * k * k;
            }
            else if (k < (2 / 2.75)) {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            }
            else if (k < (2.5 / 2.75)) {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            }
            else {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }
        },
        InOut: (k) => {
            if (k < 0.5) {
                return JMEasing.Bounce.In(k * 2) * 0.5;
            }
            return JMEasing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
        },
    },
};
