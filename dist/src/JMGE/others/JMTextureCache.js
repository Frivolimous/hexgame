import * as PIXI from 'pixi.js';
export class JMTextureCache {
    constructor(renderer) {
        this.renderer = renderer;
        this.cache = {};
        this.addTextureFromGraphic = (id, graphic) => {
            let m = this.renderer.generateTexture(graphic);
            if (this.cache[id]) {
                console.warn('overwriting texture', id);
            }
            this.cache[id] = m;
            return m;
        };
        this.getTextureFromImage = (url) => {
            let m = PIXI.Texture.from(url);
            this.cache[url] = m;
            return m;
        };
        this.getTexture = (id) => {
            if (this.cache[id]) {
                return this.cache[id];
            }
            else {
                return PIXI.Texture.WHITE;
            }
        };
    }
}
