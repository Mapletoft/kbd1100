// MULTITASKING MODULE - Realistic Dispatcher Simulation
// Students manage 4 units and assign them to incoming calls based on priority

const multitaskingModule = {
    name: "Multitasking",
    
    callBank: [
        { text: "Chest pain, difficulty breathing", priority: "high", service: "EMS", points: 10 },
        { text: "Structure fire, flames visible", priority: "high", service: "Fire", points: 10 },
        { text: "Unresponsive person", priority: "high", service: "EMS", points: 10 },
        { text: "Armed robbery in progress", priority: "high", service: "Police", points: 10 },
        { text: "Overdose, not breathing", priority: "high", service: "EMS", points: 10 },
        { text: "Heart attack symptoms", priority: "high", service: "EMS", points: 10 },
        { text: "Gas odor in building", priority: "high", service: "Fire", points: 10 },
        { text: "Power lines down, sparking", priority: "high", service: "Fire", points: 10 },
        { text: "Chemical spill on roadway", priority: "high", service: "Fire", points: 10 },
        { text: "Child fell from playground equipment", priority: "high", service: "EMS", points: 10 },
        
        { text: "Traffic accident, injuries reported", priority: "medium", service: "Police", points: 5 },
        { text: "Domestic disturbance, yelling heard", priority: "medium", service: "Police", points: 5 },
        { text: "Smoke alarm activation", priority: "medium", service: "Fire", points: 5 },
        { text: "Suspicious person near school", priority: "medium", service: "Police", points: 5 },
        { text: "Loud party after midnight", priority: "medium", service: "Police", points: 5 },
        { text: "Water main break", priority: "medium", service: "Utilities", points: 5 },
        { text: "Trespassing on property", priority: "medium", service: "Police", points: 5 },
        { text: "Shoplifting in progress", priority: "medium", service: "Police", points: 5 },
        { text: "Minor vehicle accident", priority: "medium", service: "Police", points: 5 },
        { text: "Alarm activation - business", priority: "medium", service: "Police", points: 5 },
        
        { text: "Noise complaint from neighbor", priority: "low", service: "Police", points: 2 },
        { text: "Lost pet report", priority: "low", service: "Police", points: 2 },
        { text: "Theft report from yesterday", priority: "low", service: "Police", points: 2 },
        { text: "Vehicle blocking driveway", priority: "low", service: "Police", points: 2 },
        { text: "Parking violation", priority: "low", service: "Police", points: 2 },
        { text: "Request for police report", priority: "low", service: "Police", points: 2 },
        { text: "Barking dog complaint", priority: "low", service: "Animal Control", points: 2 },
        { text: "Found property report", priority: "low", service: "Police", points: 2 },
        { text: "Street light out", priority: "low", service: "Utilities", points: 2 },
        { text: "Request for patrol check", priority: "low", service: "Police", points: 2 }
    ],
    
    state: null,
    container: null,
    onComplete: null,
    gameInterval: null,
    mathQuestionInterval: null,
    
    render(container, questionCount, onComplete) {
        this.container = container;
        this.onComplete = onComplete;
        this.showInstructions();
    },
    
    showInstructions() {
        this.container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2>🎮 Realistic Dispatch Simulation</h2>
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 700px; text-align: left;">
                    <h3>Instructions:</h3>
                    <ol style="padding-left: 20px; line-height: 1.8;">
                        <li><strong>You manage 4 units</strong> responding to emergency calls</li>
                        <li><strong>6 calls will be in the queue</strong> at all times</li>
                        <li><strong>Click an unit, then click a call</strong> to assign them</li>
                        <li><strong>Units take 20 seconds</strong> to handle each call</li>
                        <li><strong>Priority matters!</strong>
                            <ul style="margin-top: 5px;">
                                <li><span style="background: #dc3545; color: white; padding: 2px 8px; border-radius: 3px;">HIGH</span> = Life-threatening (10 pts)</li>
                                <li><span style="background: #ffc107; color: black; padding: 2px 8px; border-radius: 3px;">MEDIUM</span> = Urgent (5 pts)</li>
                                <li><span style="background: #28a745; color: white; padding: 2px 8px; border-radius: 3px;">LOW</span> = Routine (2 pts)</li>
                            </ul>
                        </li>
                        <li><strong>Watch for math questions!</strong> You'll be interrupted to answer simple calculations</li>
                        <li><strong>Simulation runs for 10 minutes</strong></li>
                        <li><strong>Assign HIGH priority calls first!</strong> Low priority calls can wait</li>
                    </ol>
                    <div style="background: #d1ecf1; padding: 10px; border-radius: 5px; margin-top: 15px; border-left: 4px solid #0c5460;">
                        <strong>⚠️ Tip:</strong> Dispatching high priority calls late will lose you points!
                    </div>
                </div>
                <button onclick="multitaskingModule.startSimulation()" class="primary-btn">
                    Start 10-Minute Simulation
                </button>
            </div>
        `;
    },
    
    startSimulation() {
        // Initialize game state
        this.state = {
            units: [
                { id: 1, name: "Unit 101", status: "available", assignedCall: null, timeRemaining: 0 },
                { id: 2, name: "Unit 102", status: "available", assignedCall: null, timeRemaining: 0 },
                { id: 3, name: "Unit 103", status: "available", assignedCall: null, timeRemaining: 0 },
                { id: 4, name: "Unit 104", status: "available", assignedCall: null, timeRemaining: 0 }
            ],
            callQueue: [],
            selectedUnit: null,
            score: 0,
            callsCompleted: 0,
            startTime: Date.now(),
            timeElapsed: 0,
            totalTime: 600, // 10 minutes = 600 seconds
            callCounter: 1,
            mathQuestionActive: false,
            mathQuestion: null,
            mathCorrect: 0,
            mathTotal: 0
        };
        
        // Generate initial 6 calls
        for (let i = 0; i < 6; i++) {
            this.addNewCall();
        }
        
        // Start the main game loop (updates every second)
        this.gameInterval = setInterval(() => this.updateGame(), 1000);
        
        // Show math questions every 30-60 seconds
        this.scheduleMathQuestion();
        
        this.renderUI();
    },
    
    updateGame() {
        this.state.timeElapsed++;
        
        // Check if time is up
        if (this.state.timeElapsed >= this.state.totalTime) {
            this.endSimulation();
            return;
        }
        
        // Update units
        this.state.units.forEach(unit => {
            if (unit.status === "busy") {
                unit.timeRemaining--;
                if (unit.timeRemaining <= 0) {
                    // Unit finished the call
                    this.state.callsCompleted++;
                    unit.status = "available";
                    unit.assignedCall = null;
                    
                    // Add a new call to replace the completed one
                    this.addNewCall();
                }
            }
        });
        
        // Calculate penalty for high priority calls waiting too long
        this.state.callQueue.forEach(call => {
            call.waitTime++;
            
            // High priority calls waiting more than 30 seconds = lose points
            if (call.priority === "high" && call.waitTime > 30 && !call.penalized) {
                this.state.score -= 5;
                call.penalized = true;
            }
            // Medium priority calls waiting more than 60 seconds = lose points
            if (call.priority === "medium" && call.waitTime > 60 && !call.penalized) {
                this.state.score -= 2;
                call.penalized = true;
            }
        });
        
        this.renderUI();
    },
    
    addNewCall() {
        // Pick a random call from the bank
        const template = this.callBank[Math.floor(Math.random() * this.callBank.length)];
        const newCall = {
            id: this.state.callCounter++,
            text: template.text,
            priority: template.priority,
            service: template.service,
            points: template.points,
            waitTime: 0,
            penalized: false
        };
        this.state.callQueue.push(newCall);
    },
    
    scheduleMathQuestion() {
        // Random interval between 30-60 seconds
        const delay = (30 + Math.random() * 30) * 1000;
        
        setTimeout(() => {
            if (this.state.timeElapsed < this.state.totalTime && !this.state.mathQuestionActive) {
                this.showMathQuestion();
            }
            if (this.state.timeElapsed < this.state.totalTime) {
                this.scheduleMathQuestion();
            }
        }, delay);
    },
    
    showMathQuestion() {
        this.state.mathQuestionActive = true;
        
        // Generate simple addition problem
        const num1 = Math.floor(Math.random() * 50) + 10;
        const num2 = Math.floor(Math.random() * 50) + 10;
        const correctAnswer = num1 + num2;
        
        this.state.mathQuestion = {
            question: `${num1} + ${num2} = ?`,
            answer: correctAnswer
        };
        
        this.state.mathTotal++;
        this.renderUI();
    },
    
    answerMathQuestion() {
        const userAnswer = parseInt(document.getElementById('mathAnswer').value);
        
        if (userAnswer === this.state.mathQuestion.answer) {
            this.state.mathCorrect++;
            this.state.score += 3; // Bonus for correct answer
        } else {
            this.state.score -= 2; // Penalty for wrong answer
        }
        
        this.state.mathQuestionActive = false;
        this.state.mathQuestion = null;
        this.renderUI();
    },
    
    renderUI() {
        if (this.state.mathQuestionActive) {
            this.renderMathQuestion();
            return;
        }
        
        const timeRemaining = this.state.totalTime - this.state.timeElapsed;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        // Sort calls by priority for display (high first)
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const sortedCalls = [...this.state.callQueue].sort((a, b) => 
            priorityOrder[a.priority] - priorityOrder[b.priority]
        );
        
        this.container.innerHTML = `
            <div class="multitasking-game">
                <div class="game-header">
                    <div class="stats">
                        <div class="stat-box">
                            <span class="stat-label">Time Remaining:</span>
                            <span class="stat-value" style="font-size: 24px; color: ${minutes < 2 ? '#dc3545' : '#2c3e50'};">
                                ${minutes}:${seconds.toString().padStart(2, '0')}
                            </span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Score:</span>
                            <span class="stat-value" style="color: #28a745;">${this.state.score}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Calls Completed:</span>
                            <span class="stat-value">${this.state.callsCompleted}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Math Questions:</span>
                            <span class="stat-value">${this.state.mathCorrect}/${this.state.mathTotal}</span>
                        </div>
                    </div>
                </div>
                
                <div class="game-layout">
                    <div class="units-panel">
                        <h3>👮 Available Units</h3>
                        ${this.state.units.map(unit => `
                            <div class="unit-card ${unit.status} ${this.state.selectedUnit === unit.id ? 'selected' : ''}"
                                 onclick="multitaskingModule.selectUnit(${unit.id})">
                                <div class="unit-name">${unit.name}</div>
                                <div class="unit-status">
                                    ${unit.status === 'available' 
                                        ? '<span style="color: #28a745;">● Available</span>'
                                        : `<span style="color: #dc3545;">● Busy (${unit.timeRemaining}s)</span>`
                                    }
                                </div>
                                ${unit.assignedCall 
                                    ? `<div class="unit-call">${unit.assignedCall.text}</div>`
                                    : ''
                                }
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="calls-panel">
                        <h3>📞 Incoming Calls (${this.state.callQueue.length})</h3>
                        <div class="instruction-text">
                            ${this.state.selectedUnit 
                                ? '👈 Click a call to assign to selected unit'
                                : '👈 Select an available unit first'
                            }
                        </div>
                        ${sortedCalls.map(call => `
                            <div class="call-card ${call.priority} ${this.state.selectedUnit ? 'clickable' : ''}"
                                 onclick="multitaskingModule.assignCall(${call.id})">
                                <div class="call-priority">
                                    <span class="priority-badge ${call.priority}">${call.priority.toUpperCase()}</span>
                                    <span class="call-service">${call.service}</span>
                                </div>
                                <div class="call-text">${call.text}</div>
                                <div class="call-footer">
                                    <span class="call-points">+${call.points} pts</span>
                                    <span class="call-wait">⏱ ${call.waitTime}s</span>
                                    ${call.waitTime > 30 && call.priority === 'high' 
                                        ? '<span style="color: #dc3545; font-weight: bold;">⚠ URGENT!</span>'
                                        : ''
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <style>
                .multitasking-game {
                    padding: 20px;
                }
                .game-header {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                .stats {
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                .stat-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .stat-label {
                    font-size: 12px;
                    color: #6c757d;
                    text-transform: uppercase;
                }
                .stat-value {
                    font-size: 28px;
                    font-weight: bold;
                    color: #2c3e50;
                }
                .game-layout {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 20px;
                }
                .units-panel, .calls-panel {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    border: 2px solid #e0e0e0;
                }
                .units-panel h3, .calls-panel h3 {
                    margin-top: 0;
                    color: #2c3e50;
                }
                .instruction-text {
                    background: #e7f3ff;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 15px;
                    text-align: center;
                    font-weight: bold;
                    color: #0066cc;
                }
                .unit-card {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all 0.2s;
                }
                .unit-card.available {
                    border-color: #28a745;
                }
                .unit-card.busy {
                    background: #fff3cd;
                    border-color: #ffc107;
                }
                .unit-card.selected {
                    border-color: #007bff;
                    box-shadow: 0 0 10px rgba(0,123,255,0.3);
                }
                .unit-card:hover {
                    transform: translateY(-2px);
                }
                .unit-name {
                    font-weight: bold;
                    font-size: 16px;
                    margin-bottom: 5px;
                }
                .unit-status {
                    font-size: 14px;
                }
                .unit-call {
                    margin-top: 8px;
                    padding: 8px;
                    background: white;
                    border-radius: 5px;
                    font-size: 13px;
                    color: #495057;
                }
                .call-card {
                    background: white;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 10px;
                    transition: all 0.2s;
                }
                .call-card.clickable {
                    cursor: pointer;
                }
                .call-card.clickable:hover {
                    border-color: #007bff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .call-card.high {
                    border-left: 5px solid #dc3545;
                }
                .call-card.medium {
                    border-left: 5px solid #ffc107;
                }
                .call-card.low {
                    border-left: 5px solid #28a745;
                }
                .call-priority {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .priority-badge {
                    padding: 3px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                }
                .priority-badge.high {
                    background: #dc3545;
                    color: white;
                }
                .priority-badge.medium {
                    background: #ffc107;
                    color: black;
                }
                .priority-badge.low {
                    background: #28a745;
                    color: white;
                }
                .call-service {
                    font-size: 12px;
                    color: #6c757d;
                }
                .call-text {
                    font-size: 15px;
                    margin: 8px 0;
                    color: #2c3e50;
                }
                .call-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 13px;
                    margin-top: 8px;
                }
                .call-points {
                    color: #28a745;
                    font-weight: bold;
                }
                .call-wait {
                    color: #6c757d;
                }
            </style>
        `;
    },
    
    renderMathQuestion() {
        this.container.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;">
                <div style="background: white; padding: 40px; border-radius: 15px; text-align: center; max-width: 500px;">
                    <h2 style="color: #dc3545; margin-bottom: 20px;">⚡ Quick Math Question!</h2>
                    <p style="font-size: 14px; color: #6c757d; margin-bottom: 30px;">
                        Answer quickly to get back to dispatching!
                    </p>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 25px;">
                        <h1 style="font-size: 48px; margin: 0; color: #2c3e50;">${this.state.mathQuestion.question}</h1>
                    </div>
                    <input type="text" id="mathAnswer" 
                           style="width: 200px; padding: 15px; font-size: 24px; text-align: center; border: 2px solid #667eea; border-radius: 8px;"
                           placeholder="Answer" autofocus inputmode="numeric" pattern="[0-9]*">
                    <br><br>
                    <button onclick="multitaskingModule.answerMathQuestion()" 
                            style="background: #667eea; color: white; border: none; padding: 15px 40px; font-size: 18px; border-radius: 8px; cursor: pointer;">
                        Submit Answer
                    </button>
                </div>
            </div>
        `;
        
        // Get the input element
        const mathInput = document.getElementById('mathAnswer');
        
        // Only allow numbers to be typed
        mathInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
        
        // Allow Enter key to submit
        mathInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.answerMathQuestion();
            }
        });
    },
    
    selectUnit(unitId) {
        const unit = this.state.units.find(o => o.id === unitId);
        if (unit.status === 'available') {
            this.state.selectedUnit = unitId;
            this.renderUI();
        }
    },
    
    assignCall(callId) {
        if (!this.state.selectedUnit) {
            return; // No unit selected
        }
        
        const unit = this.state.units.find(o => o.id === this.state.selectedUnit);
        if (unit.status !== 'available') {
            return; // Unit is busy
        }
        
        const call = this.state.callQueue.find(c => c.id === callId);
        if (!call) {
            return; // Call not found
        }
        
        // Assign the call to the unit
        unit.status = 'busy';
        unit.timeRemaining = 20; // 20 seconds to handle call
        unit.assignedCall = {
            text: call.text,
            priority: call.priority
        };
        
        // Add points based on call priority and wait time
        let points = call.points;
        
        // Bonus for handling high priority quickly
        if (call.priority === 'high' && call.waitTime < 15) {
            points += 5; // Bonus for fast response
        }
        
        this.state.score += points;
        
        // Remove call from queue
        this.state.callQueue = this.state.callQueue.filter(c => c.id !== callId);
        
        // Deselect unit
        this.state.selectedUnit = null;
        
        this.renderUI();
    },
    
    endSimulation() {
        // Stop intervals
        clearInterval(this.gameInterval);
        
        // Calculate final score
        const accuracy = this.state.mathTotal > 0 
            ? (this.state.mathCorrect / this.state.mathTotal) * 100 
            : 100;
        
        // Score is based on points earned
        const maxPossibleScore = this.state.callsCompleted * 10; // Assuming average of 10 points per call
        const scorePercentage = Math.min(100, (this.state.score / maxPossibleScore) * 100);
        
        const finalResults = {
            moduleId: 'multitasking',
            accuracy: scorePercentage,
            correctAnswers: this.state.callsCompleted,
            totalQuestions: this.state.callsCompleted,
            score: scorePercentage,
            rawScore: this.state.score,
            mathAccuracy: accuracy
        };
        
        if (this.onComplete) {
            this.onComplete(finalResults);
        }
    }
};

// Export
window.multitaskingModule = multitaskingModule;
