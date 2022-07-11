export class PauseMenu extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private pauseImg: Phaser.GameObjects.Image;
    private contBtn: Phaser.GameObjects.Image;
    private restartBtn: Phaser.GameObjects.Image;
    private soundBtn: Phaser.GameObjects.Image;

    private container: Phaser.GameObjects.Container;

    private zone: Phaser.GameObjects.Zone;

    constructor() {
        super({
            key: 'PauseMenu'
        });
    }

    create(): void {
        this.createZone();

        this.createButtons();

        this.createContainer();

        this.createInputHandler();
    }

    createZone() {
        const rec = this.add.rectangle(0, 0, this.sys.canvas.width, this.sys.canvas.height, 0x000000, 0.7).setOrigin(0, 0)

        this.zone = this.add.zone(0, 0, this.sys.canvas.width, this.sys.canvas.height).setOrigin(0, 0);
    }

    createButtons() {
        this.background = this.add.image(0, 0, 'back').setScale(2.2, 1.6);
        this.pauseImg = this.add.image(0, -220, 'pauseimg').setScale(1.2);
        this.contBtn = this.add.sprite(-150, 0, 'continue').setInteractive();
        this.restartBtn = this.add.sprite(0, 0, 'restart').setInteractive();
        this.soundBtn = this.add.sprite(150, 0, 'sound' + this.sound.mute).setInteractive();
    }

    createContainer() {
        this.container = this.add.container(
            0, 0,
            [this.pauseImg, this.background, this.contBtn, this.restartBtn, this.soundBtn]);
        Phaser.Display.Align.In.Center(this.container, this.zone);

        this.tweens.add({
            targets: this.container,
            scale: {
                from: 0,
                to: 1
            },
            duration: 300,
            ease: 'Linear'
        })
    }

    createInputHandler() {
        this.contBtn.on('pointerover', () => {
            this.contBtn.setTint(0x76BA99);
            this.sound.play('mouseover')
        });
        this.contBtn.on('pointerout', () => {
            this.contBtn.clearTint();
            this.contBtn.setScale(1)
        });
        this.restartBtn.on('pointerover', () => {
            this.restartBtn.setTint(0x76BA99);
            this.sound.play('mouseover')
        });
        this.restartBtn.on('pointerout', () => {
            this.restartBtn.clearTint();
            this.restartBtn.setScale(1)
        });
        this.soundBtn.on('pointerover', () => {
            this.sound.play('mouseover')
            this.soundBtn.setTint(0x76BA99);
        });
        this.soundBtn.on('pointerout', () => {
            this.soundBtn.setScale(1)
            this.soundBtn.clearTint();
        });


        this.contBtn.on('pointerdown', () => {
            this.contBtn.setScale(1.1);
        })
        this.contBtn.on('pointerup', () => {
            this.contBtn.setScale(1);
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
                    this.scene.stop();
                    this.scene.resume('GameScene');
                },
                delay: 100
            })

        })

        this.restartBtn.on('pointerdown', () => {
            this.restartBtn.setScale(1.1);
        })
        this.restartBtn.on('pointerup', () => {
            this.restartBtn.setScale(1);
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
                    this.scene.start('GameScene')
                    this.scene.stop();
                },
                delay: 100
            })

        })

        this.soundBtn.on('pointerdown', () => {
            this.soundBtn.setScale(1.1);
        })
        this.soundBtn.on('pointerup', () => {
            this.soundBtn.setScale(1)
            this.sound.play('click')
            if (this.sound.mute) {
                this.sound.mute = false;
                this.soundBtn.setTexture('soundfalse');
            } else {
                this.sound.mute = true;
                this.soundBtn.setTexture('soundtrue');
            }
        })
    }
}
