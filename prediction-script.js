// Prediction System JavaScript

// Global variables
let currentMode = null; // 'realTime' or 'normal'
let currentData = null; // Loaded regression data
let measurementInterval = null; // For real-time measurements
let isMeasuring = false; // Real-time measurement state

// Blank reference settings (ตามโครงสร้างของ index.html)
let blankReference = {
    r: 255,
    g: 255,
    b: 255
};
let xAxisType = 'C'; // C, logC, lnC

// Analysis settings with toggle options
let analysisSettings = {
    includeBlankInFitting: false, // เปิด/ปิดการรวม Blank ในการฟิต
    includeBlankInRegression: false, // เปิด/ปิดการรวม Blank ในการคำนวณสมการถดถอย (ไม่แนะนำ)
    includeAbsorbanceAsY: false, // เปิด/ปิดการรวม Absorbance เป็นตัวเลือก Y
    includeAbsorbanceAsDependent: false // เปิด/ปิดการรวม Absorbance เป็นตัวแปรตามในการวิเคราะห์
};

// DOM elements
const realTimeModeBtn = document.getElementById('realTimeModeBtn');
const normalModeBtn = document.getElementById('normalModeBtn');
const loadLocalBtn = document.getElementById('loadLocalBtn');
const loadServerBtn = document.getElementById('loadServerBtn');
const loadSessionBtn = document.getElementById('loadSessionBtn');
const savedDataList = document.getElementById('savedDataList');
const savedDataContainer = document.getElementById('savedDataContainer');
const realTimeSection = document.getElementById('realTimeSection');
const normalSection = document.getElementById('normalSection');
const equationDisplay = document.getElementById('equationDisplay');

// Blank reference elements
const manualInputBtn = document.getElementById('manualInputBtn');
const hexInputBtn = document.getElementById('hexInputBtn');
const imageInputBtn = document.getElementById('imageInputBtn');
const manualInputSection = document.getElementById('manualInputSection');
const hexInputSection = document.getElementById('hexInputSection');
const imageInputSection = document.getElementById('imageInputSection');
const blankR = document.getElementById('blankR');
const blankG = document.getElementById('blankG');
const blankB = document.getElementById('blankB');
const blankColorPreview = document.getElementById('blankColorPreview');
const blankHexColor = document.getElementById('blankHexColor');
const blankHexColorPreview = document.getElementById('blankHexColorPreview');
const blankImageUpload = document.getElementById('blankImageUpload');
const blankImageCanvas = document.getElementById('blankImageCanvas');
const clearBlankBtn = document.getElementById('clearBlankBtn');
const addBlankBtn = document.getElementById('addBlankBtn');
const xAxisTypeSelect = document.getElementById('xAxisType');
const setBlankBtn = document.getElementById('setBlankBtn');

// Real-time elements
const targetConcentration = document.getElementById('targetConcentration');
const tolerance = document.getElementById('tolerance');
const currentAbsorbance = document.getElementById('currentAbsorbance');
const currentConcentration = document.getElementById('currentConcentration');
const currentTransmittance = document.getElementById('currentTransmittance');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const statusSubtext = document.getElementById('statusSubtext');
const startMeasurementBtn = document.getElementById('startMeasurementBtn');
const stopMeasurementBtn = document.getElementById('stopMeasurementBtn');
const resetRealTimeBtn = document.getElementById('resetRealTimeBtn');

// Normal prediction elements
const absorbanceInputBtn = document.getElementById('absorbanceInputBtn');
const rgbInputBtn = document.getElementById('rgbInputBtn');
const absorbanceInput = document.getElementById('absorbanceInput');
const rgbInput = document.getElementById('rgbInput');
const absorbanceValue = document.getElementById('absorbanceValue');
const rgbR = document.getElementById('rgbR');
const rgbG = document.getElementById('rgbG');
const rgbB = document.getElementById('rgbB');
const colorPreview = document.getElementById('colorPreview');
const predictFromAbsorbanceBtn = document.getElementById('predictFromAbsorbanceBtn');
const predictFromRGBBtn = document.getElementById('predictFromRGBBtn');
const predictionResult = document.getElementById('predictionResult');
const predictedConcentration = document.getElementById('predictedConcentration');
const calculatedAbsorbance = document.getElementById('calculatedAbsorbance');
const calculatedTransmittance = document.getElementById('calculatedTransmittance');
const predictionAccuracy = document.getElementById('predictionAccuracy');

