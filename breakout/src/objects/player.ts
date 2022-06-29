import { IRectangleConstructor } from '../interfaces/interfaces';

export class Player extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body;

  public start: boolean = false;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(aParams: IRectangleConstructor) {
    super(
      aParams.scene,
      aParams.x,
      aParams.y,
      aParams.width,
      aParams.height,
      aParams.fillColor,
      aParams.fillAlpha
    );

    this.initRectangle();
    this.initPhysics();
    this.initInput();
    this.scene.add.existing(this);
  }

  private initRectangle(): void {
    this.setFillStyle(0x9697c6, 1);
  }

  private initPhysics(): void {
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds();
    this.body.setDragX(300);
    this.body.setImmovable(true);
  }

  private initInput(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update(): void {
    this.handleInput();
  }

  private handleInput(): void {
    if (this.cursors.right.isDown) {
      this.start = true;
      this.x += 5;
    } else if (this.cursors.left.isDown) {
      this.start = true;
      this.x -= 5;
    }
    // this.body.setVelocityX(0)
  }

  public resetToStartPosition(): void {
    this.start = false;
    this.x = +this.scene.game.config.width / 2 - 20;
    this.y = +this.scene.game.config.height - 50;
  }
}
