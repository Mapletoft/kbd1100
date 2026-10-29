// Call Summarization Module - listen to a 911 call, then decide which
// services to dispatch and at what priority. Previously this module (in
// criticall.html) showed the scenario as plain on-screen text, which isn't
// how real CritiCall's call summarization works - it's audio-based. The
// fix here is delivery (listen once, no transcript) rather than the
// scoring concept, which stays the same: select the correct services and
// priority level. Shared between the practice hub (criticall.html) and
// the graded test (criticalltest.html).

function arraysEqualCS(a, b) {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, i) => val === sortedB[i]);
}

const callSummarizationScenarios = [
    { script: "A 45-year-old male is experiencing severe chest pain and difficulty breathing. He is conscious but in obvious distress. His wife reports he has a history of heart problems.", correctServices: ["ems"], correctPriority: "high" },
    { script: "Caller reports seeing smoke coming from a neighbor's garage. No flames visible yet, but the smell is getting stronger. No one appears to be home.", correctServices: ["fire"], correctPriority: "medium" },
    { script: "A two-car collision at Main Street and 5th Avenue. Minor injuries reported, one vehicle is blocking the right lane. Both drivers are out of their vehicles.", correctServices: ["police", "ems"], correctPriority: "medium" },
    { script: "Caller reports an unresponsive infant, not breathing. Mother is hysterical. Address is clear.", correctServices: ["ems"], correctPriority: "high" },
    { script: "Neighbor reports a burglary in progress. Suspects are currently inside the residence. Homeowners are on vacation.", correctServices: ["police"], correctPriority: "high" },
    { script: "Elderly woman fell in her bathroom. She is conscious and alert but cannot get up. No visible injuries but complaining of hip pain.", correctServices: ["ems"], correctPriority: "medium" },
    { script: "Structure fire fully involved, multiple floors. Building is a commercial warehouse. All occupants have evacuated safely.", correctServices: ["fire", "police"], correctPriority: "high" },
    { script: "Carbon monoxide alarm sounding in a residence. Family members are feeling dizzy and nauseous. They are outside now.", correctServices: ["fire", "ems"], correctPriority: "high" },
    { script: "Suspicious person loitering near a school playground. School is currently in session. Individual is not responding to staff requests to leave.", correctServices: ["police"], correctPriority: "medium" },
    { script: "Tree branch fell on power lines during a storm. Sparking visible. Lines are across the roadway, blocking both lanes.", correctServices: ["fire", "police", "utilities"], correctPriority: "high" },
    { script: "Caller reports her medication was stolen from her vehicle overnight. Vehicle was parked in her driveway.", correctServices: ["police"], correctPriority: "low" },
    { script: "Domestic disturbance. Neighbors report shouting and sounds of items breaking. Children's voices heard crying.", correctServices: ["police"], correctPriority: "high" },
    { script: "Gas leak reported at a restaurant. Strong odor throughout the building. Building has been evacuated.", correctServices: ["fire", "utilities"], correctPriority: "high" },
    { script: "Vehicle versus pedestrian accident. Pedestrian is conscious, sitting on the curb. Visible leg injury. Driver remained on scene.", correctServices: ["police", "ems"], correctPriority: "high" },
    { script: "Caller locked keys in car with an infant inside. Weather is hot, approximately 30 degrees. Infant appears alert through the window.", correctServices: ["fire", "police"], correctPriority: "high" }
];

