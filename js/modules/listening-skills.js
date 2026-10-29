// Listening Skills Module - listen to a 911 call once, then answer
// comprehension questions about it. The original criticall.html version
// had a real bug: it printed the caller's exact words on screen as italic
// text WHILE the audio played, which defeats the entire point of a
// listening test. This version never shows scenario.script as visible
// text at any point - only the question/answer UI shows, matching what
// js/audio-player.js already enforces for all audio-based modules. Shared
// between the practice hub (criticall.html) and the graded test
// (criticalltest.html).

const listeningSkillsScenarios = [
    // The 3 original recordings - kept as real audio.
    {
        audioFile: "audio/listening/listening1.mp3",
        questions: [
            { q: "What is the address of the fire?", options: ["456 Elm Street", "456 Oak Street", "546 Elm Street", "4566 Elm Avenue"], correct: 0 },
            { q: "Where are the flames visible?", options: ["First floor", "Second floor", "Basement", "Roof"], correct: 1 },
            { q: "How many children are possibly trapped?", options: ["One", "Two", "Three", "Unknown"], correct: 1 },
            { q: "What did the caller report seeing from the street?", options: ["Only flames", "Only smoke", "Flames and smoke", "People at windows"], correct: 2 }
        ]
    },
    {
        audioFile: "audio/listening/listening2.mp3",
        questions: [
            { q: "Where did the collision occur?", options: ["Main and 4th", "Main and 5th", "Main and 6th", "5th and Oak"], correct: 1 },
            { q: "What colour is the Honda?", options: ["Black", "White", "Silver", "Blue"], correct: 2 },
            { q: "What is the condition of the Honda driver?", options: ["Conscious", "Unconscious", "Walked away", "Not mentioned"], correct: 1 },
            { q: "What did the pickup driver do?", options: ["Remained at scene", "Walked away from scene", "Was transported", "Was unconscious"], correct: 1 },
            { q: "How is traffic affected?", options: ["No impact", "Backed up one block", "Backed up several blocks", "Road closed"], correct: 2 }
        ]
    },
    {
        audioFile: "audio/listening/listening3.mp3",
        questions: [
            { q: "What is the patient's age?", options: ["68", "78", "88", "87"], correct: 1 },
            { q: "What is the main complaint?", options: ["Difficulty breathing", "Chest pain", "Abdominal pain", "Headache"], correct: 1 },
            { q: "What is the apartment number?", options: ["3B", "4A", "4B", "5B"], correct: 2 },
            { q: "What medical condition does the patient have?", options: ["Heart disease", "Diabetes", "Asthma", "Cancer"], correct: 1 },
            { q: "Is the patient conscious?", options: ["Yes", "No", "Intermittent", "Not mentioned"], correct: 0 }
        ]
    },
    // TTS-only scenarios for variety - swap in a real audioFile here later
    // for any of these and nothing else needs to change.
    {
        script: "911 emergency. I'm calling about a break-in. I came home and found my back door wide open, the window next to it is smashed. It looks like someone went through my jewelry box in the bedroom. I don't think anyone is in the house right now, I checked every room. This happened sometime between 9 AM and 3 PM today while I was at work.",
        questions: [
            { q: "What type of incident is being reported?", options: ["Assault", "Break and enter", "Vehicle theft", "Vandalism"], correct: 1 },
            { q: "Which room did the suspect search?", options: ["Kitchen", "Living room", "Bedroom", "Garage"], correct: 2 },
            { q: "Is the suspect believed to still be inside?", options: ["Yes", "No", "Unknown", "Not mentioned"], correct: 1 },
            { q: "What is the estimated time window of the break-in?", options: ["6 AM to 9 AM", "9 AM to 3 PM", "3 PM to 9 PM", "Overnight"], correct: 1 }
        ]
    },
    {
        script: "I need an ambulance, my coworker just collapsed at the warehouse on Fraser Road. He's breathing but he's not responding when we talk to him. He mentioned he felt dizzy about ten minutes before this happened. We've moved the forklift away from him but we haven't moved him otherwise.",
        questions: [
            { q: "Where did the incident occur?", options: ["An office building", "A warehouse", "A grocery store", "A construction site"], correct: 1 },
            { q: "Is the patient breathing?", options: ["Yes", "No", "Unknown", "Intermittently"], correct: 0 },
            { q: "What symptom did the patient report before collapsing?", options: ["Chest pain", "Dizziness", "Nausea", "Blurred vision"], correct: 1 },
            { q: "Has the patient been moved?", options: ["Yes, fully", "No, not at all", "Only the forklift was moved away", "Moved to a chair"], correct: 2 }
        ]
    },
    {
        script: "There's a dog that's been hit by a car on Concession Road, right near the intersection with Maple. The driver stopped and is still here. The dog is alive but can't stand up. There's no collar or tag that we can see. Traffic is starting to back up because the car is still partially in the lane.",
        questions: [
            { q: "What type of incident is this?", options: ["Animal struck by vehicle", "Two-vehicle collision", "Pedestrian struck", "Abandoned vehicle"], correct: 0 },
            { q: "Where exactly did this happen?", options: ["Maple and Concession", "Oak and Concession", "Concession and Main", "Maple and Main"], correct: 0 },
            { q: "Did the driver remain at the scene?", options: ["Yes", "No, they fled", "Unknown", "They called from home"], correct: 0 },
            { q: "What is affecting traffic?", options: ["A downed tree", "The car partially blocking the lane", "A police checkpoint", "Road construction"], correct: 1 }
        ]
    },
    {
        script: "I'm at the community pool on Birchwood Avenue and a young boy, maybe 8 years old, pulled himself out of the water and he's coughing a lot and seems disoriented. The lifeguard already has him sitting up on the deck. He was under the water for what the lifeguard thinks was less than a minute before being pulled out.",
        questions: [
            { q: "Where is the incident taking place?", options: ["A lake", "A community pool", "A water park", "A bathtub"], correct: 1 },
            { q: "Approximately how old is the child?", options: ["4", "8", "12", "16"], correct: 1 },
            { q: "What is the child's current condition?", options: ["Unconscious", "Coughing and disoriented", "Fully normal", "Not breathing"], correct: 1 },
            { q: "Who is currently with the child?", options: ["No one", "A parent", "The lifeguard", "A police officer"], correct: 2 }
        ]
    }
];