// Equation display elements
const currentEquation = document.getElementById('currentEquation');
const currentRSquared = document.getElementById('currentRSquared');
const currentRMSE = document.getElementById('currentRMSE');

// Note: Analysis settings moved to index.html

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateStatusIndicator('waiting', 'รอการวัด', 'กรุณาเริ่มการวัด');
    updateBlankColorPreview();
    
    // Check for auto-loaded data from index page
    checkAutoLoadedData();
});

function initializeEventListeners() {
    // Blank reference controls
    manualInputBtn.addEventListener('click', () => switchBlankInputMethod('manual'));
    hexInputBtn.addEventListener('click', () => switchBlankInputMethod('hex'));
    imageInputBtn.addEventListener('click', () => switchBlankInputMethod('image'));
    
    blankR.addEventListener('input', updateBlankColorPreview);
    blankG.addEventListener('input', updateBlankColorPreview);
    blankB.addEventListener('input', updateBlankColorPreview);
    blankHexColor.addEventListener('input', updateBlankHexColorPreview);
    blankImageUpload.addEventListener('change', handleBlankImageUpload);
    
    clearBlankBtn.addEventListener('click', clearBlankInputs);
    addBlankBtn.addEventListener('click', addBlankReference);
    setBlankBtn.addEventListener('click', setBlankReference);
    blankHexColor.addEventListener('input', updateBlankHexColorPreview);
    blankImageUpload.addEventListener('change', handleBlankImageUpload);
    
    clearBlankBtn.addEventListener('click', clearBlankInputs);
    addBlankBtn.addEventListener('click', addBlankReference);
    setBlankBtn.addEventListener('click', setBlankReference);
    
    // Mode selection
    realTimeModeBtn.addEventListener('click', () => switchMode('realTime'));
    normalModeBtn.addEventListener('click', () => switchMode('normal'));
    
    // Load data buttons
    loadLocalBtn.addEventListener('click', () => loadSavedData('local'));
    loadServerBtn.addEventListener('click', () => loadSavedData('server'));
    loadSessionBtn.addEventListener('click', () => loadSavedData('session'));
    
    // Real-time controls
    startMeasurementBtn.addEventListener('click', startRealTimeMeasurement);
    stopMeasurementBtn.addEventListener('click', stopRealTimeMeasurement);
    resetRealTimeBtn.addEventListener('click', resetRealTime);
    
    // New camera and example controls
    const runExampleBtn = document.getElementById('runExampleBtn');
    if (runExampleBtn) {
        runExampleBtn.addEventListener('click', () => runExample(null)); // Pass null as model for now
    }
    
    // Normal prediction controls
    absorbanceInputBtn.addEventListener('click', () => switchInputMethod('absorbance'));
    rgbInputBtn.addEventListener('click', () => switchInputMethod('rgb'));
    predictFromAbsorbanceBtn.addEventListener('click', predictFromAbsorbance);
    predictFromRGBBtn.addEventListener('click', predictFromRGB);
    
    // RGB input preview
    rgbR.addEventListener('input', updateColorPreview);
    rgbG.addEventListener('input', updateColorPreview);
    rgbB.addEventListener('input', updateColorPreview);
    
    // Note: Analysis settings moved to index.html
}

// ===== AUTO-LOAD DATA FROM INDEX PAGE =====

function checkAutoLoadedData() {
    try {
        // Check for auto-loaded data from session storage
        const autoData = sessionStorage.getItem('xquant_auto_prediction_data');
        if (autoData) {
            const data = JSON.parse(autoData);
            console.log('Auto-loading data from index page:', data);
            
            // Load the regression data automatically
            loadRegressionData(data);
            
            // Set blank reference automatically
            if (data.blankReference) {
                blankReference = data.blankReference;
                updateBlankColorPreview();
                
                // Update blank reference inputs
                if (blankR && blankG && blankB) {
                    blankR.value = data.blankReference.r || 255;
                    blankG.value = data.blankReference.g || 255;
                    blankB.value = data.blankReference.b || 255;
                }
            }
            
            // Set x-axis type
            if (data.xAxisType) {
                xAxisType = data.xAxisType;
                if (xAxisTypeSelect) {
                    xAxisTypeSelect.value = data.xAxisType;
                }
            }
            
            // Show success message
            alert(`โหลดโมเดลอัตโนมัติจากหน้า Index เรียบร้อยแล้ว!\nสมการ: ${data.equation}\nR² = ${data.rSquared.toFixed(4)}`);
            
            // Clear the auto-loaded data from session storage
            sessionStorage.removeItem('xquant_auto_prediction_data');
            
            return true;
        }
    } catch (error) {
        console.warn('Failed to auto-load data:', error);
    }
    
    return false;
}

