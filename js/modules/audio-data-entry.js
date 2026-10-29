// Audio Data Entry Module - listen to a 911 call once, then type what you
// heard. This is a distinct CritiCall skill from the text-based on-screen
// "Data Entry" module (js/modules/data-entry.js, js/data/question-bank.js)
// - that one tests typing structured info you're reading; this one tests
// listening comprehension plus accurate entry, same as the real CritiCall
// "audio data entry" category. Ported from criticall.html's original
// inline showDataEntry()/submitDataEntry(), now shared between the
// practice hub (criticall.html) and the graded test (criticalltest.html).

const audioDataEntryScenarios = [
    // The 3 original recordings - kept as real audio.
    {
        audioFile: "audio/data-entry/scenario1.mp3",
        answers: { callerName: "SARAH JOHNSTON", address: "1245 OAK STREET", incidentType: "MEDICAL EMERGENCY" }
    },
    {
        audioFile: "audio/data-entry/scenario2.mp3",
        answers: { callerName: "MICHELLE CHEN", address: "789 MAPLE AVENUE", incidentType: "STRUCTURE FIRE" }
    },
    {
        audioFile: "audio/data-entry/scenario3.mp3",
        answers: { callerName: "EMILY RODRIQUEZ", address: "456 PINE STREET", incidentType: "MVC" }
    },
    // TTS-only scenarios for variety - swap in a real audioFile here later
    // for any of these and nothing else needs to change.
    {
        script: "911, what's your emergency? This is David Chen, I'm at 782 Birch Lane. There's a car crash right outside my house, two vehicles involved.",
        answers: { callerName: "DAVID CHEN", address: "782 BIRCH LANE", incidentType: "MOTOR VEHICLE COLLISION" }
    },
    {
        script: "I need help, this is Amanda Foster at 310 Westbrook Drive, my husband collapsed and he's not breathing.",
        answers: { callerName: "AMANDA FOSTER", address: "310 WESTBROOK DRIVE", incidentType: "MEDICAL EMERGENCY" }
    },
    {
        script: "Hi, my name is Robert Hale, I'm calling from 95 Lakeview Court. Someone just broke into my neighbor's house, I can see a broken window.",
        answers: { callerName: "ROBERT HALE", address: "95 LAKEVIEW COURT", incidentType: "BREAK AND ENTER" }
    },
    {
        script: "This is Jennifer Osei, I'm at 1420 Grove Avenue. There's been a hit and run, the other car just drove off.",
        answers: { callerName: "JENNIFER OSEI", address: "1420 GROVE AVENUE", incidentType: "HIT AND RUN" }
    },
    {
        script: "My name is Thomas Whitfield, address is 67 Harbor Road. There's a strong smell of gas in my basement.",
        answers: { callerName: "THOMAS WHITFIELD", address: "67 HARBOR ROAD", incidentType: "GAS LEAK" }
    },
    {
        script: "This is Priya Nair calling from 248 Sunset Terrace. My son fell off his bike and he's bleeding pretty badly from his head.",
        answers: { callerName: "PRIYA NAIR", address: "248 SUNSET TERRACE", incidentType: "MEDICAL EMERGENCY" }
    },
    {
        script: "I'm Daniel Okafor, I'm at 503 Industrial Parkway. There's a forklift accident at the warehouse, someone's leg is trapped.",
        answers: { callerName: "DANIEL OKAFOR", address: "503 INDUSTRIAL PARKWAY", incidentType: "INDUSTRIAL ACCIDENT" }
    }
];

