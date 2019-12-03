import { JMTextureCache } from './others/JMTextureCache';
import { InputManager } from './events/JMInputManager';
let initialized = false;
export let interactionMode = 'desktop';
export let sharedTextureCache;
export let inputManger;
export function setInteractionMode(s) {
    this.interactionMode = s;
}
export function init(app) {
    if (!initialized) {
        sharedTextureCache = new JMTextureCache(app.renderer);
        inputManger = new InputManager(app);
        initialized = true;
    }
}
