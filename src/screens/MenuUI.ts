import * as PIXI from 'pixi.js';
import * as JMBUI from '../JMGE/JMBUI';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { CONFIG } from '../Config';
import { SoundData } from '../utils/SoundData';
import { CreditsUI } from './CreditsUI';
import { HighScoreUI } from './HighScoreUI';
import { GameUI } from './GameUI';

export class MenuUI extends BaseUI {
  // public muter: MuterOverlay;

  private startB: JMBUI.Button;
  private highScoreB: JMBUI.Button; 
  private creditsB: JMBUI.Button;

  constructor() {
    super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666, label: 'Millenium\nTyper', labelStyle: { fontSize: 30, fill: 0x3333ff } });
    this.label.x += 50;
    this.startB = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 200, label: 'Start', output: this.startGame });
    this.highScoreB = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 300, label: 'High Score', output: this.navHighScore });
    this.creditsB = new JMBUI.Button({ width: 100, height: 30, x: 150, y: 380, label: 'Credits', output: this.navCredits });
    this.addChild(this.startB, this.highScoreB, this.creditsB);

    // this.muter = new MuterOverlay();
    // this.muter.x = this.getWidth() - this.muter.getWidth();
    // this.muter.y = this.getHeight() - this.muter.getHeight();
    // this.addChild(this.muter);
  }

  // public positionElements = (e: IResizeEvent) => {

  // }

  public navIn = () => {
    // this.muter.reset();
    SoundData.playMusic(0);

    // let extrinsic = SaveData.getExtrinsic();
    // let wpm = extrinsic.data.wpm;

    // if (wpm) {
    //   this.typingTestB.highlight(false);
    //   TooltipReader.addTooltip(this.typingTestB, null);
    // } else {
    //   this.typingTestB.highlight(true);
    //   TooltipReader.addTooltip(this.typingTestB, {title: StringData.TYPING_TEST_TITLE, description: StringData.TYPING_TEST_DESC});
    // }
  }

  public nullFunc = () => { };

  public startGame = () => {
    this.navForward(new GameUI(0, 0));
  }

  public navCredits = () => {
    this.navForward(new CreditsUI());
  }

  public navHighScore = () => {
    this.navForward(new HighScoreUI());
  }
}
