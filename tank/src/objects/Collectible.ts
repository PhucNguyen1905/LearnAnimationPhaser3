import { IImageConstructor } from "../Interfaces/IImageConstructor";

export class Collectible extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;

    // variables
    public typePowerUp: string;
    private scaleTween: Phaser.Tweens.Tween;

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

        // variables
        this.initSprite();
        this.scene.add.existing(this);
    }

    private initSprite() {
        // sprite
        this.setOrigin(0.5, 0.5);
        this.genTypePowerUp();

        this.initTween();

        // physics
        this.scene.physics.world.enable(this);

    }

    private genTypePowerUp() {
        let t = Phaser.Math.Between(0, 2);
        this.setFrame(t);
        switch (t) {
            case 0: {
                this.typePowerUp = 'incDamage';
                break;
            }
            case 1: {
                this.typePowerUp = 'incHealth';
                break;
            }
            case 2: {
                this.typePowerUp = 'incSpeed';
                break;
            }
        }
    }

    private initTween() {
        this.scaleTween = this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 800,
            yoyo: true,
            repeat: -1
        })
    }

    update(): void { }

    public collected(): void {
        this.scaleTween.stop();
        this.scene.physics.world.disable(this);

        this.scene.tweens.add({
            targets: this,
            scale: { from: 1.2, to: 0.2 },
            alpha: { from: 1, to: 0.2 },
            duration: 400,
            onComplete: () => {
                this.destroy();
            }
        })
    }
}
