/**
 * @author Ashvin Motye
 * @date 22 April 2024
 */

// METHODS
// init
const init = () => {
    // console.log('init');

    const TIME_RUN = 5;
    const TIME_REST = 5;
    const MAX_RUNS = 200;
    const DIFF_RUNS = 25;
    const TOTAL_RUNS = generateRandomNumber(MAX_RUNS - DIFF_RUNS, MAX_RUNS);
    // console.log(TOTAL_RUNS);
    showChaseTotal(TOTAL_RUNS);

    const ARR_RUNS = generateRunsArray(TOTAL_RUNS);
    // ARR_RUNS = [1, 2, 1];
    // console.log(ARR_RUNS);
    // console.log('total time', (TOTAL_RUNS * TIME_RUN + (ARR_RUNS.length * TIME_REST)));
    // console.log('total time', (TOTAL_RUNS * TIME_RUN + (ARR_RUNS.length * TIME_REST)) / 60);
    // console.log('total time', (4 * TIME_RUN + (ARR_RUNS.length * TIME_REST)));

    startRunChase(ARR_RUNS, TIME_RUN, TIME_REST);
}
// END init

//
const startRunChase = (array_runs, time_run, time_rest) => {
    document.querySelector('#start-run-chase').addEventListener('click', event => {
        handleRuns(array_runs, time_run, time_rest, 0);
        event.target.disabled = true;
    });
} 
//

// whistle
const whistle = () => {
    var audio = new Audio('whistle.wav');
    audio.play();
}
// END whistle

// showChaseTotal
const showChaseTotal = (total_runs) => {
    document.querySelector('.chase').innerHTML = total_runs;
}
// END showChaseTotal

// handleRuns
const handleRuns = (array_runs, time_run, time_rest, index) => {
    const elCurrentRun = document.querySelector('.current-run');
    const elMyChaseTotal = document.querySelector('.my-chase');

    let currentRun = array_runs[index];
    let timeForRun = (currentRun * time_run) + time_rest;
    let chaseTotal = array_runs.slice(0, index).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    
    elCurrentRun.textContent = currentRun;
    elMyChaseTotal.textContent = chaseTotal;
    
    whistle();

    let run_timeout = setTimeout(() => {
        handleRuns(array_runs, time_run, time_rest, index + 1);
        clearTimeout(run_timeout);
    }, timeForRun * 1000);
}
// END handleRuns

// generateRunsArray
const generateRunsArray = (runs) => {
    let remaining = runs;
    let total = 0;
    let array_runs = [];


    while (remaining > 0) {
        let run = generateRandomNumber(1, 6);
        array_runs.push(run);
        total += run;
        remaining = remaining - run;
    }

    if (total - runs > 0) {
        array_runs[array_runs.length - 1] = array_runs[array_runs.length - 1] - (total - runs);
    }

    // let sum = array_runs.reduce((accumulator, currentValue) => {
    //     return accumulator + currentValue
    // },0);
    // console.log(total, sum);

    return array_runs;
}
// END generateRunsArray

// generateRandomNumber
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
// END generateRandomNumber

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', init);