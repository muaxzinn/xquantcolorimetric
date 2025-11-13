// Global variables
let samples = [];
let regressions = [];
let chart = null;
let currentBlankId = null;
let currentViewMode = 'main'; // 'main' or 'list'
let currentListMode = 'local'; // 'local' or 'server'


// DOM elements
const sampleTypeSelect = document.getElementById('sampleType');
const concentrationInput = document.getElementById('concentrationInput');
const concentrationField = document.getElementById('concentration');
const xAxisTypeSelect = document.getElementById('xAxisType');
const extinctionCoeffInput = document.getElementById('extinctionCoeff');
const useExtinctionCoeffToggle = document.getElementById('useExtinctionCoeff');
const blankReferenceSelect = document.getElementById('blankReference');
const manualInputBtn = document.getElementById('manualInputBtn');
const hexInputBtn = document.getElementById('hexInputBtn');
const imageInputBtn = document.getElementById('imageInputBtn');
const manualInputSection = document.getElementById('manualInputSection');
const hexInputSection = document.getElementById('hexInputSection');
const imageInputSection = document.getElementById('imageInputSection');
const hexColorInput = document.getElementById('hexColor');
const colorPreview = document.getElementById('colorPreview');
const imageUpload = document.getElementById('imageUpload');
const imageCanvas = document.getElementById('imageCanvas');
const imageCtx = imageCanvas.getContext('2d');
const addSampleBtn = document.getElementById('addSampleBtn');
const clearFormBtn = document.getElementById('clearFormBtn');
const sampleTableBody = document.getElementById('sampleTableBody');
const runRegressionBtn = document.getElementById('runRegressionBtn');
const topRegressionsDiv = document.getElementById('topRegressions');
const allRegressionsDiv = document.getElementById('allRegressions');
const hiddenRegressionsDiv = document.getElementById('hiddenRegressions');
const showMoreBtn = document.getElementById('showMoreBtn');
const predictionResultsDiv = document.getElementById('predictionResults');
const regressionChartCtx = document.getElementById('regressionChart').getContext('2d');
const qualityMetricsDiv = document.getElementById('qualityMetrics');

// Delete controls elements
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const adminPasswordModal = document.getElementById('adminPasswordModal');
const adminPasswordInput = document.getElementById('adminPassword');
const confirmAdminPasswordBtn = document.getElementById('confirmAdminPasswordBtn');
const cancelAdminPasswordBtn = document.getElementById('cancelAdminPasswordBtn');


// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI
    updateConcentrationInputVisibility();
    
    // Input method buttons
    manualInputBtn.addEventListener('click', () => showInputMethod('manual'));
    hexInputBtn.addEventListener('click', () => showInputMethod('hex'));
    imageInputBtn.addEventListener('click', () => showInputMethod('image'));
    
    // Sample type change
    sampleTypeSelect.addEventListener('change', updateConcentrationInputVisibility);
    
    // HEX color input
    hexColorInput.addEventListener('input', updateColorPreview);
    
    // Image upload
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Add sample button
    addSampleBtn.addEventListener('click', addSample);
    
    // Clear form button
    clearFormBtn.addEventListener('click', clearForm);
    
    // Run regression button
    runRegressionBtn.addEventListener('click', runRegressionAnalysis);
    
    // Show more regressions button
    showMoreBtn.addEventListener('click', toggleShowMoreRegressions);
    
    // Save best regression button
    document.getElementById('saveBestRegressionBtn').addEventListener('click', saveBestRegression);
    document.getElementById('loadSavedRegressionBtn').addEventListener('click', loadSavedRegression);
    
    // New save buttons
    document.getElementById('saveToLocalBtn').addEventListener('click', saveToLocal);
    document.getElementById('saveToServerBtn').addEventListener('click', saveToServer);
    document.getElementById('saveToSessionBtn').addEventListener('click', saveToSession);
    document.getElementById('viewSavedListBtn').addEventListener('click', showSavedList);
    document.getElementById('goToPredictionBtn').addEventListener('click', goToPredictionPage);
    
    // List view buttons
    document.getElementById('localModeBtn').addEventListener('click', () => switchListMode('local'));
    document.getElementById('serverModeBtn').addEventListener('click', () => switchListMode('server'));
    document.getElementById('backToMainBtn').addEventListener('click', showMainView);
    
    // Password modal buttons
    document.getElementById('confirmPasswordBtn').addEventListener('click', confirmServerPassword);
    document.getElementById('cancelPasswordBtn').addEventListener('click', hidePasswordModal);
    
    // Admin password modal buttons
    if (confirmAdminPasswordBtn) {
        confirmAdminPasswordBtn.addEventListener('click', confirmAdminPassword);
    }
    if (cancelAdminPasswordBtn) {
        cancelAdminPasswordBtn.addEventListener('click', hideAdminPasswordModal);
    }
    
    // Delete controls
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', deleteSelectedItems);
    }
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllData);
    }
    
    // Extinction coefficient toggle
    if (useExtinctionCoeffToggle) {
        useExtinctionCoeffToggle.addEventListener('change', toggleExtinctionCoeff);
    }
    
    // Blank reference selection
    blankReferenceSelect.addEventListener('change', function() {
        currentBlankId = this.value;
        updateSampleTable();
        updateQualityMetrics();
    });
    
    // Check for saved regression data on startup
    checkSavedRegression();
    
});

// Functions
function updateConcentrationInputVisibility() {
    const sampleType = sampleTypeSelect.value;
    if (sampleType === 'blank') {
        concentrationField.value = '0';
        concentrationField.disabled = true;
        concentrationInput.style.display = 'block';
    } else if (sampleType === 'unknown') {
        concentrationInput.style.display = 'none';
        concentrationField.disabled = false;
    } else {
        concentrationInput.style.display = 'block';
        concentrationField.disabled = false;
    }
}

function showInputMethod(method) {
    manualInputSection.classList.add('hidden');
    hexInputSection.classList.add('hidden');
    imageInputSection.classList.add('hidden');
    
    manualInputBtn.classList.remove('bg-blue-600', 'text-white');
    hexInputBtn.classList.remove('bg-blue-600', 'text-white');
    imageInputBtn.classList.remove('bg-blue-600', 'text-white');
    
    manualInputBtn.classList.add('bg-blue-100', 'text-blue-700');
    hexInputBtn.classList.add('bg-blue-100', 'text-blue-700');
    imageInputBtn.classList.add('bg-blue-100', 'text-blue-700');
    
    if (method === 'manual') {
        manualInputSection.classList.remove('hidden');
        manualInputBtn.classList.remove('bg-blue-100', 'text-blue-700');
        manualInputBtn.classList.add('bg-blue-600', 'text-white');
    } else if (method === 'hex') {
        hexInputSection.classList.remove('hidden');
        hexInputBtn.classList.remove('bg-blue-100', 'text-blue-700');
        hexInputBtn.classList.add('bg-blue-600', 'text-white');
    } else if (method === 'image') {
        imageInputSection.classList.remove('hidden');
        imageInputBtn.classList.remove('bg-blue-100', 'text-blue-700');
        imageInputBtn.classList.add('bg-blue-600', 'text-white');
    }
}

