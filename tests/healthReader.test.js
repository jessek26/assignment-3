const { healthMetricsCounter } = require('../healthReader');
const path = require('path');
const fs = require('fs');

//define paths for testing
const VALID_JSON = path.join(__dirname, '../data/health-metrics.json');
const MISSING_JSON = path.join(__dirname, '../data/missing.json');
const INVALID_JSON = path.join(__dirname, '../data/invalid-health.json');
const EMPTY_JSON = path.join(__dirname, '../data/empty-health.json');

//creates an invalid JSON file for testing
beforeAll(() => {
    if (!fs.existsSync(path.dirname(INVALID_JSON))) {
        fs.mkdirSync(path.dirname(INVALID_JSON), { recursive: true });
    }
    //syntax error file 
    fs.writeFileSync(INVALID_JSON, '[{"steps": 123, ]');
    //valid JSON file but not an array
    fs.writeFileSync(EMPTY_JSON, '{"not_an_array": "data"}');
});

//cleans up the test files
afterAll(() => {
    fs.unlinkSync(INVALID_JSON);
    fs.unlinkSync(EMPTY_JSON);
});


describe('healthMetricsCounter', () => {
    test('should return the correct count for a valid JSON file', async () => {
        const count = await healthMetricsCounter(VALID_JSON);
        expect(count).toBe(8);
    });
    test('should throw a "File Missing" error if the file is missing', async () => {
        await expect(healthMetricsCounter(MISSING_JSON)).rejects.toThrow('File Missing: missing.json');
    });
    test('should throw an "Invalid JSON: Parsing failed" error for corrupted JSON', async () => {
        await expect(healthMetricsCounter(INVALID_JSON)).rejects.toThrow('Invalid JSON: Parsing failed');
    });
    test('should throw an "Invalid JSON: Not an array" error for non-array JSON', async () => {
        await expect(healthMetricsCounter(EMPTY_JSON)).rejects.toThrow('Invalid JSON: Not an array');
    });
});