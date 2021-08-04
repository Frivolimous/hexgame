import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { CONFIG } from '../Config';
import { IResizeEvent, IKeyboardEvent, JMInteractionEvents } from '../JMGE/events/JMInteractionEvents';
import { FPSCounter } from '../ui/fpsCounter';
import { WorldGenerator } from '../game/WorldGenerator';
import { SidePanel } from '../ui/SidePanel';

export class ExploreUI extends BaseUI {
  private background: PIXI.Graphics;
  private world: WorldGenerator;
  private sidepanel: SidePanel;

  constructor() {
    super();
    this.background = new PIXI.Graphics().beginFill(0x777777).drawRect(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT);
    this.world = new WorldGenerator();
    this.sidepanel = new SidePanel(this.world.config);
    this.addChild(this.background);
    this.addChild(this.world);
    this.addChild(this.sidepanel);
  }

  public positionElements = (e: IResizeEvent) => {
    this.background.clear().beginFill(0x777777)
      .drawRect(e.outerBounds.x, e.outerBounds.y, e.outerBounds.width, e.outerBounds.height);
    this.sidepanel.x = e.outerBounds.right - this.sidepanel.getWidth();
  };

  public navIn = () => {
    JMInteractionEvents.KEY_DOWN.addListener(this.keyDown);
  }

  public navOut = () => {
    JMInteractionEvents.KEY_DOWN.removeListener(this.keyDown);
    this.world.destroy();
  }

  public dispose = () => {
    this.finishDispose();
  }

  public keyDown = (e: IKeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        this.navBack();
        break;
      case 'e': this.world.makeWater(1); break;
      case 'r': this.world.makeLand(1); break;
      case 'q': this.world.newSeed(); break;
      case 'c': this.world.export(); break;
    }
  }
}
