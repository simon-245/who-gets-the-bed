import StartScene from "./scenes/StartScene.js";
import GameScene from "./scenes/GameScene.js";
import ResultScene from "./scenes/ResultScene.js";

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  parent: "game-container",
  backgroundColor: "#000",
  scene: [StartScene, GameScene, ResultScene]
};

new Phaser.Game(config);