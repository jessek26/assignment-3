const fs = require('fs/promises');
const path = require('path');

async function healthMetricsCounter(filePath) {
    // intialize variables 
    let fileContent;
    let data;

    try {
        // read file asyncronously 
        fileContent = await fs.readFile(filePath, 'utf8');

    } catch (error) {
        // file missing error
        if (error.code === 'ENOENT') {
            console.error(`Error: JSON file not found at ${filePath}`);
            throw new Error(`File Missing: ${path.basename(filePath)}`);
        }
        throw error;
    }
    
    try {
        // parse JSON
        data = JSON.parse(fileContent);

        // checks for an array - MODIFIED TO CHECK FOR data.metrics ARRAY
        if (typeof data !== 'object' || data === null || !Array.isArray(data.metrics)) {
            console.error('Error: JSON content is not a valid object containing a "metrics" array.');
            throw new Error('Invalid JSON: Not an array');
        }
        
        // Use the metrics array for counting
        const metricsArray = data.metrics;
        
        const count = metricsArray.length; // Count the items in the metrics array
        console.log(`Total health entries: ${count}`);
        return count;

    } catch (error) {
        // parsing error handling
        if (error instanceof SyntaxError) {
            console.error(' Error: JSON file invalid');
            throw new Error('Invalid JSON: Parsing failed');
        }
        throw error;
    }
}

module.exports = {
    healthMetricsCounter
};