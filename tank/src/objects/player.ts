import { IImageConstructor } from '../Interfaces/IImageConstructor';
import { BulletManager } from './Bullet/BulletManager';

export class Player extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    // variables
    private health: number;
    private damage: number;
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
        this.damage = 2;
        this.nextShootTime = 0;
        this.speed = 100;

        // image
        this.setOrigin(0.5, 0.5);
        this.setDepth(0);
        this.angle = 180;

        this.initBarrel();

        this.lifeBar = this.scene.add.graphics();
        this.redrawLifebar();

        // game objects
        this.bullets = new BulletManager(this.scene, 'bulletBlue', 10, this.damage)

        // input
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        // physics
        this.scene.physics.world.enable(this);

    }

    private initBarrel() {
        this.barrel = this.scene.add.image(this.x, this.y, 'barrelBlue');
        this.barrel.setOrigin(0.5, 1);
        this.barrel.setDepth(1);
        this.barrel.angle = 180;
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
        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.active) {
                let angle = Phaser.Math.Angle.Between(
                    this.barrel.x,
                    this.barrel.y,
                    pointer.x + this.scene.cameras.main.scrollX,
                    pointer.y + this.scene.cameras.main.scrollY
                );
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

                this.bullets.fireBullet(
                    this.barrel.x,
                    this.barrel.y,
                    this.barrel.rotation
                )

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
        this.lifeBar.strokeRect(
            -this.width / 2,
            this.height / 2,
            this.width,
            15
        );
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

    private tweenHealthText(damage: number) {
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
        healthText.setColor('#0078AA')
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

    public updateHealth(damage: number): void {
        if (this.health > 0) {
            this.scene.sound.play('hit')
            this.tweenHealthText(damage);
            this.health -= 0.025 * damage;
            if (this.health < 0) {
                this.health = 0;
            }

            this.redrawLifebar();

        } else {
            this.scene.sound.play('boom')
            this.updateHighScore();

            this.health = 0;
            this.active = false;

            this.scene.scene.pause();
            this.scene.events.off('enemyDying')
            this.scene.sound.stopByKey('playsound');
            this.scene.scene.launch('OverMenu');
        }
    }

    private tweenPowerUp(color: string, num: number) {
        let healthText = this.scene.add.text(
            this.x - Phaser.Math.Between(30, 70),
            this.y - 50,
            num.toString(),
            {
                fontSize: '60px',
                fontFamily: 'Revalia',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 2
            }
        )
        healthText.setColor(color)
        this.scene.tweens.add(
            {
                targets: healthText,
                props: { y: healthText.y - 150 },
                duration: 700,
                ease: 'Power0',
                yoyo: false,
                onComplete: () => {
                    healthText.destroy();
                }
            }
        )
    }

    public handleGetPowerup(type: string) {
        switch (type) {
            case 'incDamage': {
                let color = '#3EC70B';
                this.damage += 2;
                this.bullets.updateBulletDamage(this.damage);
                this.tweenPowerUp(color, 2);
                break;
            }
            case 'incHealth': {
                let color = '#e66a28';
                this.health = (this.health + 0.25) % 1;
                this.redrawLifebar();
                this.tweenPowerUp(color, 25);
                break;
            }
            case 'incSpeed': {
                let color = '#FAC213';
                this.speed += 20;
                this.tweenPowerUp(color, 20);
                break;
            }
        }
    }
}
