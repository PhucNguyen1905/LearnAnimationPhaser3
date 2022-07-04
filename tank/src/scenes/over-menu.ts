export class OverMenu extends Phaser.Scene {

    private background: Phaser.GameObjects.Image;
    private restartBtn: Phaser.GameObjects.Image;
    private scoreImg: Phaser.GameObjects.Image;
    private scoreText: Phaser.GameObjects.Text;
    private highScoreImg: Phaser.GameObjects.Image;
    private highScoreText: Phaser.GameObjects.Text;

    private container: Phaser.GameObjects.Container;
    constructor() {
        super({
            key: 'OverMenu'
        });
    }

    create(): void {
        this.createMenu();

        this.createContainer();

        this.createInputHandler();
    }

    createMenu() {
        this.background = this.add.image(150, 0, 'back').setScale(2, 4.75);

        this.scoreImg = this.add.image(0, -145, 'score')
        this.scoreText = this.add.text(200, -165, this.registry.get('score') || 0).setFontSize(80);

        this.highScoreImg = this.add.image(0, 5, 'high')
        this.highScoreText = this.add.text(200, -20, this.registry.get('highScore') || 0).setFontSize(80);

        this.restartBtn = this.add.sprite(150, 150, 'newgame').setInteractive();
    }

    createContainer() {
        this.container = this.add.container(
            this.sys.canvas.width / 2 - 100,
            this.sys.canvas.height / 2,
            [this.background, this.scoreImg, this.scoreText, this.highScoreImg, this.highScoreText, this.restartBtn]);

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
        this.restartBtn.on('pointerover', () => {
            this.sound.play('mouseover')
            this.restartBtn.setTint(0x76BA99);
        });

        this.restartBtn.on('pointerout', () => {
            this.restartBtn.clearTint();
        });

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

    }
}
