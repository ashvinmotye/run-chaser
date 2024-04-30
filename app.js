/**
 * @author Ashvin Motye
 * @date 22 April 2024
 */

const APP_DATA = {
    TIME_RUN: 5,
    TIME_REST: 5,
    MAX_RUNS: 200,
    DIFF_RUNS: 0.125,
    MAX_MULTIPLIER: 1.5,
    TOTAL_RUNS: 0,
    ARR_RUNS: [],
    AUDIO: new Audio('whistle.wav'),
    SPEECH: null,
    VOICE: null,
    SESSION_COMPLETE: 'Good work! Session completed!',
    COMPLETE_TEXT: 'DONE!',
    ENABLE_VOICE: true,
    VOICE_PITCH: 1.8,
    VOICE_RATE: 1.2,
    RUN_DISTANCE: 0,
    INTERVAL: null,
    SHOW_TIMER: true,
    JS_CONFETTI: null,
    STREAK_OBJ: {
        host: window.location.hostname,
        startedDate: new Date(),
        lastDate: new Date(),
        currentStreakCount: 0,
        currentStreakRuns: 0,
        totalRuns: 0,
        bestStreakRuns: 0
    }
};

// METHODS
// init
const init = () => {
    initSpeech();
    initRunTotal();
    showChaseTotal();
    generateRunsArray();
    initSettingsForm();
    initRunChaseApp();
    renderStreak();
}
// END init

// toggleStreak
const toggleStreak = () => {
    document.querySelector('.streak').classList.toggle('hide');
}
// END toggleStreak

// renderStreak
const renderStreak = () => {
    const elStreaks = document.querySelectorAll('.streak .streak-number');

    const hasStreak = localStorage.getItem('runChaser') != null;

    if(!hasStreak) {
        return;
    }

    const { currentStreakCount, currentStreakRuns, bestStreakRuns, totalRuns } = JSON.parse(localStorage.getItem('runChaser'));
    const streakArray = [currentStreakCount, currentStreakRuns, bestStreakRuns, totalRuns];

    elStreaks.forEach((el, index) => {
        el.textContent = streakArray[index];
    });
}
// END renderStreak

// getDateAtMidnight
const getDateAtMidnight = (date) => {
    let _date = new Date(date);
    return new Date(
        _date.getFullYear(),
        _date.getMonth(),
        _date.getDate()
    );
}
// END getDateAtMidnight

// handleStreak
const handleStreak = () => {
    const toInitStreak = localStorage.getItem('runChaser') == null;
    let runChaserObj;

    if(toInitStreak) {
        runChaserObj = APP_DATA.STREAK_OBJ;
        runChaserObj.currentStreakRuns = APP_DATA.TOTAL_RUNS;
        runChaserObj.currentStreakCount = runChaserObj.currentStreakCount + 1;
        runChaserObj.totalRuns = APP_DATA.TOTAL_RUNS;
        runChaserObj.bestStreakRuns = APP_DATA.TOTAL_RUNS;
        runChaserObj.lastDate = getDateAtMidnight(new Date());
        runChaserObj.startedDate = getDateAtMidnight(new Date());
    } else {
        runChaserObj = JSON.parse(localStorage.getItem('runChaser'));
        console.table(runChaserObj);
        runChaserObj.totalRuns = runChaserObj.totalRuns + APP_DATA.TOTAL_RUNS;

        let dateDiff = Math.abs(getDateAtMidnight(new Date()) - getDateAtMidnight(new Date(runChaserObj.lastDate)));
        let diffDays = Math.ceil(dateDiff / (1000 * 60 * 60 * 24));

        if(diffDays == 0) {
            runChaserObj.currentStreakRuns = runChaserObj.currentStreakRuns + APP_DATA.TOTAL_RUNS;
        }
        else if(diffDays == 1) {
            runChaserObj.currentStreakCount = runChaserObj.currentStreakCount + 1;
            runChaserObj.currentStreakRuns = runChaserObj.currentStreakRuns + APP_DATA.TOTAL_RUNS;
        } else {
            runChaserObj.currentStreakCount = 0;
            runChaserObj.currentStreakRuns = APP_DATA.TOTAL_RUNS;
            runChaserObj.lastDate = getDateAtMidnight(new Date());
        }
        runChaserObj.bestStreakRuns = runChaserObj.bestStreakRuns < runChaserObj.currentStreakRuns ? runChaserObj.currentStreakRuns : runChaserObj.bestStreakRuns;
    }

    APP_DATA.STREAK_OBJ = runChaserObj;
    localStorage.setItem('runChaser', JSON.stringify(runChaserObj));
    renderStreak();
}
// END handleStreak

// celebrate
const celebrate = () => {
    if(APP_DATA.JS_CONFETTI == null) {
        APP_DATA.JS_CONFETTI = new JSConfetti();
    }

    const confetti = APP_DATA.JS_CONFETTI;
    const config = {
        confettiColors: ['#e31a81', '#f292be']
    };

    confetti.addConfetti(config);
    setTimeout(() => {
        confetti.addConfetti(config);
    }, 600);
}
// END celebrate

