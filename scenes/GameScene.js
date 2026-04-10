import Player from "../entities/Player.js";

export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
    }

    create() {
	
        this.player = new Player(this);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {

        if (this.cursors.left.isDown) {
            this.player.moveLeft();
        }

        if (this.cursors.right.isDown) {
            this.player.moveRight();
        }
    }
}