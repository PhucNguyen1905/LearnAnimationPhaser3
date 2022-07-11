export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
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

    const intro = this.add.bitmapText(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      'font',
      'PRESS S TO PLAY',
      30
    ).setOrigin(0.5, 0.5);
    this.bitmapTexts.push(intro);

    this.tweens.add({
      targets: intro,
      scaleX: 1.4,
      scaleY: 1.4,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })

  }
  createBackground() {
    const bg = this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
    bg.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height)
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('GameScene');
    }
  }
}
