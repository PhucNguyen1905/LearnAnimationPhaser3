import { Coin } from '../objects/coin';
import { Player } from '../objects/player';

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  private coin: Coin;
  private coinsCollectedText: Phaser.GameObjects.Text;
  private collectedCoins: number;
  private player: Player;
  private touchEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload(): void {
    this.load.image('background', './assets/images/background.png');
    this.load.image('player', './assets/images/player.png');
    this.load.image('coin', './assets/images/coin.png');
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
  }

  init(): void {
    this.collectedCoins = 0;
  }

  create(): void {
    this.createBackground();

    this.createCoin();

    this.createPlayer();

    this.createTexts();

    this.createParticle();

  }

  createBackground() {
    // create background
    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0, 0);

  }

  createCoin() {
    this.coin = new Coin({
      scene: this,
      x: Phaser.Math.RND.integerInRange(100, 700),
      y: Phaser.Math.RND.integerInRange(100, 500),
      texture: 'coin'
    });
  }

  createPlayer() {
    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      texture: 'player'
    });
  }

  createTexts() {
    this.coinsCollectedText = this.add.text(
      this.sys.canvas.width / 2,
      this.sys.canvas.height - 50,
      this.collectedCoins + '',
      {
        fontFamily: 'Arial',
        fontSize: 38 + 'px',
        stroke: '#fff',
        strokeThickness: 6,
        color: '#000000'
      }
    );
  }

  createParticle() {

    this.touchEmitter = this.add.particles('flares').createEmitter({
      x: -100,
      y: -100,
      frame: 'red',
      speed: { min: -200, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      lifespan: 500,
      gravityY: 800
    });
  }

  update(): void {
    // update objects
    this.player.update();
    this.coin.update();

    // do the collision check
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        this.coin.getBounds()
      ) && !this.coin.isMoving
    ) {
      this.touchEmitter.explode(20, this.coin.x, this.coin.y);
      this.updateCoinStatus();
    }
  }

  private updateCoinStatus(): void {
    this.collectedCoins++;
    this.coinsCollectedText.setText(this.collectedCoins + '');
    this.coin.changePosition();
  }


}
