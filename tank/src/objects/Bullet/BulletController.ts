import { Bullet } from "./Bullet";

export class Bullets {
    private curScene: Phaser.Scene;
    private texture: string;
    private numOfBullets: number;
    private bullets: Phaser.GameObjects.Group;
    constructor(scene: Phaser.Scene, texture: string, num: number) {
        this.curScene = scene;
        this.texture = texture;
        this.numOfBullets = num;

        this.createBullets();
    }

    createBullets() {
        // game objects
        this.bullets = this.curScene.add.group({
            active: true,
            maxSize: this.numOfBullets
        });
        for (let i = 0; i < this.numOfBullets; i++) {
            const bullet = new Bullet({ scene: this.curScene, x: 0, y: 0, rotation: 0, texture: this.texture })
            this.bullets.add(bullet)
        }
    }

    public fireBullet(x: number, y: number, rotation: number) {
        let bullet: Bullet = this.bullets.getFirstDead(false);

        if (bullet) {
            bullet.fire(x, y, rotation);
        }
    }
    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets;
    }
}