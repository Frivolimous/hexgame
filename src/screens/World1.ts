import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { BaseUI, IFadeTiming } from '../JMGE/UI/BaseUI';
import { CONFIG } from '../Config';
import { IResizeEvent, IKeyboardEvent, JMInteractionEvents } from '../JMGE/events/JMInteractionEvents';
import { HexTile } from '../game/map/HexTile';
import { FPSCounter } from '../ui/fpsCounter';
import { HexMap } from '../game/map/HexMap';
import { AStarPath, astarSpacialHermeneutic } from '../utils/AStar';

export class World1UI extends BaseUI {
//   private manager: GameManager;

  private background: PIXI.Graphics;
  private hexMap: HexMap;
//   private sidepanel: SidePanel;
  private fpsCounter: FPSCounter;

  private fadeTiming: IFadeTiming = {
    color: 0xffffff,
    fadeIn: 2000,
    fadeOut: 500,
    delay: 3000,
    delayBlank: 1000,
  };

  constructor() {
    super();
    this.background = new PIXI.Graphics().beginFill(0x777777).drawRect(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT);
    // this.manager = new GameManager(level, difficulty);
    // this.manager.display.y = 50;
    // this.sidepanel = new SidePanel(HexConfig);
    // this.sidepanel.x = CONFIG.INIT.SCREEN_WIDTH + 50;
    
    this.addChild(this.background);
    // this.addChild(this.sidepanel);
    this.fpsCounter = new FPSCounter();
    this.fpsCounter.x = -100;
    this.addChild(this.fpsCounter);
  }

  public positionElements = (e: IResizeEvent) => {
    this.background.clear().beginFill(0x777777)
      .drawRect(e.outerBounds.x, e.outerBounds.y, e.outerBounds.width, e.outerBounds.height);
    this.fpsCounter.x = e.outerBounds.left;
    // this.sidepanel.x = e.outerBounds.right - this.sidepanel.getWidth();
    // this.manager.positionElements(e);
  };

  public navIn = () => {
    // this.manager.running = true;
    JMInteractionEvents.KEY_DOWN.addListener(this.keyDown);
    this.hexMap = new HexMap({ across: 100, down: 100, scale: 0.08});
    this.addChild(this.hexMap);

    this.initMap();
  }

  public initMap() {
    let across = 100;
    let down = 100;
    this.hexMap.tiles.forEach((tile, index) => {
        let x = index % across;
        let y = Math.floor (index / across);
        tile.setValues(0, 0, 255);
    });
    this.startMountains();
    this.makeLand(30);
    this.makeTowns();
    // this.makeWater();

    this.updateTiles();
  }

  public startMountains (n: number = 50) {
    for (let i = 0; i < n; i++) {
        let tile = _.sample(this.hexMap.tiles);

        tile.setValues(255, 0, 0);
        tile.connections.forEach(con => con.r === 255 ? null : con.setValues(0, 255, 0));
    }
    this.updateTiles();
  }

  public makeLand(n: number = 100) {
      for (let i = 0; i < n; i++) {
        this.spreadLand();
      }

      this.updateTiles();
  }

  public spreadLand() {
    let landChances = [0, 0.1, 0.1, 0.1, 0.1, 0.1, 1];
    let mountainChances = [0, 0.05, 0.07, 0.02, 0.03, 0.05, 0.7];

    this.hexMap.tiles.forEach((tile, index, array) => {
        if (tile.b === 255) {
            let numLand = tile.connections.filter(con => con.g === 255).length;
            if (Math.random() <= landChances[numLand]) {
                tile.setValues(0, 255, 0);
            }
        } else if (tile.g === 255){
            let numMountains = tile.connections.filter(con => con.r === 255).length;
            if (Math.random() <= mountainChances[numMountains]) {
                tile.setValues(255, 0, 0);
                tile.connections.forEach(con => con.r === 255 ? null : con.setValues(0, 255, 0));
            }
            // if (Math.random() < 0.01) {
            // }
        }
    });
  }

  public makeWater(n: number = 100) {
      for (let i = 0; i < n; i++) {
          this.spreadWater();
      }
      this.updateTiles();
  }

  public spreadWater () {
    let across = 100;
    let down = 100;
    let chances = [0, 0.3, 0.05, 0.1, 0.1, 0.3, 1];

    this.hexMap.tiles.forEach((tile, index, array) => {
        let numWater = tile.connections.filter(con => con.b === 255).length;
        if (Math.random() <= chances[numWater]) {
            tile.b = 255;
            tile.g = 0;
        }
    });
  }

  public makeTowns (n: number = 50) {
    
    let candidates = this.hexMap.tiles.filter(tile => {
        return (tile.b === 0 && (tile.g === 255 || Math.random() < 0.2));
    });

    let towns: HexTile[] = [];
    for (let i = 0; i < n; i++) {
        let town = _.sample(candidates);
        _.pull(candidates, town);
        town.setValues(255, 255, 0);
        towns.push(town);
    }

    for (let i = 0; i < 10; i++) {
        let townA = _.sample(towns);
        let townB = _.sample(towns);
        if (townA !== townB) {
            let path = new AStarPath(townA, townB, this.tilePathValue, astarSpacialHermeneutic);
            if (path.path) {
                path.path.forEach((tile: HexTile) => tile.setValues(255, 255, 0));
            }
        } else {
            i--;
        }
    }
  }

  public tilePathValue = (node: HexTile): number => {
    if (node.r === 255 && node.g === 255) return 0.5;
    if (node.b === 255) return 300;
    if (node.r === 255) return 500;
    return 100;
  }

  public export() {
    let indexes = [
        13, //b = water
        2, //g = grass
        5, //r = mountain
        8, //y = road
    ]
    let map = this.hexMap.tiles.map(node => {
        if (node.r === 255 && node.g === 255) return indexes[3];
        if (node.b === 255) return indexes[0];
        if (node.r === 255) return indexes[2];
        return indexes[1];
    });
    console.log(JSON.stringify(map));
  }

  public updateTiles () {
      this.hexMap.tiles.forEach(tile => tile.updateTint());
  }

  public navOut = () => {
    // this.manager.running = false;
    JMInteractionEvents.KEY_DOWN.removeListener(this.keyDown);
    this.hexMap.destroy();
  }

  public dispose = () => {
    this.finishDispose();
    // this.manager.dispose();
  }

  public keyDown = (e: IKeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        this.navBack();
        break;
      case 'e': this.makeWater(1); break;
      case 'r': this.makeLand(1); break;
      case 'q': this.navOut(); this.navIn(); break;
      case 'c': this.export(); break;
    }
  }
}