function updateColorPreview() {
    const hex = hexColorInput.value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        colorPreview.style.backgroundColor = hex;
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            imageCanvas.classList.remove('hidden');
            imageCanvas.width = 200;
            imageCanvas.height = 200;
            
            // Draw image maintaining aspect ratio
            const scale = Math.min(imageCanvas.width / img.width, imageCanvas.height / img.height);
            const x = (imageCanvas.width / 2) - (img.width / 2) * scale;
            const y = (imageCanvas.height / 2) - (img.height / 2) * scale;
            
            imageCtx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function getColorFromInput() {
    if (!manualInputSection.classList.contains('hidden')) {
        const r = parseInt(document.getElementById('red').value) || 0;
        const g = parseInt(document.getElementById('green').value) || 0;
        const b = parseInt(document.getElementById('blue').value) || 0;
        return { r, g, b };
    } else if (!hexInputSection.classList.contains('hidden')) {
        const hex = hexColorInput.value;
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            const r = parseInt(hex.substring(1, 3), 16);
            const g = parseInt(hex.substring(3, 5), 16);
            const b = parseInt(hex.substring(5, 7), 16);
            return { r, g, b };
        }
        return null;
    } else if (!imageInputSection.classList.contains('hidden')) {
        if (imageUpload.files.length === 0) return null;
        
        const method = document.querySelector('input[name="imageMethod"]:checked').value;
        if (method === 'average') {
            return getAverageColorFromImage();
        } else {
            return getCenterColorFromImage();
        }
    }
    return null;
}

function getAverageColorFromImage() {
    const imageData = imageCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const data = imageData.data;
    
    let r = 0, g = 0, b = 0;
    let count = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }
    
    return {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count)
    };
}

function getCenterColorFromImage() {
    const x = Math.floor(imageCanvas.width / 2);
    const y = Math.floor(imageCanvas.height / 2);
    const pixel = imageCtx.getImageData(x, y, 1, 1).data;
    
    return {
        r: pixel[0],
        g: pixel[1],
        b: pixel[2]
    };
}

function rgbToCmyk(r, g, b) {
    // Normalize RGB values
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    // Calculate K (black)
    const k = 1 - Math.max(r, g, b);
    
    // Avoid division by zero
    if (k === 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }
    
    // Calculate CMY
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);
    
    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

function calculateBeerLambertMetrics(sample, blank) {
    if (!blank || sample.type === 'blank') return null;
    
    // Avoid division by zero
    if (blank.rgb.r === 0 || blank.rgb.g === 0 || blank.rgb.b === 0) return null;
    
    // Calculate transmittance (T = I/I₀)
    const T_r = sample.rgb.r / blank.rgb.r;
    const T_g = sample.rgb.g / blank.rgb.g;
    const T_b = sample.rgb.b / blank.rgb.b;
    
    // Calculate absorbance (A = -log(T) = log(I₀/I))
    const A_r = T_r > 0 ? -Math.log10(T_r) : 0;
    const A_g = T_g > 0 ? -Math.log10(T_g) : 0;
    const A_b = T_b > 0 ? -Math.log10(T_b) : 0;
    
    return {
        transmittance: { r: T_r, g: T_g, b: T_b },
        absorbance: { r: A_r, g: A_g, b: A_b }
    };
}

function addSample() {
    const color = getColorFromInput();
    if (!color) {
        alert('Please enter valid color values');
        return;
    }
    
    const sampleType = sampleTypeSelect.value;
    let concentration = null;
    
    if (sampleType !== 'unknown') {
        concentration = parseFloat(concentrationField.value);
        if (isNaN(concentration)) {
            alert('Please enter a valid concentration value');
            return;
        }
    }
    
    // Calculate all color metrics
    const cmyk = rgbToCmyk(color.r, color.g, color.b);
    
    // Create sample object
    const sample = {
        id: Date.now(),
        type: sampleType,
        color: `rgb(${color.r}, ${color.g}, ${color.b})`,
        rgb: { r: color.r, g: color.g, b: color.b },
        concentration: concentration,
        metrics: {
            cmyk: cmyk
        }
    };
    
    samples.push(sample);
    updateSampleTable();
    updateBlankReferenceDropdown();
    updateQualityMetrics();
    clearForm();
}

