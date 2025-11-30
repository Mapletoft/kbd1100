// Data Entry Module - Randomized question selection

const dataEntryModule = {
    name: "Data Entry",
    questionBank: null, // Will be loaded from QuestionBank
    selectedScenarios: [],
    currentScenario: 0,
    results: {
        correct: 0,
        total: 0,
        totalKeystrokes: 0,
        totalWords: 0,
        startTime: null,
        individualResults: []
    },

    // Initialize module with random scenario selection
    init(questionCount) {
        // Load question bank
        this.questionBank = QuestionBank.dataEntry;
        
        // Randomly select scenarios
        this.selectedScenarios = getRandomQuestions(this.questionBank, questionCount);
        
        this.currentScenario = 0;
        this.results = {
            correct: 0,
            total: questionCount,
            totalKeystrokes: 0,
            totalWords: 0,
            startTime: Date.now(),
            individualResults: []
        };
        
        console.log('Data Entry initialized with', questionCount, 'scenarios');
    },

    // Render module to container
    render(container, questionCount, onComplete) {
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        
        this.showScenario();
    },

    // Show current scenario
    showScenario() {
        if (this.currentScenario >= this.selectedScenarios.length) {
            this.finish();
            return;
        }

        const scenario = this.selectedScenarios[this.currentScenario];
        const scenarioNum = this.currentScenario + 1;
        const total = this.selectedScenarios.length;

        this.container.innerHTML = `
            <div class="data-entry-module">
                <div class="progress-indicator">
                    <p>Scenario ${scenarioNum} of ${total}</p>
                    <div class="progress-bar-slim">
                        <div class="progress-fill" style="width: ${(scenarioNum / total) * 100}%"></div>
                    </div>
                </div>

                <div class="scenario-display">
                    <h3>Emergency Call Information</h3>
                    <div class="info-display">
                        <p><strong>Name:</strong> ${scenario.name}</p>
                        <p><strong>Phone:</strong> ${scenario.phone}</p>
                        <p><strong>Address:</strong> ${scenario.address}</p>
                        <p><strong>City:</strong> ${scenario.city}</p>
                        <p><strong>Postal Code:</strong> ${scenario.postalCode}</p>
                        <p><strong>Emergency:</strong> ${scenario.emergency}</p>
                    </div>
                    <p class="instruction">Review the information above, then enter it in the form below.</p>
                </div>

                <div class="data-entry-form">
                    <h3>Enter Information (AS YOU WOULD IN CAD - CAPS LOCK ON)</h3>
                    <div class="form-grid">
                        <div class="form-field">
                            <label>Caller Name *</label>
                            <input type="text" id="input_name" class="data-input" autocomplete="off">
                        </div>
                        <div class="form-field">
                            <label>Phone Number *</label>
                            <input type="text" id="input_phone" class="data-input" autocomplete="off">
                        </div>
                        <div class="form-field">
                            <label>Street Address *</label>
                            <input type="text" id="input_address" class="data-input" autocomplete="off">
                        </div>
                        <div class="form-field">
                            <label>City *</label>
                            <input type="text" id="input_city" class="data-input" autocomplete="off">
                        </div>
                        <div class="form-field">
                            <label>Postal Code *</label>
                            <input type="text" id="input_postal" class="data-input" autocomplete="off">
                        </div>
                        <div class="form-field">
                            <label>Emergency Type *</label>
                            <input type="text" id="input_emergency" class="data-input" autocomplete="off">
                        </div>
                    </div>
                </div>

                <div class="module-actions">
                    <button onclick="dataEntryModule.submitScenario()" class="primary-btn">
                        Submit Entry
                    </button>
                </div>
            </div>
        `;

        // Track keystrokes
        const inputs = this.container.querySelectorAll('.data-input');
        inputs.forEach(input => {
            input.addEventListener('keypress', () => {
                this.results.totalKeystrokes++;
            });
        });

        // Focus first input
        document.getElementById('input_name').focus();
    },

    // Submit current scenario
    submitScenario() {
        const scenario = this.selectedScenarios[this.currentScenario];
        
        // Get user inputs (normalize for comparison)
        const userInputs = {
            name: document.getElementById('input_name').value.trim(),
            phone: document.getElementById('input_phone').value.trim(),
            address: document.getElementById('input_address').value.trim(),
            city: document.getElementById('input_city').value.trim(),
            postal: document.getElementById('input_postal').value.trim(),
            emergency: document.getElementById('input_emergency').value.trim()
        };

        // Calculate score for this scenario
        let fieldsCorrect = 0;
        const totalFields = 6;
        const feedback = [];

        // Check each field (case-insensitive, trimmed)
        if (this.compareFields(userInputs.name, scenario.name)) {
            fieldsCorrect++;
            feedback.push({ field: 'Name', correct: true, expected: scenario.name });
        } else {
            feedback.push({ field: 'Name', correct: false, expected: scenario.name, got: userInputs.name });
        }

        if (this.compareFields(userInputs.phone, scenario.phone)) {
            fieldsCorrect++;
            feedback.push({ field: 'Phone', correct: true, expected: scenario.phone });
        } else {
            feedback.push({ field: 'Phone', correct: false, expected: scenario.phone, got: userInputs.phone });
        }

        if (this.compareFields(userInputs.address, scenario.address)) {
            fieldsCorrect++;
            feedback.push({ field: 'Address', correct: true, expected: scenario.address });
        } else {
            feedback.push({ field: 'Address', correct: false, expected: scenario.address, got: userInputs.address });
        }

        if (this.compareFields(userInputs.city, scenario.city)) {
            fieldsCorrect++;
            feedback.push({ field: 'City', correct: true, expected: scenario.city });
        } else {
            feedback.push({ field: 'City', correct: false, expected: scenario.city, got: userInputs.city });
        }

        if (this.compareFields(userInputs.postal, scenario.postalCode)) {
            fieldsCorrect++;
            feedback.push({ field: 'Postal Code', correct: true, expected: scenario.postalCode });
        } else {
            feedback.push({ field: 'Postal Code', correct: false, expected: scenario.postalCode, got: userInputs.postal });
        }

        if (this.compareFields(userInputs.emergency, scenario.emergency)) {
            fieldsCorrect++;
            feedback.push({ field: 'Emergency Type', correct: true, expected: scenario.emergency });
        } else {
            feedback.push({ field: 'Emergency Type', correct: false, expected: scenario.emergency, got: userInputs.emergency });
        }

        // Calculate score percentage for this scenario
        const scenarioScore = (fieldsCorrect / totalFields) * 100;
        
        // Count total words typed
        const totalWords = Object.values(userInputs).reduce((sum, val) => {
            return sum + val.split(/\s+/).filter(w => w.length > 0).length;
        }, 0);
        this.results.totalWords += totalWords;

        // Store result
        this.results.individualResults.push({
            scenarioNum: this.currentScenario + 1,
            score: scenarioScore,
            fieldsCorrect: fieldsCorrect,
            totalFields: totalFields,
            feedback: feedback
        });

        if (fieldsCorrect === totalFields) {
            this.results.correct++;
        }

        // Show feedback then move to next
        this.showFeedback(feedback, scenarioScore);
    },

    // Compare fields with flexible matching
    compareFields(user, correct) {
        // Normalize both strings
        const normalize = (str) => {
            return str.toLowerCase()
                .replace(/\s+/g, ' ')
                .replace(/-/g, '')
                .replace(/\./g, '')
                .trim();
        };

        return normalize(user) === normalize(correct);
    },

    // Show feedback for current scenario
    showFeedback(feedback, score) {
        const isCorrect = score === 100;
        const statusClass = isCorrect ? 'success' : 'warning';
        const statusIcon = isCorrect ? '✓' : '!';

        let feedbackHTML = '<div class="feedback-list">';
        feedback.forEach(item => {
            const icon = item.correct ? '✓' : '✗';
            const className = item.correct ? 'correct' : 'incorrect';
            feedbackHTML += `
                <div class="feedback-item ${className}">
                    <span class="feedback-icon">${icon}</span>
                    <span class="feedback-field">${item.field}:</span>
                    ${item.correct ? 
                        '<span class="feedback-status">Correct</span>' :
                        `<span class="feedback-status">Expected: <strong>${item.expected}</strong></span>`
                    }
                </div>
            `;
        });
        feedbackHTML += '</div>';

        this.container.innerHTML = `
            <div class="scenario-feedback ${statusClass}">
                <div class="feedback-header">
                    <h2>${statusIcon} Scenario ${this.currentScenario + 1} Complete</h2>
                    <h3>Score: ${Math.round(score)}%</h3>
                </div>
                
                ${feedbackHTML}
                
                <div class="module-actions">
                    <button onclick="dataEntryModule.nextScenario()" class="primary-btn">
                        Continue to Next Scenario →
                    </button>
                </div>
            </div>
        `;
    },

    // Move to next scenario
    nextScenario() {
        this.currentScenario++;
        this.showScenario();
    },

    // Finish module
    finish() {
        const endTime = Date.now();
        const timeUsed = (endTime - this.results.startTime) / 1000; // seconds

        // Calculate final accuracy
        const accuracy = (this.results.correct / this.results.total) * 100;

        // Prepare results for test engine
        const finalResults = {
            moduleId: 'dataEntry',
            accuracy: accuracy,
            correctAnswers: this.results.correct,
            totalQuestions: this.results.total,
            totalKeystrokes: this.results.totalKeystrokes,
            totalWords: this.results.totalWords,
            score: accuracy,
            individualResults: this.results.individualResults
        };

        // Call completion callback
        if (this.onComplete) {
            this.onComplete(finalResults);
        }
    }
};

// Make available globally
window.dataEntryModule = dataEntryModule;
