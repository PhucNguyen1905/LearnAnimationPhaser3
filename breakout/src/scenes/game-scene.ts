import { Ball } from '../objects/ball';
import { Brick } from '../objects/brick';
import { Player } from '../objects/player';
import { settings } from '../settings';

const BRICK_COLORS: number[] = [0xf2e49b, 0xbed996, 0xf2937e, 0xffffff];

export class GameScene extends Phaser.Scene {
  private ball: Ball;
  private bricks: Phaser.GameObjects.Group;
  private player: Player;
  private scoreText: Phaser.GameObjects.BitmapText;
  private highScoreText: Phaser.GameObjects.BitmapText;
  private livesText: Phaser.GameObjects.BitmapText;

  private bounceWallEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private bounceBrickEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private fire: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    settings.highScore = settings.score;
    settings.score = 0;
    settings.lives = 3;
  }

  create(): void {
    this.createBricks();

    this.createPlayer();

    this.createBall();

    this.createTexts();

    this.createColliders();

    this.createEvents();

    this.setupPhysic();

    this.createParticle();
  }

  createBricks() {
    // bricks
    this.bricks = this.add.group();

    const BRICKS = settings.LEVELS[settings.currentLevel].BRICKS;
    const WIDTH = settings.LEVELS[settings.currentLevel].WIDTH;
    const HEIGHT = settings.LEVELS[settings.currentLevel].HEIGHT;
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        this.bricks.add(
          new Brick({
            scene: this,
            x: (settings.BRICK.WIDTH + settings.BRICK.SPACING) * x,
            y:
              settings.BRICK.MARGIN_TOP +
              y * (settings.BRICK.HEIGHT + settings.BRICK.SPACING),
            width: settings.BRICK.WIDTH,
            height: settings.BRICK.HEIGHT,
            fillColor: BRICK_COLORS[BRICKS[y * 14 + x]]
          })
        );
      }
    }

  }

  createPlayer() {
    // player
    this.player = new Player({
      scene: this,
      x: +this.game.config.width / 2 - 20,
      y: +this.game.config.height - 50,
      width: 400,
      height: 10
    });
  }

  createBall() {
    // ball
    this.ball = new Ball({ scene: this, x: 0, y: 0 }).setVisible(false);
  }

  createTexts() {
    // score
    this.scoreText = this.add.bitmapText(
      10,
      10,
      'font',
      `Score: ${settings.score}`,
      8
    );

    this.highScoreText = this.add.bitmapText(
      10,
      20,
      'font',
      `Highscore: ${settings.highScore}`,
      8
    );

    this.livesText = this.add.bitmapText(
      10,
      30,
      'font',
      `Lives: ${settings.lives}`,
      8
    );
  }

  createColliders() {
    // collisions
    // ----------
    this.physics.add.collider(
      this.ball,
      this.player,
      this.ballPlayerCollision,
      null,
      this);
    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.ballBrickCollision,
      null,
      this
    );
  }

  createEvents() {
    // events
    // ------
    this.events.on('scoreChanged', this.updateScore, this);
    this.events.on('livesChanged', this.updateLives, this);
  }

  setupPhysic() {
    // physics
    // -------
    this.physics.world.setBoundsCollision(true, true, true, true);
    this.physics.world.checkCollision.down = false;
    this.ball.body.onWorldBounds = true;
    this.physics.world.on('worldbounds', this.ballHitWorldBounds, this)
  }

  createParticle() {
    this.bounceWallEmitter = this.add.particles('snow').createEmitter({
      x: -100,
      y: -100,
      lifespan: 200,
      speed: 50,
      alpha: 0.2,
      scale: 0.1,
      blendMode: Phaser.BlendModes.COLOR
    });

    this.bounceBrickEmitter = this.add.particles('flares').createEmitter({
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

    this.fire = this.add.particles('flares').createEmitter({
      frame: { frames: ['green', 'yellow'], cycle: true },
      x: 100,
      y: 300,
      lifespan: 200,
      speedX: 0,
      speedY: { min: -100, max: 100 },
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      follow: this.ball,
      followOffset: { x: 5, y: 5 }

    });
    this.fire.visible = false;
    this.fire.reserve(1000);


  }


  update(): void {
    this.player.update();

    if (this.player.start && !this.ball.visible) {
      this.ball.setPosition(this.player.x, this.player.y - 200);
      this.ball.applyInitVelocity();
      this.ball.setVisible(true);
    }
    if (this.ball.visible) {
      this.fire.visible = true;
    }

    if (this.ball.y > this.game.config.height) {
      settings.lives -= 1;
      this.fire.visible = false;
      this.events.emit('livesChanged');

      if (settings.lives === 0) {
        this.gameOver();
      } else {
        this.player.body.setVelocity(0);
        this.player.resetToStartPosition();
        this.ball.setPosition(0, 0);
        this.ball.body.setVelocity(0);
        this.ball.setVisible(false);
      }
    }
  }

  private ballBrickCollision(ball: Ball, brick: Brick): void {
    let b1 = new Brick({ scene: this, x: brick.x, y: brick.y, width: brick.width / 2, height: brick.height, fillColor: brick.color })
    b1.setAngle(-20)
    let b2 = new Brick({ scene: this, x: brick.x + brick.width / 2 + 5, y: brick.y, width: brick.width / 2, height: brick.height, fillColor: brick.color })
    b2.setAngle(20)
    let y = brick.y;
    let x = brick.x;
    this.bounceBrickEmitter.explode(5, x, y);
    brick.destroy();
    for (const b of [b1, b2]) {
      this.tweens.add({
        targets: b,
        x: x + Phaser.Math.RND.between(-1, 1) * Math.random() * 40,
        y: y + Math.random() * 40,
        duration: 1000,
        scale: { from: 1, to: 0.25, ease: 'Quad.easeOut' },
        alpha: { from: 0.8, to: 0, ease: 'Quad.easeIn' },
        onComplete: () => {
          // brick.destroy();
          b.destroy();
          settings.score += 5;
          this.events.emit('scoreChanged');
        }
      })
    }



    if (this.bricks.countActive() === 0) {
      // all bricks are gone!
      this.scene.restart();
    }
  }

  private ballHitWorldBounds(ballBody: Phaser.Physics.Arcade.Body) {
    this.bounceWallEmitter.explode(35, ballBody.x, ballBody.y)

  }
  private ballPlayerCollision(ball: Ball, player: Player) {
    this.bounceWallEmitter.explode(35, ball.x, ball.y)

  }

  private gameOver(): void {
    this.scene.restart();
  }

  private updateScore(): void {
    this.scoreText.setText(`Score: ${settings.score}`);
  }

  private updateLives(): void {
    this.livesText.setText(`Lives: ${settings.lives}`);
  }
}
