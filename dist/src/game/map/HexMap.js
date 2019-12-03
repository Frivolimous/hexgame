import * as PIXI from 'pixi.js';
import { TextureData } from '../../utils/TextureData';
import { HexTile } from './HexTile';
// export class HexMap extends PIXI.Container {
export class HexMap extends PIXI.ParticleContainer {
    constructor(config) {
        super(100000, { position: true, tint: true });
        this.config = config;
        this.tiles = [];
        this.root23 = Math.sqrt(2 / 3);
        // this.visible = false;
        // super();
        let perAcross = config.scale * 100;
        let perDown = config.scale * this.root23 * 100;
        for (let y = 0; y < config.down; y++) {
            for (let x = 0; x < config.across; x++) {
                let tile = new HexTile(TextureData.hex);
                tile.scale.set(config.scale);
                tile.position.set((x + (y % 2 === 0 ? 0.5 : 0)) * perAcross, y * perDown);
                this.addChild(tile);
                let i = y * config.across + x;
                this.tiles[i] = tile;
                if (i >= config.across) {
                    if (y % 2 === 0) {
                        this.connectTiles(tile, this.tiles[i - config.across]);
                        if ((i - config.across) % config.across !== config.across - 1) {
                            this.connectTiles(tile, this.tiles[i - config.across + 1]);
                        }
                    }
                    else {
                        this.connectTiles(tile, this.tiles[i - config.across]);
                        if ((i - config.across) % config.across !== 0) {
                            this.connectTiles(tile, this.tiles[i - config.across - 1]);
                        }
                    }
                }
                if (i % config.across !== 0) {
                    this.connectTiles(tile, this.tiles[i - 1]);
                }
            }
        }
    }
    getWidth() {
        return (this.config.across + 0.5) * this.config.scale * 100;
    }
    getHeight() {
        return (this.config.down + 0.5) * this.config.scale * 100 * this.root23;
    }
    connectTiles(tile1, tile2) {
        tile1.connections.push(tile2);
        tile2.connections.push(tile1);
    }
    getTileAt(pos) {
        let y = Math.floor(pos.y / this.config.scale / 100 / this.root23);
        let x = Math.floor(pos.x / this.config.scale / 100 - (y % 2 === 0 ? 0.5 : 0));
        return this.tiles[y * this.config.across + x];
    }
    makePathPriority(start) {
        this.start = start;
    }
}
