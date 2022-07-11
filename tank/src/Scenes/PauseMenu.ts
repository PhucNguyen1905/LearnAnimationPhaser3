import { Button } from "../Objects/Buttons/Button";

export class PauseMenu extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private pauseImg: Phaser.GameObjects.Image;
    private contBtn: Button;
    private restartBtn: Button;
    private exitBtn: Button;
    private soundBtn: Button;

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
        this.background = this.add.image(0, 0, 'back').setScale(2.6, 1.7);
        this.pauseImg = this.add.image(0, -220, 'pauseimg').setScale(1.2);
        this.contBtn = new Button({ scene: this, x: -220, y: 0, texture: 'continue' })
        this.restartBtn = new Button({ scene: this, x: -70, y: 0, texture: 'restart' })
        this.soundBtn = new Button({ scene: this, x: 80, y: 0, texture: 'sound' + this.sound.mute })
        this.exitBtn = new Button({ scene: this, x: 230, y: 0, texture: 'exit' })
    }

    createContainer() {
        this.container = this.add.container(
            0, 0,
            [this.pauseImg, this.background, this.contBtn, this.restartBtn, this.soundBtn, this.exitBtn]);
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

        this.exitBtn.on('pointerup', () => {
            this.exitBtn.setScale(1);
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
