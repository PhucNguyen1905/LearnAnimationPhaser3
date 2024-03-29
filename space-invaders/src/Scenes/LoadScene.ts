import { AnimationHelper } from '../Helpers/AnimationHelper';

export class LoadScene extends Phaser.Scene {
  private animationHelperInstance: AnimationHelper;
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: 'LoadScene'
    });
  }

  preload(): void {
    // set the background and create loading bar
    this.cameras.main.setBackgroundColor(0x98d687);
    this.createLoadingbar();

    // pass value to change the loading bar fill
    this.load.on(
      'progress',
      function (value: number) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xfff6d3, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );

    // delete bar graphics, when loading complete
    this.load.on(
      'complete',
      function () {
        this.animationHelperInstance = new AnimationHelper(
          this,
          this.cache.json.get('animationJSON')
        );
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this
    );

    // load out package
    this.load.pack('preload', './assets/pack.json', 'preload');

    this.load.image('fire', 'assets/particles/muzzleflash3.png');
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
  }

  update(): void {
    this.scene.start('MenuScene');
  }

  private createLoadingbar(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x5dae47, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}
