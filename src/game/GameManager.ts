
import { CONFIG } from '../Config';
import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import { JMInteractionEvents, IKeyboardEvent, IResizeEvent } from '../JMGE/events/JMInteractionEvents';
import { GameEvents } from '../utils/GameEvents';
import { HexMap } from './map/HexMap';
import { HexConfig, HexTile } from './map/HexTile';
import { LEVEL_DATA, ITileData } from '../data/LevelData';
import { logObjectArray, logObject } from '../JMGE/others/Logger';

export class GameManager {
  public running = true;
  public interactive = true;

  public display = new  PIXI.Container();

  private hexMap: HexMap;
  private spawnTile: HexTile;

  private background: PIXI.Graphics;

  constructor(private levelIndex: number = 0, private difficulty: number = 1) {
    this.background = new PIXI.Graphics();
    this.display.addChild(this.background);
    
    this.display.interactive = true;

    switch(levelIndex) {
      case 0: this.initBurst(); break;
      default: this.initLevel(levelIndex); break;
    }
  }

  public positionElements = (e: IResizeEvent) => {
    this.background.clear();
    this.background.beginFill(0, 0.01);
    this.background.drawRect(e.outerBounds.x, e.outerBounds.y, e.outerBounds.width, e.outerBounds.height);
  }

  public initBurst = () => {
    _.assign(HexConfig,{
      DECAY: 0.95,
      TRANS: 0.28,
      EQ: 0,
      PATH: 0.1,
      GI: 0,
      RI: 255,
      BI: 255,
      GREY: 0,
    });
    // delete HexConfig.GI;
    // delete HexConfig.EQ;
    this.hexMap = new HexMap({ across: 100, down: 100, scale: 0.08});
    this.display.addChild(this.hexMap);
    this.display.addListener("pointerdown", this.mouseDownBurst);
    this.display.addListener("pointerup", this.mouseUp);
    this.display.addListener("pointermove", this.mouseMove);
    GameEvents.ticker.add(this.onTickBurst);
  }

  public initLevel = (index: number) => {
    let level = LEVEL_DATA[index];
    _.assign(HexConfig,level.hexConfig);
    this.hexMap = new HexMap(level.mapConfig);
    level.tiles.forEach(tile => {
      this.hexMap.tiles[tile.index].import(tile);
      if (tile.start) {
        this.spawnTile = this.hexMap.tiles[tile.index];
      }
    })
    this.display.addChild(this.hexMap);

    this.display.addListener("pointerdown", this.mouseDownLevel);
    this.display.addListener("pointerup", this.mouseUp);
    this.display.addListener("pointermove", this.mouseMove);
    GameEvents.ticker.add(this.onTickLevel);
  }

  public logTileData() {
    let tiles: ITileData[] = [];
    this.hexMap.tiles.forEach((tile, index) => {
      let data: ITileData = {index};
      if (tile.fb) {
        data.fb = true;
        data.b = tile.b;
      }
      if (tile.fr) {
        data.fr = true;
        data.r = tile.r;
      }
      if (tile.fg) {
        data.fg = true;
        data.g = tile.g;
        data.h = tile.h;
      }
      if (tile === this.spawnTile) {
        data.start = true;
      }
      if (Object.keys(data).length > 1) {
        tiles.push(data);
      }
    });
    logObjectArray(tiles);
    logObject(HexConfig);
  }

  public dispose = () => {
    console.log('dispose');
    GameEvents.ticker.remove(this.onTickLevel);
    GameEvents.ticker.remove(this.onTickBurst);
    this.display.destroy();
  }

  isMouseDown = false;
  lastLoc: PIXI.Point;

  public mouseDownBurst = (e: PIXI.interaction.InteractionEvent) => {
    this.isMouseDown = true;
    this.lastLoc = e.data.getLocalPosition(this.display);
  }

  public mouseDownLevel = (e: PIXI.interaction.InteractionEvent) => {
    this.isMouseDown = true;
    this.lastLoc = e.data.getLocalPosition(this.display);
    let tile = this.hexMap.getTileAt(this.lastLoc);
    if (tile) {
      if (e.data.originalEvent.ctrlKey) {
        tile.r = 150;
        tile.b = 255;
        tile.fb = !tile.fb;
        tile.fr = !tile.fr;
        this.spawnTile = tile;
      } else if (e.data.originalEvent.altKey) {
        tile.g = 0;
        tile.h = 0;
        tile.b = 0;
        tile.fb = !tile.fb;
        tile.fg = !tile.fg;
      } else if (e.data.originalEvent.shiftKey) {
        tile.b = 25;
        tile.fb = !tile.fb;
      } else {
        tile.b = 200;
        tile.fb = !tile.fb;
      }
    }
  }
  public mouseUp = (e: PIXI.interaction.InteractionEvent) => {
    this.isMouseDown = false;
  }
  public mouseMove = (e: PIXI.interaction.InteractionEvent) => {
    this.lastLoc = e.data.getLocalPosition(this.hexMap);
  }

  spawnTick = 0;
  public onTickLevel = (ms: number) => {
    this.hexMap.tiles.forEach(tile => {
      tile.adjustValues(false);
    });

    HexTile.MAX_H = _.max(_.map(this.hexMap.tiles, tile => tile.h));

    this.spawnTick--;
    if (this.spawnTile && this.spawnTick < 0) {
      this.spawnTick = SPAWN_FREQ;
      let tile = this.spawnTile;
      tile.nr += 200;
      // let tile = _.sample(this.hexMap.tiles);
      // tile.r += 255;
      // tile.g += 255;
      // tile.b += 255;
      // tile.r += 255;
      // tile.g += 255;
      // tile.b += 255;
    }
    if (!this.running) return;

  }
  public onTickBurst = (ms: number) => {
    if (this.isMouseDown) {
      let tile = this.hexMap.getTileAt(this.lastLoc);
      if (tile) {
        tile.r += 50;
      }
    }
    this.hexMap.tiles.forEach(tile => {
      tile.adjustValues(true);
    });

    this.spawnTick--;
    if (this.spawnTick < 0) {
      this.spawnTick = SPAWN_FREQ;
      let tile = _.sample(this.hexMap.tiles);
      tile.g += 255;
      tile.b += 255;
    }
    if (!this.running) return;

  }
}

const SPAWN_FREQ = 10;