function updateSampleTable() {
    sampleTableBody.innerHTML = '';
    
    const blank = samples.find(s => s.id === currentBlankId);
    
    // เรียงลำดับตัวอย่างตามเงื่อนไข
    const sortedSamples = [...samples].sort((a, b) => {
        // 1. Blank อยู่บนสุดเสมอ
        if (a.type === 'blank') return -1;
        if (b.type === 'blank') return 1;
        
        // 2. Standard เรียงตาม Concentration (น้อยไปมาก)
        if (a.type === 'standard' && b.type === 'standard') {
            return a.concentration - b.concentration;
        }
        
        // 3. Unknown อยู่ล่างสุด
        if (a.type === 'unknown') return 1;
        if (b.type === 'unknown') return -1;
        
        return 0;
    });
    
    // แสดงผลตาราง
    sortedSamples.forEach((sample, index) => {
        const row = document.createElement('tr');
        row.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        
        const beerLambert = calculateBeerLambertMetrics(sample, blank);
        let absorbanceDisplay = 'N/A';
        
        if (sample.type === 'blank') {
            absorbanceDisplay = 'Reference (I₀)';
        } else if (beerLambert && beerLambert.absorbance) {
            // Calculate average absorbance
            const avgAbsorbance = (beerLambert.absorbance.r + beerLambert.absorbance.g + beerLambert.absorbance.b) / 3;
            absorbanceDisplay = avgAbsorbance.toFixed(4);
        } else if (blank) {
            // Fallback calculation if beerLambert fails
            try {
                const T_r = sample.rgb.r / blank.rgb.r;
                const T_g = sample.rgb.g / blank.rgb.g;
                const T_b = sample.rgb.b / blank.rgb.b;
                
                const A_r = T_r > 0 ? -Math.log10(T_r) : 0;
                const A_g = T_g > 0 ? -Math.log10(T_g) : 0;
                const A_b = T_b > 0 ? -Math.log10(T_b) : 0;
                
                const avgAbsorbance = (A_r + A_g + A_b) / 3;
                absorbanceDisplay = avgAbsorbance.toFixed(4);
            } catch (error) {
                console.warn('Error calculating absorbance:', error);
                absorbanceDisplay = 'Error';
            }
        }
        
        row.innerHTML = `
            <td class="py-2 px-4 border-b">${index + 1}</td>
            <td class="py-2 px-4 border-b capitalize">${sample.type}</td>
            <td class="py-2 px-4 border-b">
                <div class="color-preview" style="background-color: ${sample.color}"></div>
            </td>
            <td class="py-2 px-4 border-b">${sample.rgb.r}, ${sample.rgb.g}, ${sample.rgb.b}</td>
            <td class="py-2 px-4 border-b">${sample.concentration !== null ? sample.concentration : 'N/A'}</td>
            <td class="py-2 px-4 border-b">${absorbanceDisplay}</td>
            <td class="py-2 px-4 border-b">
                C:${sample.metrics.cmyk.c}% M:${sample.metrics.cmyk.m}% Y:${sample.metrics.cmyk.y}% K:${sample.metrics.cmyk.k}%
            </td>
        `;
        
        // ส่วนปุ่มแก้ไข/ลบ
        const actionCell = document.createElement('td');
        actionCell.className = 'py-2 px-4 border-b flex space-x-2';
        
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>';
        editBtn.className = 'text-blue-600 hover:text-blue-800';
        editBtn.addEventListener('click', () => editSample(sample.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>';
        deleteBtn.className = 'text-red-600 hover:text-red-800';
        deleteBtn.addEventListener('click', () => confirmDeleteSample(sample.id));
        
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);
        
        sampleTableBody.appendChild(row);
    });
}

function editSample(sampleId) {
    const sample = samples.find(s => s.id === sampleId);
    if (!sample) return;
    
    // Populate form with sample data
    sampleTypeSelect.value = sample.type;
    concentrationField.value = sample.concentration || '';
    
    // Set color values based on sample
    document.getElementById('red').value = sample.rgb.r;
    document.getElementById('green').value = sample.rgb.g;
    document.getElementById('blue').value = sample.rgb.b;
    
    // Show manual input
    showInputMethod('manual');
    
    // Remove the sample being edited
    samples = samples.filter(s => s.id !== sampleId);
    updateSampleTable();
    updateBlankReferenceDropdown();
}

function confirmDeleteSample(sampleId) {
    if (confirm('Are you sure you want to delete this sample?')) {
        samples = samples.filter(s => s.id !== sampleId);
        updateSampleTable();
        updateBlankReferenceDropdown();
        updateQualityMetrics();
    }
}

function clearForm() {
    sampleTypeSelect.value = 'standard';
    concentrationField.value = '';
    document.getElementById('red').value = '';
    document.getElementById('green').value = '';
    document.getElementById('blue').value = '';
    hexColorInput.value = '';
    colorPreview.style.backgroundColor = '';
    imageUpload.value = '';
    imageCanvas.classList.add('hidden');
    showInputMethod('manual');
}

function updateBlankReferenceDropdown() {
    const blankSelect = document.getElementById('blankReference');
    if (!blankSelect) {
        console.error('Blank reference select element not found');
        return;
    }
    
    blankSelect.innerHTML = '<option value="">-- Select Blank Sample --</option>';
    
    const blankSamples = samples.filter(s => s.type === 'blank');
    console.log('Found blank samples:', blankSamples.length);
    
    blankSamples.forEach((blank, index) => {
        const option = document.createElement('option');
        option.value = blank.id;
        option.textContent = `Blank ${index + 1} (RGB: ${blank.rgb.r},${blank.rgb.g},${blank.rgb.b})`;
        blankSelect.appendChild(option);
        
        // Auto-select if only one blank exists
        if (blankSamples.length === 1) {
            option.selected = true;
            currentBlankId = blank.id;
            console.log('Auto-selected blank:', blank.id);
        }
    });
    
    // If currentBlankId is set but not in the dropdown, clear it
    if (currentBlankId && !blankSamples.find(s => s.id === currentBlankId)) {
        currentBlankId = null;
        blankSelect.value = '';
    }
    
    updateQualityMetrics();
}

function runRegressionAnalysis() {
    if (samples.filter(s => s.type === 'standard').length < 2) {
        alert('You need at least 2 standard samples to perform regression analysis');
        return;
    }
    
    if (!currentBlankId) {
        alert('Please select a blank reference sample');
        return;
    }
    
    const blank = samples.find(s => s.id === currentBlankId);
    if (!blank) return;
    
    const xAxisType = xAxisTypeSelect.value;
    regressions = [];
    
    // Get all standard samples for regression (exclude blanks and unknowns)
    const regressionSamples = samples.filter(s => s.type === 'standard');
    
    // Prepare X values based on selected type
    const xValues = regressionSamples.map(sample => {
        if (xAxisType === 'logC') {
            return Math.log10(sample.concentration);
        } else if (xAxisType === 'lnC') {
            return Math.log(sample.concentration);
        } else {
            return sample.concentration;
        }
    });
    
    // List of all possible Y metrics to test (using Beer-Lambert absorbance)
    const yMetrics = [
        { name: 'Absorbance (R)', getValue: s => calculateBeerLambertMetrics(s, blank).absorbance.r },
        { name: 'Absorbance (G)', getValue: s => calculateBeerLambertMetrics(s, blank).absorbance.g },
        { name: 'Absorbance (B)', getValue: s => calculateBeerLambertMetrics(s, blank).absorbance.b },
        { name: 'Absorbance (Avg)', getValue: s => {
            const ab = calculateBeerLambertMetrics(s, blank).absorbance;
            return (ab.r + ab.g + ab.b) / 3;
        }}
    ];
    
    // Calculate regression for each Y metric
    yMetrics.forEach(metric => {
        const yValues = regressionSamples.map(metric.getValue);
        const regression = linearRegression(xValues, yValues);
        
        regressions.push({
            name: metric.name,
            equation: regression,
            rSquared: calculateRSquared(xValues, yValues, regression),
            rmse: calculateRMSE(xValues, yValues, regression)
        });
    });
    
    // Sort regressions by R² descending and RMSE ascending
    regressions.sort((a, b) => {
        const r2Diff = b.rSquared - a.rSquared;
        if (Math.abs(r2Diff) > 0.01) return r2Diff;
        return a.rmse - b.rmse;
    });
    
    displayRegressionResults();
    predictUnknownConcentrations();
    updateRegressionChart();
    updateQualityMetrics();
}



function linearRegression(x, y) {
    const n = x.length;
    
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumXX += x[i] * x[i];
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return {
        slope: slope,
        intercept: intercept
    };
}

function calculateRSquared(xValues, yValues, regression) {
    const n = xValues.length;
    let ssTot = 0, ssRes = 0;
    
    const meanY = yValues.reduce((a, b) => a + b, 0) / n;
    
    for (let i = 0; i < n; i++) {
        const predicted = regression.slope * xValues[i] + regression.intercept;
        ssTot += Math.pow(yValues[i] - meanY, 2);
        ssRes += Math.pow(yValues[i] - predicted, 2);
    }
    
    return 1 - (ssRes / ssTot);
}

function calculateRMSE(xValues, yValues, regression) {
    let sumSquaredErrors = 0;
    const n = xValues.length;
    
    for (let i = 0; i < n; i++) {
        const predicted = regression.slope * xValues[i] + regression.intercept;
        sumSquaredErrors += Math.pow(yValues[i] - predicted, 2);
    }
    
    return Math.sqrt(sumSquaredErrors / n);
}

function displayRegressionResults() {
    topRegressionsDiv.innerHTML = '';
    allRegressionsDiv.innerHTML = '';
    
    // Display top 3 regressions
    for (let i = 0; i < Math.min(3, regressions.length); i++) {
        const regression = regressions[i];
        topRegressionsDiv.appendChild(createRegressionCard(regression, i + 1));
    }
    
    // Display all other regressions
    for (let i = 3; i < regressions.length; i++) {
        const regression = regressions[i];
        allRegressionsDiv.appendChild(createRegressionCard(regression, i + 1));
    }
    
    // Reset show more state
    hiddenRegressionsDiv.classList.remove('show-regressions');
    showMoreBtn.textContent = 'Show All Regressions';
}

function createRegressionCard(regression, rank) {
    const card = document.createElement('div');
    card.className = 'regression-card p-4 border border-gray-200 rounded-lg bg-white';
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-700">${regression.name}</h3>
            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Rank ${rank}</span>
        </div>
        <div class="mb-2">
            <span class="text-gray-600 text-sm">Equation:</span>
            <div class="font-mono text-sm">y = ${regression.equation.slope.toFixed(4)}x + ${regression.equation.intercept.toFixed(4)}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
                <span class="text-gray-600">R²:</span>
                <span class="font-semibold">${regression.rSquared.toFixed(4)}</span>
            </div>
            <div>
                <span class="text-gray-600">RMSE:</span>
                <span class="font-semibold">${regression.rmse.toFixed(4)}</span>
            </div>
        </div>
    `;
    
    return card;
}

function toggleShowMoreRegressions() {
    hiddenRegressionsDiv.classList.toggle('show-regressions');
    
    if (hiddenRegressionsDiv.classList.contains('show-regressions')) {
        showMoreBtn.textContent = 'Show Less';
    } else {
        showMoreBtn.textContent = 'Show All Regressions';
    }
}

function predictUnknownConcentrations() {
    predictionResultsDiv.innerHTML = '';
    
    const blank = samples.find(s => s.id === currentBlankId);
    const unknownSamples = samples.filter(s => s.type === 'unknown');
    if (unknownSamples.length === 0) {
        predictionResultsDiv.innerHTML = '<p class="text-gray-600">No unknown samples to predict concentrations for.</p>';
        return;
    }
    
    if (regressions.length === 0) {
        predictionResultsDiv.innerHTML = '<p class="text-gray-600">Please run regression analysis first.</p>';
        return;
    }
    
    const bestRegression = regressions[0];
    const xAxisType = xAxisTypeSelect.value;
    
    // ดึงค่า L จาก input (ค่าเริ่มต้นเป็น 1.0 cm ถ้าไม่กรอก)
    const L = parseFloat(document.getElementById('pathLengthInput').value) || 1.0;
    
    const container = document.createElement('div');
    container.className = 'space-y-4';
    
    const heading = document.createElement('h3');
    heading.className = 'text-lg font-semibold text-gray-700';
    heading.textContent = `Predictions using ${bestRegression.name} (R² = ${bestRegression.rSquared.toFixed(4)}, RMSE = ${bestRegression.rmse.toFixed(4)})`;
    container.appendChild(heading);
    
    unknownSamples.forEach((sample, index) => {
        const yValue = getYValueForRegression(sample, bestRegression.name, blank);
        const xValue = (yValue - bestRegression.equation.intercept) / bestRegression.equation.slope;
        
        let concentration;
        if (xAxisType === 'logC') {
            concentration = Math.pow(10, xValue);
        } else if (xAxisType === 'lnC') {
            concentration = Math.exp(xValue);
        } else {
            concentration = xValue;
        }
        
        // Apply extinction coefficient if provided (ใช้ L ในการคำนวณ)
        const ε = parseFloat(extinctionCoeffInput.value);
        if (!isNaN(ε) && ε !== 0) {
            concentration = yValue / (ε * L); // ปรับสูตรเป็น c = A/(ε·L)
        }
        
        const card = document.createElement('div');
        card.className = 'p-4 border border-gray-200 rounded-lg bg-white';
        
        card.innerHTML = `
            <div class="flex items-center mb-2">
                <div class="color-preview mr-3" style="background-color: ${sample.color}"></div>
                <div>
                    <h4 class="font-medium text-gray-700">Unknown Sample ${index + 1}</h4>
                    <p class="text-sm text-gray-600">RGB: ${sample.rgb.r}, ${sample.rgb.g}, ${sample.rgb.b}</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <span class="text-gray-600">Absorbance (A):</span>
                    <span class="font-medium">${yValue.toFixed(4)}</span>
                </div>
                <div>
                    <span class="text-gray-600">ε (L·mol⁻¹·cm⁻¹):</span>
                    <span class="font-medium">${ε ? ε.toFixed(2) : 'N/A'}</span>
                </div>
                <div>
                    <span class="text-gray-600">Path length (L, cm):</span>
                    <span class="font-medium">${L.toFixed(2)}</span>
                </div>
                <div>
                    <span class="text-gray-600">X value:</span>
                    <span class="font-medium">${xValue.toFixed(4)}</span>
                </div>
                <div class="col-span-2">
                    <span class="text-gray-600">Predicted concentration:</span>
                    <span class="font-bold text-blue-600">${concentration.toFixed(6)} mol/L</span>
                </div>
                ${ε ? `<div class="col-span-2 text-xs text-gray-500">
                    สมการ: c = A/(ε×L) = ${yValue.toFixed(4)}/(${ε.toFixed(2)}×${L.toFixed(2)})
                </div>` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
    
    predictionResultsDiv.appendChild(container);
}

function getYValueForRegression(sample, regressionName, blank) {
    if (!blank || sample.type === 'blank') return 0;
    
    const metrics = calculateBeerLambertMetrics(sample, blank);
    if (!metrics) return 0;
    
    switch (regressionName) {
        case 'Absorbance (R)': return metrics.absorbance.r;
        case 'Absorbance (G)': return metrics.absorbance.g;
        case 'Absorbance (B)': return metrics.absorbance.b;
        case 'Absorbance (Avg)': return (metrics.absorbance.r + metrics.absorbance.g + metrics.absorbance.b) / 3;
        default: return 0;
    }
}

function updateRegressionChart() {
    if (regressions.length === 0 || !currentBlankId) return;
    
    const blank = samples.find(s => s.id === currentBlankId);
    const bestRegression = regressions[0];
    const xAxisType = xAxisTypeSelect.value;
    
    // Get standard samples for the chart
    const chartSamples = samples.filter(s => s.type === 'standard');
    
    // Prepare data
    const xValues = chartSamples.map(sample => {
        if (xAxisType === 'logC') {
            return Math.log10(sample.concentration);
        } else if (xAxisType === 'lnC') {
            return Math.log(sample.concentration);
        } else {
            return sample.concentration;
        }
    });
    
    const yValues = chartSamples.map(sample => getYValueForRegression(sample, bestRegression.name, blank));
    
    // Calculate regression line points
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const lineX = [minX, maxX];
    const lineY = lineX.map(x => bestRegression.equation.slope * x + bestRegression.equation.intercept);
    
    // Destroy previous chart if exists
    if (chart) {
        chart.destroy();
    }
    
    // Create new chart
    chart = new Chart(regressionChartCtx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Data Points',
                    data: xValues.map((x, i) => ({x, y: yValues[i]})),
                    backgroundColor: chartSamples.map(s => s.color),
                    borderColor: '#333',
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Regression Line',
                    data: lineX.map((x, i) => ({x, y: lineY[i]})),
                    type: 'line',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: getXAxisLabel(xAxisType),
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: bestRegression.name,
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const sample = chartSamples[context.dataIndex];
                            let label = `${bestRegression.name}: ${context.parsed.y.toFixed(2)}`;
                            label += `\nConcentration: ${sample.concentration}`;
                            label += `\nRGB: ${sample.rgb.r}, ${sample.rgb.g}, ${sample.rgb.b}`;
                            return label;
                        }
                    }
                },
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Best Regression: ${bestRegression.name} (R² = ${bestRegression.rSquared.toFixed(4)}, RMSE = ${bestRegression.rmse.toFixed(4)})`,
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

function getXAxisLabel(xAxisType) {
    switch (xAxisType) {
        case 'logC': return 'log₁₀(Concentration)';
        case 'lnC': return 'ln(Concentration)';
        default: return 'Concentration';
    }
}

function updateQualityMetrics() {
    const blankCount = samples.filter(s => s.type === 'blank').length;
    const standardCount = samples.filter(s => s.type === 'standard').length;
    const unknownCount = samples.filter(s => s.type === 'unknown').length;
    
    let blankName = 'Not selected';
    if (currentBlankId) {
        const blank = samples.find(s => s.id === currentBlankId);
        if (blank) {
            blankName = `Blank ${samples.indexOf(blank) + 1}`;
        }
    }
    
    let lastAnalysis = 'Not performed';
    if (regressions.length > 0) {
        lastAnalysis = `${regressions[0].name} (R²=${regressions[0].rSquared.toFixed(3)})`;
    }
    
    qualityMetricsDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-blue-50 rounded-lg">
                <h3 class="font-semibold text-gray-700 mb-2">System Status</h3>
                <p class="text-sm text-gray-600">Blank: ${blankName}</p>
                <p class="text-sm text-gray-600">Last analysis: ${lastAnalysis}</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg">
                <h3 class="font-semibold text-gray-700 mb-2">Samples Count</h3>
                <p class="text-sm text-gray-600">Blank: ${blankCount}</p>
                <p class="text-sm text-gray-600">Standard: ${standardCount}</p>
                <p class="text-sm text-gray-600">Unknown: ${unknownCount}</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg">
                <h3 class="font-semibold text-gray-700 mb-2">Analysis Parameters</h3>
                <p class="text-sm text-gray-600">X-axis: ${getXAxisLabel(xAxisTypeSelect.value)}</p>
                <p class="text-sm text-gray-600">Extinction Coefficient: ${extinctionCoeffInput.value || 'Not specified'}</p>
            </div>
        </div>
    `;
    
    // Update best regression info
    updateBestRegressionInfo();
}

