export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image("icu", "images/Icu_room.png");
        this.load.image("doctor", "images/doctor.png");

        this.load.image("anna", "images/child.png");
        this.load.image("john", "images/old_man.png");
        this.load.image("maria", "images/girl.png");
        this.load.image("patientReport", "images/PATIENT REPORT.png");
    }

    create() {
        // =====================
        // FULLSCREEN BACKGROUND
        // =====================
        this.bg = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            "icu"
        );

        this.bg.setDepth(0);

        this.fitBackground();

        // =====================
        // DOCTOR
        // =====================
        this.doctor = this.add.image(
            this.scale.width * 0.5,
            this.scale.height * 0.78,
            "doctor"
        );

        this.doctor.setScale(0.35);
        this.doctor.setDepth(10);

        // =====================
        // GAME STATE
        // =====================
        this.beds = 2;
        this.selected = null;
        this.results = [];

        this.patients = [
            {
                name: "Anna",
                age: 23,
                survival: 0.8,
                sprite: "anna",
                disease: "Acute severe asthma exacerbation",
                symptoms:
                    "Diffuse wheeze, SpO2 91% on room air, RR 28, accessory muscle use. Peak flow 45% predicted. No fever.",
                vitals: "BP 118/72 · HR 104 · Temp 36.8°C · GCS 15"
            },
            {
                name: "John",
                age: 67,
                survival: 0.4,
                sprite: "john",
                disease: "NSTEMI with acute on chronic HF",
                symptoms:
                    "Substernal pressure 6/10 since AM, bilateral crackles, JVD 2 cm. Troponin rising, BNP 980 pg/mL.",
                vitals: "BP 96/58 · HR 112 · SpO2 93% on 2L NC · GCS 15"
            },
            {
                name: "Maria",
                age: 35,
                survival: 0.6,
                sprite: "maria",
                disease: "Suspected urosepsis",
                symptoms:
                    "Rigors, dysuria x2 days, temp 39.1°C, WBC 18.4. UA positive nitrites, lactate 2.8 mmol/L.",
                vitals: "BP 92/54 · HR 118 · RR 24 · GCS 15"
            }
        ];

        // =====================
        // UI PANEL
        // =====================
        this.infoBox = this.add.rectangle(
            16,
            16,
            400,
            220,
            0xffffff,
            0.9
        )
            .setOrigin(0)
            .setStrokeStyle(1, 0xcccccc)
            .setDepth(20);

        this.uiText = this.add.text(28, 28, "Select a patient to open the report", {
            fontSize: "13px",
            color: "#000",
            lineSpacing: 4
        }).setDepth(21);

        this.layoutInfoPanel(this.scale.width);

        // =====================
        // PATIENT REPORT OVERLAY (hidden until a patient is chosen)
        // =====================
        this.createPatientReportOverlay();

        // =====================
        // PATIENTS
        // =====================
        this.cards = [];

        const spacing = this.scale.width / 4;

        this.patients.forEach((p, i) => {
            const x = spacing * (i + 1);
            const y = this.scale.height * 0.48;

            const card = this.add.image(x, y, p.sprite)
                .setScale(0.22)
                .setInteractive({ useHandCursor: true })
                .setDepth(15);

            card.on("pointerdown", () => {
                this.selected = i;
                this.updateUI();
                this.showPatientReport(i);
            });

            this.cards.push(card);
        });

        // =====================
        // BUTTONS (above report overlay)
        // =====================
        const btnDepth = 50;

        this.giveBtn = this.add.text(
            60,
            this.scale.height - 100,
            "GIVE BED",
            {
                fontSize: "26px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                padding: { x: 16, y: 10 }
            }
        )
            .setInteractive({ useHandCursor: true })
            .setDepth(btnDepth);

        this.skipBtn = this.add.text(
            this.scale.width - 180,
            this.scale.height - 100,
            "SKIP",
            {
                fontSize: "26px",
                backgroundColor: "#D32F2F",
                color: "#fff",
                padding: { x: 16, y: 10 }
            }
        )
            .setInteractive({ useHandCursor: true })
            .setDepth(btnDepth);

        this.giveBtn.on("pointerdown", () => this.decide(true));
        this.skipBtn.on("pointerdown", () => this.decide(false));

        this.scale.on("resize", this.resizeGame, this);
    }

    layoutInfoPanel(width) {
        const margin = 14;
        const boxW = Phaser.Math.Clamp(Math.round(width * 0.4), 320, 560);
        const boxH = 236;

        this.infoBox.setPosition(margin, margin);
        this.infoBox.setSize(boxW, boxH);

        this.uiText.setPosition(margin + 12, margin + 12);
        this.uiText.setStyle({
            fontSize: "13px",
            color: "#000",
            lineSpacing: 4,
            wordWrap: { width: Math.max(180, boxW - 26) }
        });
    }

    createPatientReportOverlay() {
        const w = this.scale.width;
        const h = this.scale.height;

        this.reportDimmer = this.add
            .rectangle(w / 2, h / 2, w, h, 0x000000, 0.55)
            .setDepth(40)
            .setVisible(false);

        // Sheet image + overlaid text move together when the window resizes
        this.reportPanel = this.add.container(0, 0).setDepth(41).setVisible(false);

        this.reportImage = this.add.image(0, 0, "patientReport").setOrigin(0.5);

        this.reportDetailsText = this.add.text(0, 0, "", {
            fontSize: "14px",
            color: "#1a1a1a",
            align: "left",
            lineSpacing: 4
        }).setOrigin(0, 0);

        this.reportPanel.add([this.reportImage, this.reportDetailsText]);
    }

    /**
     * Large report on screen; text is laid out inside a margin box on the PNG so it
     * stays on the “paper”. Tweak the inset fractions if your asset’s writable area differs.
     */
    layoutPatientReport(width, height) {
        if (!this.reportDimmer || !this.reportPanel || !this.reportImage) return;

        this.reportDimmer.setPosition(width / 2, height / 2);
        this.reportDimmer.setSize(width, height);

        const bottomReserve = 82;
        const maxImgW = width * 0.995;
        const maxImgH = Math.max(200, height - bottomReserve - 8);

        const scale = Math.min(
            maxImgW / this.reportImage.width,
            maxImgH / this.reportImage.height
        );

        this.reportImage.setScale(scale);

        const dispW = this.reportImage.width * this.reportImage.scaleX;
        const dispH = this.reportImage.height * this.reportImage.scaleY;

        this.reportPanel.setPosition(width / 2, (height - bottomReserve) / 2);

        const insetLeft = 0.22;
        const insetRight = 0.22;
        const insetTop = 0.22;
        const insetBottom = 0.22;

        const textLeft = -dispW * 0.5 + dispW * insetLeft;
        const textTop = -dispH * 0.5 + dispH * insetTop;
        const wrap = Math.max(140, dispW * (1 - insetLeft - insetRight));
        const maxTextHeight = Math.max(80, dispH * (1 - insetTop - insetBottom));

        this.reportDetailsText.setPosition(textLeft, textTop);

        let fontPx = Phaser.Math.Clamp(
            Math.round(9 + scale * 32),
            10,
            13
        );

        const applyTextStyle = (px) => {
            const lineSpacing = Math.max(2, Math.round(px * 0.24));
            this.reportDetailsText.setStyle({
                fontSize: `${px}px`,
                wordWrap: { width: wrap },
                color: "#1a1a1a",
                align: "left",
                lineSpacing
            });
        };

        applyTextStyle(fontPx);

        for (let n = 0; n < 14 && this.reportDetailsText.height > maxTextHeight && fontPx > 8; n++) {
            fontPx -= 1;
            applyTextStyle(fontPx);
        }
    }

    showPatientReport(index) {
        const p = this.patients[index];
        if (!p) return;

        const w = this.scale.width;
        const h = this.scale.height;

        const copy =
            `${p.name} · ${p.age} years\n` +
            `Chief diagnosis: ${p.disease}\n\n` +
            `Presentation:\n${p.symptoms}\n\n` +
            `Vitals (on arrival): ${p.vitals}\n\n` +
            `Estimated survival with ICU bed: ${Math.floor(p.survival * 100)}%`;

        this.reportDetailsText.setText(copy);

        this.reportDimmer.setVisible(true);
        this.reportPanel.setVisible(true);

        this.layoutPatientReport(w, h);
    }

    hidePatientReport() {
        if (!this.reportDimmer) return;

        this.reportDimmer.setVisible(false);
        this.reportPanel.setVisible(false);
    }

    fitBackground() {
        const scaleX = this.scale.width / this.bg.width;
        const scaleY = this.scale.height / this.bg.height;

        const scale = Math.max(scaleX, scaleY);

        this.bg.setScale(scale);
    }

    resizeGame(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;

        this.bg.setPosition(width / 2, height / 2);

        const texWidth = this.bg.texture.source[0].width;
        const texHeight = this.bg.texture.source[0].height;

        const scaleX = width / texWidth;
        const scaleY = height / texHeight;

        const scale = Math.max(scaleX, scaleY);

        this.bg.setScale(scale);

        this.doctor.setPosition(width * 0.5, height * 0.78);

        this.giveBtn.setPosition(60, height - 100);
        this.skipBtn.setPosition(width - 180, height - 100);

        this.layoutInfoPanel(width);

        if (this.reportDimmer && this.reportDimmer.visible) {
            this.layoutPatientReport(width, height);
        }
    }

    updateUI() {
        if (this.selected === null) return;

        const p = this.patients[this.selected];

        this.uiText.setText(
            `Patient: ${p.name}\n` +
                `Age: ${p.age}\n` +
                `Survival if admitted: ${Math.floor(p.survival * 100)}%\n` +
                `Beds left: ${this.beds}\n\n` +
                `Review the report, then assign a bed or skip.`
        );
    }

    decide(give) {
        if (this.selected === null) return;

        const p = this.patients[this.selected];

        let survived = false;
        const hadBed = this.beds > 0;
        const choseGive = give;
        let receivedBed = false;

        if (choseGive && hadBed) {
            receivedBed = true;
            this.beds--;
            survived = Math.random() < p.survival;
        }

        this.results.push({
            name: p.name,
            age: p.age,
            survival: p.survival,
            choseGive,
            receivedBed,
            survived
        });

        this.cards[this.selected].destroy();

        this.patients[this.selected] = null;
        this.selected = null;

        this.uiText.setText("Select a patient to open the report");
        this.hidePatientReport();

        const remaining = this.patients.filter((patient) => patient !== null).length;

        if (remaining === 0) {
            this.time.delayedCall(500, () => {
                this.scene.start("ResultScene", {
                    results: this.results,
                    bedsLeft: this.beds
                });
            });
        }
    }
}
