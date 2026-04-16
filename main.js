import GameScene from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: "#f5f5f5",
    scene: [GameScene]
};

new Phaser.Game(config);