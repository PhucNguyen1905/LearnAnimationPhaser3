import { Bullet } from "./Bullet";

export class Bullets extends Phaser.GameObjects.Group {
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene.add.group({
            classType: Bullet,
            active: false,
            maxSize: 10,
            runChildUpdate: true
        })
    }

    public fireBullet(x: number, y: number, rotation: number) {
        let bullet: Bullet = this.getFirstDead(false);

        if (bullet) {
            bullet.fire(x, y, rotation);
        }
    }
}