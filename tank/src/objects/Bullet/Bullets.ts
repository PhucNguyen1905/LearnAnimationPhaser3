import { Bullet } from "./Bullet";

export class Bullets {
    private curScene: Phaser.Scene;
    private textture: string;
    private bullets: Phaser.GameObjects.Group;
    constructor(scene: Phaser.Scene, textture: string) {
        this.curScene = scene;
        this.textture = textture;

        this.createBullets();
    }

    createBullets() {
        // game objects
        this.bullets = this.curScene.add.group({
            active: true,
            maxSize: 10
        });
        for (let i = 0; i < 10; i++) {
            const bullet = new Bullet({ scene: this.curScene, x: 0, y: 0, rotation: 0, texture: this.textture })
            this.bullets.add(bullet)
        }
    }

    public fireBullet(x: number, y: number, rotation: number) {
        let bullet: Bullet = this.bullets.getFirstDead(false);

        if (bullet) {
            bullet.fire(x, y, rotation);
        }
    }
}