const listeningSkillsModule = {
    name: "Listening Skills",
    selectedScenarios: [],
    currentScenarioIndex: 0,
    currentQuestionIndex: 0,
    results: { correct: 0, totalQuestions: 0 },

    init(questionCount) {
        this.selectedScenarios = pickRandomScenarios(listeningSkillsScenarios, questionCount);
        this.currentScenarioIndex = 0;
        this.currentQuestionIndex = 0;
        this.results = {
            correct: 0,
            totalQuestions: this.selectedScenarios.reduce((sum, s) => sum + s.questions.length, 0)
        };
    },

    render(container, questionCount, onComplete) {
        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.showScenarioAudio();
    },

    get questionsAnsweredSoFar() {
        let answered = 0;
        for (let i = 0; i < this.currentScenarioIndex; i++) answered += this.selectedScenarios[i].questions.length;
        return answered + this.currentQuestionIndex;
    },

    showScenarioAudio() {
        if (this.currentScenarioIndex >= this.selectedScenarios.length) {
            this.finish();
            return;
        }

        const scenario = this.selectedScenarios[this.currentScenarioIndex];
        this.container.innerHTML = `
            <div class="module-progress">Call ${this.currentScenarioIndex + 1} of ${this.selectedScenarios.length}</div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 10px; border: 2px solid #ffc107; margin-bottom: 15px;">
                <strong>⚠️ You can only play the audio ONCE.</strong> Listen carefully - you won't see a transcript.
            </div>
            <h3>🎧 Listen to the Emergency Call</h3>
            <div id="audioSlot"></div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-success" id="beginQuestionsBtn" disabled>Begin Questions</button>
                <p style="color: #666; font-size: 14px; margin-top: 10px;">Finish listening before you can continue.</p>
            </div>
        `;

        buildAudioPlayerUI(this.container.querySelector('#audioSlot'), scenario, {
            onEnded: () => {
                const btn = this.container.querySelector('#beginQuestionsBtn');
                btn.disabled = false;
                btn.textContent = 'Begin Questions';
            }
        });

        this.container.querySelector('#beginQuestionsBtn').addEventListener('click', () => {
            this.currentQuestionIndex = 0;
            this.showQuestion();
        });
    },

    showQuestion() {
        const scenario = this.selectedScenarios[this.currentScenarioIndex];
        const question = scenario.questions[this.currentQuestionIndex];
        const answeredSoFar = this.questionsAnsweredSoFar;

        this.container.innerHTML = `
            <div class="module-progress">
                Question ${answeredSoFar + 1} of ${this.results.totalQuestions}
                <div style="background: #e0e0e0; height: 10px; border-radius: 5px; overflow: hidden; margin-top: 8px;">
                    <div style="background: #007bff; height: 100%; width: ${(answeredSoFar / this.results.totalQuestions) * 100}%;"></div>
                </div>
            </div>
            <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #2196f3;">
                <h3 style="color: #1976d2; margin: 0;">${question.q}</h3>
            </div>
            <div class="listening-options">
                ${question.options.map((opt, i) => `
                    <label>
                        <input type="radio" name="listeningAnswer" value="${i}" style="margin-right: 12px; width: 18px; height: 18px; vertical-align: middle;">
                        <span style="font-size: 16px;">${opt}</span>
                    </label>
                `).join('')}
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-success" id="lsSubmitBtn">Submit Answer</button>
            </div>
        `;

        this.container.querySelector('#lsSubmitBtn').addEventListener('click', () => this.submitAnswer(question));
    },

    submitAnswer(question) {
        const selected = this.container.querySelector('input[name="listeningAnswer"]:checked');
        if (!selected) {
            alert('Please select an answer before submitting.');
            return;
        }

        const userAnswer = parseInt(selected.value, 10);
        const correct = userAnswer === question.correct;
        if (correct) this.results.correct++;

        const feedback = document.createElement('div');
        feedback.className = `listening-feedback ${correct ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = `
            <p style="font-size: 18px; margin: 0;"><strong>${correct ? '✓ Correct!' : '✗ Incorrect'}</strong></p>
            ${!correct ? `<p style="margin: 10px 0 0 0;">Correct answer: ${question.options[question.correct]}</p>` : ''}
        `;
        this.container.appendChild(feedback);
        this.container.querySelector('#lsSubmitBtn').disabled = true;

        setTimeout(() => {
            const scenario = this.selectedScenarios[this.currentScenarioIndex];
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex >= scenario.questions.length) {
                this.currentScenarioIndex++;
                this.showScenarioAudio();
            } else {
                this.showQuestion();
            }
        }, 1500);
    },

    finish() {
        const accuracy = this.results.totalQuestions > 0
            ? (this.results.correct / this.results.totalQuestions) * 100
            : 0;

        const finalResults = {
            moduleId: 'listeningSkills',
            correctAnswers: this.results.correct,
            totalQuestions: this.results.totalQuestions,
            accuracy: Math.round(accuracy)
        };

        this.onComplete(finalResults);
    }
};

window.listeningSkillsModule = listeningSkillsModule;
