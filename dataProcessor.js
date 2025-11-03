//load envrionment
require('dotenv').config();

//import functions
const { healthMetricsCounter } = require('./healthReader');
const { workoutCalculator } = require('./workoutReader');

const WORKOUT_FILE = './data/workouts.csv';
const HEALTH_FILE = './data/health-metrics.json';

//main functions for processing data
async function processFiles() {
    //environment variables
    const userName = process.env.USER_NAME || 'User';
    const weeklyGoal = parseInt(process.env.WEEKLY_GOAL, 10) || 0;

    //start message
    console.log(`\nProcessing data for: ${userName}`);

    let workoutData;
    let healthCount;

    //call the functions using async/await and handle errors
    try {
        console.log('\n📁 Reading workout data...');
        //waits for the workout data to be calculated
        workoutData = await workoutCalculator(WORKOUT_FILE);

        console.log('\n📁 Reading health data...');
        //waits for the health data to be counted
        healthCount = await healthMetricsCounter(HEALTH_FILE);

    } catch (error) {
        //handle errors and provide feedback
        console.error(`\nCRITICAL ERROR: Could not process all files.`);
        console.error(`Reason: ${error.message}`);
        return; //stops if a critical error occurs
    }

    //Display Summary
    console.log('\n=== SUMMARY ===');
    console.log(`Workouts found: ${workoutData.totalWorkouts}`);
    console.log(`Total workout minutes: ${workoutData.totalMinutes}`);
    console.log(`Health entries found: ${healthCount}`);
    console.log(`Weekly goal: ${weeklyGoal} minutes`);

    //Checks weekly goal and display message
    if (workoutData.totalMinutes >= weeklyGoal) {
        console.log(`\n🎉 **Congratulations ${userName}! You have exceeded your weekly goal!**`);
    } else {
        const minutesShort = weeklyGoal - workoutData.totalMinutes;
        console.log(`\n😔 **Keep going ${userName}! You are ${minutesShort} minutes short of your weekly goal.**`);
    }
}

// Execute the main program
processFiles();