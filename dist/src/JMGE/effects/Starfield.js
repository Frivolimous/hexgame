import * as PIXI from 'pixi.js';
export class Starfield extends PIXI.Container {
    constructor(canvasWidth, canvasHeight) {
        super();
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.stars = [];
        this.objects = [];
        this.back = new PIXI.Graphics();
        this.setBack(0);
        this.addChild(this.back);
        for (let i = 0; i < 40; i += 1) {
            this.stars.push(new Star(1 + Math.random() * 1, Math.floor(Math.random() * this.canvasWidth), Math.random() * this.canvasHeight));
        }
        this.nebTick = 9000;
    }
    setBack(i) {
        // back.bitmapData=new BitmapData(Facade.stage.stageWidth,Facade.stage.stageHeight,false,0);
        // back.bitmapData=SpriteSheets.back[Math.floor(i/4)];
    }
    spawnStar() {
        let newStar = new Star(1 + Math.random() * 3, Math.floor(Math.random() * this.canvasWidth));
        this.stars.push(newStar);
        this.addChild(newStar);
    }
    spawnNebula() {
        // this.objects.push(new Nebula());
        // this.addChildAt(this.objects[this.objects.length-1],1);
    }
    update(speed) {
        let spawn = speed * 0.3;
        while (spawn > 1) {
            spawn -= 1;
            this.spawnStar();
        }
        if (Math.random() < spawn) {
            this.spawnStar();
        }
        if (this.nebTick > 10000 / speed) {
            this.spawnNebula();
            this.nebTick = 0;
        }
        else {
            this.nebTick += 1;
        }
        let i = 0;
        while (i < this.stars.length) {
            this.stars[i].y += this.stars[i].v * speed;
            if (this.stars[i].y > this.canvasHeight) {
                this.removeChild(this.stars[i]);
                this.stars.splice(i, 1);
            }
            else {
                i += 1;
            }
        }
        i = 0;
        while (i < this.objects.length) {
            this.objects[i].y += speed * 0.6;
            if (this.objects[i].y > this.canvasHeight) {
                this.objects[i].parent.removeChild(this.objects[i]);
                this.objects.splice(i, 1);
            }
            else {
                i += 1;
            }
        }
        i = 0;
        // while (i<particles.length){
        //   particles[i].update(wpm);
        //   if (particles[i].timer>particles[i].life){
        //     gameV.removeChild(particles[i]);
        //     particles.splice(i,1);
        //   }else{
        //     i+=1;
        //   }
        // }
    }
}
class Star extends PIXI.Graphics {
    constructor(v, x, y = 0) {
        super();
        this.v = v;
        this.x = x;
        this.y = y;
        this.beginFill(0xffffff);
        this.drawCircle(0, 0, v / 2);
    }
}
