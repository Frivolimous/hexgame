import { JMInteractionEvents } from "./JMInteractionEvents";
import { MouseObject } from "./objects/MouseObject";
export class InputManager {
    constructor(app) {
        this.app = app;
        this.MOUSE_HOLD = 200;
        this.onWheel = (e) => {
            JMInteractionEvents.MOUSE_WHEEL.publish({ mouse: this.mouse, deltaY: e.deltaY });
        };
        this.onKeyDown = (e) => {
            //if (external keyboard override) dothat;
            switch (e.key) {
                case "a":
                case "A": break;
                case "Control":
                    this.mouse.ctrlKey = true;
                    break;
            }
            JMInteractionEvents.KEY_DOWN.publish({ key: e.key });
        };
        this.onKeyUp = (e) => {
            switch (e.key) {
                case "Control":
                    this.mouse.ctrlKey = false;
                    break;
            }
            JMInteractionEvents.KEY_UP.publish({ key: e.key });
        };
        this.mouse = new MouseObject();
        this.mouse.addCanvas(app.stage);
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("mousewheel", this.onWheel);
    }
}
