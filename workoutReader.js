const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

function workoutCalculator(filePath) {
    return new Promise((resolve, reject) => {
        //initiate variables 
        let totalWorkouts = 0;
        let totalMinutes = 0;

        const readStream = fs.createReadStream(filePath);

        //handle system errors 
        readStream.on('error', (error) => {
            if (error.code === 'ENOENT') {
                const errorMessage = `Error: CSV file not found at ${filePath}`;
                console.error(errorMessage);
                return reject(new Error(`File Missing: ${path.basename(filePath)}`));
            }
            return reject(error);
        });

        //pipe stream through csv-parser
        readStream
            .pipe(csv())
            .on('data', (row) => {
                // 5. Process each row
                totalWorkouts++;
                const minutes = parseInt(row.duration, 10);
                if (!isNaN(minutes)) {
                    totalMinutes += minutes;
                }
                
            })
            .on('end', () => {
                //resolve promise with final counts
                console.log(`Total workouts: ${totalWorkouts}`);
                console.log(`Total minutes: ${totalMinutes}`);
                resolve({ totalWorkouts, totalMinutes });
            })
            .on('error', (err) => {
                //Handle stream/parser errors 
                const errorMessage = `Error: CSV file is corrupted or invalid: ${err.message}`;
                console.error(errorMessage);
                reject(new Error(`Corrupted CSV: ${path.basename(filePath)}`));
            });
    });
}

module.exports = {
    workoutCalculator
};