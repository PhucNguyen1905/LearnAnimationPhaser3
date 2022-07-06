import { IImageConstructor } from '../interfaces/image.interface';

export class Coin extends Phaser.GameObjects.Image {
  private centerOfScreen: number;
  private changePositionTimer: Phaser.Time.TimerEvent;
  private lastPosition: string;
  public isMoving: boolean = false;

  private rotateTween: Phaser.Tweens.Tween;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.initVariables();
    this.initImage();
    this.initEvents();
    this.initTween();

    this.setDepth(5)


    this.scene.add.existing(this);
  }

  private initVariables(): void {
    this.centerOfScreen = this.scene.sys.canvas.width / 2;
    this.changePositionTimer = null;
    this.setFieldSide();
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initTween() {

    this.scene.tweens.add({
      targets: this,
      scaleX: 1.2,
      scaleY: 1.2,
      ease: 'Sine.easeInOut',
      duration: 1000,
      repeat: -1,
      yoyo: true
    })

    this.rotateTween = this.scene.tweens.addCounter({
      from: 0,
      to: 360,
      duration: 2000,
      repeat: -1,
      onUpdate: () => {
        //  tween.getValue = range between 0 and 360

        this.setAngle(this.rotateTween.getValue());
      }
    })
  }

  private initEvents(): void {
    this.changePositionTimer = this.scene.time.addEvent({
      delay: 5000,
      callback: this.changePosition,
      callbackScope: this,
      loop: true
    });
  }

  update(): void { }

  public changePosition(): void {
    this.setNewPosition();
    this.setFieldSide();

    this.changePositionTimer.reset({
      delay: 5000,
      callback: this.changePosition,
      callbackScope: this,
      loop: true
    });
  }

  private setNewPosition(): void {
    let x, y;
    if (this.lastPosition == 'right') {
      x = Phaser.Math.RND.integerInRange(100, this.centerOfScreen);
    } else {
      x = Phaser.Math.RND.integerInRange(385, 700);
    }
    y = Phaser.Math.RND.integerInRange(100, 500);
    this.isMoving = true;
    this.scene.tweens.add({
      targets: this,
      props: {
        x: { value: x, duration: 1500, ease: 'Power2' },
        y: { value: y, duration: 1500, ease: 'Bounce.easeOut' }
      },
      onComplete: () => {
        this.isMoving = false;
      }
    })
  }

  private setFieldSide(): void {
    if (this.x <= this.centerOfScreen) {
      this.lastPosition = 'left';
    } else {
      this.lastPosition = 'right';
    }
  }
}
