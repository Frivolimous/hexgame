import { JMEventListener } from './JMEventListener';
export const JMInteractionEvents = {
    MOUSE_MOVE: new JMEventListener(),
    MOUSE_DOWN: new JMEventListener(),
    MOUSE_UP: new JMEventListener(),
    MOUSE_CLICK: new JMEventListener(),
    MOUSE_WHEEL: new JMEventListener(),
    KEY_DOWN: new JMEventListener(),
    KEY_UP: new JMEventListener(),
    UI_OVER: new JMEventListener(),
    UI_OFF: new JMEventListener(),
    WINDOW_RESIZE: new JMEventListener(),
};
