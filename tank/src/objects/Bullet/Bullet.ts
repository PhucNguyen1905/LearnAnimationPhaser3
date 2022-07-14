import { IBulletConstructor } from "../../interfaces/IBulletConstructor";

export class Bullet extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    private hitEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    public fireEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    private bulletSpeed: number;

    public damage: number;

    constructor(aParams: IBulletConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture);

        this.rotation = aParams.rotation;
        this.damage = aParams.damage;

        this.initImage();
        this.scene.add.existing(this);
    }

    private initImage(): void {
        // variables
        this.bulletSpeed = 980;

        // image
        this.setOrigin(0.5, 0.5);
        this.setDepth(2);

        this.setActive(false);
        this.setVisible(false);

        this.createEmitters();
    }

    private createEmitters() {
        this.hitEmitter = this.scene.add.particles('flares')
            .createEmitter({
                x: -100,
                y: -100,
                frame: 'red',
                speed: { min: -200, max: 200 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.2, end: 0 },
                blendMode: 'ADD',
                lifespan: 400,
                gravityY: 600
            });

        this.fireEmitter = this.scene.add.particles('flares')
            .createEmitter({
                quantity: 10,
                speedX: { min: -10, max: 10 },
                speedY: { min: 50, max: 50 },
                alpha: { start: 0.5, end: 0, ease: 'Sine.easeIn' },
                scale: { start: 0.065, end: 0.02 },
                angle: { min: 30, max: 110 },
                rotate: { min: -180, max: 180 },
                lifespan: { min: 100, max: 200 },
                blendMode: 'ADD',
                follow: this
            });
        this.fireEmitter.stop();
    }

    public explodeEmitter(num: number) {
        // physics
        this.setActive(false);
        this.setVisible(false);
        this.body.setVelocity(0)
        this.scene.physics.world.disable(this);

        // Disable emitter
        this.hitEmitter.explode(num, this.x, this.y)
        this.fireEmitter.stop()
        this.fireEmitter.setVisible(false);
    }

    public fire(x: number, y: number, rotation: number) {
        this.setActive(true);
        this.setVisible(true);
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.fireEmitter.start();
        this.fireEmitter.setVisible(true);


        // physics
        this.scene.physics.world.enable(this);
        this.scene.physics.velocityFromRotation(
            this.rotation - Math.PI / 2,
            this.bulletSpeed,
            this.body.velocity
        );
    }

    public getDamage(): number {
        if (this.damage == 0) {
            return Phaser.Math.Between(1, 3);
        } else {
            return Phaser.Math.Between(1, this.damage);
        }
    }

    update(): void { }
}
