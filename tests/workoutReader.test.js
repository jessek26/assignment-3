const { workoutCalculator } = require('../workoutReader');
const path = require('path');
const fs = require('fs');

//define paths for testing
const VALID_CSV = path.join(__dirname, '../data/workouts.csv');
const MISSING_CSV = path.join(__dirname, '../data/missing.csv');
const CORRUPTED_CSV = path.join(__dirname, '../data/corrupted.csv');

// corrupted CSV file for testing
beforeAll(() => {
    if (!fs.existsSync(path.dirname(CORRUPTED_CSV))) {
        fs.mkdirSync(path.dirname(CORRUPTED_CSV), { recursive: true });
    }
    //file with incorrect header and missing data
    fs.writeFileSync(CORRUPTED_CSV, 'day,activity,time\n2023-01-01,run,not_a_number');
});

//clean up the test file
afterAll(() => {
    fs.unlinkSync(CORRUPTED_CSV);
});

describe('workoutCalculator', () => {
    test('should return correct total workouts and minutes for a valid CSV', async () => {
        const result = await workoutCalculator(VALID_CSV);
        expect(result.totalWorkouts).toBe(10);
        expect(result.totalMinutes).toBe(330);
    });
    test('should throw a "File Missing" error if the file is missing', async () => {
        await expect(workoutCalculator(MISSING_CSV)).rejects.toThrow('File Missing: missing.csv');
    });
    test('should return correct counts even with corrupted/bad rows (if non-critical)', async () => {
        const result = await workoutCalculator(CORRUPTED_CSV);
        expect(result.totalWorkouts).toBe(1); 
        expect(result.totalMinutes).toBe(0); 
    });
});