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
        // Mid-sentence self-correction - the real test includes callers who
        // change their mind partway through a sentence; typing the first
        // address you hear before the correction is a known trap. The
        // answer below is the CORRECTED value, not the first one spoken.
        script: "911, what's your emergency? This is David Chen, I'm at 782 Birch Lane - no wait, sorry, that's 782 Birch Court, I always mix those up. There's a car crash right outside my house, two vehicles involved.",
        answers: { callerName: "DAVID CHEN", address: "782 BIRCH COURT", incidentType: "MOTOR VEHICLE COLLISION" }
    },
    {
        script: "I need help, this is Amanda Foster at 310 Westbrook Drive, my husband collapsed and he's not breathing.",
        answers: { callerName: "AMANDA FOSTER", address: "310 WESTBROOK DRIVE", incidentType: "MEDICAL EMERGENCY" }
    },
    {
        // Real dispatchers have callers spell an uncommon surname rather
        // than leaving the dispatcher to guess - "Hale" has no way to be
        // inferred correctly from audio alone otherwise (could just as
        // easily be "Hail"). Any name here that isn't an unambiguous common
        // spelling gets this same spelled-out treatment.
        script: "Hi, my name is Robert Hale - that's spelled H, A, L, E - I'm calling from 95 Lakeview Court. Someone just broke into my neighbor's house, I can see a broken window.",
        answers: { callerName: "ROBERT HALE", address: "95 LAKEVIEW COURT", incidentType: "BREAK AND ENTER" }
    },
    {
        // Another mid-sentence correction, this time on the caller's name.
        script: "This is Jennifer Osei - actually it's Jennifer Osei-Bonsu, that's spelled O, S, E, I, hyphen, B, O, N, S, U, people usually just use my first name. I'm at 1420 Grove Avenue. There's been a hit and run, the other car just drove off.",
        answers: { callerName: "JENNIFER OSEI-BONSU", address: "1420 GROVE AVENUE", incidentType: "HIT AND RUN" }
    },
    {
        script: "My name is Thomas Whitfield, address is 67 Harbor Road. There's a strong smell of gas in my basement.",
        answers: { callerName: "THOMAS WHITFIELD", address: "67 HARBOR ROAD", incidentType: "GAS LEAK" }
    },
    {
        script: "This is Priya Nair - that's spelled N, A, I, R - calling from 248 Sunset Terrace. My son fell off his bike and he's bleeding pretty badly from his head.",
        answers: { callerName: "PRIYA NAIR", address: "248 SUNSET TERRACE", incidentType: "MEDICAL EMERGENCY" }
    },
    {
        script: "I'm Daniel Okafor - that's spelled O, K, A, F, O, R - I'm at 503 Industrial Parkway. There's a forklift accident at the warehouse, someone's leg is trapped.",
        answers: { callerName: "DANIEL OKAFOR", address: "503 INDUSTRIAL PARKWAY", incidentType: "INDUSTRIAL ACCIDENT" }
    }
];

// Grading for address/incidentType used to require an exact string match,
// which failed obviously-correct answers written in a different (but
// equally valid) format - "Parkview Ct" vs "Parkview Court", or "B and E"
// vs "Break and Enter" (real CAD shorthand dispatchers actually use). These
// normalize both the student's answer AND the stored answer key to the same
// canonical form before comparing, so either form is accepted regardless of
// which one happens to be written in the data.
const STREET_TYPE_ALIASES = {
    street: 'st', avenue: 'ave', court: 'ct', drive: 'dr', road: 'rd',
    boulevard: 'blvd', lane: 'ln', place: 'pl', terrace: 'ter',
    parkway: 'pkwy', circle: 'cir', crescent: 'cres', trail: 'trl'
};

function normalizeAddress(str) {
    return str
        .toLowerCase()
        .replace(/[.,]/g, '')
        .split(/\s+/)
        .map(word => STREET_TYPE_ALIASES[word] || word)
        .join(' ')
        .trim();
}

const INCIDENT_TYPE_ALIASES = {
    'b and e': 'break and enter', 'b & e': 'break and enter', 'b&e': 'break and enter',
    'break & enter': 'break and enter', 'breaking and entering': 'break and enter',
    'break in': 'break and enter', 'break-in': 'break and enter',
    'mvc': 'motor vehicle collision', 'mva': 'motor vehicle collision',
    'motor vehicle accident': 'motor vehicle collision', 'car accident': 'motor vehicle collision',
    'car crash': 'motor vehicle collision', 'vehicle collision': 'motor vehicle collision',
    'hit & run': 'hit and run', 'h&r': 'hit and run',
    'medical': 'medical emergency', 'medical call': 'medical emergency',
    'gas leak': 'gas leak', 'gas odor': 'gas leak', 'gas smell': 'gas leak',
    'fire': 'structure fire', 'house fire': 'structure fire',
    'industrial accident': 'industrial accident', 'workplace accident': 'industrial accident'
};

function normalizeIncidentType(str) {
    const cleaned = str.toLowerCase().replace(/[.,]/g, '').trim();
    return INCIDENT_TYPE_ALIASES[cleaned] || cleaned;
}

const audioDataEntryModule = {
    name: "Audio Data Entry",
    selectedScenarios: [],
    currentScenario: 0,
    results: { correct: 0, total: 0, individualResults: [], startTime: null },
    // Set to true by js/test-engine.js right before it renders this module
    // for the graded test, so per-question feedback stops revealing the
    // correct answer mid-test (practice mode leaves this false).
    testMode: false,

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
                <h4>Type the information as you hear it (use CAPS, as you would in CAD) - don't wait for the call to end. Common abbreviations are fine (St/Ave/Ct, B and E, MVC, etc).</h4>
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
        const normalizers = {
            callerName: s => s.trim().toLowerCase(),
            address: normalizeAddress,
            incidentType: normalizeIncidentType
        };
        let fieldsCorrect = 0;
        const feedback = fields.map(field => {
            const correct = normalizers[field](userAnswers[field]) === normalizers[field](scenario.answers[field]);
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
                        ${f.correct ? '✓' : '✗'} ${labels[f.field]}: ${f.correct ? 'Correct' : (this.testMode ? 'Incorrect' : `Incorrect (Correct: ${f.correctValue})`)}
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