function updateBestRegressionInfo() {
    if (regressions.length > 0) {
        const bestRegression = regressions[0];
        const blank = samples.find(s => s.id === currentBlankId);
        
        document.getElementById('bestRegressionName').textContent = bestRegression.name;
        document.getElementById('bestRSquared').textContent = bestRegression.rSquared.toFixed(4);
        document.getElementById('bestRMSE').textContent = bestRegression.rmse.toFixed(4);
        document.getElementById('bestEquation').textContent = `y = ${bestRegression.equation.slope.toFixed(4)}x + ${bestRegression.equation.intercept.toFixed(4)}`;
        document.getElementById('bestBlankRef').textContent = blank ? `RGB: ${blank.rgb.r}, ${blank.rgb.g}, ${blank.rgb.b}` : 'Not selected';
        document.getElementById('bestExtinctionCoeff').textContent = extinctionCoeffInput.value || 'Not specified';
    }
}

function saveBestRegression() {
    if (regressions.length === 0) {
        alert('No regression data available to save');
        return;
    }
    
    const bestRegression = regressions[0];
    const blank = samples.find(s => s.id === currentBlankId);
    
    const regressionData = {
        timestamp: new Date().toISOString(),
        name: bestRegression.name,
        rSquared: bestRegression.rSquared,
        rmse: bestRegression.rmse,
        equation: bestRegression.equation,
        blankReference: blank ? {
            id: blank.id,
            rgb: blank.rgb,
            color: blank.color
        } : null,
        extinctionCoeff: parseFloat(extinctionCoeffInput.value) || null,
        pathLength: parseFloat(document.getElementById('pathLengthInput')?.value) || 1.0,
        xAxisType: xAxisTypeSelect.value,
        samples: samples.map(s => ({
            id: s.id,
            type: s.type,
            rgb: s.rgb,
            concentration: s.concentration
        }))
    };
    
    // Save to localStorage
    localStorage.setItem('xquant_best_regression', JSON.stringify(regressionData));
    
    // Show success message
    alert('Best regression data saved successfully!');
    console.log('Saved regression data:', regressionData);
    
    // Update saved regression display
    checkSavedRegression();
}

