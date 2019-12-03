import * as PIXI from 'pixi.js';
import * as JMBL from '../JMBL';
import { JMTicker } from '../events/JMTicker';
export class Firework {
    constructor(stage, x, y, count) {
        if (!Firework.initialized)
            Firework.initialize();
        for (let i = 0; i < count; i += 1) {
            let particle = new FireworkParticle(x, y);
            Firework.particles.push(particle);
            stage.addChild(particle);
        }
    }
    static initialize() {
        if (!this.initialized) {
            let firework = new PIXI.Graphics();
            firework.beginFill(0xffffff);
            firework.drawCircle(0, 0, 5);
            Firework.TEXTURE = JMBL.sharedTextureCache.addTextureFromGraphic('firework', firework);
            JMTicker.add(this.onTick.bind(this));
            this.initialized = true;
        }
    }
    static onTick() {
        for (var i = 0; i < this.particles.length; i += 1) {
            this.particles[i].update();
            if (this.particles[i].alpha < 0.1) {
                this.particles[i].destroy();
                this.particles.splice(i, 1);
                i -= 1;
            }
        }
        //if (this.particles.length>0) console.log(this.particles[0].x+" "+this.particles[0].y);
    }
}
Firework.particles = [];
Firework.initialized = false;
class FireworkParticle extends PIXI.Sprite {
    constructor(x, y) {
        super(Firework.TEXTURE);
        this.fade = 0.01;
        this.vX = 0.6;
        this.vY = 0.6;
        this.update = () => {
            this.x += this.vX;
            this.y += this.vY;
            this.alpha -= this.fade;
        };
        this.x = x;
        this.y = y;
        this.vX = Math.random() * this.vX - this.vX / 2;
        this.vY = Math.random() * this.vY - this.vY / 2;
        this.alpha = 1 + Math.random() * 0.5;
        let size = 2 + Math.random() * 8;
        this.width = size;
        this.height = size;
        this.tint = 0xcccccc;
    }
}
