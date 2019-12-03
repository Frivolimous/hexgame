import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'q':
            HexConfig.DECAY += 0.1;
            break;
        case 'a':
            HexConfig.DECAY -= 0.1;
            break;
        case 'w':
            HexConfig.TRANS += 0.01;
            break;
        case 's':
            HexConfig.TRANS -= 0.01;
            break;
        case 'p':
            console.log(HexConfig);
            break;
    }
});
export const HexConfig = {
    DECAY: 0.95,
    TRANS: 0.28,
    EQ: 100,
    PATH: 0.1,
    GI: 255,
    RI: 255,
    BI: 100,
    GREY: 0,
};
export class HexTile extends PIXI.Sprite {
    constructor() {
        super(...arguments);
        this.connections = [];
        this.nr = 0;
        this.og = 0;
        this.ob = 0;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.fb = false;
        this.fg = false;
        this.fr = false;
        this.oh = 0;
        this.h = 0;
        this.adjustValues = (equal) => {
            this.adjustBlueValue();
            if (equal) {
                this.adjustRefgreenEqual();
            }
            else {
                this.adjustGreenValue();
                this.adjustRedValue();
            }
            this.updateTint();
        };
        this.adjustBlueValue = () => {
            this.ob = this.b;
            if (!this.fb) {
                this.connections.forEach(tile => {
                    if (tile.ob > this.ob && tile.ob > HexConfig.EQ)
                        this.b += Math.min(tile.ob - HexConfig.EQ, tile.ob - this.ob) * HexConfig.TRANS;
                    if (tile.ob < this.ob && tile.ob < HexConfig.EQ)
                        this.b += Math.max(tile.ob - HexConfig.EQ, tile.ob - this.ob) * HexConfig.TRANS;
                });
                this.b = HexConfig.EQ + (this.b - HexConfig.EQ) * HexConfig.DECAY;
            }
        };
        this.adjustRefgreenEqual = () => {
            this.nr = this.r;
            this.og = this.g;
            this.connections.forEach(tile => {
                if (tile.nr > this.nr && tile.nr > HexConfig.EQ)
                    this.r += Math.min(tile.nr - HexConfig.EQ, tile.nr - this.nr) * HexConfig.TRANS;
                if (tile.nr < this.nr && tile.nr < HexConfig.EQ)
                    this.r += Math.max(tile.nr - HexConfig.EQ, tile.nr - this.nr) * HexConfig.TRANS;
            });
            this.r = HexConfig.EQ + (this.r - HexConfig.EQ) * HexConfig.DECAY;
            this.connections.forEach(tile => {
                if (tile.og > this.og && tile.og > HexConfig.EQ)
                    this.g += Math.min(tile.og - HexConfig.EQ, tile.og - this.og) * HexConfig.TRANS;
                if (tile.og < this.og && tile.og < HexConfig.EQ)
                    this.g += Math.max(tile.og - HexConfig.EQ, tile.og - this.og) * HexConfig.TRANS;
            });
            this.g = HexConfig.EQ + (this.g - HexConfig.EQ) * HexConfig.DECAY;
        };
        this.adjustGreenValue = () => {
            this.og = this.g;
            this.oh = this.h;
            if (!this.fg) {
                let hs = _.map(this.connections, tile => tile.oh);
                let minH = _.min(hs);
                let b = _.clamp(this.ob, 0, 0xFF);
                this.h = minH + HexConfig.PATH + b / 0xFF;
            }
            if (HexTile.MAX_H === 0) {
                this.g = 0;
            }
            else {
                this.g = this.h / HexTile.MAX_H * 0xFF;
            }
        };
        this.adjustRedValue = () => {
            if (this.r > 0) {
                let hs = _.map(this.connections, tile => tile.oh);
                let lowestI = this.indexOfSmallest(hs);
                let lowest = this.connections[lowestI];
                if (lowest.oh >= this.oh) {
                    if (!this.fr) {
                        this.r = 0;
                    }
                    return;
                }
                if (!this.fr) {
                    lowest.nr += this.r;
                    this.r = 0;
                }
                else {
                    lowest.nr += this.nr;
                    this.nr = this.r;
                }
            }
            if (!this.fr) {
                this.r = this.nr;
                this.nr = 0;
            }
        };
    }
    // constructor(texture: PIXI.Texture) {
    //   super(texture);
    // }
    import(tile) {
        this.r = tile.r;
        this.g = tile.g;
        this.b = tile.b;
        this.h = tile.h;
        this.fb = tile.fb || false;
        this.fg = tile.fg || false;
        this.fr = tile.fr || false;
    }
    reset() {
        this.nr = 0;
        this.og = 0;
        this.ob = 0;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.fb = false;
        this.fg = false;
        this.fr = false;
        this.oh = 0;
        this.h = 0;
    }
    indexOfSmallest(a) {
        var lowest = 0;
        for (var i = 1; i < a.length; i++) {
            if (a[i] < a[lowest])
                lowest = i;
        }
        return lowest;
    }
    updateTint() {
        if (HexConfig.GREY) {
            let w = Math.round((this.r * HexConfig.RI + this.g * HexConfig.GI + this.b * HexConfig.BI) / (HexConfig.RI + HexConfig.GI + HexConfig.BI));
            this.tint = 0x010000 * w + 0x0100 * w + w;
        }
        else {
            let r = _.clamp(Math.round(this.r * HexConfig.RI / 0xFF), 0, 0xFF);
            let g = _.clamp(Math.round(this.g * HexConfig.GI / 0xFF), 0, 0xFF);
            let b = _.clamp(Math.round(this.b * HexConfig.BI / 0xFF), 0, 0xFF);
            this.tint = 0x010000 * r + 0x0100 * g + b;
        }
    }
}
HexTile.MAX_H = 0;
