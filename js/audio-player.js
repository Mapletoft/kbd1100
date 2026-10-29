// Shared audio/TTS playback for CritiCall audio-based scenarios.
//
// Each scenario carries { script, audioFile }: if audioFile is set, that
// real recording plays; otherwise the browser speaks `script` aloud via
// SpeechSynthesis. Swapping TTS for a real recording later is just adding
// an audioFile path to that scenario's data - no code changes needed here
// or in any module that uses this.
//
// Used by: js/modules/audio-data-entry.js, js/modules/call-summarization.js,
// js/modules/listening-skills.js.

const AUDIO_PLAYER_TTS_RATE = 0.85; // slower than the browser default so it doesn't sound rushed

// Renders a Play button + status line into `container` and plays the given
// scenario's audio exactly once when clicked - never automatically. Calls
// onEnded() when playback finishes, whether it was a real recording or TTS.
// Deliberately never renders scenario.script as visible text - the whole
// point is that the information only exists in what's spoken, same as a
// real emergency call.
function buildAudioPlayerUI(container, scenario, { onEnded } = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'audio-player-widget';
    wrapper.innerHTML = `
        <p class="audio-player-warning">⚠️ You can only play this audio ONCE — listen carefully.</p>
        <button class="btn btn-success audio-player-btn" type="button">▶ Play Audio</button>
        <p class="audio-player-status">Ready to play</p>
    `;
    container.appendChild(wrapper);

    const playBtn = wrapper.querySelector('.audio-player-btn');
    const statusEl = wrapper.querySelector('.audio-player-status');
    let hasPlayed = false;

    playBtn.addEventListener('click', () => {
        if (hasPlayed) return;
        hasPlayed = true;
        playBtn.disabled = true;
        playBtn.textContent = '⏸ Playing...';
        playBtn.style.opacity = '0.6';
        statusEl.textContent = 'Playing...';
        statusEl.style.color = '#28a745';

        const finish = () => {
            playBtn.textContent = '✓ Played (cannot replay)';
            statusEl.textContent = 'Audio completed (cannot replay)';
            statusEl.style.color = '#dc3545';
            if (onEnded) onEnded();
        };

        if (scenario.audioFile) {
            const audio = new Audio(scenario.audioFile);
            audio.addEventListener('ended', finish);
            audio.addEventListener('error', finish); // don't softlock a student on a missing/broken file
            audio.play();
        } else if (scenario.script) {
            if (!('speechSynthesis' in window)) {
                statusEl.textContent = 'Audio not supported in this browser.';
                finish();
                return;
            }
            speechSynthesis.cancel(); // clear any queued/stuck utterances first
            const utterance = new SpeechSynthesisUtterance(scenario.script);
            utterance.rate = AUDIO_PLAYER_TTS_RATE;
            utterance.onend = finish;
            utterance.onerror = finish;
            speechSynthesis.speak(utterance);
        } else {
            // No audio source at all for this scenario - shouldn't happen,
            // but don't leave the student stuck waiting on a dead button.
            finish();
        }
    });

    return wrapper;
}

// Shuffles a copy of `pool` and returns the first `count` entries. Kept
// local to this file (rather than depending on js/data/question-bank*.js's
// getRandomQuestions) so these audio modules work the same whether they're
// loaded from criticall.html (practice) or criticalltest.html (graded
// test) - the two pages don't share the same set of script includes.
function pickRandomScenarios(pool, count) {
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

window.buildAudioPlayerUI = buildAudioPlayerUI;
window.pickRandomScenarios = pickRandomScenarios;