const audioDataEntryModule = {
    name: "Audio Data Entry",
    selectedScenarios: [],
    currentScenario: 0,
    results: { correct: 0, total: 0, individualResults: [], startTime: null },

    init(questionCount) {
        this.selectedScenarios = pickRandomScenarios(audioDataEntryScenarios, questionCount);
        this.currentScenario = 0;
        this.results = {
            correct: 0,
            total: this.selectedScenarios.length,
            individualResults: [],
            startTime: Date.now()
        };
    },

    render(container, questionCount, onComplete) {
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.showScenario();
    },

    showScenario() {
        if (this.currentScenario >= this.selectedScenarios.length) {
            this.finish();
            return;
        }

        const scenario = this.selectedScenarios[this.currentScenario];
        this.container.innerHTML = `
            <div class="module-progress">Scenario ${this.currentScenario + 1} of ${this.selectedScenarios.length}</div>
            <h3>🎧 Listen Carefully to the Emergency Call</h3>
            <div id="audioSlot"></div>
            <div class="data-entry-form" id="dataEntryFormArea">
                <h4>Type the information as you hear it (use CAPS, as you would in CAD) - don't wait for the call to end:</h4>
                <div class="form-row">
                    <label>Caller Name:</label>
                    <input type="text" id="deCallerName" placeholder="First and Last Name">
                </div>
                <div class="form-row">
                    <label>Address/Location:</label>
                    <input type="text" id="deAddress" placeholder="Street address or location">
                </div>
                <div class="form-row">
                    <label>Incident Type:</label>
                    <input type="text" id="deIncidentType" placeholder="Type of emergency">
                </div>
                <div style="text-align: center; margin-top: 15px;">
                    <button class="btn btn-success" id="deSubmitBtn">Submit Entry</button>
                </div>
            </div>
        `;

        // The form renders enabled from the start, alongside the audio
        // player - real CritiCall audio data entry means typing while the
        // call plays, not waiting for it to finish. onEnded here is just
        // for the audio widget's own "completed" status text, not a gate
        // on the form.
        buildAudioPlayerUI(this.container.querySelector('#audioSlot'), scenario);

        this.container.querySelector('#deSubmitBtn').addEventListener('click', () => this.submitScenario(scenario));
    },

    submitScenario(scenario) {
        const userAnswers = {
            callerName: this.container.querySelector('#deCallerName').value.trim(),
            address: this.container.querySelector('#deAddress').value.trim(),
            incidentType: this.container.querySelector('#deIncidentType').value.trim()
        };

        const fields = ['callerName', 'address', 'incidentType'];
        let fieldsCorrect = 0;
        const feedback = fields.map(field => {
            const correct = userAnswers[field].toLowerCase() === scenario.answers[field].toLowerCase();
            if (correct) fieldsCorrect++;
            return { field, correct, correctValue: scenario.answers[field] };
        });

        const scenarioScore = (fieldsCorrect / fields.length) * 100;
        if (scenarioScore === 100) this.results.correct++;
        this.results.individualResults.push({ scenario, userAnswers, scenarioScore, feedback });

        this.showFeedback(scenarioScore, feedback);
    },

    showFeedback(scenarioScore, feedback) {
        const labels = { callerName: 'Caller Name', address: 'Address', incidentType: 'Incident Type' };
        this.container.innerHTML = `
            <div class="score-display">
                <h3>Scenario ${this.currentScenario + 1} Results</h3>
                <h2>${Math.round(scenarioScore)}%</h2>
            </div>
            <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
                ${feedback.map(f => `
                    <p style="margin: 10px 0; font-size: 16px;">
                        ${f.correct ? '✓' : '✗'} ${labels[f.field]}: ${f.correct ? 'Correct' : `Incorrect (Correct: ${f.correctValue})`}
                    </p>
                `).join('')}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" id="deContinueBtn">Continue</button>
            </div>
        `;
        this.container.querySelector('#deContinueBtn').addEventListener('click', () => {
            this.currentScenario++;
            this.showScenario();
        });
    },

    finish() {
        const accuracy = this.results.individualResults.length > 0
            ? this.results.individualResults.reduce((sum, r) => sum + r.scenarioScore, 0) / this.results.individualResults.length
            : 0;

        const finalResults = {
            moduleId: 'audioDataEntry',
            correctAnswers: this.results.correct,
            totalQuestions: this.selectedScenarios.length,
            accuracy: Math.round(accuracy)
        };

        this.onComplete(finalResults);
    }
};

window.audioDataEntryModule = audioDataEntryModule;
