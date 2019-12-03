export var SoundIndex;
(function (SoundIndex) {
    SoundIndex[SoundIndex["TYPING"] = 0] = "TYPING";
    SoundIndex[SoundIndex["CLICK"] = 1] = "CLICK";
    SoundIndex[SoundIndex["SCORE"] = 2] = "SCORE";
    SoundIndex[SoundIndex["LASER"] = 3] = "LASER";
    SoundIndex[SoundIndex["EXPLODE_SS"] = 4] = "EXPLODE_SS";
    SoundIndex[SoundIndex["EXPLODE_BS"] = 5] = "EXPLODE_BS";
    SoundIndex[SoundIndex["CHARGE"] = 6] = "CHARGE";
    SoundIndex[SoundIndex["HEAL"] = 7] = "HEAL";
    SoundIndex[SoundIndex["EMP"] = 8] = "EMP";
    SoundIndex[SoundIndex["BOSS_CHARGE"] = 9] = "BOSS_CHARGE";
    SoundIndex[SoundIndex["BOSS_LASER"] = 10] = "BOSS_LASER";
    SoundIndex[SoundIndex["SUPERMAN"] = 11] = "SUPERMAN";
})(SoundIndex || (SoundIndex = {}));
const MUSIC_VOLUME = 0.5;
export class SoundData {
}
SoundData.setMute = (b) => {
    SoundData.muted = b;
    if (b) {
        if (SoundData.musicPlaying) {
            SoundData.musicPlaying.fade(MUSIC_VOLUME, 0, 500);
        }
    }
    else {
        if (SoundData.musicPlaying) {
            SoundData.musicPlaying.fade(0, MUSIC_VOLUME, 500);
        }
    }
};
SoundData.playMusicForLevel = (i) => {
    switch (i) {
        case 0:
        case 1:
        case 2:
            SoundData.playMusic(1);
            break;
        case 4:
        case 5:
        case 6:
            SoundData.playMusic(2);
            break;
        case 8:
        case 9:
        case 10:
            SoundData.playMusic(3);
            break;
        case 3:
        case 7:
        case 11:
            SoundData.playMusic(4);
            break;
    }
};
SoundData.playMusic = (i) => {
    return;
    // let nextTrack: Howl = SoundData.music[i];
    // if (SoundData.musicPlaying === nextTrack) {
    //   return;
    // }
    // if (SoundData.muted) {
    //   if (SoundData.musicPlaying) {
    //     SoundData.musicPlaying.stop();
    //   }
    //   nextTrack.volume(0);
    //   nextTrack.play();
    //   SoundData.musicPlaying = nextTrack;
    // } else {
    //   if (SoundData.musicPlaying) {
    //     let prev = SoundData.musicPlaying;
    //     prev.fade(MUSIC_VOLUME, 0, 1000);
    //     prev.once('fade', () => prev.stop());
    //   }
    //   nextTrack.fade(0, MUSIC_VOLUME, 1000);
    //   // nextTrack.on('fade', () => {});
    //   nextTrack.play();
    //   SoundData.musicPlaying = nextTrack;
    // }
};
SoundData.playSound = (i) => {
    if (SoundData.muted)
        return;
    switch (i) {
        // case SoundIndex.TYPING: SoundData.typing.play(); break;
        // case SoundIndex.CLICK: SoundData.click.play(); break;
        // case SoundIndex.SCORE: SoundData.score.play(); break;
        // case SoundIndex.LASER: SoundData.laser.play(); break;
        // case SoundIndex.EXPLODE_SS: SoundData.explodeSS.play(); break;
        // case SoundIndex.EXPLODE_BS: SoundData.explodeBS.play(); break;
        // case SoundIndex.CHARGE: SoundData.charge.play(); break;
        // case SoundIndex.HEAL: SoundData.heal.play(); break;
        // case SoundIndex.EMP: SoundData.emp.play(); break;
        // case SoundIndex.BOSS_CHARGE: SoundData.bossCharge.play(); break;
        // case SoundIndex.BOSS_LASER: SoundData.bossLaser.play(); break;
        // case SoundIndex.SUPERMAN: SoundData.superman.play(); break;
    }
};
SoundData.muted = false;
// window.addEventListener('keydown', (e: any) => {
//   switch (e.key) {
//     case '1': SoundData.playSound(0); break;
//     case '2': SoundData.playSound(1); break;
//     case '3': SoundData.playSound(2); break;
//     case '4': SoundData.playSound(3); break;
//     case '5': SoundData.playSound(4); break;
//     case '6': SoundData.playSound(5); break;
//     case '7': SoundData.playSound(6); break;
//     case '8': SoundData.playSound(7); break;
//     case '9': SoundData.playSound(8); break;
//     case '0': SoundData.playSound(9); break;
//     case '-': SoundData.playSound(10); break;
//     case '=': SoundData.playSound(11); break;
//     case 'q': SoundData.playMusic(0); break;
//     case 'w': SoundData.playMusic(1); break;
//     case 'e': SoundData.playMusic(2); break;
//     case 'r': SoundData.playMusic(3); break;
//     case 't': SoundData.playMusic(4); break;
//   }
// });
