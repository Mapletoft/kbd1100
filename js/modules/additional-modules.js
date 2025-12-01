// ADDITIONAL MODULES
// Reading Comprehension and Memory Recall
// (Map Reading, Cross Reference, Multitasking are in map-cross-multi.js)

// ===== READING COMPREHENSION MODULE =====
const readingComprehensionModule = {
    name: "Reading Comprehension",
    selectedPassages: [],
    currentPassage: 0,
    results: {
        correct: 0,
        total: 0
    },

    init(questionCount) {
        this.selectedPassages = getRandomQuestions(QuestionBankPart2.readingComprehension, questionCount);
        this.currentPassage = 0;
        this.results = {
            correct: 0,
            total: 0
        };
    },

    render(container, questionCount, onComplete) {
        // Safety check: ensure getRandomQuestions is available
        if (typeof getRandomQuestions === 'undefined') {
            console.warn('⚠️ Reading Comprehension waiting for question bank to load...');
            setTimeout(() => this.render(container, questionCount, onComplete), 50);
            return;
        }
        
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.showPassage();
    },

    showPassage() {
        if (this.currentPassage >= this.selectedPassages.length) {
            this.finish();
            return;
        }

        const passage = this.selectedPassages[this.currentPassage];
        const passageNum = this.currentPassage + 1;
        const total = this.selectedPassages.length;

        this.container.innerHTML = `
            <div class="reading-comprehension-module">
                <div class="progress-indicator">
                    <p>Passage ${passageNum} of ${total}</p>
                    <div class="progress-bar-slim">
                        <div class="progress-fill" style="width: ${(passageNum / total) * 100}%"></div>
                    </div>
                </div>

                <div class="passage-content">
                    <h3>${passage.title}</h3>
                    <div class="passage-text">
                        ${passage.text}
                    </div>
                </div>

                <div class="module-actions">
                    <button onclick="readingComprehensionModule.startQuestions()" class="primary-btn">
                        Answer Questions →
                    </button>
                </div>
            </div>

            <style>
                .passage-content {
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .passage-text {
                    line-height: 1.8;
                    font-size: 16px;
                    color: #2c3e50;
                }
            </style>
        `;
    },

    startQuestions() {
        this.currentQuestion = 0;
        this.passageResults = {
            correct: 0,
            total: this.selectedPassages[this.currentPassage].questions.length
        };
        this.showQuestion();
    },

    showQuestion() {
        const passage = this.selectedPassages[this.currentPassage];
        
        if (this.currentQuestion >= passage.questions.length) {
            this.nextPassage();
            return;
        }

        const question = passage.questions[this.currentQuestion];
        const questionNum = this.currentQuestion + 1;
        const total = passage.questions.length;

        this.container.innerHTML = `
            <div class="reading-question-module">
                <div class="progress-indicator">
                    <p>Question ${questionNum} of ${total}</p>
                </div>

                <div class="question-content">
                    <h4>${question.question}</h4>
                    <div class="answer-options">
                        ${question.options.map((option, index) => `
                            <button onclick="readingComprehensionModule.selectAnswer('${option.replace(/'/g, "\\'")}')" 
                                    class="answer-option">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>

            <style>
                .question-content {
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .answer-options {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-top: 20px;
                }
                .answer-option {
                    padding: 15px 20px;
                    text-align: left;
                    background: white;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .answer-option:hover {
                    border-color: #667eea;
                    background: #f8f9fa;
                }
            </style>
        `;
    },

    selectAnswer(selectedAnswer) {
        const passage = this.selectedPassages[this.currentPassage];
        const question = passage.questions[this.currentQuestion];
        const correct = selectedAnswer === question.correctAnswer;

        if (correct) {
            this.passageResults.correct++;
            this.results.correct++;
        }
        this.results.total++;

        this.showQuestionFeedback(correct, question);
    },

    showQuestionFeedback(correct, question) {
        this.container.innerHTML = `
            <div class="scenario-feedback ${correct ? 'success' : 'warning'}">
                <div class="feedback-header">
                    <h2>${correct ? '✓ Correct!' : '! Incorrect'}</h2>
                </div>

                <div class="feedback-details">
                    <div class="feedback-section">
                        <h4>Correct Answer:</h4>
                        <p>${question.correctAnswer}</p>
                    </div>
                </div>

                <div class="module-actions">
                    <button onclick="readingComprehensionModule.nextQuestion()" class="primary-btn">
                        ${this.currentQuestion < this.selectedPassages[this.currentPassage].questions.length - 1 ? 'Next Question →' : 'Continue →'}
                    </button>
                </div>
            </div>
        `;
    },

    nextQuestion() {
        this.currentQuestion++;
        this.showQuestion();
    },

    nextPassage() {
        this.currentPassage++;
        this.showPassage();
    },

    finish() {
        const accuracy = this.results.total > 0 ? (this.results.correct / this.results.total) * 100 : 0;

        const finalResults = {
            moduleId: 'readingComprehension',
            accuracy: accuracy,
            correctAnswers: this.results.correct,
            totalQuestions: this.results.total,
            score: accuracy
        };

        if (this.onComplete) {
            this.onComplete(finalResults);
        }
    }
};

// ===== MEMORY RECALL MODULE =====
const memoryRecallModule = {
    name: "Memory Recall",
    questionBank: [
        {
            items: ["Badge 423", "Unit 7", "Oak Street", "10-4", "Engine 2"],
            questions: [
                { q: "What badge number was shown?", a: "423" },
                { q: "What unit number was mentioned?", a: "7" },
                { q: "What street name appeared?", a: "Oak Street" }
            ]
        },
        {
            items: ["Code 3", "Maple Ave", "Badge 156", "Squad 9", "10-23"],
            questions: [
                { q: "What code was displayed?", a: "Code 3" },
                { q: "What avenue was shown?", a: "Maple Ave" },
                { q: "What was the badge number?", a: "156" }
            ]
        },
        {
            items: ["Officer Johnson", "Unit 12", "Pine Street", "Badge 789", "Code 2"],
            questions: [
                { q: "What was the officer's name?", a: "Johnson" },
                { q: "What was the unit number?", a: "12" },
                { q: "What badge number appeared?", a: "789" }
            ]
        },
        {
            items: ["10-20 at Main St", "Badge 342", "Squad 5", "Engine 8", "Ladder 3"],
            questions: [
                { q: "What street was mentioned in 10-20?", a: "Main St" },
                { q: "What badge number was shown?", a: "342" },
                { q: "What squad number appeared?", a: "5" }
            ]
        },
        {
            items: ["Suspect: Male, 6'2\"", "Weapon: Handgun", "Vehicle: Blue Sedan", "Plate: ABC 1234", "Direction: Northbound"],
            questions: [
                { q: "What was the suspect's height?", a: "6'2\"" },
                { q: "What color was the vehicle?", a: "Blue" },
                { q: "What direction was the suspect heading?", a: "Northbound" }
            ]
        },
        {
            items: ["Time: 14:35", "Location: 789 Elm St", "Caller: James Park", "Badge 567", "Unit 15"],
            questions: [
                { q: "What was the time?", a: "14:35" },
                { q: "What was the location?", a: "789 Elm St" },
                { q: "Who was the caller?", a: "James Park" }
            ]
        },
        {
            items: ["Vehicle: Red Truck", "Plate: XYZ 789", "Speed: 85 MPH", "Direction: Eastbound", "Highway 401"],
            questions: [
                { q: "What color was the vehicle?", a: "Red" },
                { q: "What was the license plate?", a: "XYZ 789" },
                { q: "Which highway was mentioned?", a: "Highway 401" }
            ]
        },
        {
            items: ["Apartment 5C", "Building: Maple Towers", "Victim: Lisa Wong", "Age: 34", "Injury: Arm"],
            questions: [
                { q: "What apartment number?", a: "5C" },
                { q: "What was the building name?", a: "Maple Towers" },
                { q: "What was the victim's age?", a: "34" }
            ]
        },
        {
            items: ["Code 1", "Officer Davis", "Backup Requested", "Badge 891", "Intersection: King & Queen"],
            questions: [
                { q: "What code was used?", a: "Code 1" },
                { q: "Which officer requested backup?", a: "Davis" },
                { q: "What was the intersection?", a: "King & Queen" }
            ]
        },
        {
            items: ["Suspect: Female, 5'6\"", "Clothing: Black Hoodie", "Last seen: 7-Eleven", "Time: 23:45", "On Foot"],
            questions: [
                { q: "What was the suspect wearing?", a: "Black Hoodie" },
                { q: "Where was suspect last seen?", a: "7-Eleven" },
                { q: "What time?", a: "23:45" }
            ]
        }
    ],
    selectedScenario: null,
    currentQuestion: 0,
    currentRound: 0,
    totalRounds: 5,
    usedScenarios: [],
    userAnswers: [],
    memoryTimer: null,
    results: {
        correct: 0,
        total: 0
    },

    init(questionCount) {
        this.currentRound = 0;
        this.usedScenarios = [];
        this.currentQuestion = 0;
        this.userAnswers = [];
        this.results = { correct: 0, total: 0 };
        this.selectNewScenario();
    },

    selectNewScenario() {
        // Get scenarios that haven't been used yet
        const availableScenarios = this.questionBank.filter((scenario, index) => 
            !this.usedScenarios.includes(index)
        );
        
        // If we've used all scenarios, reset
        if (availableScenarios.length === 0) {
            this.usedScenarios = [];
            this.selectNewScenario();
            return;
        }
        
        // Pick a random available scenario
        const randomIndex = Math.floor(Math.random() * availableScenarios.length);
        this.selectedScenario = availableScenarios[randomIndex];
        
        // Mark this scenario as used
        const originalIndex = this.questionBank.indexOf(this.selectedScenario);
        this.usedScenarios.push(originalIndex);
        
        // Update total questions count
        this.results.total += this.selectedScenario.questions.length;
    },

    render(container, questionCount, onComplete) {
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.showMemoryItems();
    },

    showMemoryItems() {
        this.container.innerHTML = `
            <div class="memory-recall-module">
                <div class="progress-indicator">
                    <p><strong>Round ${this.currentRound + 1} of ${this.totalRounds}</strong></p>
                </div>
                <h3>🧠 Memorize the following information</h3>
                <div class="memory-timer-display">
                    <p style="font-size: 32px; font-weight: bold; color: #667eea;">
                        Time remaining: <span id="memoryTimer">15</span>s
                    </p>
                </div>
                <div class="memory-items-display">
                    ${this.selectedScenario.items.map(item => `
                        <div class="memory-item">${item}</div>
                    `).join('')}
                </div>
            </div>

            <style>
                .memory-items-display {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin: 30px auto;
                    max-width: 600px;
                }
                .memory-item {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    font-size: 20px;
                    font-weight: bold;
                    border: 3px solid #667eea;
                    text-align: center;
                }
                .memory-timer-display {
                    text-align: center;
                    margin: 20px 0;
                }
            </style>
        `;

        let timeLeft = 15;
        this.memoryTimer = setInterval(() => {
            timeLeft--;
            const timerEl = document.getElementById('memoryTimer');
            if (timerEl) timerEl.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(this.memoryTimer);
                this.hideAndAskQuestions();
            }
        }, 1000);
    },

    hideAndAskQuestions() {
        this.currentQuestion = 0;
        this.showQuestion();
    },

    showQuestion() {
        if (this.currentQuestion >= this.selectedScenario.questions.length) {
            this.completeRound();
            return;
        }

        const question = this.selectedScenario.questions[this.currentQuestion];
        const questionNum = this.currentQuestion + 1;
        const total = this.selectedScenario.questions.length;

        this.container.innerHTML = `
            <div class="memory-question-module">
                <div class="progress-indicator">
                    <p><strong>Round ${this.currentRound + 1} of ${this.totalRounds}</strong> | Question ${questionNum} of ${total}</p>
                    <div class="progress-bar-slim">
                        <div class="progress-fill" style="width: ${(questionNum / total) * 100}%"></div>
                    </div>
                </div>

                <div class="question-display">
                    <h3>${question.q}</h3>
                    <input type="text" id="memoryAnswer" class="memory-answer-input" placeholder="Type your answer..." autofocus>
                </div>

                <div class="module-actions">
                    <button onclick="memoryRecallModule.submitAnswer()" class="primary-btn">
                        Submit Answer
                    </button>
                </div>
            </div>

            <style>
                .question-display {
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 10px;
                    margin: 20px 0;
                    text-align: center;
                }
                .memory-answer-input {
                    width: 100%;
                    max-width: 400px;
                    padding: 15px;
                    font-size: 18px;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                .memory-answer-input:focus {
                    outline: none;
                    border-color: #667eea;
                }
            </style>
        `;

        document.getElementById('memoryAnswer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });
    },

    submitAnswer() {
        const userAnswer = document.getElementById('memoryAnswer').value.trim();
        if (!userAnswer) {
            alert('Please enter an answer.');
            return;
        }

        const question = this.selectedScenario.questions[this.currentQuestion];
        const correct = this.isAnswerCorrect(userAnswer, question.a);

        if (correct) {
            this.results.correct++;
        }

        this.userAnswers.push({
            question: question.q,
            userAnswer: userAnswer,
            correctAnswer: question.a,
            correct: correct
        });

        this.showQuestionFeedback(correct, question);
    },

    isAnswerCorrect(userAnswer, correctAnswer) {
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalize(userAnswer) === normalize(correctAnswer);
    },

    showQuestionFeedback(correct, question) {
        this.container.innerHTML = `
            <div class="scenario-feedback ${correct ? 'success' : 'warning'}">
                <div class="feedback-header">
                    <h2>${correct ? '✓ Correct!' : '! Incorrect'}</h2>
                </div>

                <div class="feedback-details">
                    <div class="feedback-section">
                        <h4>Correct Answer:</h4>
                        <p><strong>${question.a}</strong></p>
                    </div>
                </div>

                <div class="module-actions">
                    <button onclick="memoryRecallModule.nextQuestion()" class="primary-btn">
                        ${this.currentQuestion < this.selectedScenario.questions.length - 1 ? 'Next Question →' : 'Finish'}
                    </button>
                </div>
            </div>
        `;
    },

    nextQuestion() {
        this.currentQuestion++;
        this.showQuestion();
    },

    completeRound() {
        this.currentRound++;
        
        // Check if we've completed all rounds
        if (this.currentRound >= this.totalRounds) {
            this.finish();
            return;
        }
        
        // Start next round with new scenario
        this.currentQuestion = 0;
        this.selectNewScenario();
        this.showMemoryItems();
    },

    finish() {
        const accuracy = (this.results.correct / this.results.total) * 100;

        const finalResults = {
            moduleId: 'memoryRecall',
            accuracy: accuracy,
            correctAnswers: this.results.correct,
            totalQuestions: this.results.total,
            score: accuracy
        };

        if (this.onComplete) {
            this.onComplete(finalResults);
        }
    }
};

// Export modules
window.readingComprehensionModule = readingComprehensionModule;
window.memoryRecallModule = memoryRecallModule;
