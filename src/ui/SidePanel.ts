import * as PIXI from 'pixi.js';
import * as _ from 'lodash';

export class SidePanel extends PIXI.Container {
  private inputs: [string, PIXI.Text][]=[];
  private back: PIXI.Graphics

  private target: [string, PIXI.Text];

  constructor(private object: any) {
    super();

    let back = new PIXI.Graphics().beginFill(0x999999).drawRect(0, 0, 200, 600);
    this.back = back;
    this.addChild(back);
    let keys = _.keys(object);

    keys.forEach(this.addProperty);

    this.interactive = true;
    this.addListener('pointerdown', this.onClick);
    window.addEventListener('keydown', this.keyDown);
  }

  getWidth() {
    return 200;
  }

  getHeight() {
    return 600;
  }

  addProperty = (key: string, i: number) => {
    let title = new PIXI.Text(key);
    title.position.set(5, 5 + 50 * i);
    let input = new PIXI.Text(this.object[key]);
    input.position.set(100, 5 + 50 * i);
    input.interactive = true;
    if (title.width > 90) {
      title.width = 90;
      title.scale.y = title.scale.x; 
    }

    this.inputs.push([key, input]);
    this.addChild(title, input);
  }

  onClick = (e: PIXI.interaction.InteractionEvent) => {
    let target = _.find(this.inputs, input => input[1] === e.target);
    this.target = target;
    this.inputs.forEach(input => {
      if (input === target) {
        input[1].style.fill = '#0000ff';
      }else {
        input[1].style.fill = '#000000';
      }
    })
  }

  keyDown = (e: KeyboardEvent) => {
    if (this.target) {
      if (e.key === "Backspace") {
        this.target[1].text = this.target[1].text.substr(0, this.target[1].text.length - 1);
      } else if (e.key.length === 1) {
        this.target[1].text += e.key;
      }
      this.object[this.target[0]] = Number(this.target[1].text);
      console.log(this.object);
    }

  }
}