import * as JMBUI from '../JMBUI';
export class ItemObject extends JMBUI.InteractiveElement {
    constructor(data, config) {
        super(config);
        this.index = -1;
        this.data = data;
        this.buttonMode = true;
        this.draggable = true;
    }
    update(data) {
        this.data = data;
    }
    get tooltipName() {
        return '';
    }
    get tooltipDesc() {
        return '';
    }
}
