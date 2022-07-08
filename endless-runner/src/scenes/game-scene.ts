import { settings } from '../settings';

export class GameScene extends Phaser.Scene {
  private player: Phaser.GameObjects.Rectangle;
  private towers: Phaser.GameObjects.Group;
  private isPlayerJumping: boolean;
  private isBouncing: boolean;
  private currentVeloc: number;
  private loadingBar: Phaser.GameObjects.Rectangle;
  private loadingBarTween: Phaser.Tweens.Tween;

  private tailEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private bounceColEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private rotateTween: Phaser.Tweens.Tween;

  private scoreText: Phaser.GameObjects.Text;
  private highText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'GameScene'
    });
  }
  preload() {
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
  }

  init(): void {
    this.isPlayerJumping = false;
    this.isBouncing = false;
    this.currentVeloc = 0;
    settings.createTowerXPosition = 0;

    this.registry.set('score', 0)
  }

  create(): void {
    this.createLoadingBar();

    this.createTowers();

    this.createColliders();

    this.createInput();

    this.createCamera();

    this.createParEmitter();

    this.createScoreText();
  }

  createLoadingBar() {
    this.loadingBar = this.add
      .rectangle(
        0,
        this.game.canvas.height - settings.BLOCK_WIDTH,
        0,
        settings.BLOCK_WIDTH,
        0xff2463
      )
      .setOrigin(0)
      .setDepth(2);
    this.loadingBarTween = this.tweens
      .add({
        targets: this.loadingBar,
        props: {
          width: {
            value: this.game.canvas.width,
            duration: 1000,
            ease: 'Power0'
          }
        },
        yoyo: true,
        repeat: -1
      })
      .pause();

  }

  createScoreText() {
    this.scoreText = this.add.text(10, 10, 'Score: 0').setScrollFactor(0);
    this.scoreText.setFontSize(30);
    this.highText = this.add.text(10, 40, 'High Score: ' + (this.registry.get('high') || 0)).setScrollFactor(0);
    this.highText.setFontSize(30);
  }

  createTowers() {
    this.towers = this.add.group();

    for (let i = 0; i < settings.MAX_ACTIVE_TOWERS; i++) {
      this.spawnNewTower();

      if (i == 0) {
        this.player = this.add
          .rectangle(
            settings.createTowerXPosition + settings.BLOCK_WIDTH / 2,
            0,
            settings.BLOCK_WIDTH,
            settings.BLOCK_WIDTH,
            0xff2463
          )
          .setOrigin(0.5);

        this.rotateTween = this.tweens.addCounter({
          from: 0,
          to: 360,
          duration: 1000,
          repeat: -1,
          onUpdate: () => {
            //  tween.getValue = range between 0 and 360

            this.player.setAngle(this.rotateTween.getValue());
          }
        })

        this.rotateTween.stop();

        this.physics.world.enable(this.player);
      }
    }

  }

  createColliders() {
    // add colliders
    this.physics.add.collider(
      this.player,
      this.towers,
      this.playerTowerCollision,
      null,
      this
    );

  }

  createInput() {
    // setup input
    this.input.on(
      'pointerdown',
      () => {
        if (!this.isPlayerJumping && !this.isBouncing) {
          this.loadingBarTween.restart();
        }
      },
      this
    );
    this.input.on('pointerup', this.playerJump, this);

  }

  createCamera() {
    // setup camera
    this.cameras.main.setBounds(
      0,
      0,
      +this.game.config.width,
      +this.game.config.height
    );
    this.cameras.main.startFollow(this.player);
  }

  createParEmitter() {
    this.bounceColEmitter = this.add.particles('flares').createEmitter({
      x: -100,
      y: -100,
      frame: 'red',
      speed: { min: -200, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.4, end: 0 },
      blendMode: 'ADD',
      lifespan: 500,
      gravityY: 800
    });

    this.tailEmitter = this.add.particles('flares').createEmitter({
      frame: 'yellow',
      lifespan: 400,
      x: -100,
      y: -100,
      speedX: { start: -100, end: -400, steps: -1 },
      speedY: { min: 0, max: 100 },
      gravityX: 0,
      gravityY: 200,
      follow: this.player,
      followOffset: { x: -25 },
      scale: { start: 0.4, end: 0.2 },
      blendMode: 'ADD'
    });
    this.tailEmitter.visible = false;
  }

  update(): void {
    this.towers.getChildren().forEach((tower) => {
      const towerBody = tower.body as Phaser.Physics.Arcade.Body;
      if (this.isPlayerJumping) {
        towerBody.setVelocityX(settings.SCROLLING_SPEED_X_AXIS);
      } else {
        this.rotateTween.stop();
        this.player.setAngle(0)
        towerBody.setVelocityX(0);
      }

      if (towerBody.position.x < this.player.x - this.player.width * 1.7) {
        this.tweens.add({
          targets: tower,
          y: 900,
          alpha: { from: 0.7, to: 0.1 },
          duration: 2000,
          ease: 'Power2'
        })

      }

      if (towerBody.position.y > this.sys.canvas.height) {
        this.spawnNewTower();
        tower.destroy();
        this.incScore()
      }
    }, this);

    if (this.player.y > this.game.config.height) {
      this.scene.start('GameScene');
    }
    if (this.currentVeloc < this.player.body.velocity.y) {
      this.currentVeloc = this.player.body.velocity.y
    }

    this.updateEmitter()

  }

  incScore() {
    let curScore = this.registry.get('score') || 0;
    curScore += 1;
    this.registry.set('score', curScore)
    this.scoreText.setText('Score: ' + curScore)
    let highScore = this.registry.get('high') || 0;
    if (highScore < curScore) {
      highScore = curScore;
      this.highText.setText('High Score: ' + highScore)
      this.registry.set('high', highScore)
    }

  }

  updateEmitter() {
    if (this.isPlayerJumping) {
      this.tailEmitter.visible = true;
    } else {
      this.tailEmitter.visible = false;
    }

  }

  private spawnNewTower(): void {
    const spacingBeforeTower = Phaser.Math.RND.between(
      settings.SPACING.MIN,
      settings.SPACING.MAX
    );

    settings.createTowerXPosition += spacingBeforeTower * settings.BLOCK_WIDTH;
    // if (settings.createTowerXPosition >= this.sys.canvas.width * 2) {
    //   settings.createTowerXPosition /= 1.5;
    // }

    const towerHeight = Phaser.Math.RND.between(
      settings.TOWER_PROPERTIES.HEIGHT.MIN,
      settings.TOWER_PROPERTIES.HEIGHT.MAX
    );

    const newTower = this.add
      .rectangle(
        settings.createTowerXPosition,
        +this.game.config.height - towerHeight,
        settings.BLOCK_WIDTH,
        towerHeight,
        settings.TOWER_PROPERTIES.COLOR
      )
      .setOrigin(0);

    // add physics to tower
    this.physics.world.enable(newTower);
    const towerBody = newTower.body as Phaser.Physics.Arcade.Body;
    towerBody.setImmovable(true);
    towerBody.setAllowGravity(false);

    // add tower to group
    this.towers.add(newTower);
  }

  private playerJump(): void {
    if (!this.isPlayerJumping && !this.isBouncing) {
      const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
      playerBody.setVelocityY(-this.loadingBar.width);
      this.isPlayerJumping = true;
      this.rotateTween.restart();
      this.loadingBarTween.stop();
      this.loadingBar.width = 0;
    }
  }

  private playerTowerCollision(player: any, tower: any): void {
    if (tower.body.touching.up) {
      player.body.setVelocity(0);
      if (this.isPlayerJumping) {
        console.log(this.currentVeloc)
        this.isPlayerJumping = false;
        this.bounceColEmitter.explode(5, tower.x + settings.BLOCK_WIDTH / 2, tower.y)
        player.body.setAllowGravity(false)
        this.isBouncing = true;
        if (this.currentVeloc > 100) {
          let yPos = tower.y - this.currentVeloc * 0.15
          if (yPos < 30) {
            yPos = 80;
          }
          this.tweens.add({
            targets: player,
            y: yPos,
            duration: 400,
            ease: 'Power1',
            onComplete: () => {
              this.tweens.add({
                targets: player,
                props: {
                  y: { value: tower.y - player.width / 2, duration: 1500, ease: 'Bounce.easeOut' }
                },
                onUpdate: () => {
                  if (player.y + player.width / 2 <= tower.y - 0.5 && player.y + player.width / 2 >= tower.y - 3) {
                    this.bounceColEmitter.explode(1, tower.x + settings.BLOCK_WIDTH / 2, tower.y)
                  }
                },
                onComplete: () => {
                  player.body.setAllowGravity(true)
                  this.isBouncing = false;
                  this.currentVeloc = 0;
                }
              })
            }
          })
        } else {
          player.body.setAllowGravity(true)
          this.isBouncing = false;
          this.currentVeloc = 0;
        }
      }
    }
  }
}
