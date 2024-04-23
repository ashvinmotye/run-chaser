/**
 * @author Ashvin Motye
 * @date 22 April 2024
 */

const APP_DATA = {
    TIME_RUN: 5,
    TIME_REST: 5,
    MAX_RUNS: 200,
    DIFF_RUNS: 0.125,
    TOTAL_RUNS: 0,
    ARR_RUNS: [],
    AUDIO: new Audio('whistle.wav')
};

// METHODS
// init
const init = () => {
    showChaseTotal();
    generateRunsArray();
    initRunChaseApp();
}
// END init

// initRunChaseApp
const initRunChaseApp = () => {
    document.querySelector('#start-run-chase').addEventListener('click', event => {
        handleRuns(0);
        event.target.disabled = true;
    });
} 
// END initRunChaseApp

// whistle
const whistle = () => {
    APP_DATA.AUDIO.play();
}
// END whistle

// showChaseTotal
const showChaseTotal = () => {
    APP_DATA.TOTAL_RUNS = generateRandomNumber(APP_DATA.MAX_RUNS - (APP_DATA.MAX_RUNS * APP_DATA.DIFF_RUNS), APP_DATA.MAX_RUNS);
    document.querySelector('.chase').innerHTML = APP_DATA.TOTAL_RUNS;
}
// END showChaseTotal

// handleRuns
const handleRuns = (index) => {
    const elCurrentRun = document.querySelector('.current-run');
    const elMyChaseTotal = document.querySelector('.my-chase');

    let currentRun = APP_DATA.ARR_RUNS[index];
    let timeForRun = (currentRun * APP_DATA.TIME_RUN) + APP_DATA.TIME_REST;
    let chaseTotal = APP_DATA.ARR_RUNS.slice(0, index).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    
    console.log(APP_DATA.ARR_RUNS);
    console.log(index, currentRun, timeForRun);

    elCurrentRun.textContent = currentRun;
    elMyChaseTotal.textContent = chaseTotal;

    if(chaseTotal == Number(document.querySelector('.chase').textContent)) {
        elCurrentRun.textContent = 'COMPLETE!';
        return;
    }
    
    whistle();

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

    APP_DATA.ARR_RUNS = array_runs;
}
// END generateRunsArray

// generateRandomNumber
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
// END generateRandomNumber

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', init);