// handleCountdown
const handleCountdown = (timeForRun) => {
    if(APP_DATA.INTERVAL != null) {
        clearInterval(APP_DATA.INTERVAL);
    }

    const elTimer = document.querySelector('.timer span');
    elTimer.textContent = timeForRun;

    APP_DATA.INTERVAL = setInterval(() => {
        elTimer.textContent = Number(elTimer.textContent) - 1;
    }, 1000);
}
// END handleCountdown

// showTwitterShare
const showTwitterShare = () => {
    let text = `Successfully completed ${APP_DATA.TOTAL_RUNS} runs on Run Chaser!
Current streak of ${APP_DATA.STREAK_OBJ.bestStreakRuns} runs with a total of ${APP_DATA.STREAK_OBJ.totalRuns} completed so far!
`;
    let url = 'https://ashvinmotye.github.io/run-chaser/';
    let baseUrl = 'https://twitter.com/intent/tweet?';
    let tweetUrl = `${baseUrl}text=${encodeURI(text)}&hashtags=RunChaser&url=${encodeURI(url)}&original_referer=${encodeURI(url)}`;
    
    let elTweetLink = document.querySelector('.x-share');
    elTweetLink.setAttribute('href', tweetUrl);
    elTweetLink.classList.add('show');
}
// END showTwitterShare

// initLockButton
const initLockButton = () => {
    document.querySelector('#lock-screen').addEventListener('click', () => {
        setScreenWakeLock();
    });
}
// END initLockButton

// displayTotalTimeAndDistance
const displayTotalTimeAndDistance = () => {
    document.querySelector('.display-time span').textContent = Math.ceil((APP_DATA.TOTAL_RUNS * APP_DATA.TIME_RUN + (APP_DATA.ARR_RUNS.length * APP_DATA.TIME_REST)) / 60);

    let distance = APP_DATA.RUN_DISTANCE * APP_DATA.TOTAL_RUNS;
    if(distance > 0) {
        document.querySelector('.display-distance span').textContent = distance / 1000;
        document.querySelector('.display-distance').classList.remove('hidden');
    }
}
// END displayTotalTimeAndDistance

// initSettingsForm
const initSettingsForm = () => {
    const elForm = document.querySelector('#form-settings');
    const elRunsTotal = document.querySelector('#inp-runs-total');
    const elTimeRun = document.querySelector('#inp-time-run');
    const elTimeRest = document.querySelector('#inp-time-rest');
    const elEnableVoice = document.querySelector('#inp-enable-voice');
    const elDistancePerRun = document.querySelector('#inp-distance-per-run');
    const elShowTimer = document.querySelector('#inp-enable-timer');

    // Initialise values into form elements
    elRunsTotal.value = APP_DATA.TOTAL_RUNS;
    elTimeRun.value = APP_DATA.TIME_RUN;
    elTimeRest.value = APP_DATA.TIME_REST;
    elEnableVoice.checked = APP_DATA.ENABLE_VOICE;
    elShowTimer.checked = APP_DATA.SHOW_TIMER;

    // Submit form action
    elForm.addEventListener('submit', (event) => {
        event.preventDefault();

        APP_DATA.TOTAL_RUNS = Number(elRunsTotal.value);
        APP_DATA.MAX_RUNS = Number(elRunsTotal.value);
        showChaseTotal();

        APP_DATA.TIME_RUN = Number(elTimeRun.value);
        APP_DATA.TIME_REST = Number(elTimeRest.value);
        APP_DATA.ENABLE_VOICE = elEnableVoice.checked;
        APP_DATA.RUN_DISTANCE = Number(elDistancePerRun.value);
        APP_DATA.SHOW_TIMER = elShowTimer.checked;

        generateRunsArray();
        displayTotalTimeAndDistance();
    });
}
// END initSettingsForm

// initRunChaseApp
const initRunChaseApp = () => {
    document.querySelector('#start-run-chase').addEventListener('click', event => {
        handleRuns(0);
        event.target.disabled = true;
        document.querySelector('#inp-submit').disabled = true;
        setScreenWakeLock();
        document.querySelector('body').classList.add('active');
        toggleStreak();
    });
    displayTotalTimeAndDistance();
    initLockButton();
} 
// END initRunChaseApp

// whistleAndSpeak
const whistleAndSpeak = (currentRun) => {
    APP_DATA.AUDIO.play();

    setTimeout(() => {
        speak(currentRun + ' run' + (currentRun == 1 ? '' : 's'));
    }, 700);
}
// END whistleAndSpeak

// initRunTotal
const initRunTotal = () => {
    APP_DATA.TOTAL_RUNS = generateRandomNumber(APP_DATA.MAX_RUNS - (APP_DATA.MAX_RUNS * APP_DATA.DIFF_RUNS), APP_DATA.MAX_RUNS);
}
// END initRunTotal

// showChaseTotal
const showChaseTotal = () => {
    document.querySelector('.chase').innerHTML = APP_DATA.TOTAL_RUNS;
}
// END showChaseTotal