// Note: Analysis settings management moved to index.html

// ===== BLANK REFERENCE MANAGEMENT =====

function switchBlankInputMethod(method) {
    // Update button states
    manualInputBtn.className = method === 'manual' ? 'px-3 py-1 bg-blue-600 text-white rounded-md' : 'px-3 py-1 bg-blue-100 text-blue-700 rounded-md border border-blue-200';
    hexInputBtn.className = method === 'hex' ? 'px-3 py-1 bg-blue-600 text-white rounded-md' : 'px-3 py-1 bg-blue-100 text-blue-700 rounded-md border border-blue-200';
    imageInputBtn.className = method === 'image' ? 'px-3 py-1 bg-blue-600 text-white rounded-md' : 'px-3 py-1 bg-blue-100 text-blue-700 rounded-md border border-blue-200';
    
    // Show/hide sections
    manualInputSection.classList.toggle('hidden', method !== 'manual');
    hexInputSection.classList.toggle('hidden', method !== 'hex');
    imageInputSection.classList.toggle('hidden', method !== 'image');
}

function updateBlankColorPreview() {
    const r = parseInt(blankR.value) || 255;
    const g = parseInt(blankG.value) || 255;
    const b = parseInt(blankB.value) || 255;
    
    blankColorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function updateBlankHexColorPreview() {
    const hexColor = blankHexColor.value;
    if (hexColor.match(/^#[0-9A-Fa-f]{6}$/)) {
        blankHexColorPreview.style.backgroundColor = hexColor;
        
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        blankR.value = r;
        blankG.value = g;
        blankB.value = b;
        updateBlankColorPreview();
    }
}

function handleBlankImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = blankImageCanvas;
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Get average color from center
                const centerX = Math.floor(canvas.width / 2);
                const centerY = Math.floor(canvas.height / 2);
                const imageData = ctx.getImageData(centerX - 10, centerY - 10, 20, 20);
                
                let r = 0, g = 0, b = 0;
                for (let i = 0; i < imageData.data.length; i += 4) {
                    r += imageData.data[i];
                    g += imageData.data[i + 1];
                    b += imageData.data[i + 2];
                }
                r = Math.round(r / (imageData.data.length / 4));
                g = Math.round(g / (imageData.data.length / 4));
                b = Math.round(b / (imageData.data.length / 4));
                
                blankR.value = r;
                blankG.value = g;
                blankB.value = b;
                updateBlankColorPreview();
                blankImageCanvas.classList.remove('hidden');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function clearBlankInputs() {
    blankR.value = '';
    blankG.value = '';
    blankB.value = '';
    blankHexColor.value = '';
    blankImageUpload.value = '';
    blankColorPreview.style.backgroundColor = '#ffffff';
    blankHexColorPreview.style.backgroundColor = '#ffffff';
    blankImageCanvas.classList.add('hidden');
}

function addBlankReference() {
    const r = parseInt(blankR.value) || 255;
    const g = parseInt(blankG.value) || 255;
    const b = parseInt(blankB.value) || 255;
    
    blankReference = { r, g, b };
    console.log('Blank reference added:', blankReference);
    alert('เพิ่ม Blank Reference เรียบร้อยแล้ว!');
}

function setBlankReference() {
    xAxisType = xAxisTypeSelect.value;
    
    console.log('Blank reference set:', {
        blankReference,
        xAxisType
    });
    
    alert('ตั้งค่า Blank Reference เรียบร้อยแล้ว!');
}

// ===== MODE MANAGEMENT =====

function switchMode(mode) {
    currentMode = mode;
    
    // Update button states
    realTimeModeBtn.classList.toggle('active', mode === 'realTime');
    normalModeBtn.classList.toggle('active', mode === 'normal');
    
    // Show/hide sections
    realTimeSection.classList.toggle('hidden', mode !== 'realTime');
    normalSection.classList.toggle('hidden', mode !== 'normal');
    
    // Stop any ongoing measurements
    if (isMeasuring) {
        stopRealTimeMeasurement();
    }
    
    // Reset displays
    if (mode === 'realTime') {
        resetRealTime();
    } else {
        resetNormalPrediction();
    }
}

// ===== DATA LOADING =====

function loadSavedData(type) {
    let data = [];
    
    try {
        switch (type) {
            case 'local':
                data = JSON.parse(localStorage.getItem('xquant_local_saves') || '[]');
                break;
            case 'server':
                // Try server first, fallback to backup
                data = JSON.parse(localStorage.getItem('xquant_server_backup') || '[]');
                break;
            case 'session':
                data = JSON.parse(sessionStorage.getItem('xquant_session_saves') || '[]');
                break;
        }
        
        if (data.length === 0) {
            alert(`ไม่พบข้อมูลที่บันทึกไว้ใน ${type === 'local' ? 'เครื่อง' : type === 'server' ? 'Server' : 'Session'}`);
            return;
        }
        
        displaySavedDataList(data, type);
        
    } catch (error) {
        console.error('Error loading saved data:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
}

function displaySavedDataList(data, type) {
    savedDataContainer.innerHTML = '';
    
    if (!Array.isArray(data) || data.length === 0) {
        savedDataContainer.innerHTML = '<div class="text-center text-gray-500 py-4">ไม่พบข้อมูลที่บันทึกไว้</div>';
        savedDataList.classList.remove('hidden');
        return;
    }
    
    data.forEach((item, index) => {
        const dataItem = document.createElement('div');
        dataItem.className = 'saved-data-item';
        
        // Safe equation display
        let equationText = 'y = mx + b';
        if (typeof item.equation === 'object' && item.equation !== null) {
            const eq = item.equation;
            if (eq.slope !== undefined && eq.intercept !== undefined) {
                const sign = eq.intercept >= 0 ? '+' : '';
                equationText = `y = ${eq.slope.toFixed(4)}x ${sign}${eq.intercept.toFixed(4)}`;
            }
        } else if (typeof item.equation === 'string') {
            equationText = item.equation;
        }
        
        dataItem.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <div class="font-medium text-gray-800">${item.name || 'Unknown'}</div>
                    <div class="text-sm text-gray-600">${equationText}</div>
                    <div class="text-xs text-gray-500">R² = ${(item.rSquared || 0).toFixed(4)}, RMSE = ${(item.rmse || 0).toFixed(4)}</div>
                </div>
                <div class="text-xs text-gray-500">
                    ${item.saveTime ? new Date(item.saveTime).toLocaleString('th-TH') : 'Unknown'}
                </div>
            </div>
        `;
        
        dataItem.addEventListener('click', () => loadRegressionData(item));
        savedDataContainer.appendChild(dataItem);
    });
    
    savedDataList.classList.remove('hidden');
}

function loadRegressionData(data) {
    currentData = data;
    
    // Update equation display - แก้ไขปัญหา [object Object]
    if (typeof data.equation === 'object' && data.equation !== null) {
        // ถ้า equation เป็น object ให้แสดง slope และ intercept
        const eq = data.equation;
        if (eq.slope !== undefined && eq.intercept !== undefined) {
            const sign = eq.intercept >= 0 ? '+' : '';
            currentEquation.textContent = `y = ${eq.slope.toFixed(4)}x ${sign}${eq.intercept.toFixed(4)}`;
        } else {
            currentEquation.textContent = 'y = mx + b';
        }
    } else if (typeof data.equation === 'string') {
        // ถ้า equation เป็น string ให้แสดงตามปกติ
        currentEquation.textContent = data.equation || 'y = mx + b';
    } else {
        // Fallback
        currentEquation.textContent = 'y = mx + b';
    }
    
    // Update statistics with error handling
    currentRSquared.textContent = (data.rSquared || 0).toFixed(4);
    currentRMSE.textContent = (data.rmse || 0).toFixed(4);
    equationDisplay.classList.remove('hidden');
    
    // Hide data list
    savedDataList.classList.add('hidden');
    
    // Show success message
    alert(`โหลดข้อมูล "${data.name || 'Unknown'}" เรียบร้อยแล้ว!`);
    
    console.log('Loaded regression data:', data);
}

// ===== REAL-TIME ANALYSIS =====

function startRealTimeMeasurement() {
    if (!currentData) {
        alert('กรุณาโหลดข้อมูลสมการก่อนเริ่มการวัด');
        return;
    }
    
    const target = parseFloat(targetConcentration.value);
    if (isNaN(target) || target < 0) {
        alert('กรุณาป้อนความเข้มข้นเป้าหมายที่ถูกต้อง');
        return;
    }
    
    isMeasuring = true;
    startMeasurementBtn.classList.add('hidden');
    stopMeasurementBtn.classList.remove('hidden');
    
    updateStatusIndicator('measuring', 'กำลังวัด...', 'รอผลการวัด');
    
    // Start measurement interval (simulate real-time data)
    measurementInterval = setInterval(() => {
        simulateMeasurement(target);
    }, 1000); // Update every second
}

function stopRealTimeMeasurement() {
    isMeasuring = false;
    clearInterval(measurementInterval);
    measurementInterval = null;
    
    startMeasurementBtn.classList.remove('hidden');
    stopMeasurementBtn.classList.add('hidden');
    
    updateStatusIndicator('waiting', 'หยุดการวัด', 'กดเริ่มใหม่เพื่อวัดต่อ');
}

function resetRealTime() {
    stopRealTimeMeasurement();
    
    currentAbsorbance.textContent = '0.000';
    currentConcentration.textContent = '0.000';
    currentTransmittance.textContent = '0.000';
    targetConcentration.value = '';
    tolerance.value = '0.5';
    
    updateStatusIndicator('waiting', 'รอการวัด', 'กรุณาเริ่มการวัด');
}

function simulateMeasurement(target) {
    // Simulate absorbance measurement (random walk towards target)
    const currentAbs = parseFloat(currentAbsorbance.textContent);
    const targetAbs = concentrationToAbsorbance(target);
    
    // Random walk towards target
    const step = (targetAbs - currentAbs) * 0.1 + (Math.random() - 0.5) * 0.02;
    const newAbs = Math.max(0, currentAbs + step);
    
    // Calculate concentration from absorbance
    const newConc = absorbanceToConcentration(newAbs);
    
    // Calculate transmittance
    const transmittance = Math.pow(10, -newAbs);
    
    // Update displays
    currentAbsorbance.textContent = newAbs.toFixed(3);
    currentConcentration.textContent = newConc.toFixed(3);
    currentTransmittance.textContent = transmittance.toFixed(3);
    
    // Check if within tolerance
    const tol = parseFloat(tolerance.value);
    const isWithinTolerance = Math.abs(newConc - target) <= tol;
    
    if (isWithinTolerance) {
        updateStatusIndicator('success', 'เป้าหมาย!', `ความเข้มข้น: ${newConc.toFixed(2)} mg/L`);
    } else if (newConc > target + tol) {
        updateStatusIndicator('failure', 'เกินเป้าหมาย', `ลดลง ${(newConc - target).toFixed(2)} mg/L`);
    } else {
        updateStatusIndicator('measuring', 'ต่ำกว่าเป้าหมาย', `เพิ่มขึ้น ${(target - newConc).toFixed(2)} mg/L`);
    }
}

function updateStatusIndicator(status, text, subtext) {
    statusIndicator.className = `text-center p-4 rounded-lg ${status}`;
    statusText.textContent = text;
    statusSubtext.textContent = subtext;
}

// ===== NORMAL PREDICTION =====

function switchInputMethod(method) {
    absorbanceInputBtn.classList.toggle('active', method === 'absorbance');
    rgbInputBtn.classList.toggle('active', method === 'rgb');
    
    absorbanceInput.classList.toggle('hidden', method !== 'absorbance');
    rgbInput.classList.toggle('hidden', method !== 'rgb');
    
    predictionResult.classList.add('hidden');
}

function predictFromAbsorbance() {
    if (!currentData) {
        alert('กรุณาโหลดข้อมูลสมการก่อนทำนาย');
        return;
    }
    
    const absorbance = parseFloat(absorbanceValue.value);
    if (isNaN(absorbance) || absorbance < 0) {
        alert('กรุณาป้อนค่า Absorbance ที่ถูกต้อง');
        return;
    }
    
    const concentration = absorbanceToConcentration(absorbance);
    const transmittance = Math.pow(10, -absorbance);
    displayPredictionResult(concentration, absorbance, transmittance);
}

function predictFromRGB() {
    if (!currentData) {
        alert('กรุณาโหลดข้อมูลสมการก่อนทำนาย');
        return;
    }
    
    const r = parseInt(rgbR.value);
    const g = parseInt(rgbG.value);
    const b = parseInt(rgbB.value);
    
    if (isNaN(r) || isNaN(g) || isNaN(b) || 
        r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        alert('กรุณาป้อนค่า RGB ที่ถูกต้อง (0-255)');
        return;
    }
    
    // Calculate absorbance from RGB using Beer-Lambert law
    const absorbance = calculateAbsorbanceFromRGB(r, g, b);
    const concentration = absorbanceToConcentration(absorbance);
    const transmittance = Math.pow(10, -absorbance);
    
    displayPredictionResult(concentration, absorbance, transmittance);
}

function displayPredictionResult(concentration, absorbance, transmittance) {
    predictedConcentration.textContent = concentration.toFixed(3);
    calculatedAbsorbance.textContent = absorbance.toFixed(3);
    calculatedTransmittance.textContent = transmittance.toFixed(3);
    
    // Calculate accuracy based on R-squared
    const accuracy = (currentData.rSquared * 100).toFixed(1);
    predictionAccuracy.textContent = `${accuracy}%`;
    
    predictionResult.classList.remove('hidden');
}

function resetNormalPrediction() {
    absorbanceValue.value = '';
    rgbR.value = '';
    rgbG.value = '';
    rgbB.value = '';
    colorPreview.style.backgroundColor = '#ffffff';
    predictionResult.classList.add('hidden');
}

// ===== UTILITY FUNCTIONS =====

// Copy of beerLambert function from main script.js
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

function absorbanceToConcentration(absorbance) {
    if (!currentData) return 0;
    
    // Extract slope and intercept from equation
    let slope, intercept;
    
    if (typeof currentData.equation === 'object' && currentData.equation !== null) {
        // ถ้า equation เป็น object
        slope = currentData.equation.slope || 1;
        intercept = currentData.equation.intercept || 0;
    } else {
        // ถ้า equation เป็น string
        const equation = currentData.equation;
        const match = equation.match(/y\s*=\s*([\d.-]+)x\s*([+-])\s*([\d.-]+)/);
        
        if (match) {
            slope = parseFloat(match[1]);
            const sign = match[2];
            intercept = parseFloat(match[3]);
            if (sign === '-') intercept = -intercept;
        } else {
            return 0;
        }
    }
    
    // If x-axis is concentration, solve for x: y = mx + b -> x = (y - b) / m
    if (currentData.xAxisType === 'concentration') {
        return (absorbance - intercept) / slope;
    } else {
        // If x-axis is absorbance, solve for y: y = mx + b
        return slope * absorbance + intercept;
    }
}

function concentrationToAbsorbance(concentration) {
    if (!currentData) return 0;
    
    // Extract slope and intercept from equation
    let slope, intercept;
    
    if (typeof currentData.equation === 'object' && currentData.equation !== null) {
        // ถ้า equation เป็น object
        slope = currentData.equation.slope || 1;
        intercept = currentData.equation.intercept || 0;
    } else {
        // ถ้า equation เป็น string
        const equation = currentData.equation;
        const match = equation.match(/y\s*=\s*([\d.-]+)x\s*([+-])\s*([\d.-]+)/);
        
        if (match) {
            slope = parseFloat(match[1]);
            const sign = match[2];
            intercept = parseFloat(match[3]);
            if (sign === '-') intercept = -intercept;
        } else {
            return 0;
        }
    }
    
    // If x-axis is concentration, calculate y: y = mx + b
    if (currentData.xAxisType === 'concentration') {
        return slope * concentration + intercept;
    } else {
        // If x-axis is absorbance, solve for x: x = (y - b) / m
        return (concentration - intercept) / slope;
    }
}

function calculateAbsorbanceFromRGB(r, g, b) {
    // Use current blank reference settings
    const blankR = blankReference.r;
    const blankG = blankReference.g;
    const blankB = blankReference.b;
    
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

// ===== ENHANCED ANALYSIS FUNCTIONS =====

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
    
    // Filter samples based on analysis settings
    let filteredSamples = [...samples];
    
    // Include blank in fitting if enabled
    if (analysisSettings.includeBlankInFitting && options.blankData) {
        filteredSamples.push(options.blankData);
    }
    
    // Include blank in regression if enabled (not recommended)
    if (analysisSettings.includeBlankInRegression && options.blankData) {
        filteredSamples.push(options.blankData);
    }
    
    // Calculate regression based on Y-axis type
    if (analysisSettings.includeAbsorbanceAsY) {
        return calculateAbsorbanceRegression(filteredSamples, options);
    } else {
        return calculateConcentrationRegression(filteredSamples, options);
    }
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

function updateColorPreview() {
    const r = parseInt(rgbR.value) || 255;
    const g = parseInt(rgbG.value) || 255;
    const b = parseInt(rgbB.value) || 255;
    
    colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

// ===== INITIALIZATION =====

// Add loading spinner function
function showLoading(element) {
    element.innerHTML = '<span class="spinner"></span>กำลังโหลด...';
}

function hideLoading(element, originalText) {
    element.innerHTML = originalText;
}

// ===== NEW FUNCTIONS FOR CAMERA AND REAL-TIME PREDICTION =====

/**
 * Real-time prediction using camera input
 * @param {Object} model - TensorFlow.js model for prediction
 */
async function predictFromCamera(model) {
    try {
        // Check if camera is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Camera not available');
        }

        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 640, 
                height: 480,
                facingMode: 'environment' // Use back camera if available
            } 
        });

        // Create video element for camera feed
        const video = document.createElement('video');
        video.srcObject = stream;
        video.width = 640;
        video.height = 480;
        video.autoplay = true;
        video.muted = true;

        // Create canvas for processing
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');

        // Create container for camera feed
        const cameraContainer = document.createElement('div');
        cameraContainer.id = 'cameraContainer';
        cameraContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            text-align: center;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'ปิดกล้อง';
        closeBtn.style.cssText = `
            margin-top: 10px;
            padding: 8px 16px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        cameraContainer.appendChild(video);
        cameraContainer.appendChild(closeBtn);
        document.body.appendChild(cameraContainer);

        // Close camera function
        const closeCamera = () => {
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(cameraContainer);
        };

        closeBtn.addEventListener('click', closeCamera);

        // Real-time prediction loop
        const predictLoop = async () => {
            if (!video.paused && !video.ended) {
                // Draw video frame to canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Get image data from center of frame
                const centerX = Math.floor(canvas.width / 2);
                const centerY = Math.floor(canvas.height / 2);
                const imageData = ctx.getImageData(centerX - 10, centerY - 10, 20, 20);
                
                // Calculate average RGB values
                let r = 0, g = 0, b = 0;
                for (let i = 0; i < imageData.data.length; i += 4) {
                    r += imageData.data[i];
                    g += imageData.data[i + 1];
                    b += imageData.data[i + 2];
                }
                r = Math.round(r / (imageData.data.length / 4));
                g = Math.round(g / (imageData.data.length / 4));
                b = Math.round(b / (imageData.data.length / 4));

                // Calculate absorbance using Beer-Lambert law
                const absorbance = calculateAbsorbanceFromRGB(r, g, b);
                const concentration = absorbanceToConcentration(absorbance);
                const transmittance = Math.pow(10, -absorbance);

                // Update real-time display
                if (currentAbsorbance) currentAbsorbance.textContent = absorbance.toFixed(3);
                if (currentConcentration) currentConcentration.textContent = concentration.toFixed(3);
                if (currentTransmittance) currentTransmittance.textContent = transmittance.toFixed(3);

                // Check if using TensorFlow.js model
                if (model && typeof tf !== 'undefined') {
                    try {
                        // Convert image data to tensor
                        const tensor = tf.browser.fromPixels(imageData);
                        const resized = tf.image.resizeBilinear(tensor, [224, 224]);
                        const expanded = resized.expandDims(0);
                        const normalized = expanded.div(255.0);

                        // Make prediction
                        const prediction = await model.predict(normalized);
                        const predictedValue = prediction.dataSync()[0];

                        // Update display with model prediction
                        if (currentConcentration) {
                            currentConcentration.textContent = predictedValue.toFixed(3);
                        }

                        // Clean up tensors
                        tensor.dispose();
                        resized.dispose();
                        expanded.dispose();
                        normalized.dispose();
                        prediction.dispose();
                    } catch (modelError) {
                        console.warn('Model prediction failed, using Beer-Lambert calculation:', modelError);
                    }
                }
            }

            // Continue loop if camera is still active
            if (document.body.contains(cameraContainer)) {
                requestAnimationFrame(predictLoop);
            }
        };

        // Start prediction loop
        video.addEventListener('loadeddata', predictLoop);

    } catch (error) {
        console.error('Error in camera prediction:', error);
        alert('ไม่สามารถเปิดกล้องได้: ' + error.message);
    }
}

/**
 * Run example prediction with data saving and camera integration
 * @param {Object} model - TensorFlow.js model for prediction
 */
async function runExample(model) {
    try {
        // 1. Call existing prediction function (simulate with current data)
        if (!currentData) {
            alert('กรุณาโหลดข้อมูลสมการก่อนรันตัวอย่าง');
            return;
        }

        // Simulate a prediction
        const sampleAbsorbance = 0.5; // Example absorbance value
        const predictedConcentration = absorbanceToConcentration(sampleAbsorbance);
        
        console.log('Example prediction:', {
            absorbance: sampleAbsorbance,
            concentration: predictedConcentration
        });

        // 2. Save backgroundColor and linearEquation using dataHandler.js
        if (window.DataHandler) {
            const experimentData = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                name: `Example_${Date.now()}`,
                rSquared: currentData.rSquared,
                rmse: currentData.rmse,
                equation: currentData.equation,
                blankReference: blankReference,
                xAxisType: xAxisType,
                samples: currentData.samples || [],
                saveType: 'example',
                saveTime: new Date().toISOString(),
                backgroundColor: '#ffffff', // Default background
                linearEquation: {
                    slope: 1.0, // Extract from equation if available
                    intercept: 0.0
                }
            };

            // Extract slope and intercept from equation if possible
            if (typeof currentData.equation === 'object' && currentData.equation !== null) {
                experimentData.linearEquation.slope = currentData.equation.slope || 1.0;
                experimentData.linearEquation.intercept = currentData.equation.intercept || 0.0;
            } else {
                const equation = currentData.equation;
                const match = equation.match(/y\s*=\s*([\d.-]+)x\s*([+-])\s*([\d.-]+)/);
                if (match) {
                    experimentData.linearEquation.slope = parseFloat(match[1]);
                    experimentData.linearEquation.intercept = parseFloat(match[2] + match[3]);
                }
            }

            const saveSuccess = await window.DataHandler.addExperiment(experimentData);
            if (saveSuccess) {
                console.log('Experiment data saved successfully');
            } else {
                console.warn('Failed to save experiment data');
            }
        }

        // 3. Calculate Beer-Lambert Law using copied function
        const sampleRGB = { r: 128, g: 128, b: 128 }; // Example RGB values
        
        const sample = {
            type: 'unknown',
            rgb: sampleRGB
        };
        const blank = {
            type: 'blank',
            rgb: blankReference
        };

        const beerLambertResult = calculateBeerLambertMetrics(sample, blank);
        console.log('Beer-Lambert calculation:', beerLambertResult);

        // 4. Call predictFromCamera to display real-time results
        await predictFromCamera(model);

    } catch (error) {
        console.error('Error in runExample:', error);
        alert('เกิดข้อผิดพลาดในการรันตัวอย่าง: ' + error.message);
    }
}

// Export functions for potential external use
window.PredictionSystem = {
    switchMode,
    loadSavedData,
    startRealTimeMeasurement,
    stopRealTimeMeasurement,
    predictFromAbsorbance,
    predictFromRGB,
    predictFromCamera,
    runExample,
    setBlankReference,
    // New analysis functions
    calculateEnhancedRegression,
    calculateAbsorbanceRegression,
    calculateConcentrationRegression,
    performLinearRegression,
    // Analysis settings
    toggleAnalysisSettings,
    saveAnalysisSettings,
    initializeAnalysisSettings,
    // Settings getter
    getAnalysisSettings: () => analysisSettings
};
