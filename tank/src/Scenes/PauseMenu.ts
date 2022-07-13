import { Button } from "../Objects/Buttons/Button";

export class PauseMenu extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private pauseImg: Phaser.GameObjects.Image;
    private continueButton: Button;
    private restartButton: Button;
    private exitButton: Button;
    private soundButton: Button;

    private container: Phaser.GameObjects.Container;

    private zone: Phaser.GameObjects.Zone;

    constructor() {
        super({
            key: 'PauseMenu'
        });
    }

    create(): void {
        this.createZone();

        this.createBackground();

        this.createButtons();

        this.createContainer();

        this.inputHandler();
    }

    private createZone() {
        const width = this.sys.canvas.width;
        const height = this.sys.canvas.height;

        this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
            .setOrigin(0, 0)

        this.zone = this.add.zone(0, 0, width, height)
            .setOrigin(0, 0);
    }

    private createBackground() {
        this.background = this.add.image(0, 0, 'back')
            .setScale(2.6, 1.7);
        this.pauseImg = this.add.image(0, -220, 'pauseimg')
            .setScale(1.2);

        this.tweens.add({
            targets: this.pauseImg,
            scaleX: 1.4,
            scaleY: 1.4,
            yoyo: true,
            repeat: -1,
            duration: 1500
        })
    }

    private createButtons() {
        this.continueButton = new Button({ scene: this, x: -220, y: 0, texture: 'continue' })
        this.restartButton = new Button({ scene: this, x: -70, y: 0, texture: 'restart' })
        this.soundButton = new Button({ scene: this, x: 80, y: 0, texture: 'sound' + this.sound.mute })
        this.exitButton = new Button({ scene: this, x: 230, y: 0, texture: 'exit' })
    }

    private createContainer() {
        this.container = this.add.container(
            0, 0,
            [
                this.pauseImg,
                this.background,
                this.continueButton,
                this.restartButton,
                this.soundButton,
                this.exitButton
            ]);
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

    private inputHandler() {
        this.continueButton.on('pointerup', () => {
            this.continueButton.setScale(1);
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

        this.restartButton.on('pointerup', () => {
            this.restartButton.setScale(1);
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

        this.exitButton.on('pointerup', () => {
            this.exitButton.setScale(1);
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
                    this.scene.get('GameScene').scene.stop()
                    this.scene.start('MenuScene')
                    this.scene.stop();
                },
                delay: 100
            })

        })

        this.soundButton.on('pointerup', () => {
            this.soundButton.setScale(1)
            this.sound.play('click')
            if (this.sound.mute) {
                this.sound.mute = false;
                this.soundButton.setTexture('soundfalse');
            } else {
                this.sound.mute = true;
                this.soundButton.setTexture('soundtrue');
            }
        })
    }
}
