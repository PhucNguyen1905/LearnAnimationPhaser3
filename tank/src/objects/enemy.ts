import { IImageConstructor } from '../Interfaces/IImageConstructor';
import { BulletManager } from './Bullet/BulletManager';

export class Enemy extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    // variables
    private health: number;
    private nextShootTime: number;
    private dyingValue: number;

    // children
    private barrel: Phaser.GameObjects.Image;
    private lifeBar: Phaser.GameObjects.Graphics;

    // game objects
    private bullets: BulletManager;

    private exploEmitter: Phaser.GameObjects.Particles.ParticleEmitter;


    public getBarrel(): Phaser.GameObjects.Image {
        return this.barrel;
    }

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets.getBullets();
    }

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

        this.initEnemy();
        this.scene.add.existing(this);
    }

    private initEnemy() {
        // variables
        this.health = 1;
        this.nextShootTime = 0;
        this.dyingValue = Phaser.Math.Between(10, 20);


        // image
        this.setDepth(0);

        this.barrel = this.scene.add.image(0, 0, 'barrelRed');
        this.barrel.setOrigin(0.5, 1);
        this.barrel.setDepth(1);

        this.lifeBar = this.scene.add.graphics();
        this.redrawLifebar();

        // game objects
        this.bullets = new BulletManager(this.scene, 'bulletRed', 5)

        // tweens
        this.scene.tweens.add({
            targets: this,
            props: { y: this.y - 200 },
            delay: 0,
            duration: 2000,
            ease: 'Linear',
            easeParams: null,
            hold: 0,
            repeat: -1,
            repeatDelay: 0,
            yoyo: true
        });

        this.createEmitters();

        // physics
        this.scene.physics.world.enable(this);
    }


    private createEmitters() {
        this.exploEmitter = this.scene.add.particles('flares').createEmitter({
            frame: 'yellow',
            x: -100,
            y: -100,
            speed: 200,
            scale: { min: 0, max: 1 },
            blendMode: 'ADD',
            lifespan: 300
        });
    }

    update(): void {
        if (this.active) {
            this.barrel.x = this.x;
            this.barrel.y = this.y;
            this.lifeBar.x = this.x;
            this.lifeBar.y = this.y;
            this.shoot();
        } else {
            this.destroy();
            this.barrel.destroy();
            this.lifeBar.destroy();
        }
    }

    private shoot(): void {
        if (this.scene.time.now > this.nextShootTime) {
            if (this.bullets.getBullets().countActive() < 5) {
                this.bullets.fireBullet(this.barrel.x, this.barrel.y, this.barrel.rotation)

                this.nextShootTime = this.scene.time.now + 400;
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

    private tweenHealthText(damage: number) {
        // Tween health
        let healthText = this.scene.add.text(
            this.x - Phaser.Math.Between(30, 70),
            this.y - 50,
            damage.toString(),
            {
                fontSize: '50px',
                fontFamily: 'Revalia',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 2
            }
        )
        healthText.setColor('#F32424')
        this.scene.tweens.add(
            {
                targets: healthText,
                props: { y: healthText.y - 150 },
                duration: 500,
                ease: 'Power0',
                yoyo: false,
                onComplete: () => {
                    healthText.destroy();
                }
            }
        )
    }

    private tweenScoreText() {
        // Tween score
        let scoreText = this.scene.add.text(
            this.x - 100,
            this.y - 50,
            this.dyingValue.toString(),
            {
                fontSize: '50px',
                fontFamily: 'Revalia',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 2
            }
        )


        this.exploEmitter.setPosition(this.x, this.y);
        this.scene.tweens.add(
            {
                targets: scoreText,
                props: { y: scoreText.y - 50 },
                duration: 800,
                ease: 'Power0',
                yoyo: false,
                onComplete: () => {
                    scoreText.destroy();
                    this.exploEmitter.remove();
                }
            }
        )
    }

    public updateHealth(damage: number): void {
        if (this.health > 0) {
            this.scene.sound.play('hit_enemy')
            this.tweenHealthText(damage);
            this.health -= 0.05 * damage;
            if (this.health < 0) {
                this.health = 0;
            }
            this.redrawLifebar();

        } else {
            this.scene.sound.play('boom')

            // Update score
            this.scene.registry.set(
                'score',
                this.scene.registry.get('score') + this.dyingValue);

            // Tween score
            this.tweenScoreText();

            this.health = 0;
            this.active = false;
        }
    }
}
