// import * as PIXI from 'pixi.js';
// import * as JMBUI from '../JMGE/JMBUI';
// import * as JMBL from '../JMGE/JMBL';
// import { CONFIG } from '../Config';
// import { IInventoryUI, InventoryWindow } from '../JMGE/UI/InventoryUI';
// import { BadgeState } from '../data/PlayerData';
// import { BadgeLine } from '../ui/BadgeLine';
// import { BaseUI } from '../JMGE/UI/BaseUI';
// import { MuterOverlay } from '../ui/MuterOverlay';
// export class BadgesUI extends BaseUI {
//   public deckWindow: InventoryWindow;
//   public storageWindow: InventoryWindow;
//   public spellDeckWindow: InventoryWindow;
//   public spellStorageWindow: InventoryWindow;
//   public muter: MuterOverlay;
//   private tooltipPosition = {x: 350, y: 20};
//   constructor() {
//     super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666 });
//     let _button: JMBUI.Button = new JMBUI.Button({ width: 100, height: 30, x: CONFIG.INIT.SCREEN_WIDTH - 150, y: CONFIG.INIT.SCREEN_HEIGHT - 100, label: 'Menu', output: this.leave });
//     this.addChild(_button);
//     let scrollCanvas = new PIXI.Container();
//     let scroll = new JMBUI.MaskedWindow(scrollCanvas, { x: 20, y: 20, width: 300, height: CONFIG.INIT.SCREEN_HEIGHT - 40, autoSort: true });
//     let scrollbar = new JMBUI.Scrollbar({ height: CONFIG.INIT.SCREEN_HEIGHT - 40, x: 320, y: 20 });
//     scroll.addScrollbar(scrollbar);
//     this.addChild(scroll);
//     this.addChild(scrollbar);
//     let badge = new BadgeLine({title: 'EMPTY', description: 'something', fixedPosition: this.tooltipPosition}, BadgeState.NONE);
//     scroll.addObject(badge);
//     badge = new BadgeLine({title: 'EMPTY', description: 'something', fixedPosition: this.tooltipPosition}, BadgeState.NONE);
//     scroll.addObject(badge);
//     badge = new BadgeLine({title: 'EMPTY', description: 'something', fixedPosition: this.tooltipPosition}, BadgeState.BRONZE);
//     scroll.addObject(badge);
//     badge = new BadgeLine({title: 'EMPTY', description: 'something', fixedPosition: this.tooltipPosition}, BadgeState.SILVER);
//     scroll.addObject(badge);
//     badge = new BadgeLine({title: 'EMPTY', description: 'something', fixedPosition: this.tooltipPosition}, BadgeState.GOLD);
//     scroll.addObject(badge);
//     badge = new BadgeLine({title: 'EMPTY', description: 'something', fixedPosition: this.tooltipPosition}, BadgeState.NONE);
//     scroll.addObject(badge);
//     badge = new BadgeLine({title: 'EMPTY', description: 'something', fixedPosition: this.tooltipPosition}, BadgeState.NONE);
//     scroll.addObject(badge);
//     badge = new BadgeLine({title: 'EMPTY', description: 'something', fixedPosition: this.tooltipPosition}, BadgeState.NONE);
//     scroll.addObject(badge);
//     this.muter = new MuterOverlay();
//     this.muter.x = this.getWidth() - this.muter.getWidth();
//     this.muter.y = this.getHeight() - this.muter.getHeight();
//     this.addChild(this.muter);
//   }
//   public leave = () => {
//     this.navBack();
//   }
// }
