// Course Settings - controls which sections of the course are visible to students.
// Toggled from the Course Access panel on teacher.html; read by every student-facing page.
// Stored at Firestore doc courseSettings/KBD1100.

const COURSE_SETTINGS_COLLECTION = 'courseSettings';
const COURSE_SETTINGS_DOC_ID = 'KBD1100';

const DEFAULT_COURSE_SETTINGS = {
    fundamentalsUnlocked: false,
    programSpecificUnlocked: false,
    officeUnlocked: false,
    timedTestsUnlocked: false,
    criticallPracticeUnlocked: false,
    criticallTestUnlocked: false
};

// Fails safe: if the settings doc is missing or the read errors out, everything
// stays locked rather than accidentally opening early.
async function getCourseSettings() {
    try {
        const snap = await db.collection(COURSE_SETTINGS_COLLECTION).doc(COURSE_SETTINGS_DOC_ID).get();
        if (!snap.exists) return { ...DEFAULT_COURSE_SETTINGS };
        return { ...DEFAULT_COURSE_SETTINGS, ...snap.data() };
    } catch (err) {
        console.error('Could not load course settings, defaulting to locked:', err);
        return { ...DEFAULT_COURSE_SETTINGS };
    }
}

window.getCourseSettings = getCourseSettings;
window.DEFAULT_COURSE_SETTINGS = DEFAULT_COURSE_SETTINGS;
