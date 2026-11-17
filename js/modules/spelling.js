// Spelling Module - audio dictation, not multiple choice.
//
// The real CritiCall spelling category plays a word aloud and has you type
// it - production from audio, not picking the correctly-spelled option out
// of 4 visually similar choices. The old multiple-choice version made this
// meaningfully easier than the real thing (and had 3 data bugs where the
// wrong-answer options accidentally duplicated each other - see
// js/data/question-bank.js). This version reuses the same single-play
// audio widget as the other audio-based modules, and the word's own
// `incorrect` variants (QuestionBank.spelling) are kept for a "watch out
// for" tip in the practice feedback instead of being thrown away.

const spellingModule = {
    name: "Spelling",
    selectedWords: [],
    currentWord: 0,
    results: {
        correct: 0,
        total: 0
    },
    // Set to true by js/test-engine.js for the graded test - see
    // js/modules/audio-data-entry.js for the fuller explanation.
    testMode: false,

    init(questionCount) {
        this.selectedWords = getRandomQuestions(QuestionBank.spelling, questionCount);
        this.currentWord = 0;
        this.results = {
            correct: 0,
            total: questionCount
        };
    },

    render(container, questionCount, onComplete) {
        // Safety check: ensure getRandomQuestions is available
        if (typeof getRandomQuestions === 'undefined') {
            console.warn('⚠️ Spelling waiting for question bank to load...');
            setTimeout(() => this.render(container, questionCount, onComplete), 50);
            return;
        }

        this.init(questionCount);
        this.onComplete = onComplete;
        this.container = container;
        this.showWord();
    },

    showWord() {
        if (this.currentWord >= this.selectedWords.length) {
            this.finish();
            return;
        }

        const wordData = this.selectedWords[this.currentWord];
        const wordNum = this.currentWord + 1;
        const total = this.selectedWords.length;

        this.container.innerHTML = `
            <div class="spelling-module">
                <div class="progress-indicator">
                    <p>Word ${wordNum} of ${total}</p>
                    <div class="progress-bar-slim">
                        <div class="progress-fill" style="width: ${(wordNum / total) * 100}%"></div>
                    </div>
                </div>

                <h3 style="text-align: center;">🔊 Listen carefully, then type the word</h3>
                <div id="spellingAudioSlot"></div>
                <div class="data-entry-form" id="spellingAnswerArea" style="display: none;">
                    <div class="form-row">
                        <label>Spell the word:</label>
                        <input type="text" id="spellingAnswerInput" placeholder="Type what you heard" autocomplete="off" autocapitalize="off" spellcheck="false">
                    </div>
                    <div style="text-align: center; margin-top: 15px;">
                        <button class="btn btn-success" id="spellingSubmitBtn">Submit Answer</button>
                    </div>
                </div>
            </div>
        `;

        buildAudioPlayerUI(this.container.querySelector('#spellingAudioSlot'), { script: `Spell the following word: ${wordData.word}.` }, {
            onEnded: () => {
                const area = this.container.querySelector('#spellingAnswerArea');
                area.style.display = 'block';
                const input = this.container.querySelector('#spellingAnswerInput');
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.submitAnswer();
                });
            }
        });

        this.container.querySelector('#spellingSubmitBtn').addEventListener('click', () => this.submitAnswer());
    },

    submitAnswer() {
        const input = this.container.querySelector('#spellingAnswerInput');
        const userAnswer = input.value.trim();
        if (!userAnswer) {
            alert('Please type the word before submitting.');
            return;
        }

        const wordData = this.selectedWords[this.currentWord];
        const correct = userAnswer.toLowerCase() === wordData.word.toLowerCase();

        if (correct) {
            this.results.correct++;
        }

        this.showFeedback(correct, wordData, userAnswer);
    },

    showFeedback(correct, wordData, userAnswer) {
        const statusClass = correct ? 'success' : 'warning';
        const statusIcon = correct ? '✓' : '✗';
        const tip = wordData.incorrect && wordData.incorrect.length
            ? wordData.incorrect[Math.floor(Math.random() * wordData.incorrect.length)]
            : null;

        this.container.innerHTML = `
            <div class="scenario-feedback ${statusClass}">
                <div class="feedback-header">
                    <h2>${statusIcon} ${correct ? 'Correct!' : 'Incorrect'}</h2>
                    ${!this.testMode ? `
                        <h3>The correct spelling is: <strong>${wordData.word}</strong></h3>
                        ${!correct && tip ? `<p style="color: #666;">You typed: "${userAnswer}" - watch out for the common mistake "${tip}" too.</p>` : ''}
                    ` : ''}
                </div>

                <div class="module-actions">
                    <button onclick="spellingModule.nextWord()" class="primary-btn">
                        Next Word →
                    </button>
                </div>
            </div>
        `;
    },

    nextWord() {
        this.currentWord++;
        this.showWord();
    },

    finish() {
        const accuracy = (this.results.correct / this.results.total) * 100;

        const finalResults = {
            moduleId: 'spelling',
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

window.spellingModule = spellingModule;
