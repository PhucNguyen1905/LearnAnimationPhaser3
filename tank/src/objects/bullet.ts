import { IBulletConstructor } from '../Interfaces/BulletInterface';

export class Bullet extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    private hitEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    public fireEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    private bulletSpeed: number;

    constructor(aParams: IBulletConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture);

        this.rotation = aParams.rotation;
        this.initImage();
        this.scene.add.existing(this);
    }

    private initImage(): void {
        // variables
        this.bulletSpeed = 1000;

        // image
        this.setOrigin(0.5, 0.5);
        this.setDepth(2);

        // physics
        this.scene.physics.world.enable(this);
        this.scene.physics.velocityFromRotation(
            this.rotation - Math.PI / 2,
            this.bulletSpeed,
            this.body.velocity
        );

        this.createEmitters();
    }

    createEmitters() {
        this.hitEmitter = this.scene.add.particles('flares').createEmitter({
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

        this.fireEmitter = this.scene.add.particles('flares').createEmitter({
            quantity: 10,
            speedX: { min: -10, max: 10 },
            speedY: { min: 50, max: 50 },
            alpha: { start: 0.5, end: 0, ease: 'Sine.easeIn' },
            scale: { start: 0.065, end: 0.02 },
            angle: { min: 30, max: 110 },
            rotate: { min: -180, max: 180 },
            lifespan: { min: 100, max: 200 },
            blendMode: 'ADD',
            frequency: 15,
            follow: this
        });
    }

    public explodeEmiiter(num: number) {
        this.hitEmitter.explode(num, this.x, this.y)
        this.fireEmitter.remove()
        this.destroy();
    }

    update(): void { }
}
