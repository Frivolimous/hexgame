import * as PIXI from 'pixi.js';
import * as JMBUI from '../JMGE/JMBUI';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { CONFIG } from '../Config';
import { GameUI } from './GameUI';
import { GradientUI } from './GradientUI';

export class MenuUI extends BaseUI {

  constructor() {
    super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666, label: 'Millenium\nTyper', labelStyle: { fontSize: 30, fill: 0x3333ff } });
    this.label.x += 50;

    let button = new JMBUI.Button({
      width: 100, height: 50,
      x: 150, y: 200, label: 'Bursts',
      output: () => this.startGame(0),
    });
    this.addChild(button);
    button = new JMBUI.Button({
      width: 100, height: 50,
      x: 150, y: 260, label: 'Level',
      output: () => this.startGame(1),
    });
    this.addChild(button);
    button = new JMBUI.Button({
      width: 100, height: 50,
      x: 150, y: 320, label: 'Gradient',
      output: this.openGradient,
    });
    this.addChild(button);
  }


  public navIn = () => {

  }

  public nullFunc = () => { };

  public startGame = (index: number) => {
    this.navForward(new GameUI(index, 0));
  }

  public openGradient = () => {
    this.navForward(new GradientUI());
  }
}
