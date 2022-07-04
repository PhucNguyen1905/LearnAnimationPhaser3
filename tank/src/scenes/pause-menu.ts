export class PauseMenu extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private contBtn: Phaser.GameObjects.Image;
    private restartBtn: Phaser.GameObjects.Image;
    private soundBtn: Phaser.GameObjects.Image;

    private container: Phaser.GameObjects.Container;
    constructor() {
        super({
            key: 'PauseMenu'
        });
    }

    create(): void {
        this.createButtons();

        this.createContainer();

        this.createInputHandler();
    }

    createButtons() {
        this.background = this.add.image(150, 0, 'back').setScale(2.5, 1.6);
        this.contBtn = this.add.sprite(0, 0, 'continue').setInteractive();
        this.restartBtn = this.add.sprite(150, 0, 'restart').setInteractive();
        this.soundBtn = this.add.sprite(300, 0, 'sound' + this.sound.mute).setInteractive();
    }

    createContainer() {
        this.container = this.add.container(
            this.sys.canvas.width / 2 - 100,
            this.sys.canvas.height / 2,
            [this.background, this.contBtn, this.restartBtn, this.soundBtn]);

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
        });
        this.restartBtn.on('pointerover', () => {
            this.restartBtn.setTint(0x76BA99);
            this.sound.play('mouseover')
        });
        this.restartBtn.on('pointerout', () => {
            this.restartBtn.clearTint();
        });
        this.soundBtn.on('pointerover', () => {
            this.sound.play('mouseover')
            this.soundBtn.setTint(0x76BA99);
        });
        this.soundBtn.on('pointerout', () => {
            this.soundBtn.clearTint();
        });

        this.contBtn.on('pointerup', () => {
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
                    this.scene.resume('GameScene');
                    this.scene.stop();
                }
            })

        })
        this.restartBtn.on('pointerup', () => {
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
        this.soundBtn.on('pointerup', () => {
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
