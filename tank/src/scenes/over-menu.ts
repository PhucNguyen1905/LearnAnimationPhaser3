export class OverMenu extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private restartBtn: Phaser.GameObjects.Image;
    private scoreImg: Phaser.GameObjects.Image;
    private scoreText: Phaser.GameObjects.Text;
    private highScoreImg: Phaser.GameObjects.Image;
    private highScoreText: Phaser.GameObjects.Text;

    private container: Phaser.GameObjects.Container;

    private zone: Phaser.GameObjects.Zone;

    constructor() {
        super({
            key: 'OverMenu'
        });
    }

    create(): void {
        this.createZone();

        this.createMenu();

        this.createContainer();

        this.createInputHandler();
    }

    createZone() {
        const rec = this.add.rectangle(0, 0, this.sys.canvas.width, this.sys.canvas.height, 0x000000, 0.7).setOrigin(0, 0)

        this.zone = this.add.zone(0, 0, this.sys.canvas.width, this.sys.canvas.height).setOrigin(0, 0);
    }


    createMenu() {
        this.background = this.add.image(0, 0, 'back').setScale(2.2, 3.8);

        this.scoreImg = this.add.image(-150, -65, 'score')
        this.scoreText = this.add.text(-35, -100, '', { fontSize: '50px', fontFamily: 'Revalia', align: 'center', stroke: '#000000', strokeThickness: 2 }).setFontSize(80);

        this.highScoreImg = this.add.image(-150, 80, 'high')
        this.highScoreText = this.add.text(-35, 45, '', { fontSize: '50px', fontFamily: 'Revalia', align: 'center', stroke: '#000000', strokeThickness: 2 }).setFontSize(80);

        this.restartBtn = this.add.sprite(150, 15, 'newgame').setInteractive();
    }

    createContainer() {
        this.container = this.add.container(
            0, 0,
            [this.background, this.scoreImg, this.scoreText, this.highScoreImg, this.highScoreText, this.restartBtn]);
        Phaser.Display.Align.In.Center(this.container, this.zone);

        this.tweens.add({
            targets: this.container,
            scale: {
                from: 0,
                to: 1
            },
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                this.createScoreText();
            }
        })
    }

    createScoreText() {
        // let score = this.registry.get('score') || 0;
        let score = this.registry.get('score') || 0;
        this.tweens.add({
            targets: this.scoreText,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
            duration: 500
        })
        this.tweens.addCounter({
            from: 0,
            to: score,
            duration: 1000,
            onUpdate: (tween) => {
                this.scoreText.setText(Math.floor(tween.getValue()).toString());
            }
        })

        let highScore = this.registry.get('highScore') || 0;
        this.tweens.add({
            targets: this.highScoreText,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
            duration: 500
        })
        this.tweens.addCounter({
            from: 0,
            to: highScore,
            duration: 1000,
            onUpdate: (tween) => {
                this.highScoreText.setText(Math.floor(tween.getValue()).toString());
            }
        })

        this.time.delayedCall(1250, () => {
            if (score == highScore) {
                this.sound.play('yeah')
                let logoSource = {
                    getRandomPoint: (vec: any) => {
                        let x = Phaser.Math.Between(0, this.sys.canvas.width);
                        let y = Phaser.Math.Between(0, this.sys.canvas.height);

                        return vec.setTo(x, y);
                    }
                };

                this.add.particles('flares').createEmitter({
                    x: 0,
                    y: 0,
                    lifespan: 1000,
                    gravityY: 10,
                    scale: { start: 0, end: 0.5, ease: 'Quad.easeOut' },
                    alpha: { start: 1, end: 0, ease: 'Quad.easeIn' },
                    blendMode: 'ADD',
                    emitZone: { type: 'random', source: logoSource }
                });
            } else {
                this.sound.play('over')
            }
        })

    }

    createInputHandler() {
        this.restartBtn.on('pointerover', () => {
            this.sound.play('mouseover')
            this.restartBtn.setTint(0x76BA99);
        });

        this.restartBtn.on('pointerout', () => {
            this.restartBtn.clearTint();
            this.restartBtn.setScale(1)
        });

        this.restartBtn.on('pointerdown', () => {
            this.restartBtn.setScale(1.1);
        })

        this.restartBtn.on('pointerup', () => {
            this.restartBtn.setScale(1)
            this.sound.play('click')
            this.tweens.add({
                targets: this.container,
                scale: {
                    from: 1,
                    to: 0
                },
                duration: 250,
                ease: 'Linear',
                onComplete: () => {
                    this.scene.start('GameScene');
                    this.scene.stop();
                }
            })

        })

    }
}
