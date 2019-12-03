import * as PIXI from 'pixi.js';
import * as JMBUI from '../JMGE/JMBUI';
import * as JMBL from '../JMGE/JMBL';

import { BaseUI } from '../JMGE/UI/BaseUI';
import { CONFIG } from '../Config';
import { ColorGradient, parseColorToString, parseColor } from '../JMGE/others/Colors';

export class GradientUI extends BaseUI {

  public rects: PIXI.Graphics[] = [];
  public texts: PIXI.Text[] = [];

  constructor() {
    super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 1 });
    let padding = 50;
    let width = (CONFIG.INIT.SCREEN_WIDTH - padding * 2) / 7;
    let height = width * 2;
    for (let i = 0; i < 7; i++) {
      let graphic = new PIXI.Graphics();
      graphic.beginFill(0xffffff);
      graphic.drawRect(0, 0, width, height);
      graphic.position.set(padding + i * width, padding);
      this.rects.push(graphic);
      this.addChild(graphic);
      let text = new PIXI.Text('#FFFFFF', {fill: 0xFFFFFF});
      text.width = width * 0.7;
      text.scale.y = text.scale.x;
      this.texts.push(text);
      text.position.set(padding + i * width + (width - text.width) / 2, padding + height + 5);
      this.addChild(text);

      let explanation = new PIXI.Text('open the console and type in:\nmakeGradient("#COLOR1", "#COLOR2")', {fill: 0xffffff});
      this.addChild(explanation);
      explanation.position.set(50, 400);
    }

    this.makeGradient(0x109A85, 0x00ff00);

    window['makeGradient'] = this.makeGradient;
  }

  public makeGradient = (color0: number|string, color1: number|string) => {
    let gradient = new ColorGradient(parseColor(color0), parseColor(color1));
    for (let i = 0; i < this.rects.length; i++) {
      let percent = i/(this.rects.length - 1);
      // console.log(this.rects, i, this.rects[i]);
      let color = gradient.getColorAt(percent);
      this.rects[i].tint = color;
      this.texts[i].text = parseColorToString(color);
    }
  }

  public leave = () => {
    this.navBack();
  }
}