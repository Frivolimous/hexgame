export const JMTicker = {
    prevTime: -1,
    tickEvents: [],
    active: false,
    add: (output) => {
        JMTicker.tickEvents.push(output);
        if (!JMTicker.active) {
            JMTicker.active = true;
            requestAnimationFrame(JMTicker.onTick);
        }
    },
    addOnce: (output) => {
        let m = () => {
            JMTicker.remove(m);
            output();
        };
        JMTicker.tickEvents.push(m);
    },
    remove: (output) => {
        let i = JMTicker.tickEvents.indexOf(output);
        if (i >= 0) {
            JMTicker.tickEvents.splice(i, 1);
        }
    },
    clear: () => {
        JMTicker.tickEvents = [];
    },
    onTick: (time) => {
        let ms;
        if (JMTicker.prevTime < 0) {
            ms = 0;
        }
        else {
            ms = time - JMTicker.prevTime;
        }
        JMTicker.prevTime = time;
        if (JMTicker.tickEvents.length === 0) {
            JMTicker.active = false;
            JMTicker.prevTime = -1;
        }
        else {
            JMTicker.tickEvents.forEach(output => output(ms));
            requestAnimationFrame(JMTicker.onTick);
        }
    },
};
