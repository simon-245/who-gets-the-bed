export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.sprite = scene.add.rectangle(200, 500, 30, 30, 0x00aaff);
        console.log("✅ Player создан");
    }

    moveLeft() {
        this.sprite.x -= 5;
    }

    moveRight() {
        this.sprite.x += 5;
    }

    getBounds() {
        return this.sprite.getBounds();
    }
}