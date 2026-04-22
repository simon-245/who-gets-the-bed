import StartScene from "./scenes/StartScene.js";
import GameScene from "./scenes/GameScene.js";
import ResultScene from "./scenes/ResultScene.js";

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: "#f5f5f5",
    parent: "game-container",
    scene: [GameScene, ResultScene]
};

new Phaser.Game(config);