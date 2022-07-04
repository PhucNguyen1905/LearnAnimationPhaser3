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
        this.soundBtn = this.add.sprite(300, 0, 'sound').setInteractive();
    }

    createContainer() {
        this.add.container(this.sys.canvas.width / 2 - 100, this.sys.canvas.height / 2, [this.background, this.contBtn, this.restartBtn, this.soundBtn])
    }

    createInputHandler() {
        this.contBtn.on('pointerover', () => {
            this.contBtn.setTint(0x76BA99);
        });
        this.contBtn.on('pointerout', () => {
            this.contBtn.clearTint();
        });
        this.restartBtn.on('pointerover', () => {
            this.restartBtn.setTint(0x76BA99);
        });
        this.restartBtn.on('pointerout', () => {
            this.restartBtn.clearTint();
        });
        this.soundBtn.on('pointerover', () => {
            this.soundBtn.setTint(0x76BA99);
        });
        this.soundBtn.on('pointerout', () => {
            this.soundBtn.clearTint();
        });



        this.contBtn.on('pointerup', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        })
        this.restartBtn.on('pointerup', () => {
            // this.scene.pause();
            // this.scene.launch('PauseMenu');
        })
        this.soundBtn.on('pointerup', () => {
            // this.scene.pause();
            // this.scene.launch('PauseMenu');
        })
    }
}
