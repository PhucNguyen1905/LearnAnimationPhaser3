export class MenuScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key;
    private bg: Phaser.GameObjects.Sprite;
    private intro: Phaser.GameObjects.BitmapText;
    private introSound: Phaser.Sound.BaseSound;
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

    constructor() {
        super({
            key: 'MenuScene'
        });
    }

    init(): void {
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );
        this.startKey.isDown = false;
    }

    create(): void {
        this.createBackground();

        this.introSound = this.sound.add('intro', { volume: 0.7 });
        this.introSound.play();

        this.intro = this.add.bitmapText(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            'font',
            'PRESS S TO PLAY',
            30
        ).setOrigin(0.5, 0.5);
        this.bitmapTexts.push(this.intro);

        this.tweens.add({
            targets: this.intro,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 1000,
            yoyo: true,
            repeat: -1
        })

    }

    private createBackground() {
        this.bg = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'bg').setOrigin(0.5, 0.5);
        this.bg.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height)
    }

    update(): void {
        if (this.startKey.isDown) {
            this.tweens.add({
                targets: [this.bg, this.intro],
                scaleX: 0.4,
                scaleY: 0.5,
                alpha: { start: 1, end: 0.2 },
                duration: 500,
                onComplete: () => {
                    this.introSound.stop();
                    this.scene.start('GameScene');
                }
            })
        }
    }
}
