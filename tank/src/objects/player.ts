import { IImageConstructor } from '../Interfaces/IImageConstructor';
import { BulletManager } from './Bullet/BulletManager';

export class Player extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    // variables
    private health: number;
    private nextShootTime: number;
    private speed: number;

    // children
    private barrel: Phaser.GameObjects.Image;
    private lifeBar: Phaser.GameObjects.Graphics;

    // game objects
    private bullets: BulletManager;

    // input
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets.getBullets();
    }

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

        this.initImage();
        this.scene.add.existing(this);
    }

    private initImage() {
        // variables
        this.health = 1;
        this.nextShootTime = 0;
        this.speed = 100;

        // image
        this.setOrigin(0.5, 0.5);
        this.setDepth(0);
        this.angle = 180;

        this.barrel = this.scene.add.image(this.x, this.y, 'barrelBlue');
        this.barrel.setOrigin(0.5, 1);
        this.barrel.setDepth(1);
        this.barrel.angle = 180;

        this.lifeBar = this.scene.add.graphics();
        this.redrawLifebar();

        // game objects
        this.bullets = new BulletManager(this.scene, 'bulletBlue', 10)

        // input
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        // physics
        this.scene.physics.world.enable(this);

    }

    update(): void {
        if (this.active) {
            this.barrel.x = this.x;
            this.barrel.y = this.y;
            this.lifeBar.x = this.x;
            this.lifeBar.y = this.y;
            this.handleInput();
        } else {
            this.destroy();
            this.barrel.destroy();
            this.lifeBar.destroy();
        }
    }

    private handleInput() {
        if (this.cursors.up.isDown) {
            this.scene.physics.velocityFromRotation(
                this.rotation - Math.PI / 2,
                this.speed,
                this.body.velocity
            );
        } else if (this.cursors.down.isDown) {
            this.scene.physics.velocityFromRotation(
                this.rotation - Math.PI / 2,
                -this.speed,
                this.body.velocity
            );
        } else {
            this.body.setVelocity(0, 0);
        }

        // rotate tank
        if (this.cursors.left.isDown) {
            this.rotation -= 0.02;
        } else if (this.cursors.right.isDown) {
            this.rotation += 0.02;
        }

        // rotate barrel
        this.scene.input.on('pointermove', (pointer: any) => {
            if (this.active) {
                let angle = Phaser.Math.Angle.Between(this.barrel.x, this.barrel.y, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY);;
                this.barrel.rotation = angle + Math.PI / 2;
            }
        })
    }

    public shoot(): void {
        if (this.active && this.scene.time.now > this.nextShootTime) {
            this.scene.cameras.main.shake(20, 0.005);
            this.scene.tweens.add({
                targets: this,
                props: { alpha: 0.8 },
                delay: 0,
                duration: 5,
                ease: 'Power1',
                easeParams: null,
                hold: 0,
                repeat: 0,
                repeatDelay: 0,
                yoyo: true,
                paused: false
            });

            if (this.bullets.getBullets().countActive() < 10) {
                this.scene.sound.play('shoot')
                this.bullets.fireBullet(this.barrel.x, this.barrel.y, this.barrel.rotation)

                this.nextShootTime = this.scene.time.now + 80;
            }
        }
    }

    private redrawLifebar(): void {
        this.lifeBar.clear();
        this.lifeBar.fillStyle(0xe66a28, 1);
        this.lifeBar.fillRect(
            -this.width / 2,
            this.height / 2,
            this.width * this.health,
            15
        );
        this.lifeBar.lineStyle(2, 0xffffff);
        this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15);
        this.lifeBar.setDepth(1);
    }

    private updateHighScore() {
        let highScore = this.scene.registry.get('highScore');
        let score = this.scene.registry.get('score');
        if (!highScore || score > highScore) {
            highScore = score
        }
        this.scene.registry.set('highScore', highScore)
    }

    public updateHealth(damage: number): void {
        if (this.health > 0) {
            this.scene.sound.play('hit')
            this.health -= 0.025 * damage;
            this.redrawLifebar();

        } else {
            this.scene.sound.play('boom')
            this.updateHighScore();

            this.health = 0;
            this.active = false;
            this.scene.scene.pause();
            this.scene.sound.stopByKey('playsound');
            this.scene.scene.launch('OverMenu');
        }
    }
}
