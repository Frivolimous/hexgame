// import * as PIXI from 'pixi.js';
// import * as JMBUI from '../JMGE/JMBUI';
// import { TextureData } from '../utils/TextureData';
// // import { BadgeState } from '../data/PlayerData';
// import { TooltipReader, ITooltip } from '../JMGE/TooltipReader';

// export class BadgeLine extends JMBUI.BasicElement {
//   public symbol: PIXI.Sprite;
//   constructor(tooltipConfig: ITooltip, state: BadgeState = BadgeState.NONE) {
//     super({ width: 100, height: 50, label: tooltipConfig.title });
//     this.symbol = new PIXI.Sprite(TextureData.cache.getTexture('medal'));
//     // this.symbol.anchor.set(0.5,0.5);
//     // this.symbol.x=-15;
//     // this.symbol.y=this.getHeight()/2;
//     this.label.x = 30;
//     this.addChild(this.symbol);
//     this.setState(state);
//     TooltipReader.addTooltip(this, tooltipConfig);
//   }

//   public setState(state: BadgeState) {
//     this.symbol.tint = state;
//   }
// }
