// Data Handler for managing experiment data storage
// Handles loading, saving, and adding experiments to data.json

/**
 * Load data from data.json file
 * @returns {Promise<Object>} The loaded data object
 */
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        // Return default structure if file doesn't exist or can't be loaded
        return { experiments: [] };
    }
}

/**
 * Save data to data.json file
 * @param {Object} data - The data object to save
 * @returns {Promise<boolean>} Success status
 */
async function saveData(data) {
    try {
        const response = await fetch('data.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data, null, 2)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        // Fallback: try to save to localStorage as backup
        try {
            localStorage.setItem('xquant_data_backup', JSON.stringify(data));
            console.log('Data saved to localStorage as backup');
            return true;
        } catch (localError) {
            console.error('Error saving to localStorage:', localError);
            return false;
        }
    }
}

/**
 * Add a new experiment to the data
 * @param {Object} experimentData - The experiment data to add
 * @returns {Promise<boolean>} Success status
 */
async function addExperiment(experimentData) {
    try {
        // Load existing data
        const data = await loadData();
        
        // Create new experiment object with all required fields
        const newExperiment = {
            id: experimentData.id || Date.now().toString(),
            timestamp: experimentData.timestamp || new Date().toISOString(),
            name: experimentData.name || `Experiment_${Date.now()}`,
            rSquared: experimentData.rSquared || 0,
            rmse: experimentData.rmse || 0,
            equation: experimentData.equation || '',
            blankReference: experimentData.blankReference || { r: 255, g: 255, b: 255 },
            extinctionCoeff: experimentData.extinctionCoeff || 0,
            pathLength: experimentData.pathLength || 1,
            xAxisType: experimentData.xAxisType || 'concentration',
            samples: experimentData.samples || [],
            saveType: experimentData.saveType || 'local',
            saveTime: experimentData.saveTime || new Date().toISOString(),
            backgroundColor: experimentData.backgroundColor || '#ffffff',
            linearEquation: experimentData.linearEquation || {
                slope: 0,
                intercept: 0
            }
        };
        
        // Add to experiments array
        data.experiments.push(newExperiment);
        
        // Save updated data
        const success = await saveData(data);
        
        if (success) {
            console.log('Experiment added successfully:', newExperiment);
        }
        
        return success;
    } catch (error) {
        console.error('Error adding experiment:', error);
        return false;
    }
}

/**
 * Get experiment by ID
 * @param {string} id - The experiment ID
 * @returns {Promise<Object|null>} The experiment object or null if not found
 */
async function getExperimentById(id) {
    try {
        const data = await loadData();
        return data.experiments.find(exp => exp.id === id) || null;
    } catch (error) {
        console.error('Error getting experiment by ID:', error);
        return null;
    }
}

/**
 * Update an existing experiment
 * @param {string} id - The experiment ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<boolean>} Success status
 */
async function updateExperiment(id, updateData) {
    try {
        const data = await loadData();
        const experimentIndex = data.experiments.findIndex(exp => exp.id === id);
        
        if (experimentIndex === -1) {
            console.error('Experiment not found:', id);
            return false;
        }
        
        // Update the experiment
        data.experiments[experimentIndex] = {
            ...data.experiments[experimentIndex],
            ...updateData,
            timestamp: new Date().toISOString() // Update timestamp
        };
        
        return await saveData(data);
    } catch (error) {
        console.error('Error updating experiment:', error);
        return false;
    }
}

/**
 * Delete an experiment
 * @param {string} id - The experiment ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteExperiment(id) {
    try {
        const data = await loadData();
        const experimentIndex = data.experiments.findIndex(exp => exp.id === id);
        
        if (experimentIndex === -1) {
            console.error('Experiment not found:', id);
            return false;
        }
        
        // Remove the experiment
        data.experiments.splice(experimentIndex, 1);
        
        return await saveData(data);
    } catch (error) {
        console.error('Error deleting experiment:', error);
        return false;
    }
}

/**
 * Get all experiments
 * @returns {Promise<Array>} Array of all experiments
 */
async function getAllExperiments() {
    try {
        const data = await loadData();
        return data.experiments || [];
    } catch (error) {
        console.error('Error getting all experiments:', error);
        return [];
    }
}

// Export functions for use in other modules
window.DataHandler = {
    loadData,
    saveData,
    addExperiment,
    getExperimentById,
    updateExperiment,
    deleteExperiment,
    getAllExperiments
};
