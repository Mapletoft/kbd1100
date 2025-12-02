// MAP READING MODULE - Image-based with hardcoded questions
// Uses 4 real map images with 10 questions each
// Test randomly selects 3 maps and 5 questions per map (15 total)

const mapReadingModule = {
    name: "Map Reading",
    
    // Bank of 4 maps with their specific questions
    mapBank: [
        {
            id: 1,
            imagePath: "images/image1.png",
            title: "Downtown Street Grid",
            questions: [
                {
                    question: "How many 2-directional named North and South roadways are there?",
                    options: ["3", "0", "1", "2"],
                    correct: 0
                },
                {
                    question: "If I leave the trade center by Kindergarten/West and turn East, then South on 00 St, what road would be on my left?",
                    options: ["00E st", "Would not be able to follow these directions as West st only goes West", "01 St", "02W St"],
                    correct: 1
                },
                {
                    question: "You are on BB St looking West, What would be the fastest way to get to the intersection 02 St/West St?",
                    options: ["Turn around to go East on BB then South on 02 St", "Follow BB West, then South on Angel, then East on West", "Follow BB West, South on Angel, West on West, South on 00, East on 00E, North on 02", "Follow BB West, South on Angel, West on West, South on 00, East on 01, North on 02"],
                    correct: 2
                },
                {
                    question: "Which streets run East to West and West to East (2-directional)?",
                    options: ["03 St, Joy St, West St", "03 St, Joy St, West St, BB St, 00E St", "03 St, Joy St, West St, BB St, 00E St, 01 St", "Joy St, BB St, 00E St"],
                    correct: 3
                },
                {
                    question: "you are at the South East corner of the Trade Center and need to get to the North West corner, which way is the fastest?",
                    options: ["go North on 00 St, West on West St", "East on 01 St, North on 02 St, West on West St", "East on 01 St, North on 02 St, West on 00E St, North on 00 St, West on West", "East on 01 St, North on 02 St, West on 03 St, South on 00 St, West on West"],
                    correct: 0
                },
                {
                    question: "WHat general direction is the Hospital from Art gallery?",
                    options: ["North", "North/East", "East", "North/West"],
                    correct: 1
                },
                {
                    question: "How many one-way streets are shown on this map?",
                    options: ["4", "8", "7", "5"],
                    correct: 2
                },
                {
                    question: "if you are travelling on 03 St and pass 00 St, what building would you be at?",
                    options: ["Trade Center", "Hospital", "Church", "Kindergarten"],
                    correct: 3
                },
                {
                    question: "Which street intersects with the most streets?",
                    options: ["01 St", "North St", "02 St", "03 St"],
                    correct: 2
                },
                {
                    question: "I am at the intersection 00E St/02 St, if I want to get to Angel St how many correct paths are there if I start Northbound on 02 St?",
                    options: ["3", "1", "2", "5"],
                    correct: 0
                }
            ]
        },
        {
            id: 2,
            imagePath: "images/image2.png",
            title: "Street Grid",
            questions: [
                {
                    question: "how many 2-directional roads are there?",
                    options: ["2", "3", "1", "4"],
                    correct: 1
                },
                {
                    question: "How would you quickly get from South East corner of Apartment Building to the restaurant?",
                    options: ["North on cole, West on Third, South on Low", "West on Second", "North on Cole, West on First", "There is no possible route"],
                    correct: 1
                },
                {
                    question: "You are driving on First and just passed Downhill, what is the next road you come to?",
                    options: ["High", "Cole", "Polk", "Third"],
                    correct: 2
                },
                {
                    question: "From the Mall, which direction is the Restaurant?",
                    options: ["Northeast", "Southeast", "Southwest", "Northwest"],
                    correct: 2
                },
                {
                    question: "You are travelling on Third and just passed Cole St, what is the next street you can take North?",
                    options: ["Polk", "Downhill", "High", "Cole"],
                    correct: 1
                },
                {
                    question: "A police car is at the South East corner of the Mall and needs to get to the North East corner. What directions would you give them?",
                    options: ["Go North on Polk", "West on Third, North on Downhill, East on Fourth", "East on Third, North on Cole, West on Fourth", "East on Third, North on Cole, West on Fifth, North on Polk"],
                    correct: 1
                },
                {
                    question: "How many one way streets are there?",
                    options: ["5", "10", "7", "8"],
                    correct: 2
                },
                {
                    question: "You are driving on First, what is the named building on your left?",
                    options: ["Apartment Building", "Restaurant", "Mall", "Cafe"],
                    correct: 3
                },
                {
                    question: "You are driving North on Downhill, what is the first named building on your left?",
                    options: ["Apartment Building", "Police Station", "Mall", "there isnt one"],
                    correct: 1
                },
                {
                    question: "You leave the Mall on Polk. What building are you heading towards?",
                    options: ["Cafe", "Police Station", "Apartment building", "Restaurant"],
                    correct: 2
                }
            ]
        },
        {
            id: 3,
            imagePath: "images/image3.png",
            title: "City",
            questions: [
                {
                    question: "What building is on the South West of the map?",
                    options: ["Hilltop Apartment", "Police Dept.", "Land View Apartment", "Public Park"],
                    correct: 2
                },
                {
                    question: "How many one way streets are shown?",
                    options: ["3", "10", "7", "6"],
                    correct: 1
                },
                {
                    question: "How would you get from Office C to Office A?",
                    options: ["South on Gully, East on Lake, North on Dale, West on Creek, West on River", "There is no route", "South on Gully, West on Lake, North on Cliff", "West on River"],
                    correct: 3
                },
                {
                    question: "you are travelling on Lake Street and just pass the Parking, what building do you pass next?",
                    options: ["Restaurant", "Not enough information to know", "Cafe", "World Elementary School"],
                    correct: 1
                },
                {
                    question: "How many 2-directional streets are marked on the map?",
                    options: ["1", "2", "5", "4"],
                    correct: 2
                },
                {
                    question: "What building is North of the Library?",
                    options: ["Grocery", "Hilltop Apartment", "Central Hospital", "World Elementary School"],
                    correct: 2
                },
                {
                    question: "From the Fire Dept, what is the route to Warehouse?",
                    options: ["Left on Glen, Right on cliff", "Right on Glen, Left on Dale, Left on Lake, right on Cliff", "Right on Glen, Left on Dale, right on Lake, right on Cliff", "Right on Glen, Left on Dale, Left on Lake, left on Cliff"],
                    correct: 1
                },
                {
                    question: "How many parking on the map?",
                    options: ["4", "1", "2", "3"],
                    correct: 2
                },
                {
                    question: "You turn off Glen onto Knoll, what building would be on your left?",
                    options: ["Grocery", "Fire Dept", "Library", "Restaurant"],
                    correct: 0
                },
                {
                    question: "Which road provides access to Gully and Cliff?",
                    options: ["River", "Creek", "Glen", "Lake"],
                    correct: 3
                }
            ]
        },
        {
            id: 4,
            imagePath: "images/image4.png",
            title: "Rural Township",
            questions: [
                {
                    question: "You turn left from Parkdale onto Casimir, what intersection do you approach first?",
                    options: ["Casimir/Park Crescent", "Casimir/Colonization", "Casimir/Sprouce/Parkdale", "Casimir/Schmidt"],
                    correct: 2
                },
                {
                    question: "How many named roads are shown?",
                    options: ["6", "8", "7", "5"],
                    correct: 1
                },
                {
                    question: "Which direction does Colonization Ave flow?",
                    options: ["North to South", "South to North", "East to West", "West to East"],
                    correct: 1
                },
                {
                    question: "What Street can Firefighters leave the Fire Station from?",
                    options: ["Colonization", "Wilde", "Park Crescent", "Casimir"],
                    correct: 1
                },
                {
                    question: "How many streets does Schmidt Crescent touch on this map?",
                    options: ["1", "3", "2", "4"],
                    correct: 1
                },
                {
                    question: "What road runs parallel to Wilde?",
                    options: ["Sprouce", "Parkdale", "Casimir", "schmidt"],
                    correct: 2
                },
                {
                    question: "From the fire station, which direction is the driving school?",
                    options: ["Northeast", "Southeast", "Southwest", "Northwest"],
                    correct: 2
                },
                {
                    question: "how many streets touch the Dental Clinic?",
                    options: ["1", "2", "3", "4"],
                    correct: 2
                },
                {
                    question: "What road(s) can the firefighters take to return to the Fire Station?",
                    options: ["Wilde", "Colonization", "Wilde or Colonization", "Park Crescent"],
                    correct: 2
                },
                {
                    question: "How many 2-directional streets are on this map?",
                    options: ["2", "1", "5", "4"],
                    correct: 3
                }
            ]
        }
    ],
    
    state: null,
    container: null,
    onComplete: null,
    
    init(questionCount) {
        // Select 3 random maps from the 4 available
        const shuffledMaps = this.shuffleArray([...this.mapBank]);
        this.selectedMaps = shuffledMaps.slice(0, 3);
        
        // For each selected map, choose 5 random questions
        this.selectedMaps.forEach(map => {
            const shuffledQuestions = this.shuffleArray([...map.questions]);
            map.selectedQuestions = shuffledQuestions.slice(0, 5);
        });
        
        this.currentMapIndex = 0;
        this.currentQuestionIndex = 0;
        
        this.results = {
            correct: 0,
            total: 15, // 3 maps × 5 questions
            mapResults: []
        };
    },
    
    render(container, questionCount, onComplete) {
        this.container = container;
        this.onComplete = onComplete;
        this.init(questionCount);
        this.showMapAndQuestion();
    },
    
    showMapAndQuestion() {
        // Check if all maps completed
        if (this.currentMapIndex >= this.selectedMaps.length) {
            this.finish();
            return;
        }
        
        const currentMap = this.selectedMaps[this.currentMapIndex];
        
        // Check if all questions for this map completed
        if (this.currentQuestionIndex >= currentMap.selectedQuestions.length) {
            this.currentMapIndex++;
            this.currentQuestionIndex = 0;
            this.showMapAndQuestion();
            return;
        }
        
        const question = currentMap.selectedQuestions[this.currentQuestionIndex];
        const overallProgress = (this.currentMapIndex * 5) + this.currentQuestionIndex + 1;
        
        this.container.innerHTML = `
            <div class="map-reading-module">
                <div class="progress-indicator">
                    <p>Question ${overallProgress} of 15 | Map ${this.currentMapIndex + 1} of 3: ${currentMap.title}</p>
                    <div class="progress-bar-slim">
                        <div class="progress-fill" style="width: ${(overallProgress / 15) * 100}%"></div>
                    </div>
                </div>
                
                <div class="map-display">
                    <img src="${currentMap.imagePath}" alt="${currentMap.title}" class="map-image">
                </div>
                
                <div class="question-section">
                    <h3>${question.question}</h3>
                    <div class="answer-options">
                        ${question.options.map((option, index) => `
                            <button onclick="mapReadingModule.selectAnswer(${index})" class="answer-option">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <style>
                .map-reading-module {
                    padding: 20px;
                }
                .map-display {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    text-align: center;
                }
                .map-image {
                    max-width: 100%;
                    max-height: 500px;
                    border: 2px solid #dee2e6;
                    border-radius: 5px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .question-section {
                    background: white;
                    padding: 25px;
                    border-radius: 10px;
                    border: 2px solid #e0e0e0;
                }
                .question-section h3 {
                    color: #2c3e50;
                    margin-bottom: 20px;
                }
                .answer-options {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .answer-option {
                    padding: 15px 20px;
                    text-align: left;
                    background: #f8f9fa;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 16px;
                }
                .answer-option:hover {
                    border-color: #667eea;
                    background: #e7f0ff;
                    transform: translateX(5px);
                }
            </style>
        `;
    },
    
    selectAnswer(selectedIndex) {
        const currentMap = this.selectedMaps[this.currentMapIndex];
        const question = currentMap.selectedQuestions[this.currentQuestionIndex];
        const correct = selectedIndex === question.correct;
        
        if (correct) {
            this.results.correct++;
        }
        
        this.showFeedback(correct, question);
    },
    
    showFeedback(correct, question) {
        const currentMap = this.selectedMaps[this.currentMapIndex];
        
        this.container.innerHTML = `
            <div class="scenario-feedback ${correct ? 'success' : 'warning'}">
                <div class="feedback-header">
                    <h2>${correct ? '✓ Correct!' : '✗ Incorrect'}</h2>
                </div>
                
                <div class="map-display">
                    <img src="${currentMap.imagePath}" alt="${currentMap.title}" class="map-image">
                </div>
                
                <div class="feedback-details">
                    <div class="feedback-section">
                        <h4>Question:</h4>
                        <p>${question.question}</p>
                    </div>
                    <div class="feedback-section">
                        <h4>Correct Answer:</h4>
                        <p>${question.options[question.correct]}</p>
                    </div>
                </div>
                
                <div class="module-actions">
                    <button onclick="mapReadingModule.nextQuestion()" class="primary-btn">
                        Next Question →
                    </button>
                </div>
            </div>
            
            <style>
                .map-display {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    text-align: center;
                }
                .map-image {
                    max-width: 100%;
                    max-height: 400px;
                    border: 2px solid #dee2e6;
                    border-radius: 5px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
            </style>
        `;
    },
    
    nextQuestion() {
        this.currentQuestionIndex++;
        this.showMapAndQuestion();
    },
    
    finish() {
        const accuracy = (this.results.correct / this.results.total) * 100;
        
        const finalResults = {
            moduleId: 'mapReading',
            accuracy: accuracy,
            correctAnswers: this.results.correct,
            totalQuestions: this.results.total,
            score: accuracy
        };
        
        if (this.onComplete) {
            this.onComplete(finalResults);
        }
    },
    
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
};

// CROSS REFERENCE MODULE - Full implementation
const crossReferenceModule = {
    name: "Cross Reference",
    questionBank: [
        {
            title: "License Verification",
            callerInfo: {
                name: "John Michael Smith",
                dob: "03/15/1985",
                license: "S1234-56789-85031",
                address: "123 Oak Street",
                phone: "705-555-1234"
            },
            databaseInfo: {
                name: "John Michael Smith",
                dob: "03/15/1985",
                license: "S1234-56789-85031",
                address: "123 Oak Street",
                phone: "705-555-1235"
            },
            discrepancy: "phone",
            question: "What information does NOT match?"
        },
        {
            title: "Warrant Check",
            callerInfo: {
                name: "Sarah Elizabeth Johnson",
                dob: "07/22/1992",
                license: "J5678-12345-92722",
                address: "456 Maple Avenue"
            },
            databaseInfo: {
                name: "Sarah Elizabeth Johnson",
                dob: "07/22/1992",
                license: "J5678-12345-92722",
                address: "456 Maple Drive"
            },
            discrepancy: "address",
            question: "Which field contains a discrepancy?"
        },
        {
            title: "Vehicle Registration",
            callerInfo: {
                name: "Michael Robert Chen",
                plate: "ABCD 123",
                vin: "1HGBH41JXMN109186",
                year: "2015",
                make: "Honda"
            },
            databaseInfo: {
                name: "Michael Robert Chen",
                plate: "ABCD 123",
                vin: "1HGBH41JXMN109186",
                year: "2016",
                make: "Honda"
            },
            discrepancy: "year",
            question: "What vehicle information doesn't match?"
        },
        {
            title: "Emergency Contact",
            callerInfo: {
                name: "Emily Rose Martinez",
                dob: "11/30/1988",
                address: "789 Pine Boulevard Apt 3B",
                emergency_contact: "Carlos Martinez",
                emergency_phone: "705-555-9876"
            },
            databaseInfo: {
                name: "Emily Rose Martinez",
                dob: "11/03/1988",
                address: "789 Pine Boulevard Apt 3B",
                emergency_contact: "Carlos Martinez",
                emergency_phone: "705-555-9876"
            },
            discrepancy: "dob",
            question: "Which piece of information is inconsistent?"
        },
        {
            title: "Perfect Match",
            callerInfo: {
                name: "David Lee Thompson",
                dob: "05/14/1979",
                license: "T2345-67890-79514",
                address: "321 Birch Lane"
            },
            databaseInfo: {
                name: "David Lee Thompson",
                dob: "05/14/1979",
                license: "T2345-67890-79514",
                address: "321 Birch Lane"
            },
            discrepancy: "none",
            question: "Do all fields match?"
        },
        {
            title: "DL Number Mismatch",
            callerInfo: {
                name: "Jennifer Ann Williams",
                dob: "09/08/1990",
                license: "W9876-54321-90908",
                address: "555 Cedar Court",
                phone: "705-555-4567"
            },
            databaseInfo: {
                name: "Jennifer Ann Williams",
                dob: "09/08/1990",
                license: "W9876-54322-90908",
                address: "555 Cedar Court",
                phone: "705-555-4567"
            },
            discrepancy: "license",
            question: "Which field has incorrect information?"
        },
        {
            title: "Name Spelling Difference",
            callerInfo: {
                name: "Christopher Alan MacDonald",
                dob: "12/25/1987",
                plate: "XYZ 789",
                address: "100 Highland Road"
            },
            databaseInfo: {
                name: "Christopher Alan McDonald",
                dob: "12/25/1987",
                plate: "XYZ 789",
                address: "100 Highland Road"
            },
            discrepancy: "name",
            question: "What doesn't match between records?"
        },
        {
            title: "VIN Verification",
            callerInfo: {
                name: "Angela Marie Foster",
                plate: "DEF 456",
                vin: "2T3BF4DV9BW123456",
                make: "Toyota",
                model: "RAV4"
            },
            databaseInfo: {
                name: "Angela Marie Foster",
                plate: "DEF 456",
                vin: "2T3BF4DV9BW123457",
                make: "Toyota",
                model: "RAV4"
            },
            discrepancy: "vin",
            question: "Which vehicle identifier is different?"
        },
        {
            title: "Complete Match",
            callerInfo: {
                name: "Robert James Peterson",
                dob: "04/17/1983",
                phone: "705-555-2468",
                address: "987 Oakwood Terrace",
                license: "P4567-89012-83417"
            },
            databaseInfo: {
                name: "Robert James Peterson",
                dob: "04/17/1983",
                phone: "705-555-2468",
                address: "987 Oakwood Terrace",
                license: "P4567-89012-83417"
            },
            discrepancy: "none",
            question: "Are there any discrepancies?"
        },
        {
            title: "Plate Number Error",
            callerInfo: {
                name: "Lisa Michelle Anderson",
                plate: "GHI 321",
                vin: "5TDZA23C77S123456",
                year: "2019",
                color: "Silver"
            },
            databaseInfo: {
                name: "Lisa Michelle Anderson",
                plate: "GHI 322",
                vin: "5TDZA23C77S123456",
                year: "2019",
                color: "Silver"
            },
            discrepancy: "plate",
            question: "Which field doesn't match?"
        },
        {
            title: "DOB Transposition",
            callerInfo: {
                name: "Thomas Edward Sullivan",
                dob: "08/12/1975",
                license: "S7890-12345-75812",
                address: "246 Willow Way"
            },
            databaseInfo: {
                name: "Thomas Edward Sullivan",
                dob: "08/21/1975",
                license: "S7890-12345-75812",
                address: "246 Willow Way"
            },
            discrepancy: "dob",
            question: "What information is inconsistent?"
        },
        {
            title: "Address Suffix Difference",
            callerInfo: {
                name: "Patricia Louise Grant",
                dob: "06/30/1991",
                address: "802 Riverside Drive",
                phone: "705-555-7890"
            },
            databaseInfo: {
                name: "Patricia Louise Grant",
                dob: "06/30/1991",
                address: "802 Riverside Court",
                phone: "705-555-7890"
            },
            discrepancy: "address",
            question: "Which field contains an error?"
        },
        {
            title: "Make vs Model Confusion",
            callerInfo: {
                name: "Kevin Scott Harris",
                plate: "JKL 654",
                make: "Ford",
                model: "F-150",
                year: "2018"
            },
            databaseInfo: {
                name: "Kevin Scott Harris",
                plate: "JKL 654",
                make: "Ford",
                model: "F-250",
                year: "2018"
            },
            discrepancy: "model",
            question: "What vehicle information is different?"
        },
        {
            title: "Phone Number Last Digit",
            callerInfo: {
                name: "Amanda Grace Turner",
                dob: "10/05/1986",
                phone: "705-555-3456",
                address: "159 Sunset Boulevard"
            },
            databaseInfo: {
                name: "Amanda Grace Turner",
                dob: "10/05/1986",
                phone: "705-555-3457",
                address: "159 Sunset Boulevard"
            },
            discrepancy: "phone",
            question: "Which field has a discrepancy?"
        },
        {
            title: "All Fields Match",
            callerInfo: {
                name: "Daniel Frank Morrison",
                dob: "02/14/1982",
                license: "M2345-67890-82214",
                address: "753 Mountain View Lane",
                plate: "MNO 987"
            },
            databaseInfo: {
                name: "Daniel Frank Morrison",
                dob: "02/14/1982",
                license: "M2345-67890-82214",
                address: "753 Mountain View Lane",
                plate: "MNO 987"
            },
            discrepancy: "none",
            question: "Is all information accurate?"
        }
    ],
    selectedScenarios: [],
    currentScenario: 0,
    results: {
        correct: 0,
        total: 0,
        totalKeystrokes: 0,
        startTime: null
    },

    init(questionCount) {
        this.selectedScenarios = getRandomQuestions(this.questionBank, questionCount);
        this.currentScenario = 0;
        this.results = {
            correct: 0,
            total: questionCount,
            totalKeystrokes: 0,
            startTime: Date.now()
        };
    },

    render(container, questionCount, onComplete) {
        // Safety check: ensure getRandomQuestions is available
        if (typeof getRandomQuestions === 'undefined') {
            console.warn('⚠️ Cross Reference waiting for question bank to load...');
            setTimeout(() => this.render(container, questionCount, onComplete), 50);
            return;
        }
        
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
        const scenarioNum = this.currentScenario + 1;
        const total = this.selectedScenarios.length;

        // Count keystrokes for data review
        const callerText = JSON.stringify(scenario.callerInfo);
        const dbText = JSON.stringify(scenario.databaseInfo);
        this.results.totalKeystrokes += callerText.length + dbText.length;

        this.container.innerHTML = `
            <div class="cross-reference-module">
                <div class="progress-indicator">
                    <p>Scenario ${scenarioNum} of ${total}</p>
                    <div class="progress-bar-slim">
                        <div class="progress-fill" style="width: ${(scenarioNum / total) * 100}%"></div>
                    </div>
                </div>

                <h3>🔍 ${scenario.title}</h3>
                <p style="color: #666; margin-bottom: 20px;">${scenario.question}</p>

                <div class="comparison-container">
                    <div class="data-panel">
                        <h4>📞 Caller Information</h4>
                        <div class="data-fields">
                            ${Object.entries(scenario.callerInfo).map(([key, value]) => `
                                <div class="data-field">
                                    <span class="field-label">${this.formatFieldName(key)}:</span>
                                    <span class="field-value">${value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="data-panel">
                        <h4>💾 Database Information</h4>
                        <div class="data-fields">
                            ${Object.entries(scenario.databaseInfo).map(([key, value]) => `
                                <div class="data-field">
                                    <span class="field-label">${this.formatFieldName(key)}:</span>
                                    <span class="field-value">${value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="discrepancy-options">
                    <h4>Select the discrepancy:</h4>
                    <div class="option-buttons">
                        ${Object.keys(scenario.callerInfo).map(field => `
                            <button onclick="crossReferenceModule.selectDiscrepancy('${field}')" class="discrepancy-btn">
                                ${this.formatFieldName(field)}
                            </button>
                        `).join('')}
                        <button onclick="crossReferenceModule.selectDiscrepancy('none')" class="discrepancy-btn" style="background: #d4edda; border-color: #c3e6cb;">
                            ✓ All Match
                        </button>
                    </div>
                </div>
            </div>

            <style>
                .comparison-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin: 20px 0;
                }
                .data-panel {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                }
                .data-panel h4 {
                    color: #2c3e50;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e0e0e0;
                }
                .data-fields {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .data-field {
                    background: white;
                    padding: 12px;
                    border-radius: 5px;
                    display: flex;
                    justify-content: space-between;
                }
                .field-label {
                    font-weight: bold;
                    color: #7f8c8d;
                }
                .field-value {
                    font-family: 'Courier New', monospace;
                    color: #2c3e50;
                }
                .discrepancy-options {
                    margin-top: 30px;
                }
                .option-buttons {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 10px;
                    margin-top: 15px;
                }
                .discrepancy-btn {
                    padding: 12px;
                    background: white;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .discrepancy-btn:hover {
                    border-color: #667eea;
                    transform: translateY(-2px);
                }
            </style>
        `;
    },

    formatFieldName(key) {
        const names = {
            name: "Name",
            dob: "Date of Birth",
            license: "Driver's License",
            address: "Address",
            phone: "Phone Number",
            plate: "License Plate",
            vin: "VIN",
            year: "Year",
            make: "Make",
            model: "Model",
            color: "Color",
            emergency_contact: "Emergency Contact",
            emergency_phone: "Emergency Phone"
        };
        return names[key] || key;
    },

    selectDiscrepancy(selectedField) {
        const scenario = this.selectedScenarios[this.currentScenario];
        const correct = selectedField === scenario.discrepancy;

        if (correct) {
            this.results.correct++;
        }

        this.showFeedback(correct, scenario, selectedField);
    },

    showFeedback(correct, scenario, selectedField) {
        const statusClass = correct ? 'success' : 'warning';
        const statusIcon = correct ? '✓' : '✗';

        this.container.innerHTML = `
            <div class="scenario-feedback ${statusClass}">
                <div class="feedback-header">
                    <h2>${statusIcon} ${correct ? 'Correct!' : 'Incorrect'}</h2>
                </div>

                <div class="feedback-details">
                    <div class="feedback-section">
                        <h4>Correct Answer:</h4>
                        <p><strong>${scenario.discrepancy === 'none' ? 'All fields match' : this.formatFieldName(scenario.discrepancy)}</strong></p>
                    </div>

                    ${!correct ? `
                        <div class="feedback-section">
                            <h4>You Selected:</h4>
                            <p>${selectedField === 'none' ? 'All fields match' : this.formatFieldName(selectedField)}</p>
                        </div>
                    ` : ''}

                    ${scenario.discrepancy !== 'none' ? `
                        <div class="feedback-section explanation">
                            <h4>The Discrepancy:</h4>
                            <p>Caller: <strong>${scenario.callerInfo[scenario.discrepancy]}</strong></p>
                            <p>Database: <strong>${scenario.databaseInfo[scenario.discrepancy]}</strong></p>
                        </div>
                    ` : ''}
                </div>

                <div class="module-actions">
                    <button onclick="crossReferenceModule.nextScenario()" class="primary-btn">
                        Next Scenario →
                    </button>
                </div>
            </div>
        `;
    },

    nextScenario() {
        this.currentScenario++;
        this.showScenario();
    },

    finish() {
        const endTime = Date.now();
        const timeUsed = (endTime - this.results.startTime) / 1000;
        const accuracy = (this.results.correct / this.results.total) * 100;

        // Calculate KPH
        const kpm = Math.round((this.results.totalKeystrokes / timeUsed) * 60);
        const kph = kpm * 60;

        const finalResults = {
            moduleId: 'crossReference',
            accuracy: accuracy,
            correctAnswers: this.results.correct,
            totalQuestions: this.results.total,
            score: accuracy,
            totalKeystrokes: this.results.totalKeystrokes,
            kph: kph,
            kpm: kpm
        };

        if (this.onComplete) {
            this.onComplete(finalResults);
        }
    }
};

// MULTITASKING MODULE - Full implementation
window.mapReadingModule = mapReadingModule;
window.crossReferenceModule = crossReferenceModule;
