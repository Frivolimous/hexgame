import * as PIXI from 'pixi.js';
import { JMInteractionEvents } from "../JMInteractionEvents";
import { DragObject } from "./DragObject";
export class MouseObject extends PIXI.Point {
    constructor(config = {}) {
        super(config.x, config.y);
        //x,y;
        this.clickMode = false;
        this.down = false;
        this.ctrlKey = false;
        this.timerRunning = false;
        this.onUI = false;
        this.disabled = false;
        this.touchMode = false;
        // removeCanvas(){
        // 	this.canvas.off("mousedown",this.onDown);
        // 	this.canvas.off("mouseup",this.onUp);
        // 	this.canvas.off("mouseupoutside",this.onUp);
        // 	this.canvas.off("mousemove",this.onMove);
        // }
        this.enableTouchMode = () => {
            this.touchMode = true;
            this.canvas.removeListener("touchstart", this.enableTouchMode);
            this.canvas.addListener("mousedown", this.disableTouchMode);
            this.canvas.removeListener("pointerup", this.onUp);
            this.canvas.addListener("touchend", this.onUp);
        };
        this.disableTouchMode = () => {
            this.touchMode = false;
            this.canvas.removeListener("mousedown", this.disableTouchMode);
            this.canvas.addListener("touchstart", this.enableTouchMode);
            this.canvas.removeListener("touchend", this.onUp);
            this.canvas.addListener("pointerup", this.onUp);
        };
        this.startDrag = (target, onMove, onRelease, onDown, offset) => {
            target.selected = true;
            this.drag = new DragObject(target, onMove, onRelease, onDown, offset);
        };
        this.endDrag = () => {
            if (this.drag) {
                if (this.drag.release(this)) {
                    this.drag = null;
                }
            }
        };
        this.onDown = (e) => {
            this.onMove(e);
            this.down = true;
            if (this.disabled || this.timerRunning) {
                return;
            }
            if (this.drag) {
                if (this.drag.down && this.drag.down(this)) {
                    this.drag = null;
                }
            }
            else {
                if (this.clickMode) {
                    this.timerRunning = true;
                    setTimeout(() => {
                        this.timerRunning = false;
                        if (this.down) {
                            JMInteractionEvents.MOUSE_DOWN.publish(this);
                        }
                    }, MouseObject.HOLD);
                }
                else {
                    JMInteractionEvents.MOUSE_DOWN.publish(this);
                }
            }
        };
        this.onUp = (e) => {
            this.onMove(e);
            this.down = false;
            if (this.disabled) {
                return;
            }
            if (this.drag) {
                this.endDrag();
            }
            else {
                if (this.clickMode && this.timerRunning) {
                    JMInteractionEvents.MOUSE_CLICK.publish(this);
                }
                else {
                    JMInteractionEvents.MOUSE_UP.publish(this);
                }
            }
        };
        this.onMove = (e) => {
            this.target = e.target;
            if (e.target && e.target.isUI) {
                this.onUI = true;
            }
            else {
                this.onUI = false;
            }
            let point = e.data.getLocalPosition(this.canvas);
            if (this.locationFilter) {
                point = this.locationFilter(point, this.drag ? this.drag.object : null);
            }
            this.set(point.x, point.y);
            if (this.disabled) {
                return;
            }
            if (this.drag != null) {
                if (this.drag.move) {
                    this.drag.move(this);
                }
            }
            JMInteractionEvents.MOUSE_MOVE.publish(this);
        };
        this.down = config.down || false;
        this.drag = config.drag || null;
        this.id = config.id || 0;
    }
    addCanvas(canvas) {
        // if (this.canvas){
        // 	this.removeCanvas();
        // }
        this.canvas = canvas;
        // canvas.on("mousedown",this.onDown);
        // canvas.on("mouseup",this.onUp);
        // if (interactionMode=="desktop"){
        // 	window.addEventListener("pointerup",this.onMouseUp);
        // }else{
        // 	window.addEventListener("touchend",this.onMouseUp);
        // }
        // canvas.on("mouseupoutside",this.onUp);
        // canvas.on("mousemove",this.onMove);
        canvas.addListener("touchstart", this.enableTouchMode);
        canvas.addListener("pointerdown", this.onDown);
        canvas.addListener("pointermove", this.onMove);
        canvas.addListener("pointerup", this.onUp);
        canvas.addListener("pointerupoutside", this.onUp);
    }
}
MouseObject.HOLD = 200;
