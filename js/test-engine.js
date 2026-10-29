// CritiCall Test Engine - Manages overall test flow, timing, and scoring

const CritiCallTestEngine = {
    // Test configuration
    config: {
        modules: [
            { id: 'dataEntry', name: 'Data Entry', timeLimit: 300, questionCount: 12 },
            { id: 'audioDataEntry', name: 'Audio Data Entry', timeLimit: 360, questionCount: 6 },
            { id: 'decisionMaking', name: 'Decision Making', timeLimit: 1800, questionCount: 35 },
            { id: 'spelling', name: 'Spelling', timeLimit: 600, questionCount: 50 },
            { id: 'mathematics', name: 'Mathematics', timeLimit: 900, questionCount: 25 },
            { id: 'readingComprehension', name: 'Reading Comprehension', timeLimit: 1200, questionCount: 6 },
            { id: 'memoryRecall', name: 'Memory Recall', timeLimit: 900, questionCount: 5 },
            { id: 'mapReading', name: 'Map Reading', timeLimit: 900, questionCount: 12 },
            { id: 'crossReference', name: 'Cross Reference', timeLimit: 600, questionCount: 15 },
            { id: 'multitasking', name: 'Multitasking', timeLimit: 610, questionCount: 12 },
            { id: 'callSummarization', name: 'Call Summarization', timeLimit: 900, questionCount: 10 },
            { id: 'listeningSkills', name: 'Listening Skills', timeLimit: 900, questionCount: 5 }
        ],

        // Module weights for the overall score. Real CritiCall never gives
        // credit for finishing early - this is a pure accuracy-weighted
        // average across modules, renormalized in calculateOverallScore()
        // over whichever modules were actually completed. Typing speed for
        // the KPM-based modules is its own separate pass/fail gate (see
        // passingScores.speed below), not blended into this weighting.
        weights: {
            accuracy: {
                decisionMaking: 0.20,      // Most critical - emergency response decisions
                multitasking: 0.15,        // High importance - juggling priorities
                memoryRecall: 0.12,        // Important - recall under pressure
                crossReference: 0.10,      // Important - accuracy in data verification
                callSummarization: 0.10,   // Real-world dispatcher judgment from a live call
                mapReading: 0.08,          // Moderate - navigation skills
                readingComprehension: 0.08, // Moderate - understanding procedures
                listeningSkills: 0.08,     // Comprehension under audio-only conditions
                audioDataEntry: 0.05,      // Listening + accurate entry under pressure
                dataEntry: 0.04,           // Lower weight in the composite, but still gated on its own
                mathematics: 0.02,         // Lower - basic calculations
                spelling: 0.02             // Lowest - spell check exists
            }
        },

        // Minimum passing scores per module, checked independently (both
        // must be met where both apply - matching real CritiCall, where
        // speed and accuracy are separate minimums, not substitutes for
        // each other).
        passingScores: {
            accuracy: {
                dataEntry: 80,           // % accuracy - must be accurate, not just fast
                audioDataEntry: 80,      // % accuracy - correctness of what was heard, not raw speed
                decisionMaking: 70,      // % accuracy
                spelling: 70,            // % accuracy
                mathematics: 60,         // % accuracy
                readingComprehension: 65, // % accuracy
                memoryRecall: 65,        // % accuracy
                mapReading: 60,          // % accuracy
                crossReference: 80,      // % accuracy - must be accurate, not just fast
                multitasking: 70,        // % accuracy
                callSummarization: 70,   // % accuracy
                listeningSkills: 65      // % accuracy
            },
            // Net KPM (keystrokes already factored for accuracy - see
            // completeModule) required for the typing-flavored modules.
            speed: {
                dataEntry: 60,
                crossReference: 70,
                multitasking: 65
            }
        },

        overallPassingScore: 70
    },

    // Current test state
    state: {
        testId: null,
        startTime: null,
        currentModuleIndex: 0,
        moduleResults: {},
        timerInterval: null,
        timeRemaining: 0,
        testInProgress: false
    },

    // Initialize test
    init() {
        this.state.testId = this.generateTestId();
        this.state.startTime = new Date();
        this.state.currentModuleIndex = 0;
        this.state.moduleResults = {};
        this.state.testInProgress = true;
        
        console.log('Test initialized:', this.state.testId);
    },

    // Generate unique test ID
    generateTestId() {
        return 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Start the test
    startTest() {
        this.init();
        this.loadModule(0);
        this.updateProgressBar();
    },

    // Load a specific module by index
    loadModule(index) {
        if (index >= this.config.modules.length) {
            this.completeTest();
            return;
        }

        this.state.currentModuleIndex = index;
        const module = this.config.modules[index];
        
        console.log('Loading module:', module.name);
        
        // Clear previous content
        const moduleContent = document.getElementById('moduleContent');
        if (moduleContent) {
            moduleContent.innerHTML = '';
        }

        // Show module intro screen
        this.showModuleIntro(module);
    },

    // Show intro screen before each module
    showModuleIntro(module) {
        const introHTML = `
            <div class="module-intro">
                <h2>${module.name}</h2>
                <div class="module-info">
                    <p><strong>Time Limit:</strong> ${this.formatTime(module.timeLimit)}</p>
                    <p><strong>Questions:</strong> ${module.questionCount}</p>
                    <p class="module-instructions">
                        ${this.getModuleInstructions(module.id)}
                    </p>
                </div>
                <div class="intro-buttons">
                    <button onclick="CritiCallTestEngine.beginModule()" class="primary-btn">
                        Begin Module
                    </button>
                </div>
            </div>
        `;

        document.getElementById('moduleContent').innerHTML = introHTML;
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('testContainer').style.display = 'block';
    },

    // Get instructions for specific module
    getModuleInstructions(moduleId) {
        const instructions = {
            dataEntry: 'Enter caller information accurately and quickly. You will be timed on both speed and accuracy.',
            audioDataEntry: 'Listen to each emergency call once, then enter the caller\'s information accurately. Audio cannot be replayed.',
            decisionMaking: 'Read each scenario and determine which emergency services should respond and the priority level.',
            callSummarization: 'Listen to emergency calls and answer questions about key details. Audio plays only once.',
            mapReading: 'Using the map provided, determine the best route for emergency responders.',
            readingComprehension: 'Read passages about emergency procedures and answer comprehension questions.',
            spelling: 'Select the correctly spelled word from the options provided.',
            mathematics: 'Solve math problems related to emergency dispatch scenarios.',
            memoryRecall: 'Memorize information that will be shown briefly, then answer questions from memory.',
            crossReference: 'Compare information from different sources and identify discrepancies.',
            multitasking: 'Handle multiple emergency calls simultaneously while maintaining accuracy.',
            listeningSkills: 'Listen to each emergency call once, then answer comprehension questions about it. No transcript is provided.'
        };
        return instructions[moduleId] || 'Complete the module to the best of your ability.';
    },

    // Begin the actual module (after intro)
    beginModule() {
        const module = this.config.modules[this.state.currentModuleIndex];
        
        // Start timer
        this.state.timeRemaining = module.timeLimit;
        this.startTimer();

        // Load module content based on type
        this.loadModuleContent(module);
    },

    // Load module-specific content
    loadModuleContent(module) {
        // This will call the appropriate module's render function
        const moduleId = module.id;
        
        // Modules will be loaded from separate files
        // For now, placeholder that will be replaced with actual module
        if (window[`${moduleId}Module`] && window[`${moduleId}Module`].render) {
            window[`${moduleId}Module`].render(
                document.getElementById('moduleContent'),
                module.questionCount,
                (results) => this.completeModule(results)
            );
        } else {
            console.error('Module not found:', moduleId);
        }
    },

    // Start countdown timer
    startTimer() {
        this.stopTimer(); // Clear any existing timer
        
        this.timerInterval = setInterval(() => {
            this.state.timeRemaining--;
            this.updateTimerDisplay();

            if (this.state.timeRemaining <= 0) {
                this.timeExpired();
            }
        }, 1000);
    },

    // Stop timer
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    // Update timer display
    updateTimerDisplay() {
        const display = document.getElementById('timerDisplay');
        if (display) {
            const minutes = Math.floor(this.state.timeRemaining / 60);
            const seconds = this.state.timeRemaining % 60;
            
            let timerClass = '';
            if (this.state.timeRemaining <= 60) {
                timerClass = 'timer-critical';
            } else if (this.state.timeRemaining <= 300) {
                timerClass = 'timer-warning';
            }
            
            display.innerHTML = `
                <div class="timer ${timerClass}">
                    <span class="timer-label">Time Remaining:</span>
                    <span class="timer-value">${minutes}:${seconds.toString().padStart(2, '0')}</span>
                </div>
            `;
        }
    },

    // Handle time expiration
    timeExpired() {
        this.stopTimer();
        alert('Time expired for this module. Moving to next module.');
        
        // Auto-submit current module with partial results
        const currentModule = this.config.modules[this.state.currentModuleIndex];
        
        // Get partial results if module has a getResults function
        let partialResults = {
            moduleId: currentModule.id,
            timeUsed: currentModule.timeLimit,
            timeExpired: true,
            score: 0,
            accuracy: 0
        };
        
        this.completeModule(partialResults);
    },

    // Complete current module and move to next
    completeModule(results) {
        this.stopTimer();
        
        const module = this.config.modules[this.state.currentModuleIndex];
        
        // Calculate time used
        const timeUsed = module.timeLimit - this.state.timeRemaining;
        results.timeUsed = timeUsed;
        results.timeLimit = module.timeLimit;
        results.moduleId = module.id;
        results.moduleName = module.name;
        
        const SPEED_MODULES = ['dataEntry', 'crossReference', 'multitasking'];

        // Raw and net KPM/KPH for the typing-flavored modules. Net speed
        // subtracts for errors (the same "net WPM" convention real typing
        // tests use), approximated here from the module's own reported
        // accuracy since modules don't separately track which keystrokes
        // were correct vs. wrong.
        if (SPEED_MODULES.includes(module.id) && results.totalKeystrokes) {
            results.rawKpm = Math.round((results.totalKeystrokes / timeUsed) * 60);
            const accuracyFraction = (typeof results.accuracy === 'number' ? results.accuracy : 0) / 100;
            results.kpm = Math.round(results.rawKpm * accuracyFraction);
            results.kph = results.kpm * 60;
        }

        // Calculate WPM if applicable
        if (['dataEntry', 'callSummarization'].includes(module.id)) {
            if (results.totalWords) {
                results.wpm = Math.round((results.totalWords / timeUsed) * 60);
            }
        }

        // Determine pass/fail: accuracy is always required. The
        // typing-flavored modules additionally require their own net-speed
        // minimum - both gates checked independently, so neither speed nor
        // accuracy alone can carry a module that fails the other.
        const accuracyRequired = this.config.passingScores.accuracy[module.id];
        const accuracyOk = typeof results.accuracy === 'number' && results.accuracy >= accuracyRequired;

        let speedOk = true;
        if (SPEED_MODULES.includes(module.id)) {
            const speedRequired = this.config.passingScores.speed[module.id];
            speedOk = typeof results.kpm === 'number' && results.kpm >= speedRequired;
        }

        results.passed = accuracyOk && speedOk;
        
        // Store results
        this.state.moduleResults[module.id] = results;
        
        console.log('Module completed:', module.name, results);
        
        // Move to next module
        this.state.currentModuleIndex++;
        this.updateProgressBar();
        
        // Short delay before loading next module
        setTimeout(() => {
            this.loadModule(this.state.currentModuleIndex);
        }, 1000);
    },

    // Update progress bar
    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const totalModules = this.config.modules.length;
            const completed = this.state.currentModuleIndex;
            const percentage = (completed / totalModules) * 100;
            
            progressBar.innerHTML = `
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="progress-text">
                        Module ${completed} of ${totalModules} Complete
                    </div>
                </div>
            `;
        }
    },

    // Complete entire test
    completeTest() {
        this.state.testInProgress = false;
        const endTime = new Date();
        const totalTime = Math.floor((endTime - this.state.startTime) / 1000);
        
        // Calculate overall score
        const overallScore = this.calculateOverallScore();
        
        // Prepare test submission
        const testSubmission = {
            testId: this.state.testId,
            timestamp: firebase.firestore.Timestamp.now(),
            startTime: this.state.startTime,
            endTime: endTime,
            totalTimeSeconds: totalTime,
            ...overallScore,
            modules: this.state.moduleResults
        };
        
        // Submit to Firebase
        this.submitTestToFirebase(testSubmission);
        
        // Show results
        this.showResults(testSubmission);
    },

    // Calculate overall score: a pure accuracy-weighted average across
    // completed modules. No speed bonus - real CritiCall never rewards
    // rushing, and typing speed is already its own separate pass/fail gate
    // per module (see completeModule). Weights are renormalized over only
    // the modules actually completed, so a missing module scales the
    // remaining weights up instead of silently deflating the total.
    calculateOverallScore() {
        const results = this.state.moduleResults;

        let weightedTotal = 0;
        let weightUsed = 0;
        for (let module in this.config.weights.accuracy) {
            if (results[module] && typeof results[module].accuracy === 'number') {
                const weight = this.config.weights.accuracy[module];
                weightedTotal += results[module].accuracy * weight;
                weightUsed += weight;
            }
        }
        const overallScore = weightUsed > 0 ? weightedTotal / weightUsed : 0;
        const passed = overallScore >= this.config.overallPassingScore;

        // Check if passed all individual modules
        let allModulesPassed = Object.keys(results).length > 0;
        for (let module in results) {
            if (!results[module].passed) {
                allModulesPassed = false;
                break;
            }
        }

        return {
            overallScore: Math.round(overallScore),
            passed: passed && allModulesPassed,
            allModulesPassed: allModulesPassed
        };
    },

    // Submit test to Firebase
    async submitTestToFirebase(testData) {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error('No user logged in');
                return;
            }

            // Add user info
            testData.userId = user.uid;
            testData.studentEmail = user.email;
            
            // Get attempt number
            const previousAttempts = await db.collection('testSubmissions')
                .doc(user.uid)
                .collection('tests')
                .get();
            
            testData.attemptNumber = previousAttempts.size + 1;

            // Submit to Firestore
            await db.collection('testSubmissions')
                .doc(user.uid)
                .collection('tests')
                .doc(this.state.testId)
                .set(testData);

            console.log('Test submitted successfully');
            
            // Update class statistics
            await this.updateClassStats(testData);
            
        } catch (error) {
            console.error('Error submitting test:', error);
            alert('Error submitting test. Results saved locally.');
        }
    },

    // Update class statistics
    async updateClassStats(testData) {
        try {
            const statsRef = db.collection('classStats').doc('KBD1100');
            
            await db.runTransaction(async (transaction) => {
                const statsDoc = await transaction.get(statsRef);
                
                let stats = statsDoc.exists ? statsDoc.data() : {
                    totalAttempts: 0,
                    uniqueStudentIds: {}, // map of uid -> true; Firestore can't store a Set
                    totalScore: 0,
                    passCount: 0,
                    moduleAverages: {}
                };
                if (!stats.uniqueStudentIds) stats.uniqueStudentIds = {};

                stats.totalAttempts++;
                stats.uniqueStudentIds[testData.userId] = true;
                stats.totalScore += testData.overallScore;
                if (testData.passed) stats.passCount++;
                
                // Update module averages
                for (let module in testData.modules) {
                    if (!stats.moduleAverages[module]) {
                        stats.moduleAverages[module] = { total: 0, count: 0 };
                    }
                    stats.moduleAverages[module].total += testData.modules[module].accuracy || 0;
                    stats.moduleAverages[module].count++;
                }
                
                stats.lastUpdated = firebase.firestore.Timestamp.now();
                stats.uniqueStudentCount = Object.keys(stats.uniqueStudentIds).length;
                
                transaction.set(statsRef, stats);
            });
            
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    },

    // Show results screen
    showResults(testData) {
        document.getElementById('testContainer').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'block';
        
        const resultsHTML = this.generateResultsHTML(testData);
        document.getElementById('resultsContent').innerHTML = resultsHTML;
    },

    // Generate results HTML
    generateResultsHTML(testData) {
        const passFailIcon = testData.passed ? '✓' : '✗';
        const passFailClass = testData.passed ? 'passed' : 'failed';
        const passFailText = testData.passed ? 'PASSED' : 'FAILED';
        
        let html = `
            <div class="results-header ${passFailClass}">
                <h1>${passFailIcon} ${passFailText}</h1>
                <h2>Overall Score: ${testData.overallScore}%</h2>
                <p>Test Date: ${new Date(testData.timestamp.toDate()).toLocaleString()}</p>
                <p>Duration: ${this.formatTime(testData.totalTimeSeconds)}</p>
                <p>Attempt #${testData.attemptNumber}</p>
            </div>
            
            <div class="score-breakdown">
                <h3>How This Score Works</h3>
                <p style="color: #666; max-width: 640px; margin: 0 auto 10px; text-align: center;">
                    Your overall score is a weighted average of your accuracy across every module -
                    there's no credit for finishing early. Each module below also has its own
                    pass/fail result: timing-based modules (Data Entry, Cross Reference,
                    Multitasking) require BOTH accurate work AND meeting a separate speed
                    minimum, checked independently - just like the real CritiCall test.
                </p>
            </div>
            
            <div class="module-results">
                <h3>Module Performance</h3>
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Module</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Time</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        for (let module of this.config.modules) {
            const result = testData.modules[module.id];
            if (result) {
                const statusIcon = result.passed ? '✓' : '✗';
                const statusClass = result.passed ? 'pass' : 'fail';
                
                let scoreDisplay = `${Math.round(result.accuracy)}% accuracy`;
                if (typeof result.kpm === 'number') scoreDisplay += ` · ${result.kpm} net KPM`;
                if (result.wpm) scoreDisplay += ` · ${result.wpm} WPM`;
                
                let details = '';
                if (result.correctAnswers !== undefined) {
                    details = `${result.correctAnswers}/${result.totalQuestions} correct`;
                }
                if (result.kph) {
                    details += details ? `, ${result.kph} KPH` : `${result.kph} KPH`;
                }
                
                html += `
                    <tr>
                        <td>${module.name}</td>
                        <td>${scoreDisplay}</td>
                        <td class="${statusClass}">${statusIcon}</td>
                        <td>${Math.floor(result.timeUsed / 60)}:${(result.timeUsed % 60).toString().padStart(2, '0')}</td>
                        <td>${details}</td>
                    </tr>
                `;
            }
        }
        
        html += `
                    </tbody>
                </table>
            </div>
            
            <div class="results-actions">
                <button onclick="CritiCallTestEngine.viewHistory()" class="secondary-btn">
                    View All Attempts
                </button>
                <button onclick="CritiCallTestEngine.retakeTest()" class="primary-btn">
                    Retake Test
                </button>
                <button onclick="window.location.href='index.html'" class="secondary-btn">
                    Return to Dashboard
                </button>
            </div>
        `;
        
        return html;
    },

    // Format seconds to readable time
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m ${secs}s`;
        }
    },

    // View test history
    async viewHistory() {
        // This will show all previous attempts
        // Implementation depends on your UI preferences
        alert('Test history feature - to be implemented based on UI preferences');
    },

    // Retake test
    retakeTest() {
        if (confirm('Are you sure you want to retake the test? This will start a new attempt.')) {
            window.location.reload();
        }
    }
};

// Make available globally
window.CritiCallTestEngine = CritiCallTestEngine;
