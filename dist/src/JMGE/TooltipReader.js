import * as PIXI from 'pixi.js';
import { TooltipPopup } from './UI/TooltipPopup';
export class TooltipReader {
    constructor(stage, borders) {
        this.stage = stage;
        this.borders = borders;
        this.mouseMove = (e) => {
            let target = e.target;
            if (!target)
                return;
            if (target !== this.currentTarget && target !== this.currentTooltip) {
                if (this.currentTooltip) {
                    this.currentTooltip.destroy();
                }
                if (target.tooltip) {
                    let tooltip = target.tooltip;
                    this.currentTooltip = new TooltipPopup(tooltip.title, tooltip.description);
                    this.stage.addChild(this.currentTooltip);
                    if (tooltip.fixedPosition) {
                        this.currentTooltip.position.set(tooltip.fixedPosition.x, tooltip.fixedPosition.y);
                    }
                    else {
                        let position = this.stage.toLocal(target, target.parent);
                        let width = (target.getWidth ? target.getWidth() : target.width) || 0;
                        let height = (target.getHeight ? target.getHeight() : target.height) || 0;
                        let rect = new PIXI.Rectangle(position.x, position.y, width, height);
                        this.currentTooltip.reposition(rect, this.borders);
                    }
                }
            }
        };
        stage.addListener('mousemove', this.mouseMove);
    }
    static addTooltip(object, tooltip) {
        object.interactive = true;
        object.tooltip = tooltip;
    }
    destroy() {
    }
}
