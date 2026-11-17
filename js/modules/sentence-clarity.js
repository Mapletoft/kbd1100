// Sentence Clarity Module - pick the clearest, most concise version of a
// dispatch-report-style sentence out of 4 options. Ported from criticall.html's
// original inline implementation (which had no bugs - this is a straight port
// plus a bigger question pool), now shared between the practice hub
// (criticall.html) and the graded test (criticalltest.html).

const sentenceClarityQuestions = [
    {
        question: "Which sentence is the clearest?",
        options: [
            "The car, which was red in color, was observed to be traveling at a high rate of speed down the road.",
            "The red car was speeding down the road.",
            "Down the road, there was a car that was red in color and it was speeding.",
            "A car that was speeding, red in color, was going down the road."
        ],
        correct: 1
    },
    {
        question: "Which sentence communicates the information most effectively?",
        options: [
            "The suspect, who was wearing a blue jacket, ran from the officers.",
            "From the officers, the suspect wearing a blue jacket ran.",
            "The suspect in the blue jacket fled from officers.",
            "Running from the officers was the suspect in a jacket that was blue."
        ],
        correct: 2
    },
    {
        question: "Select the clearest version:",
        options: [
            "The dispatcher was informed by the caller that there was a fire.",
            "A fire was what the caller informed the dispatcher about.",
            "The caller informed the dispatcher of a fire.",
            "It was a fire that the dispatcher was informed of by the caller."
        ],
        correct: 2
    },
    {
        question: "Which sentence is most appropriate for a dispatch report?",
        options: [
            "There were three units that responded to the scene where the accident occurred.",
            "Three units responded to the accident scene.",
            "To the scene of the accident, three units responded.",
            "The accident scene was where three units responded to."
        ],
        correct: 1
    },
    {
        question: "Choose the clearest sentence:",
        options: [
            "Medical assistance was being requested by a male caller for his wife.",
            "A male caller's wife needed medical assistance which he requested.",
            "A male caller requested medical assistance for his wife.",
            "For his wife, a male caller was requesting that medical assistance be provided."
        ],
        correct: 2
    },
    {
        question: "Which version is best for radio communication?",
        options: [
            "The vehicle that was stolen was located at the mall parking lot.",
            "Located at the mall parking lot was the vehicle that had been stolen.",
            "The stolen vehicle was located in the mall parking lot.",
            "At the mall parking lot, the vehicle, which was stolen, was located."
        ],
        correct: 2
    },
    {
        question: "Select the most concise and clear option:",
        options: [
            "The officer, who arrived at the scene first, secured the perimeter.",
            "Securing the perimeter was done by the officer who arrived first.",
            "The first officer on scene secured the perimeter.",
            "The perimeter was secured by the officer who was first to arrive at the scene."
        ],
        correct: 2
    },
    {
        question: "Which sentence follows proper active voice?",
        options: [
            "The suspect was apprehended by two officers.",
            "By two officers, the suspect was apprehended.",
            "Two officers apprehended the suspect.",
            "The apprehension of the suspect was made by two officers."
        ],
        correct: 2
    },
    {
        question: "Choose the clearest way to report this information:",
        options: [
            "In the direction of northbound on Highway 5, the suspect vehicle was last observed traveling.",
            "The suspect vehicle was last seen traveling northbound on Highway 5.",
            "Traveling northbound on Highway 5 is where the suspect vehicle was last seen.",
            "Last seen was the suspect vehicle, traveling in a northbound direction on Highway 5."
        ],
        correct: 1
    },
    {
        question: "Which option is most appropriate for written documentation?",
        options: [
            "At 15:30 hours, Officers Martinez and Chen were the ones who arrived at the location.",
            "The arrival at the location by Officers Martinez and Chen occurred at 15:30 hours.",
            "Officers Martinez and Chen arrived at the location at 15:30 hours.",
            "It was at 15:30 hours that Officers Martinez and Chen arrived at the location."
        ],
        correct: 2
    },
    {
        question: "Which sentence is clearest for a radio transmission?",
        options: [
            "It was reported by the complainant that a break and enter had occurred.",
            "The complainant reported a break and enter.",
            "A break and enter was what was reported by the complainant.",
            "What occurred, as reported by the complainant, was a break and enter."
        ],
        correct: 1
    },
    {
        question: "Select the most concise version:",
        options: [
            "The caller, due to the fact that she was scared, was unable to provide a clear description.",
            "Because she was scared, the caller could not give a clear description.",
            "The caller was unable, due to being scared, to provide a description that was clear.",
            "A clear description could not be provided by the caller because she was scared."
        ],
        correct: 1
    },
    {
        question: "Which version is best for a written incident report?",
        options: [
            "The weapon that was used by the suspect was a knife.",
            "A knife was the weapon used by the suspect.",
            "The suspect used a knife.",
            "Used by the suspect was a knife."
        ],
        correct: 2
    },
    {
        question: "Choose the clearest sentence:",
        options: [
            "It was at approximately 2100 hours when the fire was first noticed by the neighbor.",
            "The neighbor first noticed the fire at approximately 2100 hours.",
            "The fire, at approximately 2100 hours, was first noticed by the neighbor.",
            "First noticed at approximately 2100 hours was the fire, by the neighbor."
        ],
        correct: 1
    },
    {
        question: "Which sentence avoids unnecessary passive voice?",
        options: [
            "The vehicle was towed by the responding officer.",
            "Towing of the vehicle was done by the responding officer.",
            "The responding officer towed the vehicle.",
            "It was the responding officer who towed the vehicle."
        ],
        correct: 2
    }
];

