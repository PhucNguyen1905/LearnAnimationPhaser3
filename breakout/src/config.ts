import { LoadScene } from './Scenes/LoadScene';
import { GameScene } from './Scenes/GameScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Breakout',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '1.0',
  type: Phaser.AUTO,
  scene: [LoadScene, GameScene],

  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    parent: 'game',
    width: 480,
    height: 640
  },
  backgroundColor: 0x262626,
  render: { pixelArt: true }
};