// handleRuns
const handleRuns = (index) => {
    const elCurrentRun = document.querySelector('.current-run');
    const elMyChaseTotal = document.querySelector('.my-chase');
    const elStartButton = document.querySelector('#start-run-chase');

    let currentRun = APP_DATA.ARR_RUNS[index];
    let timeForRun = (currentRun * APP_DATA.TIME_RUN) + APP_DATA.TIME_REST;
    let chaseTotal = APP_DATA.ARR_RUNS.slice(0, index).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    
    console.log(APP_DATA.ARR_RUNS);
    console.log(index, currentRun, timeForRun);

    elCurrentRun.textContent = currentRun;
    elMyChaseTotal.textContent = chaseTotal;
    elStartButton.setAttribute('style', `--width: ${(chaseTotal/APP_DATA.TOTAL_RUNS) * 100}%`);

    if(chaseTotal == Number(document.querySelector('.chase').textContent)) {
        celebrate();
        clearInterval(APP_DATA.INTERVAL);
        document.querySelector('.timer span').textContent = '';
        elCurrentRun.textContent = APP_DATA.COMPLETE_TEXT;
        speak(APP_DATA.SESSION_COMPLETE);
        handleStreak();
        showTwitterShare();
        toggleStreak();
        return;
    }
    
    whistleAndSpeak(currentRun);
    APP_DATA.SHOW_TIMER && handleCountdown(timeForRun);

    let run_timeout = setTimeout(() => {
        handleRuns(index + 1);
    }, timeForRun * 1000);
}
// END handleRuns

// generateRunsArray
const generateRunsArray = () => {
    let remaining = APP_DATA.TOTAL_RUNS;
    let total = 0;
    let array_runs = [];


    while (remaining > 0) {
        let run = generateRandomNumber(1, 6);
        array_runs.push(run);
        total += run;
        remaining = remaining - run;
    }

    if (total - APP_DATA.TOTAL_RUNS > 0) {
        array_runs[array_runs.length - 1] = array_runs[array_runs.length - 1] - (total - APP_DATA.TOTAL_RUNS);
    }

    APP_DATA.ARR_RUNS = limitRunsArray(array_runs);

    if(APP_DATA.ARR_RUNS.length == 0) {
        generateRunsArray();
    }
}
// END generateRunsArray

// limitRunsArray
const limitRunsArray = (array_runs) => {
    let max_array = [];
    let temp_array = array_runs;
    let min_length = Math.ceil(APP_DATA.TOTAL_RUNS / 6);
    let max_length = Math.ceil(APP_DATA.MAX_MULTIPLIER * min_length);

    if(temp_array.length > max_length) {
        max_array = temp_array.slice(0, max_length);
        let surplus = temp_array.slice(max_length).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        while(surplus != 0) {
            let randomIndex = generateRandomNumber(0, max_length - 1);

            if(max_array[randomIndex] != 6) {
                max_array[randomIndex] = max_array[randomIndex] + 1;
                surplus--;
            }
        }
    }

    return max_array;
}
// END limitRunsArray

// generateRandomNumber
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
// END generateRandomNumber

// speak
const speak = (text) => {
    if(!APP_DATA.ENABLE_VOICE) {
        return;
    }
    // creates the content of the speech
    // output holds the text to speak
    let output = new SpeechSynthesisUtterance(text);

    // set the voice to myVoice
    output.voice = APP_DATA.VOICE;
    output.pitch = APP_DATA.VOICE_PITCH;
    output.rate = APP_DATA.VOICE_RATE;

    // say the text
    APP_DATA.SPEECH.speak(output);
}
// END speak

// initSpeech
const initSpeech = () => {
    // create a speechSynthesis reference
    let speech = window.speechSynthesis;

    // get all voices
    let voices = speech.getVoices();

    // english voices
    let english = [];
    for (let i = 0; i < voices.length; i++) {
        let v = voices[i].voiceURI;

        // check for English language
        if (v.indexOf('English') !== -1) {
            english.push(voices[i]);
            break;
        }
    }

    // get a voice
    //taking the first one available at index 0
    APP_DATA.VOICE = english[0];

    APP_DATA.SPEECH = speech;
}
// END initSpeech

// setScreenWakeLock
const setScreenWakeLock = () => {
    let wakeLockObj = null;

    if ("keepAwake" in screen) {
        screen.keepAwake = !screen.keepAwake;
    } else if ("wakeLock" in navigator) {
        if (wakeLockObj) {
            wakeLockObj.release();
            wakeLockObj = null;
        } else {
            navigator.wakeLock
            .request("screen")
            .then((wakeLock) => {
                wakeLockObj = wakeLock;
                wakeLockObj.addEventListener("release", () => {
                    wakeLockObj = null;
                    document.querySelector('body').classList.remove('locked');
                    document.querySelector('#lock-screen').classList.add('show');
                    console.log('screen wake lock released.');
                });
                document.querySelector('body').classList.add('locked');
                document.querySelector('#lock-screen').classList.remove('show');
                console.log('screen wake locked.');
            })
            .catch((err) => {
                console.error(err);
            });
        }
    }
}
// END setScreenWakeLock

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', init);