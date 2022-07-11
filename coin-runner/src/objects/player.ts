import { IImageConstructor } from '../Interfaces/ImageInterface';

export class Player extends Phaser.GameObjects.Image {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private walkingSpeed: number;

  private rotateTween: Phaser.Tweens.Tween;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.initVariables();
    this.initImage();
    this.initInput();

    this.initTweens();

    this.scene.add.existing(this);
  }

  private initVariables(): void {
    this.walkingSpeed = 5;
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initInput(): void {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  private initTweens() {
    this.rotateTween = this.scene.tweens.addCounter({
      from: 0,
      to: 360,
      duration: 800,
      repeat: -1,
      onUpdate: () => {
        this.setAngle(this.rotateTween.getValue());
      }
    })
    this.rotateTween.stop();
  }

  update(): void {
    this.handleInput();
    if (this.x > this.scene.sys.canvas.width
      || this.x < - this.width
      || this.y < -this.height
      || this.y > this.scene.sys.canvas.height) {
      this.rollingBack();
      this.rotateTween.restart();
    }
  }

  rollingBack() {
    this.scene.tweens.add({
      targets: this,
      props: {
        x: { value: this.scene.sys.canvas.width / 2, duration: 1000, ease: 'Power2' },
        y: { value: this.scene.sys.canvas.height / 2, duration: 500, ease: 'Power2' }
      },
      delay: 1000,
      onComplete: () => {
        this.scene.time.delayedCall(500, () => {
          this.rotateTween.stop();
          this.setAngle(0)
        })
      }
    });
  }

  private handleInput(): void {
    if (this.cursors.right.isDown) {
      this.x += this.walkingSpeed;
      this.setFlipX(false);
    } else if (this.cursors.left.isDown) {
      this.x -= this.walkingSpeed;
      this.setFlipX(true);
    } else if (this.cursors.up.isDown) {
      this.y -= this.walkingSpeed;
    } else if (this.cursors.down.isDown) {
      this.y += this.walkingSpeed;
    }
  }

  public rotatePlayer(time: number) {
    this.rotateTween.restart();
    this.scene.time.delayedCall(time, () => {
      this.rotateTween.stop();
      this.setAngle(0)
    })
  }
}
