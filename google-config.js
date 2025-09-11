// google-config.js
const SHEET_ID = '1Tk_a28oGYtbz38ngZoenW2vGr0uJ6QZqcWqAK357QZ4' ; 
const API_KEY = 'AIzaSyCNtK3KVCSMwWws4VDHCY9Xs9kSCROdLsQ'; 

// For reading data (authentication)
async function checkLogin(username, password) {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Students!A2:G?key=${API_KEY}`
        );
        const data = await response.json();
        
        if (data.values) {
            for (let row of data.values) {
                if (row[0] === username && row[1] === password && row[6] === 'TRUE') {
                    return {
                        success: true,
                        user: {
                            username: row[0],
                            firstName: row[2],
                            lastName: row[3],
                            studentId: row[4],
                            email: row[5]
                        }
                    };
                }
            }
        }
        return { success: false };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false };
    }
}

// For writing progress (we'll use Google Apps Script for this)
async function saveProgress(username, lessonId, stage, wpm, accuracy) {
    // We'll set this up with Google Apps Script (easier than service account in browser)
    const webAppUrl = 'YOUR_WEB_APP_URL'; // We'll get this in next step
    
    const data = {
        username: username,
        lessonId: lessonId,
        stage: stage,
        wpm: wpm,
        accuracy: accuracy,
        date: new Date().toISOString()
    };
    
    try {
        await fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Save error:', error);
    }
}