const sentenceClarityModule = {
    name: "Sentence Clarity",
    selectedQuestions: [],
    currentQuestion: 0,
    results: { correct: 0, total: 0 },
    // Set to true by js/test-engine.js for the graded test - see
    // js/modules/audio-data-entry.js for the fuller explanation.
    testMode: false,

    init(questionCount) {
        this.selectedQuestions = pickRandomScenarios(sentenceClarityQuestions, questionCount);
        this.currentQuestion = 0;
        this.results = { correct: 0, total: this.selectedQuestions.length };
    },

    render(container, questionCount, onComplete) {
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.showQuestion();
    },

    showQuestion() {
        if (this.currentQuestion >= this.selectedQuestions.length) {
            this.finish();
            return;
        }

        const question = this.selectedQuestions[this.currentQuestion];
        const questionNum = this.currentQuestion + 1;
        const total = this.selectedQuestions.length;

        // Real CritiCall presents this as a straight pick-the-clearer-one
        // choice between TWO statements, not a 4-option MCQ - so show the
        // correct option plus one random distractor from the stored 4,
        // in random left/right order.
        const wrongIndices = question.options.map((_, i) => i).filter(i => i !== question.correct);
        const distractorIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
        const shownIndices = Math.random() < 0.5 ? [question.correct, distractorIndex] : [distractorIndex, question.correct];
        this.shownIndices = shownIndices;

        this.container.innerHTML = `
            <div class="module-progress">Question ${questionNum} of ${total}</div>
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ffc107; text-align: center;">
                <h3 style="color: #856404;">${question.question}</h3>
                <p style="font-size: 14px; color: #856404; margin-top: 10px;">Choose the clearer of the two statements</p>
            </div>
            ${shownIndices.map((optIndex) => `
                <div style="margin: 15px 0;">
                    <label style="display: block; padding: 15px; background: #f8f9fa; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer;">
                        <input type="radio" name="clarity" value="${optIndex}" style="margin-right: 10px; width: 18px; height: 18px;">
                        <span style="font-size: 16px; line-height: 1.6;">${question.options[optIndex]}</span>
                    </label>
                </div>
            `).join('')}
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-success" id="scSubmitBtn">Submit Answer</button>
            </div>
        `;

        this.container.querySelector('#scSubmitBtn').addEventListener('click', () => this.submitAnswer());
    },

    submitAnswer() {
        const selected = this.container.querySelector('input[name="clarity"]:checked');
        if (!selected) {
            alert('Please select an answer before submitting.');
            return;
        }

        const question = this.selectedQuestions[this.currentQuestion];
        const userAnswer = parseInt(selected.value, 10);
        const correct = userAnswer === question.correct;
        if (correct) this.results.correct++;

        this.showFeedback(correct, question);
    },

    showFeedback(correct, question) {
        this.container.innerHTML = `
            <div class="scenario-feedback ${correct ? 'success' : 'warning'}">
                <div class="feedback-header">
                    <h2>${correct ? '✓ Correct!' : '✗ Incorrect'}</h2>
                </div>
                ${!this.testMode ? `
                    <div class="feedback-details">
                        <div class="feedback-section">
                            <h4>Correct Answer:</h4>
                            <p>${question.options[question.correct]}</p>
                        </div>
                    </div>
                ` : ''}
                <div class="module-actions">
                    <button onclick="sentenceClarityModule.nextQuestion()" class="primary-btn">
                        Next Question →
                    </button>
                </div>
            </div>
        `;
    },

    nextQuestion() {
        this.currentQuestion++;
        this.showQuestion();
    },

    finish() {
        const accuracy = this.results.total > 0 ? (this.results.correct / this.results.total) * 100 : 0;

        const finalResults = {
            moduleId: 'sentenceClarity',
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

window.sentenceClarityModule = sentenceClarityModule;
