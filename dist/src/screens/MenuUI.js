import * as JMBUI from '../JMGE/JMBUI';
import { BaseUI } from '../JMGE/UI/BaseUI';
import { CONFIG } from '../Config';
import { CreditsUI } from './CreditsUI';
import { HighScoreUI } from './HighScoreUI';
import { GameUI } from './GameUI';
import { GradientUI } from './GradientUI';
export class MenuUI extends BaseUI {
    // public muter: MuterOverlay;
    // private startB: JMBUI.Button;
    // private highScoreB: JMBUI.Button; 
    // private creditsB: JMBUI.Button;
    constructor() {
        super({ width: CONFIG.INIT.SCREEN_WIDTH, height: CONFIG.INIT.SCREEN_HEIGHT, bgColor: 0x666666, label: 'Millenium\nTyper', labelStyle: { fontSize: 30, fill: 0x3333ff } });
        this.navIn = () => {
            // this.muter.reset();
            // SoundData.playMusic(0);
            // let extrinsic = SaveData.getExtrinsic();
            // let wpm = extrinsic.data.wpm;
            // if (wpm) {
            //   this.typingTestB.highlight(false);
            //   TooltipReader.addTooltip(this.typingTestB, null);
            // } else {
            //   this.typingTestB.highlight(true);
            //   TooltipReader.addTooltip(this.typingTestB, {title: StringData.TYPING_TEST_TITLE, description: StringData.TYPING_TEST_DESC});
            // }
        };
        this.nullFunc = () => { };
        this.startGame = (index) => {
            this.navForward(new GameUI(index, 0));
        };
        this.openGradient = () => {
            this.navForward(new GradientUI());
        };
        this.navCredits = () => {
            this.navForward(new CreditsUI());
        };
        this.navHighScore = () => {
            this.navForward(new HighScoreUI());
        };
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
}