function loadSavedRegression() {
    const savedData = localStorage.getItem('xquant_best_regression');
    if (!savedData) {
        alert('No saved regression data found');
        return;
    }
    
    const regressionData = JSON.parse(savedData);
    displaySavedRegression(regressionData);
}

function checkSavedRegression() {
    const savedData = localStorage.getItem('xquant_best_regression');
    if (savedData) {
        const regressionData = JSON.parse(savedData);
        displaySavedRegression(regressionData);
    }
}

function displaySavedRegression(regressionData) {
    const section = document.getElementById('savedRegressionSection');
    const infoDiv = document.getElementById('savedRegressionInfo');
    
    infoDiv.innerHTML = `
        <div>
            <span class="text-gray-600">Saved Time:</span>
            <span class="font-medium">${new Date(regressionData.timestamp).toLocaleString()}</span>
        </div>
        <div>
            <span class="text-gray-600">Regression Name:</span>
            <span class="font-medium">${regressionData.name}</span>
        </div>
        <div>
            <span class="text-gray-600">R² Value:</span>
            <span class="font-medium">${regressionData.rSquared.toFixed(4)}</span>
        </div>
        <div>
            <span class="text-gray-600">RMSE:</span>
            <span class="font-medium">${regressionData.rmse.toFixed(4)}</span>
        </div>
        <div>
            <span class="text-gray-600">Equation:</span>
            <span class="font-medium">y = ${regressionData.equation.slope.toFixed(4)}x + ${regressionData.equation.intercept.toFixed(4)}</span>
        </div>
        <div>
            <span class="text-gray-600">Blank Reference:</span>
            <span class="font-medium">RGB: ${regressionData.blankReference.rgb.r}, ${regressionData.blankReference.rgb.g}, ${regressionData.blankReference.rgb.b}</span>
        </div>
        <div>
            <span class="text-gray-600">Extinction Coefficient:</span>
            <span class="font-medium">${regressionData.extinctionCoeff || 'Not specified'}</span>
        </div>
        <div>
            <span class="text-gray-600">Path Length:</span>
            <span class="font-medium">${regressionData.pathLength} cm</span>
        </div>
        <div>
            <span class="text-gray-600">X-axis Type:</span>
            <span class="font-medium">${regressionData.xAxisType}</span>
        </div>
        <div>
            <span class="text-gray-600">Samples Count:</span>
            <span class="font-medium">${regressionData.samples.length}</span>
        </div>
    `;
    
    section.style.display = 'block';
}

// ===== NEW SAVE FUNCTIONS =====

