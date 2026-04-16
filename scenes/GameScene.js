export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    create() {
        this.add.text(100, 250, "Who Gets the Bed?", {
            fontSize: "20px",
            color: "#000"
        });
    }
}

create() {
    this.beds = 2;
    this.currentIndex = 0;

    this.patients = [
        { name: "Anna", age: 23, survival: 0.8, condition: "Moderate" },
        { name: "John", age: 67, survival: 0.4, condition: "Severe" },
        { name: "Maria", age: 35, survival: 0.6, condition: "Stable" }
    ];

    this.results = [];

    this.renderUI();
}