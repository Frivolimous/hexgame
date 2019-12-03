import * as PIXI from 'pixi.js';
import { BaseUI, IFadeTiming } from '../JMGE/UI/BaseUI';
import { GameManager } from '../game/GameManager';
import { Gauge } from '../JMGE/JMBUI';
import { CONFIG } from '../Config';
import { FlyingText } from '../JMGE/effects/FlyingText';
import { MuterOverlay } from '../ui/MuterOverlay';
import { PauseOverlay } from '../ui/PauseOverlay';
import { SoundData } from '../utils/SoundData';
import { IResizeEvent, IKeyboardEvent, JMInteractionEvents } from '../JMGE/events/JMInteractionEvents';
import { SidePanel } from '../ui/SidePanel';
import { HexConfig } from '../game/map/HexTile';
import { FPSCounter } from '../ui/fpsCounter';
import { LEVEL_TITLES } from '../data/LevelData';

export class GameUI extends BaseUI {
  private manager: GameManager;
  private healthBar: Gauge;

  private pauseOverlay: PauseOverlay;
  private muter: MuterOverlay;
  private wordDisplay: PIXI.Text;
  private progress: PIXI.Text;
  private score: PIXI.Text;

  private background: PIXI.Graphics;
  private sidepanel: SidePanel;
  private fpsCounter: FPSCounter;

  private fadeTiming: IFadeTiming = {
    color: 0xffffff,
    fadeIn: 2000,
    fadeOut: 500,
    delay: 3000,
    delayBlank: 1000,
  };

  constructor(level: number, difficulty: number) {
    super();
    this.background = new PIXI.Graphics().beginFill(0x777777).drawRect(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT);
    this.manager = new GameManager(level, difficulty);
    this.manager.display.y = 50;
    this.sidepanel = new SidePanel(HexConfig);
    this.sidepanel.x = CONFIG.INIT.SCREEN_WIDTH + 50;
    
    let title: PIXI.Text = new PIXI.Text(LEVEL_TITLES[level]);
    title.x = (CONFIG.INIT.SCREEN_WIDTH - title.width) / 2;
    this.addChild(this.background, this.manager.display, title);
    this.addChild(this.sidepanel);
    this.fpsCounter = new FPSCounter();
    this.fpsCounter.x = -100;
    this.addChild(this.fpsCounter);
  }

  public positionElements = (e: IResizeEvent) => {
    this.background.clear().beginFill(0x777777)
      .drawRect(e.outerBounds.x, e.outerBounds.y, e.outerBounds.width, e.outerBounds.height);
    this.fpsCounter.x = e.outerBounds.left;
    this.sidepanel.x = e.outerBounds.right - this.sidepanel.getWidth();
    this.manager.positionElements(e);
  };

  public navIn = () => {
    this.manager.running = true;
    JMInteractionEvents.KEY_DOWN.addListener(this.keyDown);
  }

  public navOut = () => {
    this.manager.running = false;
    JMInteractionEvents.KEY_DOWN.removeListener(this.keyDown);
  }

  public dispose = () => {
    this.finishDispose();
    this.manager.dispose();
  }

  public keyDown = (e: IKeyboardEvent) => {
    switch (e.key) {
      case 'Escape': {
        this.navBack();
      } break;
      case 'e': this.manager.logTileData(); break;
    }
  }
}