// 1. Save to Local Storage (Permanent)
function saveToLocal() {
    if (regressions.length === 0) {
        alert('No regression data available to save');
        return;
    }
    
    const regressionData = prepareRegressionData('local');
    
    // Get existing local saves
    let localSaves = JSON.parse(localStorage.getItem('xquant_local_saves') || '[]');
    
    // Add new save with unique ID
    const saveId = Date.now().toString();
    regressionData.id = saveId;
    regressionData.saveType = 'local';
    regressionData.saveTime = new Date().toISOString();
    
    localSaves.push(regressionData);
    
    // Save back to localStorage
    localStorage.setItem('xquant_local_saves', JSON.stringify(localSaves));
    
    alert('บันทึกลงเครื่องเรียบร้อยแล้ว!');
    console.log('Saved to local storage:', regressionData);
}

// 2. Save to Server (with password)
function saveToServer() {
    if (regressions.length === 0) {
        alert('No regression data available to save');
        return;
    }
    
    showPasswordModal();
}

function showPasswordModal() {
    document.getElementById('passwordModal').classList.remove('hidden');
    document.getElementById('serverPassword').focus();
}

function hidePasswordModal() {
    document.getElementById('passwordModal').classList.add('hidden');
    document.getElementById('serverPassword').value = '';
}

function confirmServerPassword() {
    const password = document.getElementById('serverPassword').value;
    
    if (!password) {
        alert('Please enter a password');
        return;
    }
    
    // Simulate server password check (replace with actual server API call)
    if (password === 'xquant2024') { // Default password - change as needed
        const regressionData = prepareRegressionData('server');
        
        // Simulate server save (replace with actual API call)
        saveToServerAPI(regressionData, password);
        hidePasswordModal();
    } else {
        alert('Invalid password. Please try again.');
    }
}

