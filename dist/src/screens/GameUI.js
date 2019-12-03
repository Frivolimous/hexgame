import * as PIXI from 'pixi.js';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { GameManager } from '../game/GameManager';
import { CONFIG } from '../Config';
import { JMInteractionEvents } from '../JMGE/events/JMInteractionEvents';
import { SidePanel } from '../ui/SidePanel';
import { HexConfig } from '../game/map/HexTile';
import { FPSCounter } from '../ui/fpsCounter';
import { LEVEL_TITLES } from '../data/LevelData';
export class GameUI extends BaseUI {
    constructor(level, difficulty) {
        super();
        this.fadeTiming = {
            color: 0xffffff,
            fadeIn: 2000,
            fadeOut: 500,
            delay: 3000,
            delayBlank: 1000,
        };
        this.positionElements = (e) => {
            this.background.clear().beginFill(0x777777)
                .drawRect(e.outerBounds.x, e.outerBounds.y, e.outerBounds.width, e.outerBounds.height);
            this.fpsCounter.x = e.outerBounds.left;
            this.sidepanel.x = e.outerBounds.right - this.sidepanel.getWidth();
            this.manager.positionElements(e);
        };
        this.navIn = () => {
            this.manager.running = true;
            JMInteractionEvents.KEY_DOWN.addListener(this.keyDown);
        };
        this.navOut = () => {
            this.manager.running = false;
            JMInteractionEvents.KEY_DOWN.removeListener(this.keyDown);
        };
        this.dispose = () => {
            this.finishDispose();
            this.manager.dispose();
        };
        this.keyDown = (e) => {
            switch (e.key) {
                case 'Escape':
                    {
                        this.navBack();
                    }
                    break;
                case 'e':
                    this.manager.logTileData();
                    break;
            }
        };
        this.background = new PIXI.Graphics().beginFill(0x777777).drawRect(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT);
        this.manager = new GameManager(level, difficulty);
        this.manager.display.y = 50;
        this.sidepanel = new SidePanel(HexConfig);
        this.sidepanel.x = CONFIG.INIT.SCREEN_WIDTH + 50;
        let title = new PIXI.Text(LEVEL_TITLES[level]);
        title.x = (CONFIG.INIT.SCREEN_WIDTH - title.width) / 2;
        this.addChild(this.background, this.manager.display, title);
        this.addChild(this.sidepanel);
        this.fpsCounter = new FPSCounter();
        this.fpsCounter.x = -100;
        this.addChild(this.fpsCounter);
    }
}
