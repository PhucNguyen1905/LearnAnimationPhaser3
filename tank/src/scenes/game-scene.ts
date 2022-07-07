import { Player } from '../objects/player';
import { Enemy } from '../objects/enemy';
import { Obstacle } from '../objects/obstacles/obstacle';
import { Bullet } from '../objects/bullet';

export class GameScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;

  private player: Player;
  private enemies: Phaser.GameObjects.Group;
  private obstacles: Phaser.GameObjects.Group;

  private pauseBtn: Phaser.GameObjects.Image;
  private pauseClick: boolean = false;
  private countDownText: Phaser.GameObjects.Text;
  private countTimeEvent: Phaser.Time.TimerEvent;
  private eventPause: Phaser.Events.EventEmitter;
  private countDown: number = 3;

  private scoreText: Phaser.GameObjects.Text;

  private target: Phaser.Math.Vector2;

  private zone: Phaser.GameObjects.Zone;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {
    this.registry.set('score', 0);
  }

  create(): void {
    this.createTilemap();

    this.createZone();

    this.createGameObjects();

    this.convertObjects();

    this.createColliders();

    this.enemies.children.each((enemy: Enemy) => {
      this.physics.add.overlap(
        this.player.getBullets(),
        enemy,
        this.playerBulletHitEnemy,
        null,
        this
      );
      this.physics.add.overlap(
        enemy.getBullets(),
        this.player,
        this.enemyBulletHitPlayer,
        null
      );

      this.physics.add.collider(
        enemy.getBullets(),
        this.obstacles,
        this.bulletHitObstacles,
        null
      );
      this.physics.add.collider(
        enemy.getBullets(),
        this.layer,
        this.bulletHitLayer,
        null
      );
    }, this);

    this.createCamera();

    this.createButtons();


    this.createEvents();

    this.createScoreText();

    this.createPauseVariables();

    this.inputHandler();

  }

  createTilemap() {
    // create tilemap from tiled JSON
    this.map = this.make.tilemap({ key: 'levelMap' });

    this.tileset = this.map.addTilesetImage('tiles');
    this.layer = this.map.createLayer('tileLayer', this.tileset, 0, 0);
    this.layer.setCollisionByProperty({ collide: true });
  }

  createZone() {
    this.zone = this.add.zone(0, 0, this.sys.canvas.width, this.sys.canvas.height).setOrigin(0, 0);
  }

  createPauseVariables() {
    this.pauseClick = false;
    this.countDownText = null;
    this.countDown = 3;
    this.countTimeEvent = null;

  }

  createButtons() {
    this.pauseBtn = this.add.sprite(0, 0, 'pauseBtn').setInteractive();

    Phaser.Display.Align.In.BottomRight(this.pauseBtn, this.zone)

    // Fixed to camera view
    this.pauseBtn.setScrollFactor(0);

    this.pauseBtn.on('pointerover', () => {
      this.sound.play('mouseover')
      this.pauseBtn.setTint(0x76BA99);
    });
    this.pauseBtn.on('pointerout', () => {
      this.pauseBtn.clearTint();
    });

    this.pauseBtn.on('pointerdown', () => {
      this.pauseClick = true;
      this.sound.play('click')
      this.physics.pause();
      this.scene.pause();
      this.tweens.pauseAll();
      this.scene.launch('PauseMenu');
    })

  }

  inputHandler() {
    this.input.keyboard.on('keydown-SPACE', this.playerShoot, this);
    this.input.on('pointerdown', this.playerShoot, this);

    this.input.keyboard.on('keyup-P', () => {
      this.pauseClick = true;
      this.sound.play('click')
      this.physics.pause();
      this.scene.pause();
      this.tweens.pauseAll();
      this.scene.launch('PauseMenu');
    })
  }

  playerShoot() {
    if (!this.pauseClick) {
      this.player.handleShooting();
    }
  }

  createEvents() {
    if (this.eventPause) return;
    this.eventPause = this.events.on('resume', () => {
      // Disable pause menu
      this.input.disable(this.pauseBtn);
      this.input.keyboard.enabled = false;

      this.countDown = 3;
      this.countDownText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Continue in ' + this.countDown, { fontSize: '60px', color: '#1363DF' }).setOrigin(0.5)
      this.countTimeEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDownTime,
        callbackScope: this,
        loop: true
      })

    })
  }
  countDownTime() {
    this.countDown -= 1;
    this.countDownText.setText('Continue in ' + this.countDown);
    if (this.countDown <= 0) {
      // Enable pause menu
      this.input.enable(this.pauseBtn)
      this.input.keyboard.enabled = true;

      this.countDownText.setText('');
      this.physics.resume();
      this.tweens.resumeAll();
      this.pauseClick = false;
      this.countTimeEvent.remove();
    }
  }

  createScoreText() {
    this.scoreText = this.add.text(10, 10, 'Score: 0').setScrollFactor(0);
    this.scoreText.setFontSize(50);
  }

  createGameObjects() {
    this.obstacles = this.add.group({
      /*classType: Obstacle,*/
      runChildUpdate: true
    });

    this.enemies = this.add.group({
      /*classType: Enemy*/
    });
  }

  createColliders() {
    // collider layer and obstacles
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.obstacles);

    // collider for bullets
    this.physics.add.collider(
      this.player.getBullets(),
      this.layer,
      this.bulletHitLayer,
      null,
      this
    );

    this.physics.add.collider(
      this.player.getBullets(),
      this.obstacles,
      this.bulletHitObstacles,
      null,
      this
    );
  }

  createCamera() {
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameras.main.startFollow(this.player);
  }

  update(): void {
    this.player.update();

    this.scoreText.setText('Score: ' + this.registry.get('score'))

    this.enemies.children.each((enemy: Enemy) => {
      if (!this.pauseClick) enemy.update();
      if (this.player.active && enemy.active) {
        var angle = Phaser.Math.Angle.Between(
          enemy.body.x,
          enemy.body.y,
          this.player.body.x,
          this.player.body.y
        );

        enemy.getBarrel().angle =
          (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
      }
    }, this);
  }

  private convertObjects(): void {
    // find the object layer in the tilemap named 'objects'
    const objects = this.map.getObjectLayer('objects').objects as any[];

    objects.forEach((object) => {
      if (object.type === 'player') {
        this.player = new Player({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'tankBlue'
        });
      } else if (object.type === 'enemy') {
        let enemy = new Enemy({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'tankRed'
        });

        this.enemies.add(enemy);
      } else {
        let obstacle = new Obstacle({
          scene: this,
          x: object.x,
          y: object.y - 40,
          texture: object.type
        });

        this.obstacles.add(obstacle);
      }
    });
  }

  private bulletHitLayer(bullet: Bullet): void {
    bullet.explodeEmiiter();
    bullet.destroy();
  }

  private bulletHitObstacles(bullet: Bullet, obstacle: Obstacle): void {
    bullet.explodeEmiiter();
    bullet.destroy();
  }

  private enemyBulletHitPlayer(bullet: Bullet, player: Player): void {
    bullet.destroy();
    player.updateHealth();
  }

  private playerBulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
    bullet.destroy();
    enemy.updateHealth();
  }
}
