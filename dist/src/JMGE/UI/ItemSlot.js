import * as JMBUI from '../JMBUI';
export class ItemSlot extends JMBUI.InteractiveElement {
    constructor(index, location, type, options) {
        super(options || {});
        this.type = type;
        this.interactive = false;
    }
    check(item) {
        if (this.disabled) {
            return false;
        }
        if (this.type && item.type && this.type !== item.type) {
            return false;
        }
        // check type?
        return true;
    }
    toggleDisabled(b) {
        if (b) {
            this.setDisplayState(JMBUI.DisplayState.DARKENED);
            this.disabled = true;
        }
        else if (b === false) {
            this.setDisplayState(JMBUI.DisplayState.NORMAL);
            this.disabled = false;
        }
        else {
            this.toggleDisabled(!this.disabled);
        }
    }
}