async function saveToServerAPI(regressionData, password) {
    try {
        // Simulate API call - replace with actual server endpoint
        const response = await fetch('/api/save-regression', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${password}`
            },
            body: JSON.stringify(regressionData)
        });
        
        if (response.ok) {
            alert('บันทึกลง Server เรียบร้อยแล้ว!');
            console.log('Saved to server:', regressionData);
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        // Fallback: save to localStorage as server backup
        console.log('Server unavailable, saving to local backup...');
        let serverBackup = JSON.parse(localStorage.getItem('xquant_server_backup') || '[]');
        regressionData.id = Date.now().toString();
        regressionData.saveType = 'server';
        regressionData.saveTime = new Date().toISOString();
        serverBackup.push(regressionData);
        localStorage.setItem('xquant_server_backup', JSON.stringify(serverBackup));
        
        alert('บันทึกลง Server เรียบร้อยแล้ว! (Offline mode)');
    }
}

// 3. Save to Session Storage (Temporary)
function saveToSession() {
    if (regressions.length === 0) {
        alert('No regression data available to save');
        return;
    }
    
    const regressionData = prepareRegressionData('session');
    
    // Get existing session saves
    let sessionSaves = JSON.parse(sessionStorage.getItem('xquant_session_saves') || '[]');
    
    // Add new save with unique ID
    const saveId = Date.now().toString();
    regressionData.id = saveId;
    regressionData.saveType = 'session';
    regressionData.saveTime = new Date().toISOString();
    
    sessionSaves.push(regressionData);
    
    // Save back to sessionStorage
    sessionStorage.setItem('xquant_session_saves', JSON.stringify(sessionSaves));
    
    alert('บันทึกชั่วคราวเรียบร้อยแล้ว!');
    console.log('Saved to session storage:', regressionData);
}

// Helper function to prepare regression data
function prepareRegressionData(saveType) {
    const bestRegression = regressions[0];
    const blank = samples.find(s => s.id === currentBlankId);
    
    return {
        timestamp: new Date().toISOString(),
        name: bestRegression.name,
        rSquared: bestRegression.rSquared,
        rmse: bestRegression.rmse,
        equation: bestRegression.equation,
        blankReference: blank ? {
            id: blank.id,
            rgb: blank.rgb,
            color: blank.color
        } : null,
        extinctionCoeff: parseFloat(extinctionCoeffInput.value) || null,
        pathLength: parseFloat(document.getElementById('pathLengthInput')?.value) || 1.0,
        xAxisType: xAxisTypeSelect.value,
        samples: samples.map(s => ({
            id: s.id,
            type: s.type,
            rgb: s.rgb,
            concentration: s.concentration
        })),
        saveType: saveType
    };
}

// ===== LIST VIEW FUNCTIONS =====

function showSavedList() {
    currentViewMode = 'list';
    currentListMode = 'local';
    
    // Hide main sections
    document.querySelectorAll('.section').forEach(section => {
        if (section.id !== 'savedListSection') {
            section.style.display = 'none';
        }
    });
    
    // Show list section
    document.getElementById('savedListSection').style.display = 'block';
    
    // Load local data by default
    switchListMode('local');
}

function showMainView() {
    currentViewMode = 'main';
    
    // Show all main sections
    document.querySelectorAll('.section').forEach(section => {
        if (section.id !== 'savedListSection') {
            section.style.display = 'block';
        }
    });
    
    // Hide list section
    document.getElementById('savedListSection').style.display = 'none';
}

function switchListMode(mode) {
    currentListMode = mode;
    
    // Update button styles
    document.getElementById('localModeBtn').className = mode === 'local' 
        ? 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        : 'px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300';
    
    document.getElementById('serverModeBtn').className = mode === 'server'
        ? 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        : 'px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300';
    
    // Load data based on mode
    if (mode === 'local') {
        loadLocalSaves();
    } else {
        loadServerSaves();
    }
}

function loadLocalSaves() {
    const localSaves = JSON.parse(localStorage.getItem('xquant_local_saves') || '[]');
    const sessionSaves = JSON.parse(sessionStorage.getItem('xquant_session_saves') || '[]');
    
    const allSaves = [
        ...localSaves.map(save => ({ ...save, source: 'local' })),
        ...sessionSaves.map(save => ({ ...save, source: 'session' }))
    ];
    
    displaySavedList(allSaves);
}

async function loadServerSaves() {
    try {
        // Simulate API call - replace with actual server endpoint
        const response = await fetch('/api/get-regressions');
        const serverSaves = await response.json();
        displaySavedList(serverSaves.map(save => ({ ...save, source: 'server' })));
    } catch (error) {
        // Fallback: load from local backup
        console.log('Server unavailable, loading from local backup...');
        const serverBackup = JSON.parse(localStorage.getItem('xquant_server_backup') || '[]');
        displaySavedList(serverBackup.map(save => ({ ...save, source: 'server' })));
    }
}

function displaySavedList(saves) {
    const container = document.getElementById('savedListContainer');
    
    if (saves.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p>ไม่พบข้อมูลที่บันทึกไว้</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = saves.map((save, index) => `
        <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-start space-x-3">
                    <input type="checkbox" id="item-${index}" class="mt-1" onchange="toggleItemSelection(${index})">
                    <div>
                        <h3 class="font-semibold text-gray-700">${save.name}</h3>
                        <p class="text-sm text-gray-500">บันทึกเมื่อ: ${new Date(save.timestamp).toLocaleString()}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <span class="px-2 py-1 text-xs font-medium rounded ${
                        save.source === 'local' ? 'bg-blue-100 text-blue-800' :
                        save.source === 'session' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }">
                        ${save.source === 'local' ? 'เครื่อง' : save.source === 'session' ? 'ชั่วคราว' : 'Server'}
                    </span>
                    <button onclick="loadRegressionFromList('${save.id}', '${save.source}')" 
                            class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        โหลด
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                    <span class="text-gray-600">R²:</span>
                    <span class="font-medium">${save.rSquared.toFixed(4)}</span>
                </div>
                <div>
                    <span class="text-gray-600">RMSE:</span>
                    <span class="font-medium">${save.rmse.toFixed(4)}</span>
                </div>
                <div>
                    <span class="text-gray-600">สมการ:</span>
                    <span class="font-medium">y = ${save.equation.slope.toFixed(4)}x + ${save.equation.intercept.toFixed(4)}</span>
                </div>
                <div>
                    <span class="text-gray-600">ตัวอย่าง:</span>
                    <span class="font-medium">${save.samples.length} รายการ</span>
                </div>
            </div>
        </div>
    `).join('');
}

function loadRegressionFromList(saveId, source) {
    let saveData;
    
    if (source === 'local') {
        const localSaves = JSON.parse(localStorage.getItem('xquant_local_saves') || '[]');
        saveData = localSaves.find(save => save.id === saveId);
    } else if (source === 'session') {
        const sessionSaves = JSON.parse(sessionStorage.getItem('xquant_session_saves') || '[]');
        saveData = sessionSaves.find(save => save.id === saveId);
    } else {
        const serverBackup = JSON.parse(localStorage.getItem('xquant_server_backup') || '[]');
        saveData = serverBackup.find(save => save.id === saveId);
    }
    
    if (saveData) {
        // Load the regression data
        loadRegressionData(saveData);
        
        // Return to main view
        showMainView();
        
        alert('โหลดข้อมูลเรียบร้อยแล้ว!');
    } else {
        alert('ไม่พบข้อมูลที่ต้องการ');
    }
}

function loadRegressionData(saveData) {
    // Restore samples
    samples = saveData.samples.map(sample => ({
        ...sample,
        color: `rgb(${sample.rgb.r}, ${sample.rgb.g}, ${sample.rgb.b})`,
        metrics: {
            cmyk: rgbToCmyk(sample.rgb.r, sample.rgb.g, sample.rgb.b)
        }
    }));
    
    // Restore blank reference
    currentBlankId = saveData.blankReference ? saveData.blankReference.id : null;
    
    // Restore settings
    xAxisTypeSelect.value = saveData.xAxisType;
    extinctionCoeffInput.value = saveData.extinctionCoeff || '';
    
    // Update UI
    updateSampleTable();
    updateBlankReferenceDropdown();
    
    // Recreate regression
    if (samples.filter(s => s.type === 'standard').length >= 2) {
        runRegressionAnalysis();
    }
}

// ===== PREDICTION PAGE NAVIGATION =====

function goToPredictionPage() {
    // Check if we have regression data
    if (regressions.length === 0) {
        alert('กรุณาสร้างสมการเชิงเส้นก่อนไปยังหน้า Prediction');
        return;
    }
    
    // Save current analysis settings to localStorage for prediction page
    try {
        localStorage.setItem('xquant_analysis_settings', JSON.stringify(analysisSettings));
        
        // Save current regression data for auto-loading in prediction page
        const bestRegression = regressions[0]; // Assuming first is best
        if (bestRegression) {
            const predictionData = {
                name: `Auto_${Date.now()}`,
                equation: bestRegression.equation,
                rSquared: bestRegression.rSquared,
                rmse: bestRegression.rmse,
                xAxisType: xAxisTypeSelect.value,
                blankReference: getCurrentBlankReference(),
                samples: samples,
                saveTime: new Date().toISOString(),
                autoLoaded: true
            };
            
            // Save to session storage for auto-loading
            sessionStorage.setItem('xquant_auto_prediction_data', JSON.stringify(predictionData));
        }
    } catch (error) {
        console.warn('Failed to save settings for prediction page:', error);
    }
    
    // Navigate to prediction page
    window.location.href = 'prediction.html';
}


// ===== ENHANCED REGRESSION FUNCTIONS =====

/**
 * Calculate regression with optional blank inclusion
 * @param {Array} samples - Array of sample data
 * @param {Object} options - Analysis options
 * @returns {Object} Regression results
 */
function calculateEnhancedRegression(samples, options = {}) {
    if (!Array.isArray(samples) || samples.length === 0) {
        return { error: 'No samples provided' };
    }
    
    // Use standard concentration regression
    return calculateConcentrationRegression(samples, options);
}

/**
 * Calculate regression with absorbance as Y-axis
 * @param {Array} samples - Array of sample data
 * @param {Object} options - Analysis options
 * @returns {Object} Regression results
 */
function calculateAbsorbanceRegression(samples, options = {}) {
    const dataPoints = samples.map(sample => {
        const concentration = sample.concentration || 0;
        const absorbance = sample.absorbance || calculateAbsorbanceFromSample(sample);
        return { x: concentration, y: absorbance };
    });
    
    return performLinearRegression(dataPoints);
}

/**
 * Calculate regression with concentration as Y-axis (default)
 * @param {Array} samples - Array of sample data
 * @param {Object} options - Analysis options
 * @returns {Object} Regression results
 */
function calculateConcentrationRegression(samples, options = {}) {
    const dataPoints = samples.map(sample => {
        const concentration = sample.concentration || 0;
        const absorbance = sample.absorbance || calculateAbsorbanceFromSample(sample);
        return { x: absorbance, y: concentration };
    });
    
    return performLinearRegression(dataPoints);
}

/**
 * Calculate absorbance from sample data
 * @param {Object} sample - Sample data
 * @returns {Number} Calculated absorbance
 */
function calculateAbsorbanceFromSample(sample) {
    if (sample.absorbance !== undefined) {
        return sample.absorbance;
    }
    
    if (sample.rgb) {
        return calculateAbsorbanceFromRGB(sample.rgb.r, sample.rgb.g, sample.rgb.b);
    }
    
    return 0;
}

/**
 * Calculate absorbance from RGB using Beer-Lambert law
 * @param {Number} r - Red value
 * @param {Number} g - Green value
 * @param {Number} b - Blue value
 * @returns {Number} Calculated absorbance
 */
function calculateAbsorbanceFromRGB(r, g, b) {
    const blankSample = samples.find(s => s.type === 'blank' && s.id === currentBlankId);
    if (!blankSample) return 0;
    
    const blankR = blankSample.rgb.r;
    const blankG = blankSample.rgb.g;
    const blankB = blankSample.rgb.b;
    
    // Avoid division by zero
    if (blankR === 0 || blankG === 0 || blankB === 0) return 0;
    
    // Calculate transmittance (T = I/I₀)
    const T_r = r / blankR;
    const T_g = g / blankG;
    const T_b = b / blankB;
    
    // Calculate absorbance using Beer-Lambert law (A = -log₁₀(T))
    const A_r = T_r > 0 ? -Math.log10(T_r) : 0;
    const A_g = T_g > 0 ? -Math.log10(T_g) : 0;
    const A_b = T_b > 0 ? -Math.log10(T_b) : 0;
    
    // Use average absorbance
    return (A_r + A_g + A_b) / 3;
}

/**
 * Perform linear regression on data points
 * @param {Array} dataPoints - Array of {x, y} objects
 * @returns {Object} Regression results
 */
function performLinearRegression(dataPoints) {
    if (dataPoints.length < 2) {
        return { error: 'Insufficient data points for regression' };
    }
    
    const n = dataPoints.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
    
    dataPoints.forEach(point => {
        sumX += point.x;
        sumY += point.y;
        sumXY += point.x * point.y;
        sumXX += point.x * point.x;
        sumYY += point.y * point.y;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R-squared
    const yMean = sumY / n;
    let ssRes = 0, ssTot = 0;
    
    dataPoints.forEach(point => {
        const yPred = slope * point.x + intercept;
        ssRes += Math.pow(point.y - yPred, 2);
        ssTot += Math.pow(point.y - yMean, 2);
    });
    
    const rSquared = 1 - (ssRes / ssTot);
    const rmse = Math.sqrt(ssRes / n);
    
    return {
        slope,
        intercept,
        rSquared,
        rmse,
        equation: { slope, intercept },
        dataPoints
    };
}

// ===== EXTINCTION COEFFICIENT TOGGLE =====

function toggleExtinctionCoeff() {
    if (useExtinctionCoeffToggle && extinctionCoeffInput) {
        extinctionCoeffInput.disabled = !useExtinctionCoeffToggle.checked;
        if (useExtinctionCoeffToggle.checked) {
            extinctionCoeffInput.focus();
        } else {
            extinctionCoeffInput.value = '';
        }
    }
}

// ===== DELETE CONTROLS =====

let selectedItems = new Set();

function deleteSelectedItems() {
    if (selectedItems.size === 0) {
        alert('กรุณาเลือกข้อมูลที่ต้องการลบ');
        return;
    }
    
    // Show admin password modal
    showAdminPasswordModal(() => {
        // Delete selected items
        const itemsToDelete = Array.from(selectedItems);
        let deletedCount = 0;
        
        try {
            if (currentListMode === 'local') {
                // Delete from local storage
                const localData = JSON.parse(localStorage.getItem('xquant_local_saves') || '[]');
                const filteredData = localData.filter((item, index) => !itemsToDelete.includes(index));
                localStorage.setItem('xquant_local_saves', JSON.stringify(filteredData));
                deletedCount = itemsToDelete.length;
                console.log('Deleted from local storage:', deletedCount, 'items');
            } else if (currentListMode === 'server') {
                // Delete from server (simulated)
                const serverData = JSON.parse(localStorage.getItem('xquant_server_backup') || '[]');
                const filteredData = serverData.filter((item, index) => !itemsToDelete.includes(index));
                localStorage.setItem('xquant_server_backup', JSON.stringify(filteredData));
                deletedCount = itemsToDelete.length;
                console.log('Deleted from server storage:', deletedCount, 'items');
            }
            
            // Clear selection
            selectedItems.clear();
            updateDeleteButtonState();
            
            // Refresh the list
            loadSavedData(currentListMode);
            
            alert(`ลบข้อมูลเรียบร้อยแล้ว (${deletedCount} รายการ)`);
        } catch (error) {
            console.error('Error deleting items:', error);
            alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message);
        }
    });
}

function clearAllData() {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด?')) {
        // Show admin password modal
        showAdminPasswordModal(() => {
            let clearedCount = 0;
            
            if (currentListMode === 'local') {
                const localData = JSON.parse(localStorage.getItem('xquant_local_saves') || '[]');
                clearedCount = localData.length;
                localStorage.removeItem('xquant_local_saves');
            } else if (currentListMode === 'server') {
                const serverData = JSON.parse(localStorage.getItem('xquant_server_backup') || '[]');
                clearedCount = serverData.length;
                localStorage.removeItem('xquant_server_backup');
            }
            
            // Clear selection
            selectedItems.clear();
            updateDeleteButtonState();
            
            // Refresh the list
            loadSavedData(currentListMode);
            
            alert(`ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว (${clearedCount} รายการ)`);
        });
    }
}

function showAdminPasswordModal(callback) {
    if (adminPasswordModal) {
        adminPasswordModal.classList.remove('hidden');
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
        
        // Store callback for later use
        adminPasswordModal.callback = callback;
    }
}

function hideAdminPasswordModal() {
    if (adminPasswordModal) {
        adminPasswordModal.classList.add('hidden');
        adminPasswordInput.value = '';
        adminPasswordModal.callback = null;
    }
}

function confirmAdminPassword() {
    const password = adminPasswordInput.value;
    const adminPassword = 'admin123'; // Default admin password
    
    if (password === adminPassword) {
        hideAdminPasswordModal();
        if (adminPasswordModal.callback) {
            adminPasswordModal.callback();
        }
    } else {
        alert('รหัสแอดมินไม่ถูกต้อง');
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
    }
}

function updateDeleteButtonState() {
    if (deleteSelectedBtn) {
        deleteSelectedBtn.disabled = selectedItems.size === 0;
    }
}

// ===== ITEM SELECTION =====

function toggleItemSelection(index) {
    if (selectedItems.has(index)) {
        selectedItems.delete(index);
    } else {
        selectedItems.add(index);
    }
    updateDeleteButtonState();
}

// ===== HIDE PATH LENGTH DISPLAY =====

// Override the function that displays saved regression info to hide path length
function updateSavedRegressionDisplay(saveData) {
    if (!saveData) return;
    
    const infoDiv = document.getElementById('savedRegressionInfo');
    if (infoDiv) {
        infoDiv.innerHTML = `
            <div>
                <span class="text-gray-600">Saved Time:</span>
                <span class="font-medium">${new Date(saveData.saveTime).toLocaleString('th-TH')}</span>
            </div>
            <div>
                <span class="text-gray-600">Regression Name:</span>
                <span class="font-medium">${saveData.name}</span>
            </div>
            <div>
                <span class="text-gray-600">R² Value:</span>
                <span class="font-medium">${saveData.rSquared.toFixed(4)}</span>
            </div>
            <div>
                <span class="text-gray-600">RMSE:</span>
                <span class="font-medium">${saveData.rmse.toFixed(4)}</span>
            </div>
            <div>
                <span class="text-gray-600">Equation:</span>
                <span class="font-medium">${saveData.equation}</span>
            </div>
            <div>
                <span class="text-gray-600">Blank Reference:</span>
                <span class="font-medium">RGB: ${saveData.blankReference.r}, ${saveData.blankReference.g}, ${saveData.blankReference.b}</span>
            </div>
            <div>
                <span class="text-gray-600">Extinction Coefficient:</span>
                <span class="font-medium">${saveData.extinctionCoeff || 'Not specified'}</span>
            </div>
            <div>
                <span class="text-gray-600">X-axis Type:</span>
                <span class="font-medium">${saveData.xAxisType}</span>
            </div>
            <div>
                <span class="text-gray-600">Samples Count:</span>
                <span class="font-medium">${saveData.samples ? saveData.samples.length : 0}</span>
            </div>
        `;
    }
}

// Export functions for external use
window.AnalysisSettings = {
    calculateEnhancedRegression,
    calculateAbsorbanceRegression,
    calculateConcentrationRegression,
    performLinearRegression,
    // New functions
    toggleExtinctionCoeff,
    deleteSelectedItems,
    clearAllData,
    toggleItemSelection,
    updateDeleteButtonState
};