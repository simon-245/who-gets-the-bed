export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image("icu", "images/Icu_room.png");
	this.load.image("short", "images/shortcut.png");
        this.load.image("doctor", "images/doctor.png");

        this.load.image("anna", "images/child.png");
        this.load.image("john", "images/old_man.png");
        this.load.image("maria", "images/girl.png");
        this.load.image("old_woman", "images/old_woman.png");
        this.load.image("fever_child", "images/fever child.png");
        this.load.image("woman", "images/woman.png");
        this.load.image("curtain", "images/curton.jpeg");

        this.load.image("report", "images/patient_report.png");
    }

    create() {

        // =====================
        // BACKGROUND
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
        // STATE
        // =====================
        this.totalBeds = 3;
        this.occupiedBeds = 0;
        this.selected = null;
        this.results = [];
        this.currentQuiz = null;
        this.selectedChoice = null;

        this.patients = [
            {
                name: "Anna",
                age: 23,
                survival: 0.8,
                sprite: "anna",
                health: 80,
                status: "waiting",
                mainSlot: 0,
                disease: "Guillain Barré Syndrome (Zika related)",
                outcomeReason: "",
                symptoms: "• Progressive weakness starting in legs\n• Ascending paralysis\n• Mild respiratory compromise\n• Reflexes diminished\n• Recent fever and rash 2 weeks ago\n• Difficulty walking",
                briefing: "GBS is an autoimmune disorder where the immune system attacks the peripheral nervous system. The progressive weakness and ascending paralysis are hallmark signs. Despite severity, early ICU admission with respiratory support offers good recovery prospects in younger patients.",
                vitals: "BP 120/75 · HR 92 · RR 18 · GCS 15",
                questions: [
                    {
                        prompt: "Which treatment is most appropriate for Anna's Guillain Barré Syndrome?",
                        choices: [
                            { text: "IVIG or plasmapheresis", correct: true },
                            { text: "Oral antibiotics", correct: false },
                            { text: "Diuretic therapy", correct: false },
                            { text: "Topical steroids", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the priority medication for her mild respiratory compromise?",
                        choices: [
                            { text: "Oxygen and respiratory support", correct: true },
                            { text: "High-dose insulin", correct: false },
                            { text: "Oral antihistamines", correct: false },
                            { text: "Oral analgesics", correct: false }
                        ]
                    },
                    {
                        prompt: "Which drug is least helpful for her ascending paralysis?",
                        choices: [
                            { text: "Antibiotics", correct: true },
                            { text: "IVIG", correct: false },
                            { text: "Plasmapheresis", correct: false },
                            { text: "Respiratory support", correct: false }
                        ]
                    },
                    {
                        prompt: "For reflex and nerve recovery, what is the best approach?",
                        choices: [
                            { text: "Immune modulation with IVIG or plasmapheresis", correct: true },
                            { text: "Beta blockers", correct: false },
                            { text: "Antidepressants", correct: false },
                            { text: "Antacids", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the right prescription decision for Anna?",
                        choices: [
                            { text: "Give IVIG/plasmapheresis and respiratory support", correct: true },
                            { text: "Give antibiotics and stop monitoring", correct: false },
                            { text: "Delay treatment until discharge", correct: false },
                            { text: "Prescribe only painkillers", correct: false }
                        ]
                    }
                ]
            },
            {
                name: "John",
                age: 67,
                survival: 0.4,
                sprite: "john",
                health: 45,
                status: "waiting",
                mainSlot: 1,
                disease: "Severe Guillain Barré Syndrome (Zika related)",
                symptoms: "• Rapidly progressing paralysis\n• Severe respiratory failure\n• Requires intubation\n• Complete loss of leg mobility\n• Weakness in upper extremities\n• CSF protein elevated\n• EMG shows demyelination",
                briefing: "This is a critical case with respiratory muscles paralyzed. Mechanical ventilation is essential. Age and rapid progression indicate higher mortality risk. Demyelination on EMG confirms axonal damage. ICU management with immunotherapy is standard care.",
                vitals: "BP 88/52 · HR 118 · RR 28 (ventilated) · GCS 8",
                questions: [
                    {
                        prompt: "Which medication is most important for John's severe GBS?",
                        choices: [
                            { text: "IVIG or plasmapheresis", correct: true },
                            { text: "Oral antibiotics", correct: false },
                            { text: "NSAIDs", correct: false },
                            { text: "Antacids", correct: false }
                        ]
                    },
                    {
                        prompt: "For his respiratory failure, what is the correct treatment step?",
                        choices: [
                            { text: "Continue mechanical ventilation and support", correct: true },
                            { text: "Switch to oral medications only", correct: false },
                            { text: "Stop respiratory monitoring", correct: false },
                            { text: "Give only sedatives", correct: false }
                        ]
                    },
                    {
                        prompt: "Which therapy is inappropriate for his case?",
                        choices: [
                            { text: "Giving only painkillers and no immunotherapy", correct: true },
                            { text: "Using IVIG", correct: false },
                            { text: "Using plasmapheresis", correct: false },
                            { text: "Providing respiratory support", correct: false }
                        ]
                    },
                    {
                        prompt: "What should be used to treat his immune-mediated nerve damage?",
                        choices: [
                            { text: "Immunotherapy with IVIG or plasmapheresis", correct: true },
                            { text: "Antihypertensive pills", correct: false },
                            { text: "Diuretics", correct: false },
                            { text: "Proton pump inhibitors", correct: false }
                        ]
                    },
                    {
                        prompt: "If the prescription is correct for John, his health will: ",
                        choices: [
                            { text: "Improve and the patient begins recovery", correct: true },
                            { text: "Stay the same without change", correct: false },
                            { text: "Get worse because medication was too strong", correct: false },
                            { text: "Cause instant discharge", correct: false }
                        ]
                    }
                ]
            },
            {
                name: "Maria",
                age: 35,
                survival: 0.6,
                sprite: "maria",
                health: 60,
                status: "waiting",
                mainSlot: 2,
                disease: "Guillain Barré Syndrome with Autonomic Dysfunction (Zika related)",
                symptoms: "• Moderate ascending paralysis\n• Facial weakness\n• Dysarthria\n• Autonomic instability\n• Fluctuating BP and HR\n• History of Zika infection 3 weeks ago\n• Respiratory function declining",
                briefing: "Autonomic dysfunction complicates her GBS, causing blood pressure and heart rate fluctuations. This requires careful hemodynamic monitoring. Facial weakness and dysarthria indicate cranial nerve involvement. Close respiratory monitoring needed as function is still declining.",
                vitals: "BP 105/62 · HR 112 · RR 22 · GCS 13",
                questions: [
                    {
                        prompt: "Which medicine is best for her autonomic instability and GBS?",
                        choices: [
                            { text: "IVIG or plasmapheresis and close hemodynamic support", correct: true },
                            { text: "Oral insulin", correct: false },
                            { text: "Topical antibiotics", correct: false },
                            { text: "Oral antihistamines", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the correct medication strategy for her cranial nerve involvement?",
                        choices: [
                            { text: "Maintain airway support and use immunotherapy", correct: true },
                            { text: "Start only blood pressure pills", correct: false },
                            { text: "Give only sleeping pills", correct: false },
                            { text: "Use diuretics alone", correct: false }
                        ]
                    },
                    {
                        prompt: "Which prescription is wrong for her case?",
                        choices: [
                            { text: "Antibiotics instead of IVIG/plasmapheresis", correct: true },
                            { text: "Using plasmapheresis", correct: false },
                            { text: "Using IVIG", correct: false },
                            { text: "Supporting breathing and hemodynamics", correct: false }
                        ]
                    },
                    {
                        prompt: "If she does not receive the correct treatment, what happens?",
                        choices: [
                            { text: "Health declines and she needs another attempt", correct: true },
                            { text: "She recovers faster", correct: false },
                            { text: "She is immediately discharged", correct: false },
                            { text: "No change occurs", correct: false }
                        ]
                    },
                    {
                        prompt: "The best medicine for this patient is: ",
                        choices: [
                            { text: "IVIG or plasmapheresis plus ICU support", correct: true },
                            { text: "Painkillers only", correct: false },
                            { text: "Antibiotics only", correct: false },
                            { text: "No treatment", correct: false }
                        ]
                    }
                ]
            },
            {
                name: "Old Woman",
                age: 75,
                survival: 0.3,
                sprite: "old_woman",
                health: 30,
                status: "atDoor",
                disease: "Severe Guillain-Barré Syndrome with Respiratory Failure",
                symptoms: "• Severe muscle weakness and paralysis\n• Complete respiratory failure requiring ventilation\n• Advanced age with comorbidities\n• Rapid deterioration\n• History of recent infection\n• Elevated CSF protein levels",
                briefing: "This elderly patient has severe GBS with complete respiratory paralysis. Age significantly reduces survival chances. Requires immediate intubation and ventilatory support. Immunotherapy may be less effective due to age. High risk of complications.",
                vitals: "BP 90/55 · HR 110 · RR 0 (ventilated) · GCS 6",
                questions: [
                    {
                        prompt: "What is the most critical intervention for this elderly patient?",
                        choices: [
                            { text: "Immediate intubation and mechanical ventilation", correct: true },
                            { text: "Oral antibiotics", correct: false },
                            { text: "Pain medication only", correct: false },
                            { text: "Fluid restriction", correct: false }
                        ]
                    },
                    {
                        prompt: "Given her age, what is the expected response to IVIG?",
                        choices: [
                            { text: "Reduced effectiveness due to age", correct: true },
                            { text: "Same as younger patients", correct: false },
                            { text: "Better response", correct: false },
                            { text: "No response at all", correct: false }
                        ]
                    },
                    {
                        prompt: "What complication is she most at risk for?",
                        choices: [
                            { text: "Ventilator-associated pneumonia", correct: true },
                            { text: "Hyperglycemia", correct: false },
                            { text: "Hypertension", correct: false },
                            { text: "Anemia", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the priority in her management?",
                        choices: [
                            { text: "Supportive care with ventilation and immunotherapy", correct: true },
                            { text: "Early discharge", correct: false },
                            { text: "Surgery", correct: false },
                            { text: "Physical therapy alone", correct: false }
                        ]
                    },
                    {
                        prompt: "If treatment is successful, what is her prognosis?",
                        choices: [
                            { text: "Guarded due to age and severity", correct: true },
                            { text: "Full recovery expected", correct: false },
                            { text: "Immediate death", correct: false },
                            { text: "No change", correct: false }
                        ]
                    }
                ]
            },
            {
                name: "Fever Child",
                age: 7,
                survival: 0.5,
                sprite: "fever_child",
                health: 55,
                status: "atDoor",
                disease: "High fever with weakness",
                symptoms: "• High fever\n• Chills\n• Lethargy\n• Poor appetite\n• Generalized weakness",
                briefing: "This child is waiting at the door with a high fever and signs of dehydration. Prompt evaluation and supportive care are needed.",
                vitals: "BP 100/65 · HR 110 · RR 24 · GCS 15",
                questions: [
                    {
                        prompt: "What is the most appropriate first step for this child?",
                        choices: [
                            { text: "Give fluids and monitor vital signs", correct: true },
                            { text: "Start antibiotics immediately", correct: false },
                            { text: "Give diuretics", correct: false },
                            { text: "Send home with rest", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the best next step to support this patient's condition?",
                        choices: [
                            { text: "Provide supportive care and reassess", correct: true },
                            { text: "Administer only painkillers", correct: false },
                            { text: "Withhold fluids", correct: false },
                            { text: "Use oxygen only", correct: false }
                        ]
                    },
                    {
                        prompt: "What medication is most appropriate for managing this child's high fever?",
                        choices: [
                            { text: "Paracetamol (acetaminophen)", correct: true },
                            { text: "Antibiotics", correct: false },
                            { text: "NSAIDs", correct: false },
                            { text: "Steroids", correct: false }
                        ]
                    },
                    {
                        prompt: "What should be avoided when treating fever in children?",
                        choices: [
                            { text: "Aspirin due to risk of Reye's syndrome", correct: true },
                            { text: "Paracetamol", correct: false },
                            { text: "Fluids", correct: false },
                            { text: "Rest", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the priority in managing this child's condition?",
                        choices: [
                            { text: "Monitor for dehydration and provide supportive care", correct: true },
                            { text: "Start IV antibiotics immediately", correct: false },
                            { text: "Give sedatives for lethargy", correct: false },
                            { text: "Restrict all fluids", correct: false }
                        ]
                    },
                ]
            },
            {
                name: "Woman",
                age: 45,
                survival: 0.5,
                sprite: "woman",
                health: 50,
                status: "atDoor",
                disease: "Guillain-Barré Syndrome with Mild Respiratory Involvement",
                symptoms: "• Progressive weakness in legs and arms\n• Mild difficulty breathing\n• Facial weakness\n• Reduced reflexes\n• Recent viral illness\n• CSF analysis pending",
                briefing: "Moderate GBS with early respiratory involvement. Requires close monitoring for respiratory deterioration. Standard immunotherapy should be initiated promptly. Good potential for recovery with early intervention.",
                vitals: "BP 110/70 · HR 95 · RR 20 · GCS 14",
                questions: [
                    {
                        prompt: "What is the appropriate initial treatment?",
                        choices: [
                            { text: "IVIG or plasmapheresis", correct: true },
                            { text: "Oral steroids", correct: false },
                            { text: "Antibiotics", correct: false },
                            { text: "Diuretics", correct: false }
                        ]
                    },
                    {
                        prompt: "How should her respiratory status be monitored?",
                        choices: [
                            { text: "Close observation and vital capacity measurements", correct: true },
                            { text: "No monitoring needed", correct: false },
                            { text: "Only heart rate monitoring", correct: false },
                            { text: "Blood pressure only", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the significance of facial weakness?",
                        choices: [
                            { text: "Indicates cranial nerve involvement", correct: true },
                            { text: "Not significant", correct: false },
                            { text: "Cardiac involvement", correct: false },
                            { text: "Liver failure", correct: false }
                        ]
                    },
                    {
                        prompt: "What is the expected time course for improvement?",
                        choices: [
                            { text: "Gradual improvement over weeks to months", correct: true },
                            { text: "Immediate recovery", correct: false },
                            { text: "No improvement", correct: false },
                            { text: "Rapid deterioration", correct: false }
                        ]
                    },
                    {
                        prompt: "If untreated, what is likely to happen?",
                        choices: [
                            { text: "Progression to severe respiratory failure", correct: true },
                            { text: "Spontaneous recovery", correct: false },
                            { text: "Improvement", correct: false },
                            { text: "No change", correct: false }
                        ]
                    }
                ]
            }
        ];

        this.curtains = new Array(this.patients.length);
        this.healthDisplays = new Array(this.patients.length);
        this.healthDrainEvents = new Array(this.patients.length);
        this.treatmentEvents = new Array(this.patients.length);

        // =====================
        // UI
        // =====================

this.uiText = this.add.text(20, 20, "Select patient", {
    fontSize: "20px",
    color: "#000",
    backgroundColor: "#fff",
    padding: { x: 5, y: 5 }
}).setDepth(20);
this.uiText.setVisible(true);
        // =====================
        // DIAGNOSIS PANEL
        // =====================
        this.diagnosisImage = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            "report"
        );

        this.diagnosisImage.setDepth(40);
        this.diagnosisImage.setVisible(false);
        this.diagnosisImage.setScale(1.5);

        this.symptomText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            "",
            {
                fontSize: "22px",
                color: "#000",
                align: "center",
                wordWrap: { width: 420 }
            }
        );

        this.symptomText.setOrigin(0.5);
        this.symptomText.setDepth(41);
        this.symptomText.setVisible(false);

        // =====================
        // BRIEFING BACKGROUND (Right side)
        // =====================
        this.briefingBackground = this.add.rectangle(
            this.scale.width - 20,
            this.scale.height / 3.5,
            340,
            460,
            0x1a3a52
        );

        this.briefingBackground.setOrigin(1, 0.5);
        this.briefingBackground.setDepth(55);
        this.briefingBackground.setVisible(false);

        // =====================
        // BRIEFING TEXT (Right side)
        // =====================
        this.briefingText = this.add.text(
            this.scale.width - 40,
            this.scale.height / 3.5 - 80,
            "",
            {
                fontSize: "16px",
                color: "#ffffff",
                align: "left",
                wordWrap: { width: 260 },
                padding: { x: 15, y: 15 }
            }
        );

        this.briefingText.setOrigin(1, 0);
        this.briefingText.setDepth(56);
        this.briefingText.setVisible(false);

        // =====================
        // MEDICAL REFERENCE (Right side)
        // =====================
        this.medicalReference = this.add.text(
            this.scale.width - 40,
            this.scale.height / 3.5 + 100,
            "VITAL SIGNS GUIDE:\n• BP: Blood Pressure\n• HR: Heart Rate (bpm)\n• RR: Respiratory Rate\n• Temp: Temperature\n• SpO2: Oxygen Level (%)\n• GCS: Consciousness Level",
            {
                fontSize: "13px",
                color: "#ffeb3b",
                align: "left",
                wordWrap: { width: 220 },
                padding: { x: 15, y: 10 }
            }
        );

        this.medicalReference.setOrigin(1, 0);
        this.medicalReference.setDepth(56);
        this.medicalReference.setVisible(false);

        // =====================
        // TIMER DISPLAY
        // =====================
        this.timerText = this.add.text(
            this.scale.width / 2,
            50,
            "20",
            {
                fontSize: "48px",
                color: "#fff",
                backgroundColor: "#ff0000",
                padding: { x: 15, y: 10 }
            }
        );

        this.timerText.setOrigin(0.5);
        this.timerText.setDepth(42);
        this.timerText.setVisible(false);

        // =====================
        // PATIENTS
        // =====================
        this.cards = new Array(this.patients.length);

        const waitingPatients = this.patients.filter(p => p.status === "waiting");
        const doorPatients = this.patients.filter(p => p.status === "atDoor");

        // Place waiting patients in the center
        const spacing = this.scale.width / 4;

        waitingPatients.forEach((p, idx) => {
            const i = this.patients.indexOf(p);
            const x = spacing * (idx + 1);
            const curtain = this.add.image(x, this.scale.height * 0.44, "curtain")
                .setOrigin(0.5, 0)
                .setScale(0.45)
                .setDepth(12)
                .setVisible(false);

            this.curtains[i] = curtain;

            const card = this.add.image(
                x,
                this.scale.height * 0.48,
                p.sprite
            )
                .setScale(0.22)
                .setInteractive({ useHandCursor: true })
                .setDepth(15);

            card.on("pointerdown", () => {

                if (this.selected !== null && this.selected !== i) {
                    this.startHealthDrain(this.selected);
                }

                this.selected = i;
                this.updateUI();

                const patient = this.patients[i];

                // reset old
                this.diagnosisImage.setVisible(false);
                this.symptomText.setVisible(false);
                this.briefingBackground.setVisible(false);
                this.briefingText.setVisible(false);
                this.medicalReference.setVisible(false);
                this.timerText.setVisible(false);
                this.giveBtn.setVisible(false);
                this.skipBtn.setVisible(false);
                this.hideQuizPanel();

                if (this.diagnosisTimer) {
                    this.diagnosisTimer.remove(false);
                }

                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                }

                // show new
                this.diagnosisImage.setVisible(true);
                this.symptomText.setVisible(true);
                this.briefingBackground.setVisible(true);
                this.briefingText.setVisible(true);
                this.medicalReference.setVisible(true);
                this.timerText.setVisible(true);
                this.giveBtn.setVisible(true);
                this.skipBtn.setVisible(true);

                this.symptomText.setText(
`${patient.name}

${patient.disease}

${patient.symptoms}

${patient.vitals}`
                );

                this.briefingText.setText(patient.briefing);

                // Start timer countdown
                let timeRemaining = 30;
                this.timerText.setText(timeRemaining);

                // Update timer every second
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                }

                this.timerInterval = setInterval(() => {
                    timeRemaining--;
                    this.timerText.setText(timeRemaining);
                    if (timeRemaining <= 0) {
                        clearInterval(this.timerInterval);
                    }
                }, 1000);

                // auto close and begin health drain if ignored
                this.diagnosisTimer = this.time.delayedCall(30000, () => {
                    this.hideReportPanel();
                    if (this.selected !== null) {
                        this.startHealthDrain(this.selected);
                    }
                });
            });

            this.cards[i] = card;
        });

        // Place door patients vertically stacked on the left side
        const doorSpacing = 80; // Vertical spacing between patients
        const doorX = 80; // Fixed X position on the left side
        const doorY = this.scale.height * 0.3; // Starting Y position
        doorPatients.forEach((p, idx) => {
            const i = this.patients.indexOf(p);
            const x = doorX;
            const y = doorY + idx * doorSpacing; // Stack vertically

            const curtain = this.add.image(x, this.scale.height * 0.44, "curtain")
                .setOrigin(0.5, 0)
                .setScale(0.45)
                .setDepth(12)
                .setVisible(false);

            this.curtains[i] = curtain;

            const card = this.add.image(
                x,
                y,
                p.sprite
            )
                .setScale(0.28)
                .setDepth(15)
                .setInteractive({ useHandCursor: true });

            card.on("pointerdown", () => {
                if (this.selected !== null && this.selected !== i) {
                    this.startHealthDrain(this.selected);
                }

                const patient = this.patients[i];
                if (patient && patient.status === "atDoor") {
                    const freeSlot = this.findFreeMainSlot();
                    if (freeSlot !== null) {
                        patient.status = "waiting";
                        patient.mainSlot = freeSlot;
                        this.updatePatientPosition(i);
                        this.refreshWaitingPositions();
                        this.refreshDoorPositions();
                        this.startHealthDrain(i);
                        this.uiText.setText(`${patient.name} has moved into a free bed slot and is waiting for treatment.`);
                    }
                }

                this.selected = i;
                this.updateUI();

                // reset old
                this.diagnosisImage.setVisible(false);
                this.symptomText.setVisible(false);
                this.briefingBackground.setVisible(false);
                this.briefingText.setVisible(false);
                this.medicalReference.setVisible(false);
                this.timerText.setVisible(false);
                this.giveBtn.setVisible(false);
                this.skipBtn.setVisible(false);
                this.hideQuizPanel();

                if (this.diagnosisTimer) {
                    this.diagnosisTimer.remove(false);
                }

                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                }

                // show new
                this.diagnosisImage.setVisible(true);
                this.symptomText.setVisible(true);
                this.briefingBackground.setVisible(true);
                this.briefingText.setVisible(true);
                this.medicalReference.setVisible(true);
                this.timerText.setVisible(true);
                this.giveBtn.setVisible(true);
                this.skipBtn.setVisible(true);

                this.symptomText.setText(
`${patient.name}

${patient.disease}

${patient.symptoms}

${patient.vitals}`
                );

                this.briefingText.setText(patient.briefing);

                // Start timer countdown
                let timeRemaining = 30;
                this.timerText.setText(timeRemaining);

                // Update timer every second
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                }

                this.timerInterval = setInterval(() => {
                    timeRemaining--;
                    this.timerText.setText(timeRemaining);
                    if (timeRemaining <= 0) {
                        clearInterval(this.timerInterval);
                    }
                }, 1000);

                // auto close and begin health drain if ignored
                this.diagnosisTimer = this.time.delayedCall(30000, () => {
                    this.hideReportPanel();
                    if (this.selected !== null) {
                        this.startHealthDrain(this.selected);
                    }
                });
            });

            this.cards[i] = card;
        });

        this.patients.forEach((patient, i) => {
            let x, y;
            if (patient.status === "waiting") {
                const waitingIndex = waitingPatients.indexOf(patient);
                x = spacing * (waitingIndex + 1);
                y = this.scale.height * 0.66;
            } else if (patient.status === "atDoor") {
                const doorIndex = doorPatients.indexOf(patient);
                x = doorX;
                y = doorY + doorIndex * doorSpacing; // Stack vertically
            }

            const bg = this.add.rectangle(x - 60, y, 140, 18, 0x222222)
                .setOrigin(0, 0.5)
                .setDepth(16);

            const fill = this.add.rectangle(x - 60, y, 140, 18, 0x4caf50)
                .setOrigin(0, 0.5)
                .setDepth(17);

            const label = this.add.text(x, y, `Health: ${patient.health}%`, {
                fontSize: "14px",
                color: "#ffffff"
            })
            .setOrigin(0.5)
            .setDepth(18);

            this.healthDisplays[i] = { bg, fill, label };
            this.updateHealthDisplay(i);
        });

        // =====================
        // BUTTONS
        // =====================
        this.giveBtn = this.add.text(60, this.scale.height - 100, "PRESCRIBE MEDICINE", {
            fontSize: "24px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: { x: 12, y: 8 }
        })
        .setInteractive()
        .setDepth(50);
        this.giveBtn.setVisible(false);

        this.skipBtn = this.add.text(this.scale.width - 180, this.scale.height - 100, "SKIP", {
            fontSize: "24px",
            backgroundColor: "#D32F2F",
            color: "#fff",
            padding: { x: 12, y: 8 }
        })
        .setInteractive()
        .setDepth(50);
        this.skipBtn.setVisible(false);

        this.giveBtn.on("pointerdown", () => this.openQuiz(this.selected));
        this.skipBtn.on("pointerdown", () => this.decide(false));

        this.createQuizUI();
    }

    // =====================
    // BACKGROUND SCALE
    // =====================
    fitBackground() {
        const scale = Math.max(
            this.scale.width / this.bg.width,
            this.scale.height / this.bg.height
        );

        this.bg.setScale(scale);
    }

    // =====================
    // UI UPDATE
    // =====================
    updateUI() {

        if (this.selected === null) {
            this.uiText.setText(`Beds occupied: ${this.occupiedBeds}/${this.totalBeds}`);
            return;
        }

        const p = this.patients[this.selected];

        if (!p) {
            this.uiText.setText(`Beds occupied: ${this.occupiedBeds}/${this.totalBeds}`);
            return;
        }

        this.uiText.setText(
`Patient: ${p.name}
Age: ${p.age}
Health: ${Math.round(p.health)}%
Status: ${p.status}
Beds occupied: ${this.occupiedBeds}/${this.totalBeds}`
        );
    }

    checkEnableDoorPatients() {
        // Door patients remain at the door until the player clicks them.
        // Do not automatically move them into freed patient slots.
    }

    startHealthDrain(index, drainRate = 5) {
        const patient = this.patients[index];
        if (!patient || patient.status !== "waiting") return;
        if (this.healthDrainEvents[index]) {
            this.healthDrainEvents[index].remove(false);
            this.healthDrainEvents[index] = null;
        }

        this.healthDrainEvents[index] = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                const current = this.patients[index];
                if (!current || current.status !== "waiting") {
                    this.healthDrainEvents[index].remove(false);
                    this.healthDrainEvents[index] = null;
                    return;
                }

                current.health = Math.max(0, current.health - drainRate);
                this.updateHealthDisplay(index);

                if (current.health <= 0) {
                    this.healthDrainEvents[index].remove(false);
                    this.healthDrainEvents[index] = null;
                    this.removePatient(index, false);
                }
            }
        });
    }

    startTreatment(index) {
        const patient = this.patients[index];
        if (!patient || patient.status !== "inTreatment") return;
        if (this.treatmentEvents[index]) return;

        if (this.healthDrainEvents[index]) {
            this.healthDrainEvents[index].remove(false);
            this.healthDrainEvents[index] = null;
        }

        this.treatmentEvents[index] = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                const current = this.patients[index];
                if (!current || current.status !== "inTreatment") {
                    this.treatmentEvents[index].remove(false);
                    this.treatmentEvents[index] = null;
                    return;
                }

                current.health = Math.min(100, current.health + 5);
                this.updateHealthDisplay(index);
                this.updateUI();

                if (current.health >= 100) {
                    this.treatmentEvents[index].remove(false);
                    this.treatmentEvents[index] = null;
                    this.removePatient(index, true);
                }
            }
        });
    }

    updateHealthDisplay(index) {
        const patient = this.patients[index];
        const display = this.healthDisplays[index];
        if (!patient || !display) return;

        const percent = Phaser.Math.Clamp(patient.health, 0, 100);
        display.fill.width = 140 * (percent / 100);
        display.fill.fillColor = percent > 60 ? 0x4caf50 : percent > 30 ? 0xffc107 : 0xd32f2f;
        display.label.setText(`Health: ${Math.round(percent)}%`);
    }

    createQuizUI() {
        const panelWidth = 680;
        const panelHeight = 360;
        const panelX = this.scale.width / 2;
        const panelY = this.scale.height / 2;

        this.quizPanel = this.add.rectangle(panelX, panelY, panelWidth, panelHeight, 0xf7f7f7, 0.96)
            .setStrokeStyle(3, 0x1f1f1f)
            .setDepth(45)
            .setVisible(false);

        this.quizQuestionText = this.add.text(panelX - panelWidth / 2 + 30, panelY - panelHeight / 2 + 30, "", {
            fontSize: "20px",
            color: "#000",
            wordWrap: { width: panelWidth - 60 }
        }).setDepth(46).setVisible(false);

        this.quizChoiceButtons = [];
        for (let i = 0; i < 4; i++) {
            const choiceBg = this.add.rectangle(panelX - panelWidth / 2 + 30, panelY - panelHeight / 2 + 100 + i * 60, panelWidth - 60, 45, 0xffffff)
                .setOrigin(0, 0)
                .setStrokeStyle(2, 0x333333)
                .setDepth(46)
                .setInteractive({ useHandCursor: true })
                .setVisible(false);

            const choiceText = this.add.text(choiceBg.x + 10, choiceBg.y + 12, "", {
                fontSize: "18px",
                color: "#000",
                wordWrap: { width: panelWidth - 100 }
            }).setDepth(47).setVisible(false);

            choiceBg.on("pointerdown", () => this.selectQuizChoice(i));
            this.quizChoiceButtons.push({ choiceBg, choiceText });
        }

        this.quizSubmitText = this.add.text(panelX, panelY + panelHeight / 2 + 40, "SUBMIT ANSWER", {
            fontSize: "22px",
            color: "#fff",
            backgroundColor: "#4caf50",
            padding: { x: 12, y: 8 }
        }).setOrigin(0.5)
            .setDepth(47)
            .setInteractive({ useHandCursor: true })
            .setVisible(false)
            .on("pointerdown", () => this.submitQuizAnswer());

        this.quizFeedbackText = this.add.text(panelX, panelY + panelHeight / 2 + 90, "", {
            fontSize: "18px",
            color: "#000",
            align: "center",
            wordWrap: { width: panelWidth - 80 }
        }).setOrigin(0.5).setDepth(46).setVisible(false);
    }

    openQuiz(index) {
        if (index === null) return;
        const patient = this.patients[index];
        if (!patient || patient.status !== "waiting") return;
        if (this.occupiedBeds >= this.totalBeds) {
            this.uiText.setText(`No beds available — ${this.occupiedBeds}/${this.totalBeds} occupied`);
            return;
        }
        if (!patient.questions || patient.questions.length === 0) return;

        // Stop health drain while quiz is active
        if (this.healthDrainEvents[index]) {
            this.healthDrainEvents[index].remove(false);
            this.healthDrainEvents[index] = null;
        }

        this.currentQuiz = {
            patientIndex: index,
            questionIndex: 0,
            correctCount: 0
        };
        this.selectedChoice = null;
        this.showQuizPanel();
        this.renderQuizQuestion();
    }

    showQuizPanel() {
        if (!this.quizPanel) return;
        this.hideReportPanel();
        const patient = this.patients[this.currentQuiz.patientIndex];
        if (patient) {
            this.briefingText.setText(patient.briefing);
            this.briefingBackground.setVisible(true);
            this.briefingText.setVisible(true);
            this.medicalReference.setVisible(true);
        }
        this.quizPanel.setVisible(true);
        this.quizQuestionText.setVisible(true);
        this.quizSubmitText.setVisible(true);
        this.quizFeedbackText.setVisible(true);
        this.quizChoiceButtons.forEach(({ choiceBg, choiceText }) => {
            choiceBg.setVisible(true);
            choiceText.setVisible(true);
            choiceBg.setFillStyle(0xffffff);
        });
        this.giveBtn.setVisible(false);
        this.skipBtn.setVisible(false);
    }

    hideQuizPanel() {
        if (!this.quizPanel) return;
        this.quizPanel.setVisible(false);
        this.quizQuestionText.setVisible(false);
        this.quizSubmitText.setVisible(false);
        this.quizFeedbackText.setVisible(false);
        this.quizChoiceButtons.forEach(({ choiceBg, choiceText }) => {
            choiceBg.setVisible(false);
            choiceText.setVisible(false);
        });
        this.briefingBackground.setVisible(false);
        this.briefingText.setVisible(false);
        this.medicalReference.setVisible(false);
        this.selectedChoice = null;
        // Don't clear currentQuiz here - let finishQuiz handle it
    }

    renderQuizQuestion() {
        if (!this.currentQuiz) return;
        const patient = this.patients[this.currentQuiz.patientIndex];
        const question = patient.questions[this.currentQuiz.questionIndex];
        if (!question) return;

        this.quizQuestionText.setText(`Question ${this.currentQuiz.questionIndex + 1}/5:\n${question.prompt}`);
        this.quizFeedbackText.setText("Select the correct medicine decision and submit.");
        this.selectedChoice = null;

        question.choices.forEach((choice, idx) => {
            const { choiceBg, choiceText } = this.quizChoiceButtons[idx];
            choiceText.setText(choice.text);
            choiceBg.setFillStyle(0xffffff);
            choiceBg.setStrokeStyle(2, 0x333333);
        });
    }

    selectQuizChoice(idx) {
        if (!this.currentQuiz) return;
        this.selectedChoice = idx;
        this.quizChoiceButtons.forEach(({ choiceBg }, choiceIdx) => {
            choiceBg.setFillStyle(choiceIdx === idx ? 0xe0f7fa : 0xffffff);
        });
    }

    submitQuizAnswer() {
        if (!this.currentQuiz) return;
        const patient = this.patients[this.currentQuiz.patientIndex];
        const question = patient.questions[this.currentQuiz.questionIndex];
        if (this.selectedChoice === null) {
            this.quizFeedbackText.setText("Please choose an answer before submitting.");
            return;
        }

        const answer = question.choices[this.selectedChoice];
        const { choiceBg } = this.quizChoiceButtons[this.selectedChoice];
        
        if (answer.correct) {
            this.currentQuiz.correctCount++;
            this.quizFeedbackText.setText("Correct! Move to the next question.");
            choiceBg.setFillStyle(0x4caf50); // Green for correct
        } else {
            this.quizFeedbackText.setText("Incorrect. Keep going and try to get at least 3 correct.");
            choiceBg.setFillStyle(0xf44336); // Red for wrong
        }

        this.currentQuiz.questionIndex++;
        this.selectedChoice = null;

        if (this.currentQuiz.questionIndex >= patient.questions.length) {
            this.time.delayedCall(1200, () => this.finishQuiz());
        } else {
            this.time.delayedCall(1200, () => this.renderQuizQuestion());
        }
    }

    finishQuiz() {
        if (!this.currentQuiz) return;
        const patient = this.patients[this.currentQuiz.patientIndex];
        const score = this.currentQuiz.correctCount;
        this.hideQuizPanel();
patient.quizScore = score;
if (score < 3) patient.wasWrongChoice = true;
        if (score >= 3) {
            patient.status = "inTreatment";
            patient.health = Math.max(patient.health, 60);
            this.occupiedBeds++;
            this.showCurtain(this.currentQuiz.patientIndex);
            this.updateHealthDisplay(this.currentQuiz.patientIndex);
            this.updateUI();
            this.startTreatment(this.currentQuiz.patientIndex);
            this.uiText.setText(`${patient.name} is admitted. Correct answers: ${score}/5.`);
            this.checkEnableDoorPatients();
        } else {
            // Health declines by 5% (same penalty as failed prescription)
            patient.health = Math.max(0, patient.health * 0.95);
            this.updateHealthDisplay(this.currentQuiz.patientIndex);
            this.uiText.setText(`${patient.name} answered ${score}/5. Health declines - your choices are not according to patient prescription.`);
            
            if (patient.health <= 0) {
                this.removePatient(this.currentQuiz.patientIndex, false);
            } else {
                // Same as SKIP button - hide report and start health drain
                patient.wasSkipped = true;
                this.hideReportPanel();
                this.startHealthDrain(this.currentQuiz.patientIndex, 5);
            }
        }

        this.currentQuiz = null;
        this.selectedChoice = null;
    }

    showCurtain(index) {
        const curtain = this.curtains[index];
        const card = this.cards[index];
        if (curtain) {
            curtain.setVisible(true);
        }
        if (card) {
            card.setVisible(false);
        }
    }

    getDoorSlot(doorIndex) {
        const doorX = 80;
        const doorY = this.scale.height * 0.3;
        const doorSpacing = 80;
        return {
            x: doorX,
            y: doorY + doorIndex * doorSpacing
        };
    }

    getWaitingSlot(waitingIndex) {
        const spacing = this.scale.width / 4;
        return {
            x: spacing * (waitingIndex + 1),
            y: this.scale.height * 0.48
        };
    }

    findFreeMainSlot() {
        for (let slot = 0; slot < 3; slot++) {
            const occupied = this.patients.some(p => p && p.mainSlot === slot && p.status !== "dead" && p.status !== "treated");
            if (!occupied) {
                return slot;
            }
        }
        return null;
    }

    updatePatientPosition(index) {
        const patient = this.patients[index];
        const card = this.cards[index];
        const curtain = this.curtains[index];
        const display = this.healthDisplays[index];
        if (!patient || !card || !curtain || !display) return;

        if (patient.status === "atDoor") {
            const doorPatients = this.patients.filter(p => p && p.status === "atDoor");
            const doorIndex = doorPatients.indexOf(patient);
            const { x, y } = this.getDoorSlot(doorIndex);
            card.setPosition(x, y);
            card.setScale(0.28);
            curtain.setPosition(x, this.scale.height * 0.44);
            display.bg.setX(x - 60);
            display.bg.setY(y);
            display.fill.setX(x - 60);
            display.fill.setY(y);
            display.label.setX(x);
            display.label.setY(y);
        } else if (patient.status === "waiting" || patient.status === "inTreatment") {
            const spacing = this.scale.width / 4;
            let x;
            const patientIndex = this.patients.indexOf(patient);
            if (patient.mainSlot != null) {
                x = spacing * (patient.mainSlot + 1);
            } else if (patientIndex >= 0 && patientIndex < 3) {
                x = spacing * (patientIndex + 1);
            } else {
                const waitingPatients = this.patients.filter(p => p && (p.status === "waiting" || p.status === "inTreatment") && p.mainSlot == null);
                const waitingIndex = waitingPatients.indexOf(patient);
                const slot = this.getWaitingSlot(waitingIndex);
                x = slot.x;
            }
            const y = this.scale.height * 0.48;
            card.setPosition(x, y);
            card.setScale(0.22);
            curtain.setPosition(x, this.scale.height * 0.44);
            display.bg.setX(x - 60);
            display.bg.setY(this.scale.height * 0.66);
            display.fill.setX(x - 60);
            display.fill.setY(this.scale.height * 0.66);
            display.label.setX(x);
            display.label.setY(this.scale.height * 0.66);
        }
    }

    refreshDoorPositions() {
        this.patients.forEach((patient, index) => {
            if (patient && patient.status === "atDoor") {
                this.updatePatientPosition(index);
            }
        });
    }

    refreshWaitingPositions() {
        this.patients.forEach((patient, index) => {
            if (patient && (patient.status === "waiting" || patient.status === "inTreatment")) {
                this.updatePatientPosition(index);
            }
        });
    }

    hideCurtain(index) {
        const curtain = this.curtains[index];
        const card = this.cards[index];
        if (curtain) {
            curtain.setVisible(false);
        }
        if (card) {
            card.setVisible(true);
        }
    }

    hideReportPanel() {
        this.diagnosisImage.setVisible(false);
        this.symptomText.setVisible(false);
        this.briefingBackground.setVisible(false);
        this.briefingText.setVisible(false);
        this.medicalReference.setVisible(false);
        this.timerText.setVisible(false);
        this.giveBtn.setVisible(false);
        this.skipBtn.setVisible(false);

        if (this.diagnosisTimer) {
            this.diagnosisTimer.remove(false);
            this.diagnosisTimer = null;
        }

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    removePatient(index, survived) {
        const patient = this.patients[index];
        if (!patient) return;

        if (this.healthDrainEvents[index]) {
            this.healthDrainEvents[index].remove(false);
            this.healthDrainEvents[index] = null;
        }

        if (this.treatmentEvents[index]) {
            this.treatmentEvents[index].remove(false);
            this.treatmentEvents[index] = null;
        }

        // Move door patient to the removed patient's position if it's Anna, John, or Maria

        if (patient.status === "inTreatment" && survived) {
            this.occupiedBeds = Math.max(0, this.occupiedBeds - 1);
            this.hideCurtain(index);
        }

        let outcomeText;
if (survived) {
    outcomeText = `Doctor made correct treatment decisions (${patient.quizScore}/5 answers correct). ` +
                  `Prescribing IVIG/plasmapheresis and proper ICU support led to recovery.`;
} else if (patient.wasSkipped) {
    outcomeText = `Doctor ignored the patient. No treatment was prescribed — patient deteriorated without care.`;
} else if (patient.wasWrongChoice) {
    outcomeText = `Doctor made wrong choices to treat the patient (${patient.quizScore}/5 answers correct). ` +
                  `Incorrect prescription caused further deterioration and death.`;
} else {
    outcomeText = `Patient received no treatment in time and deteriorated while waiting.`;
}

this.results.push({
    name: patient.name,
    age: patient.age,
    disease: patient.disease,
    survived: survived,
    wasSkipped: patient.wasSkipped || false,
    wasWrongChoice: patient.wasWrongChoice || false,
    quizScore: patient.quizScore ?? null,
    outcome: outcomeText
});

        patient.status = survived ? "treated" : "dead";

        if (this.cards[index]) {
            this.cards[index].destroy();
            this.cards[index] = null;
        }

        const display = this.healthDisplays[index];
        if (display) {
            display.bg.destroy();
            display.fill.destroy();
            display.label.destroy();
            this.healthDisplays[index] = null;
        }

        this.patients[index] = null;

        if (this.selected === index) {
            this.selected = null;
            this.hideReportPanel();
        }

        this.updateUI();
        this.checkEnableDoorPatients();
        this.checkForEnd();
    }

    checkForEnd() {
        const remaining = this.patients.filter(p => p !== null).length;
        if (remaining === 0) {
            this.time.delayedCall(500, () => {
                this.scene.start("ResultScene", {
                    results: this.results,
                    bedsLeft: this.totalBeds - this.occupiedBeds
                });
            });
        }
    }

    // =====================
    // DECISION LOGIC
    // =====================
    decide(give) {

        this.diagnosisImage.setVisible(false);
        this.symptomText.setVisible(false);
        this.briefingBackground.setVisible(false);
        this.briefingText.setVisible(false);
        this.medicalReference.setVisible(false);
        this.timerText.setVisible(false);
        this.giveBtn.setVisible(false);
        this.skipBtn.setVisible(false);

        if (this.selected === null) return;

        const p = this.patients[this.selected];
        if (!p) return;

        const giveBed = give && this.occupiedBeds < this.totalBeds;

        if (giveBed) {
            this.occupiedBeds++;
            p.status = "inTreatment";
            p.health = Math.max(p.health, 40);
            this.updateHealthDisplay(this.selected);
            this.showCurtain(this.selected);
            this.updateUI();
            this.hideReportPanel();
            this.startTreatment(this.selected);
            this.checkEnableDoorPatients();
            return;
        }

        if (give && this.occupiedBeds >= this.totalBeds) {
            this.uiText.setText(`No beds available — ${this.occupiedBeds}/${this.totalBeds} occupied`);
            return;
        }

        p.wasSkipped = true;
this.hideReportPanel();
this.startHealthDrain(this.selected, 5);
    }
}