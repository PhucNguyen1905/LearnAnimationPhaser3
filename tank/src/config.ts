import { LoadScene } from './scenes/LoadScene';
import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';
import { OverMenu } from './scenes/OverMenu';
import { PauseMenu } from './scenes/PauseMenu';

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Tank',
    url: 'https://github.com/digitsensitive/phaser3-typescript',
    version: '2.0',
    width: 1600,
    height: 1200,
    zoom: 0.6,
    type: Phaser.AUTO,
    parent: 'game',
    scene: [LoadScene, MenuScene, GameScene, PauseMenu, OverMenu],
    input: {
        keyboard: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    backgroundColor: '#000000',
    render: { pixelArt: false, antialias: true }
};
