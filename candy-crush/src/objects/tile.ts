import { IImageConstructor } from '../interfaces/image.interface';

export class Tile extends Phaser.GameObjects.Image {
  type: string;
  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    // set image settings
    this.type = aParams.texture;
    this.setOrigin(0, 0);
    this.setInteractive();

    this.scene.add.existing(this);
  }
}
