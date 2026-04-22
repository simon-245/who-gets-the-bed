export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("icu", "images/icu_room.png");
    this.load.image("doctor", "images/doctor.png");

    this.load.image("anna", "images/child.png");
    this.load.image("john", "images/old_man.png");
    this.load.image("maria", "images/girl.png");
  }

  create() {
    this.beds = 2;
    this.selected = null;
    this.results = [];

    // 🏥 BACKGROUND
    const bg = this.add.image(200, 300, "icu");
    bg.setDisplaySize(400, 600);
    bg.setDepth(0);

    // 🧑‍⚕️ DOCTOR
    const doctor = this.add.image(200, 440, "doctor");
    doctor.setScale(0.35);
    doctor.setDepth(5);

    // 📊 UI TEXT
    this.uiText = this.add.text(20, 20, "Select patient", {
      fontSize: "14px",
      color: "#000",
      backgroundColor: "#ffffff"
    });
    this.uiText.setDepth(20);

    // 👤 PATIENTS
    this.patients = [
      { name: "Anna", age: 23, survival: 0.8, sprite: "anna" },
      { name: "John", age: 67, survival: 0.4, sprite: "john" },
      { name: "Maria", age: 35, survival: 0.6, sprite: "maria" }
    ];

    this.cards = [];

    this.patients.forEach((p, i) => {
      const x = 100 + i * 100;
      const y = 320;

      const card = this.add.image(x, y, p.sprite)
        .setScale(0.25)
        .setInteractive({ useHandCursor: true });

      card.setDepth(10);

      card.on("pointerdown", () => {
        this.selected = i;
        this.updateUI();
      });

      this.cards.push(card);
    });

    // 🎮 BUTTONS
    this.giveBtn = this.add.text(40, 520, "GIVE BED", {
      backgroundColor: "#00ff00",
      color: "#000",
      padding: { x: 10, y: 5 }
    }).setInteractive().setDepth(30);

    this.skipBtn = this.add.text(220, 520, "SKIP", {
      backgroundColor: "#ff0000",
      color: "#000",
      padding: { x: 10, y: 5 }
    }).setInteractive().setDepth(30);

    this.giveBtn.on("pointerdown", () => this.decide(true));
    this.skipBtn.on("pointerdown", () => this.decide(false));
  }

  updateUI() {
    if (this.selected === null) return;

    const p = this.patients[this.selected];

    this.uiText.setText(
      `Name: ${p.name}
Age: ${p.age}
Survival: ${Math.floor(p.survival * 100)}%
Beds: ${this.beds}`
    );
  }

  decide(give) {
    if (this.selected === null) return;

    const p = this.patients[this.selected];

    let survived = false;

    if (give && this.beds > 0) {
      this.beds--;
      survived = Math.random() < p.survival;
    }

    this.results.push({
      name: p.name,
      age: p.age,
      survived
    });

    this.cards[this.selected].destroy();
    this.patients[this.selected] = null;
    this.selected = null;

    const remaining = this.patients.filter(p => p !== null).length;

    if (remaining === 0) {
      this.time.delayedCall(300, () => {
        this.scene.start("ResultScene", {
          results: this.results,
          bedsLeft: this.beds
        });
      });
    }
  }
}