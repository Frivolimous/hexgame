import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { HexTile } from '../game/map/HexTile';
import { HexMap } from '../game/map/HexMap';
import { AStarPath, astarSpacialHermeneutic } from '../utils/AStar';

export class WorldGenerator extends PIXI.Container {
  public config = {
    numMountains: 50,
    mountainTPercent: 0.75,
    mountainTValue: 50,
    waterLevel: 75,
    groundLevel: 175,
  };
  
  private hexMap: HexMap;

  constructor(private across: number = 100, private down: number = 100) {
    super();
    this.newSeed();
  }

  public newSeed() {
    this.hexMap && this.hexMap.destroy();
    this.hexMap = new HexMap({ across: this.across, down: this.down, scale: 0.08 });
    this.addChild(this.hexMap);
    this.initMap();
  }
  
  public initMap() {
    this.hexMap.tiles.forEach(tile => {
      tile.setValues(0, 0, 0);
    });

    this.makeElevationMap(this.config.numMountains);
    this.fillWater();
    // this.flattenWorld();

    this.updateTints();
  }

  public makeElevationMap(n: number = 50) {
    for (let i = 0; i < n; i++) {
      this.makeTopElevation();
    }
  }

  public makeTopElevation() {
    let tile = _.sample(this.hexMap.tiles);
    if (tile.r < 200) {
      tile.r = 200 + Math.random() * 55;
      this.spreadElevation(tile);
    }
  }

  public spreadElevation(tile: HexTile) {
    let connections: HexTile[] = [tile];
    let threshold = this.config.mountainTValue;
    let tPercent = this.config.mountainTPercent;
    let i = 10000;

    while (connections.length > 0) {
      i--;
      if (i <= 0) break;
      let tile = connections.shift();
      tile.connections.forEach(con => {
        if (con.r < tile.r * tPercent) {
          con.r = Math.floor( con.r + (tile.r - con.r) * (0.5 + Math.random() * 0.5));
          if (con.r > threshold) {
            connections.push(con);
          }
        }
      });
    }
  }

  public fillWater() {
    this.hexMap.tiles.forEach(tile => {
      if (tile.r < this.config.waterLevel) {
        tile.b = 255;
      }
    });
  }

  public flattenWorld() {
    this.hexMap.tiles.forEach(tile => {
      if (tile.b > 0) tile.r = 0;
      else if (tile.r < this.config.groundLevel) tile.setValues(0, 255, 0);
    });
  }

  // === \\

  public initMap2() {
    this.hexMap.tiles.forEach((tile, index) => {
      tile.setValues(0, 0, 255);
    });
    this.startMountains();
    this.makeLand(30);
    this.makeTowns();
    // this.makeWater();

    this.updateTints();
  }


  public startMountains(n: number = 50) {
    for (let i = 0; i < n; i++) {
      let tile = _.sample(this.hexMap.tiles);

      tile.setValues(255, 0, 0);
      tile.connections.forEach(con => con.r === 255 ? null : con.setValues(0, 255, 0));
    }
    this.updateTints();
  }

  public makeLand(n: number = 100) {
    for (let i = 0; i < n; i++) {
      this.spreadLand();
    }

    this.updateTints();
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
      } else if (tile.g === 255) {
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
    this.updateTints();
  }

  public spreadWater() {
    let chances = [0, 0.3, 0.05, 0.1, 0.1, 0.3, 1];

    this.hexMap.tiles.forEach((tile, index, array) => {
      let numWater = tile.connections.filter(con => con.b === 255).length;
      if (Math.random() <= chances[numWater]) {
        tile.b = 255;
        tile.g = 0;
      }
    });
  }

  public makeTowns(n: number = 50) {

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

  public updateTints() {
    this.hexMap.tiles.forEach(tile => tile.updateTint());
  }
}
