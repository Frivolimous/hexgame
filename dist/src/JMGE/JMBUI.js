import * as PIXI from 'pixi.js';
import * as JMBL from './JMBL';
import * as _ from 'lodash';
import { JMTween } from './JMTween';
import { JMTicker } from './events/JMTicker';
export var DisplayState;
(function (DisplayState) {
    DisplayState[DisplayState["NORMAL"] = 0] = "NORMAL";
    DisplayState[DisplayState["DARKENED"] = 1] = "DARKENED";
    DisplayState[DisplayState["BLACKENED"] = 2] = "BLACKENED";
    DisplayState[DisplayState["GREYED"] = 3] = "GREYED";
    DisplayState[DisplayState["BRIGHTENED"] = 4] = "BRIGHTENED";
})(DisplayState || (DisplayState = {}));
export const UICONFIG = {
    CLICK_DELAY: 200,
};
export class BasicElement extends PIXI.Container {
    constructor(options) {
        super();
        this.options = options;
        this.isUI = true;
        this.graphics = new PIXI.Graphics;
        this.baseTint = 0xffffff;
        this.getWidth = () => {
            return this.graphics.width;
        };
        this.getHeight = () => {
            return this.graphics.height;
        };
        options = options || {};
        this.addChild(this.graphics);
        if (options.width != null) {
            this.graphics.beginFill(options.fill || 0xffffff);
            if (options.rounding != null) {
                this.graphics.drawRoundedRect(0, 0, options.width, options.height, options.rounding);
            }
            else {
                this.graphics.drawRect(0, 0, options.width, options.height);
            }
            this.graphics.alpha = options.alpha == null ? 1 : options.alpha;
            this.graphics.tint = this.baseTint = options.bgColor || 0x808080;
        }
        this.x = options.x || 0;
        this.y = options.y || 0;
        if (options.label != null) {
            this.addLabel(options.label, options.labelStyle);
        }
    }
    addLabel(s, style) {
        if (this.label) {
            this.label.text = s;
            if (style)
                this.label.style = new PIXI.TextStyle(style);
            this.label.scale.set(1, 1);
        }
        else {
            this.label = new PIXI.Text(s, style || {});
            this.addChild(this.label);
        }
        if (this.label.width > this.graphics.width * 0.9) {
            this.label.width = this.graphics.width * 0.9;
        }
        this.label.scale.y = this.label.scale.x;
        this.label.x = (this.getWidth() - this.label.width) / 2;
        this.label.y = (this.getHeight() - this.label.height) / 2;
    }
    colorFlash(color, timeUp, wait, timeDown) {
        if (this.flashing)
            return;
        this.flashing = true;
        new JMTween(this.graphics).colorTo({ tint: color }).over(timeUp).onComplete(() => {
            new JMTween(this.graphics).wait(wait).to({ tint: this.baseTint }).over(timeDown).onComplete(() => {
                this.flashing = false;
            }).start();
        }).start();
    }
    highlight(b) {
        if (b) {
            if (this._Highlight)
                return;
            this._Highlight = new PIXI.Graphics();
            this._Highlight.lineStyle(3, 0xffff00);
            this._Highlight.drawRect(0, 0, this.getWidth(), this.getHeight());
            this._HighlightTween = new JMTween(this._Highlight, 500).to({ alpha: 0 }).yoyo().start();
            this.addChild(this._Highlight);
        }
        else {
            if (this._HighlightTween) {
                this._HighlightTween.stop();
                this._HighlightTween = null;
            }
            if (this._Highlight) {
                this._Highlight.destroy();
                this._Highlight = null;
            }
        }
    }
}
export class InteractiveElement extends BasicElement {
    constructor(options) {
        super(options);
        this.setDisplayState = (_state) => {
            if (this.displayState == _state)
                return;
            this.displayState = _state;
            switch (_state) {
                case DisplayState.DARKENED:
                    this.overlay.tint = 0;
                    this.overlay.alpha = 0.5;
                    this.addChild(this.overlay);
                    break;
                case DisplayState.BLACKENED:
                    this.overlay.tint = 0;
                    this.overlay.alpha = 0.8;
                    this.addChild(this.overlay);
                    break;
                case DisplayState.GREYED:
                    this.overlay.tint = 0x999999;
                    this.overlay.alpha = 0.5;
                    this.addChild(this.overlay);
                    break;
                case DisplayState.BRIGHTENED:
                    this.overlay.tint = 0xffffff;
                    this.overlay.alpha = 0.3;
                    this.addChild(this.overlay);
                    break;
                case DisplayState.NORMAL:
                default:
                    this.overlay.alpha = 0;
            }
        };
        this.overlay = new PIXI.Graphics();
        this.overlay.beginFill(0xffffff);
        this.overlay.drawRect(0, 0, this.graphics.width, this.graphics.height);
        options = options || {};
        this.interactive = true;
        if (options.downFunction != null) {
            this.downFunction = options.downFunction;
            this.on("pointerdown", this.downFunction);
        }
        options.displayState = options.displayState || DisplayState.NORMAL;
        this.setDisplayState(options.displayState);
    }
    get selected() {
        return this._Selected;
    }
    set selected(b) {
        if (b) {
            if (this.selectRect == null) {
                this.selectRect = new PIXI.Graphics;
                this.selectRect.lineStyle(3, 0xffff00);
                this.selectRect.drawRect(this.graphics.x, this.graphics.y, this.graphics.width, this.graphics.height);
            }
            this.addChild(this.selectRect);
        }
        else {
            if (this.selectRect != null && this.selectRect.parent != null)
                this.selectRect.parent.removeChild(this.selectRect);
        }
        this._Selected = b;
    }
}
export class Button extends InteractiveElement {
    constructor(options) {
        super(_.defaults(options, {
            x: 50, y: 50, width: 200, height: 50, bgColor: 0x8080ff,
        }));
        this.downOnThis = false;
        this.timeout = null;
        this.output = options.output;
        this.onOut = options.onOut;
        this.onOver = options.onOver;
        this.buttonMode = true;
        if (JMBL.interactionMode === "desktop") {
            this.addListener("pointerover", (e) => {
                if (!this.disabled) {
                    this.setDisplayState(DisplayState.DARKENED);
                    if (this.onOver) {
                        this.onOver();
                    }
                }
            });
            this.addListener("pointerout", (e) => {
                if (!this.disabled) {
                    this.setDisplayState(DisplayState.NORMAL);
                    if (this.onOut) {
                        this.onOut();
                    }
                }
                this.downOnThis = false;
            });
            //JMBL.events.add(JMBL.EventType.MOUSE_DOWN,(e:any)=>{
            this.addListener("pointerdown", () => {
                if (!this.disabled)
                    this.setDisplayState(DisplayState.BRIGHTENED);
                this.downOnThis = true;
                if (this.timeout === false) {
                    this.timeout = true;
                    window.setTimeout(() => { this.timeout = false; }, UICONFIG.CLICK_DELAY);
                }
            });
            //JMBL.events.add(JMBL.EventType.MOUSE_UP,(e:any)=>{
            this.addListener("pointerup", () => {
                if (!this.disabled)
                    this.setDisplayState(DisplayState.DARKENED);
                if (this.downOnThis && !this.disabled && this.output != null && this.timeout !== false)
                    this.output();
                this.downOnThis = false;
            });
        }
        else {
            //JMBL.events.add(JMBL.EventType.MOUSE_UP,(e:any)=>{
            this.addListener("touchend", () => {
                if (!this.disabled && this.output != null)
                    this.output();
            });
        }
    }
    get disabled() {
        return this._Disabled;
    }
    set disabled(b) {
        this._Disabled = b;
        if (b) {
            this.setDisplayState(DisplayState.BLACKENED);
        }
        else {
            this.setDisplayState(DisplayState.NORMAL);
        }
    }
}
export class HorizontalStack extends PIXI.Container {
    constructor(width = -1) {
        super();
        this.padding = 5;
    }
    addElement(v) {
        this.addChild(v);
    }
    alignAll() {
        let children = this.children;
        // let totalWidth:number=-this.padding;
        // for (let i=0;i<children.length;i++){
        // 	totalWidth+=children[i].getWidth();
        // 	totalWidth+=this.padding;
        // }
        let cX = 0;
        for (let i = 0; i < children.length; i++) {
            children[i].x = cX;
            cX += children[i].width + this.padding;
        }
    }
}
export class ClearButton extends InteractiveElement {
    constructor(options) {
        super(_.defaults(options, {
            bgColor: 0x00ff00,
            alpha: 0.01,
            width: 190,
            height: 50,
            x: 0,
            y: 0,
        }));
        this.buttonMode = true;
    }
}
export class SelectButton extends Button {
    constructor(index, selectList, selectFunction, options = null) {
        super(options);
        this.index = index;
        this.myList = selectList;
        this.output = this.selectThis;
        this.selectFunction = selectFunction;
    }
    selectThis() {
        if (this.selected)
            return;
        for (var i = 0; i < this.myList.length; i += 1) {
            this.myList[i].selected = this.myList[i] === this;
        }
        this.selectFunction(this.index);
    }
}
export class MaskedWindow extends BasicElement {
    constructor(container, options) {
        super(options);
        this.mask = new PIXI.Graphics;
        this.objects = [];
        this.offset = 0;
        this.goalY = 1;
        this.scrollbar = null;
        this.vY = 0;
        this.sortMargin = 5;
        this.dragging = false;
        this.scrollHeight = 0;
        this.horizontal = false;
        this.addScrollbar = (_scrollbar) => {
            this.scrollbar = _scrollbar;
            _scrollbar.output = this.setScroll;
        };
        this.onWheel = (e) => {
            if (e.mouse.x > this.x && e.mouse.x < this.x + this.mask.width && e.mouse.y > this.y && e.mouse.y < this.y + this.mask.height) {
                this.vY -= e.delta * 0.008;
            }
        };
        this.setScroll = (p) => {
            if (this.horizontal) {
                if (this.scrollHeight > this.mask.width) {
                    this.container.x = p * (this.mask.width - this.scrollHeight);
                    if (this.container.x > 0)
                        this.container.x = 0;
                    if (this.container.x < this.mask.width - this.scrollHeight)
                        this.container.x = this.mask.width - this.scrollHeight;
                }
                else {
                    this.container.x = 0;
                }
            }
            else {
                if (this.scrollHeight > this.mask.height) {
                    this.container.y = p * (this.mask.height - this.scrollHeight);
                    if (this.container.y > 0)
                        this.container.y = 0;
                    if (this.container.y < this.mask.height - this.scrollHeight)
                        this.container.y = this.mask.height - this.scrollHeight;
                }
                else {
                    this.container.y = 0;
                }
            }
        };
        this.getRatio = () => {
            if (this.horizontal) {
                return Math.min(1, this.mask.width / this.scrollHeight);
            }
            else {
                return Math.min(1, this.mask.height / this.scrollHeight);
            }
        };
        this.update = () => {
            if (this.horizontal) {
                if (this.goalY <= 0) {
                    this.vY = (this.goalY - this.container.x) / 4;
                }
                if (this.vY != 0) {
                    if (Math.abs(this.vY) < 0.1)
                        this.vY = 0;
                    else {
                        let _y = this.container.x + this.vY;
                        _y = Math.min(0, Math.max(_y, this.mask.width - this.scrollHeight));
                        this.vY *= 0.95;
                        if (this.scrollbar != null)
                            this.scrollbar.setPosition(_y / (this.mask.width - this.scrollHeight));
                        else
                            this.setScroll(_y / (this.mask.width - this.scrollHeight));
                    }
                }
            }
            else {
                if (this.goalY <= 0) {
                    this.vY = (this.goalY - this.container.y) / 4;
                }
                if (this.vY != 0) {
                    if (Math.abs(this.vY) < 0.1)
                        this.vY = 0;
                    else {
                        let _y = this.container.y + this.vY;
                        _y = Math.min(0, Math.max(_y, this.mask.height - this.scrollHeight));
                        this.vY *= 0.95;
                        if (this.scrollbar != null)
                            this.scrollbar.setPosition(_y / (this.mask.height - this.scrollHeight));
                        else
                            this.setScroll(_y / (this.mask.height - this.scrollHeight));
                    }
                }
            }
        };
        this.addObject = (_object) => {
            this.objects.push(_object);
            _object.x -= this.x - this.container.x;
            _object.y -= this.y - this.container.y;
            this.container.addChild(_object);
            if (this.autoSort)
                this.sortObjects();
        };
        this.removeObject = (_object) => {
            for (var i = 0; i < this.objects.length; i += 1) {
                if (this.objects[i] == _object) {
                    this.removeObjectAt(i);
                    return;
                }
            }
        };
        this.removeObjectAt = (i) => {
            this.container.removeChild(this.objects[i]);
            this.objects.splice(i, 1);
            if (this.autoSort)
                this.sortObjects();
        };
        this.sortObjects = () => {
            this.scrollHeight = this.sortMargin;
            for (var i = 0; i < this.objects.length; i += 1) {
                if (this.horizontal) {
                    this.objects[i].x = this.scrollHeight;
                    //this.objects[i].x=this.objects[i].graphics.width/2;
                    this.objects[i].timeout = false;
                    this.objects[i].y = 0;
                    this.scrollHeight += this.objects[i].graphics.width + this.sortMargin;
                }
                else {
                    this.objects[i].y = this.scrollHeight;
                    //this.objects[i].x=this.objects[i].graphics.width/2;
                    this.objects[i].timeout = false;
                    this.objects[i].x = 0;
                    this.scrollHeight += this.objects[i].graphics.height + this.sortMargin;
                }
            }
        };
        options = options || {};
        if (container) {
            this.container = container;
        }
        else {
            this.container = new PIXI.Sprite;
        }
        this.addChild(this.container);
        this.addChild(this.mask);
        this.mask.beginFill(0);
        this.mask.drawRect(0, 0, options.width || 50, options.height || 100);
        this.autoSort = options.autoSort || false;
        this.interactive = true;
        this.sortMargin = options.sortMargin || 5;
        this.horizontal = options.horizontal;
        this.on("mousedown", (e) => {
            console.log('down');
            // if (e.target !== this) {
            //   return;
            // }
            let point = e.data.getLocalPosition(this);
            if (this.horizontal) {
                this.offset = point.x - this.x - this.container.x;
            }
            else {
                this.offset = point.y - this.y - this.container.y;
            }
            this.dragging = true;
        });
        this.on("mouseup", () => {
            this.goalY = 1;
            this.dragging = false;
        });
        this.on("mouseupoutside", () => {
            this.goalY = 1;
            this.dragging = false;
        });
        this.on("mousemove", (e) => {
            let point = e.data.getLocalPosition(this);
            if (this.dragging) {
                if (this.horizontal) {
                    this.goalY = point.x - this.x - this.offset;
                    this.vY = (this.goalY - this.container.x) / 4;
                }
                else {
                    this.goalY = point.y - this.y - this.offset;
                    this.vY = (this.goalY - this.container.y) / 4;
                }
            }
        });
        JMTicker.add(this.update);
        //JMBL.events.add(JMBL.EventType.MOUSE_WHEEL,this.onWheel);
    }
    updateScrollHeight() {
        if (this.horizontal) {
            this.scrollHeight = this.container.getWidth();
        }
        else {
            this.scrollHeight = this.container.getHeight();
        }
    }
}
export class Gauge extends BasicElement {
    constructor(color = 0x00ff00, options = {}) {
        super(_.defaults(options, {
            width: 100, height: 20, bgColor: 0x101010
        }));
        this.front = new PIXI.Graphics();
        this.front.beginFill(color);
        this.front.drawRect(this.graphics.x, this.graphics.y, this.graphics.width, this.graphics.height);
        this.addChild(this.front);
    }
    setValue(value, max = -1) {
        if (max >= 1)
            this.max = max;
        this.value = value;
        this.percent = this.value / this.max;
        this.front.width = Math.floor(Math.max(1, Math.min(this.percent * this.graphics.width, this.graphics.width)));
    }
    setMax(max) {
        if (max >= 1)
            this.max = max;
        this.percent = this.value / this.max;
        this.front.width = Math.floor(Math.max(1, Math.min(this.percent * this.graphics.width, this.graphics.width)));
    }
}
export class Scrollbar extends BasicElement {
    constructor(options) {
        super(_.defaults(options, {
            x: 100, y: 50, width: 10, height: 100, rounding: 5, bgColor: 0x404080, horizontal: false,
        }));
        this.mover = new PIXI.Graphics();
        this.topY = 0;
        this.bottomY = 40;
        this.offset = 0;
        this.horizontal = false;
        this.drawMover = (p) => {
            //p = 0-1
            p = Math.min(1, Math.max(0, p));
            if (p >= 1)
                this.visible = false;
            else
                this.visible = true;
            this.mover.clear();
            this.mover.beginFill(this.moverColor);
            if (this.horizontal) {
                this.mover.drawRoundedRect(0, 0, p * this.graphics.width, this.graphics.height, this.graphics.height / 2);
                this.bottomY = this.graphics.width - this.mover.width;
            }
            else {
                this.mover.drawRoundedRect(0, 0, this.graphics.width, p * this.graphics.height, this.graphics.width / 2);
                this.bottomY = this.graphics.height - this.mover.height;
            }
        };
        this.setPosition = (p) => {
            if (this.horizontal) {
                let _x = p * (this.bottomY - this.topY) + this.topY;
                this.mover.x = _x;
            }
            else {
                let _y = p * (this.bottomY - this.topY) + this.topY;
                this.mover.y = _y;
            }
            if (this.output != null)
                this.output(p);
        };
        this.getPosition = () => {
            //returns 0-1
            if (this.horizontal) {
                return (this.mover.x - this.topY) / (this.bottomY - this.topY);
            }
            else {
                return (this.mover.y - this.topY) / (this.bottomY - this.topY);
            }
        };
        this.startMove = (e) => {
            if (this.horizontal) {
                this.offset = e.x - this.x - this.mover.x;
            }
            else {
                this.offset = e.y - this.y - this.mover.y;
            }
            this.dragging = true;
        };
        this.addChild(this.mover);
        this.output = options.output;
        this.horizontal = options.horizontal;
        this.interactive = true;
        this.buttonMode = true;
        this.moverColor = options.moverColor || 0x333333;
        this.ratio = options.ratio || 0.5;
        this.drawMover(this.ratio);
        this.setPosition(options.position || 0);
        this.on("mousedown", (e) => {
            let point = e.data.getLocalPosition(this);
            this.dragging = true;
            if (this.horizontal) {
                this.offset = point.x - this.x - this.mover.x;
            }
            else {
                this.offset = point.y - this.y - this.mover.y;
            }
        });
        this.on("mouseup", () => {
            this.dragging = false;
        });
        this.on("mouseupoutside", () => {
            this.dragging = false;
        });
        this.on("mousemove", (e) => {
            if (this.dragging) {
                //this.mover.y=e.mouse.y-this.y-this.offsetY;
                let point = e.data.getLocalPosition(this);
                if (this.horizontal) {
                    let _x = point.x - this.x - this.offset;
                    _x = Math.max(_x, this.topY);
                    _x = Math.min(_x, this.bottomY);
                    this.mover.x = _x;
                }
                else {
                    let _y = point.y - this.y - this.offset;
                    _y = Math.max(_y, this.topY);
                    _y = Math.min(_y, this.bottomY);
                    this.mover.y = _y;
                }
                if (this.output)
                    this.output(this.getPosition());
            }
        });
    }
}