const callSummarizationModule = {
    name: "Call Summarization",
    selectedScenarios: [],
    currentScenario: 0,
    results: { correct: 0, total: 0, individualResults: [] },

    init(questionCount) {
        this.selectedScenarios = pickRandomScenarios(callSummarizationScenarios, questionCount);
        this.currentScenario = 0;
        this.results = { correct: 0, total: this.selectedScenarios.length, individualResults: [] };
    },

    render(container, questionCount, onComplete) {
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.selectedPriority = null;
        this.showScenario();
    },

    showScenario() {
        if (this.currentScenario >= this.selectedScenarios.length) {
            this.finish();
            return;
        }

        this.selectedPriority = null;
        const scenario = this.selectedScenarios[this.currentScenario];
        this.container.innerHTML = `
            <div class="module-progress">Call ${this.currentScenario + 1} of ${this.selectedScenarios.length}</div>
            <h3>📞 Listen to the Emergency Call</h3>
            <div id="audioSlot"></div>
            <div id="csDecisionArea" style="display: none;">
                <div class="decision-section">
                    <h3>Select Appropriate Services:</h3>
                    <div class="checkbox-group">
                        <div class="checkbox-item"><input type="checkbox" id="service-police" value="police"><label for="service-police">🚔 Police</label></div>
                        <div class="checkbox-item"><input type="checkbox" id="service-fire" value="fire"><label for="service-fire">🚒 Fire Department</label></div>
                        <div class="checkbox-item"><input type="checkbox" id="service-ems" value="ems"><label for="service-ems">🚑 EMS/Medical</label></div>
                        <div class="checkbox-item"><input type="checkbox" id="service-utilities" value="utilities"><label for="service-utilities">⚡ Utilities</label></div>
                    </div>
                    <h3 style="margin-top: 20px;">Select Priority Level:</h3>
                    <div class="priority-buttons">
                        <button class="priority-btn high" data-priority="high">HIGH<br><small>Life-threatening / Immediate danger</small></button>
                        <button class="priority-btn medium" data-priority="medium">MEDIUM<br><small>Urgent but not life-threatening</small></button>
                        <button class="priority-btn low" data-priority="low">LOW<br><small>Non-urgent / Routine</small></button>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn btn-success" id="csSubmitBtn">Submit Decision</button>
                </div>
            </div>
        `;

        buildAudioPlayerUI(this.container.querySelector('#audioSlot'), scenario, {
            onEnded: () => {
                this.container.querySelector('#csDecisionArea').style.display = 'block';
            }
        });

        this.container.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedPriority = btn.dataset.priority;
            });
        });

        this.container.querySelector('#csSubmitBtn').addEventListener('click', () => this.submitDecision(scenario));
    },

    submitDecision(scenario) {
        const selectedServices = [];
        ['police', 'fire', 'ems', 'utilities'].forEach(service => {
            if (this.container.querySelector(`#service-${service}`).checked) selectedServices.push(service);
        });

        if (selectedServices.length === 0 || !this.selectedPriority) {
            alert('Please select at least one service and a priority level.');
            return;
        }

        const servicesCorrect = arraysEqualCS(selectedServices, scenario.correctServices);
        const priorityCorrect = this.selectedPriority === scenario.correctPriority;
        const correct = servicesCorrect && priorityCorrect;
        if (correct) this.results.correct++;

        this.results.individualResults.push({
            scenario, selectedServices, selectedPriority: this.selectedPriority,
            servicesCorrect, priorityCorrect
        });

        this.showFeedback(servicesCorrect, priorityCorrect, scenario);
    },

    showFeedback(servicesCorrect, priorityCorrect, scenario) {
        this.container.innerHTML += `
            <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
                <h3>Feedback:</h3>
                <p><strong>Services:</strong> ${servicesCorrect ? '✓ Correct' : '✗ Incorrect'}</p>
                ${!servicesCorrect ? `<p style="margin-left: 20px;">Correct services: ${scenario.correctServices.join(', ')}</p>` : ''}
                <p><strong>Priority:</strong> ${priorityCorrect ? '✓ Correct' : '✗ Incorrect'}</p>
                ${!priorityCorrect ? `<p style="margin-left: 20px;">Correct priority: ${scenario.correctPriority}</p>` : ''}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-primary" id="csContinueBtn">Continue to Next Call</button>
            </div>
        `;
        this.container.querySelector('#csContinueBtn').addEventListener('click', () => {
            this.currentScenario++;
            this.showScenario();
        });
    },

    finish() {
        const accuracy = this.selectedScenarios.length > 0
            ? (this.results.correct / this.selectedScenarios.length) * 100
            : 0;

        const finalResults = {
            moduleId: 'callSummarization',
            correctAnswers: this.results.correct,
            totalQuestions: this.selectedScenarios.length,
            accuracy: Math.round(accuracy)
        };

        this.onComplete(finalResults);
    }
};

window.callSummarizationModule = callSummarizationModule;
