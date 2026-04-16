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

renderUI() {
    this.children.removeAll();

    let p = this.patients[this.currentIndex];

    this.add.text(20, 20, `Beds left: ${this.beds}`, { color: "#000" });

    this.add.text(20, 80, `Name: ${p.name}`, { color: "#000" });
    this.add.text(20, 110, `Age: ${p.age}`, { color: "#000" });
    this.add.text(20, 140, `Condition: ${p.condition}`, { color: "#000" });
    this.add.text(20, 170, `Survival: ${Math.floor(p.survival * 100)}%`, { color: "#000" });

    this.createButtons();
}

createButtons() {
    let accept = this.add.text(20, 250, "Give Bed", {
        backgroundColor: "#0f0",
        color: "#000",
        padding: { x: 10, y: 5 }
    }).setInteractive();

    let reject = this.add.text(160, 250, "Skip", {
        backgroundColor: "#f00",
        color: "#000",
        padding: { x: 10, y: 5 }
    }).setInteractive();

    accept.on("pointerdown", () => this.makeDecision(true));
    reject.on("pointerdown", () => this.makeDecision(false));
}

makeDecision(giveBed) {
    let p = this.patients[this.currentIndex];

    let survived = false;

    if (giveBed && this.beds > 0) {
        this.beds--;
        survived = Math.random() < p.survival;
    }

    this.results.push({
        name: p.name,
        given: giveBed,
        survived: survived
    });

    this.currentIndex++;

    if (this.currentIndex >= this.patients.length) {
        this.scene.start("ResultScene", { results: this.results });
    } else {
        this.renderUI();
    }
}