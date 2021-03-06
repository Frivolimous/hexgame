// import * as PIXI from 'pixi.js';
// import * as JMBUI from '../JMGE/JMBUI';
// import { BaseUI } from '../JMGE/UI/BaseUI';
// import { CONFIG } from '../Config';
// import { MuterOverlay } from '../ui/MuterOverlay';
// import { ILevelInstance } from '../data/LevelInstance';
// import { SaveData } from '../utils/SaveData';
// import { ImageRepo, TextureData } from '../utils/TextureData';
// import { TooltipReader } from '../JMGE/TooltipReader';
// import { StringData } from '../data/StringData';
// const LABEL = 'WinUI';
// export class WinUI extends BaseUI {
//   constructor(instance: ILevelInstance) {
//     super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666, label: LABEL, labelStyle: { fontSize: 30, fill: 0x3333ff } });
//     this.calcNewScoreAndDisplay(instance);
//     let _button = new JMBUI.Button({ width: 100, height: 30, x: CONFIG.INIT.SCREEN_WIDTH - 150, y: CONFIG.INIT.SCREEN_HEIGHT - 100, label: 'Menu', output: this.navMenu });
//     this.addChild(_button);
//     let muter = new MuterOverlay();
//     muter.x = this.getWidth() - muter.getWidth();
//     muter.y = this.getHeight() - muter.getHeight();
//     this.addChild(muter);
//   }
//   public navMenu = () => {
//     this.navBack();
//   }
//   private calcNewScoreAndDisplay(instance: ILevelInstance) {
//     let extrinsic = SaveData.getExtrinsic();
//     let currentLevel = extrinsic.data.levels[instance.level] || {};
//     if (!extrinsic.data.levels[instance.level + 1]) {
//       extrinsic.data.levels[instance.level + 1] = {score: 0};
//     }
//     let highScore = currentLevel.score;
//     let newScore = instance.score;
//     let s = 'You Won! :)\n\nBase Score: ' + newScore + '\n';
//     let diffMult = 1 + instance.difficulty * 0.15;
//     let healthMult = 1 + (instance.healthLost ? instance.playerHealth / 5 : 2);
//     let killMult = 1 + (instance.enemiesKilled / instance.totalEnemies);
//     let healthBadge = instance.healthLost ? instance.playerHealth === 5 ? 2 : instance.playerHealth > 2 ? 1 : 0 : 3;
//     let killBadge = Math.min(Math.floor(instance.enemiesKilled / instance.totalEnemies), 3);
//     newScore *= diffMult;
//     s += 'Difficulty x' + diffMult.toFixed(2) + ' : ' + Math.floor(newScore) + '\n';
//     newScore *= healthMult;
//     s += 'Health x' + healthMult.toFixed(2) + ' : ' + Math.floor(newScore) + '\n';
//     newScore *= killMult;
//     s += 'Kills x' + killMult.toFixed(2) + ' : ' + Math.floor(newScore) + '\n';
//     s += 'Final Score: ' + Math.floor(newScore) + '\n';
//     if (newScore > highScore) {
//       s += 'Congratulations!  This is a new high score!';
//       currentLevel.score = Math.round(newScore);
//     } else {
//       s += 'Highscore: ' + highScore;
//     }
//     if (!currentLevel.healthBadge || healthBadge > currentLevel.healthBadge) {
//       currentLevel.healthBadge = healthBadge;
//     }
//     if (!currentLevel.killBadge || killBadge > currentLevel.killBadge) {
//       currentLevel.killBadge = killBadge;
//     }
//     if (!currentLevel.highestDifficulty || instance.difficulty > currentLevel.highestDifficulty) {
//       currentLevel.highestDifficulty = instance.difficulty;
//     }
//     SaveData.saveExtrinsic();
//     let text = new PIXI.Text(s);
//     this.addChild(text);
//     text.position.set(50, 50);
//     if (healthBadge) {
//       let healthBadgeView = TextureData.getHealthSprite(healthBadge);
//       TooltipReader.addTooltip(healthBadgeView, {title: StringData.HEALTH_AWARD, description: StringData.HEALTH_AWARD_DESC});
//       healthBadgeView.position.set(50, CONFIG.INIT.SCREEN_HEIGHT - 150);
//       this.addChild(healthBadgeView);
//     }
//     if (killBadge) {
//       let killBadgeView = TextureData.getKillSprite(killBadge);
//       TooltipReader.addTooltip(killBadgeView, {title: StringData.KILLS_AWARD, description: StringData.KILLS_AWARD_DESC});
//       killBadgeView.position.set(200, CONFIG.INIT.SCREEN_HEIGHT - 150);
//       this.addChild(killBadgeView);
//     }
//   }
// }
