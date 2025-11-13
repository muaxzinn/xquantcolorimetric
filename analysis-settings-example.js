// ตัวอย่างการใช้งานฟีเจอร์การตั้งค่าการวิเคราะห์ใหม่

// 1. การตั้งค่าการวิเคราะห์
const analysisSettings = {
    includeBlankInFitting: true,        // รวม Blank ในการฟิต
    includeBlankInRegression: false,    // ไม่รวม Blank ในการคำนวณสมการถดถอย (ไม่แนะนำ)
    includeAbsorbanceAsY: false,       // ใช้ Concentration เป็นแกน Y (ค่าเริ่มต้น)
    includeAbsorbanceAsDependent: true // ใช้ Absorbance เป็นตัวแปรตาม
};

// 2. ข้อมูลตัวอย่าง
const sampleData = [
    {
        concentration: 1.0,
        absorbance: 0.1,
        rgb: { r: 200, g: 180, b: 160 }
    },
    {
        concentration: 2.0,
        absorbance: 0.2,
        rgb: { r: 180, g: 160, b: 140 }
    },
    {
        concentration: 3.0,
        absorbance: 0.3,
        rgb: { r: 160, g: 140, b: 120 }
    },
    {
        concentration: 4.0,
        absorbance: 0.4,
        rgb: { r: 140, g: 120, b: 100 }
    }
];

const blankData = {
    concentration: 0,
    absorbance: 0,
    rgb: { r: 255, g: 255, b: 255 }
};

// 3. ตัวอย่างการใช้งานฟังก์ชันใหม่

// 3.1 การคำนวณ Enhanced Regression
function exampleEnhancedRegression() {
    console.log('=== Enhanced Regression Example ===');
    
    const options = {
        blankData: blankData
    };
    
    // ใช้ฟังก์ชันจาก PredictionSystem
    if (window.PredictionSystem) {
        const result = window.PredictionSystem.calculateEnhancedRegression(sampleData, options);
        console.log('Enhanced Regression Result:', result);
    }
}

// 3.2 การคำนวณ Absorbance Regression
function exampleAbsorbanceRegression() {
    console.log('=== Absorbance Regression Example ===');
    
    if (window.PredictionSystem) {
        const result = window.PredictionSystem.calculateAbsorbanceRegression(sampleData);
        console.log('Absorbance Regression Result:', result);
    }
}

// 3.3 การคำนวณ Concentration Regression
function exampleConcentrationRegression() {
    console.log('=== Concentration Regression Example ===');
    
    if (window.PredictionSystem) {
        const result = window.PredictionSystem.calculateConcentrationRegression(sampleData);
        console.log('Concentration Regression Result:', result);
    }
}

// 3.4 การจัดการการตั้งค่า
function exampleSettingsManagement() {
    console.log('=== Settings Management Example ===');
    
    if (window.PredictionSystem) {
        // เปิดการตั้งค่าการวิเคราะห์
        window.PredictionSystem.toggleAnalysisSettings();
        
        // บันทึกการตั้งค่า
        window.PredictionSystem.saveAnalysisSettings();
        
        // ดึงการตั้งค่าปัจจุบัน
        const currentSettings = window.PredictionSystem.getAnalysisSettings();
        console.log('Current Settings:', currentSettings);
    }
}

// 3.5 การทดสอบการตั้งค่าต่างๆ
function testDifferentSettings() {
    console.log('=== Testing Different Settings ===');
    
    // ทดสอบการรวม Blank ในการฟิต
    const settingsWithBlank = {
        includeBlankInFitting: true,
        includeBlankInRegression: false,
        includeAbsorbanceAsY: false,
        includeAbsorbanceAsDependent: false
    };
    
    // ทดสอบการใช้ Absorbance เป็นแกน Y
    const settingsWithAbsorbanceY = {
        includeBlankInFitting: false,
        includeBlankInRegression: false,
        includeAbsorbanceAsY: true,
        includeAbsorbanceAsDependent: true
    };
    
    console.log('Settings with Blank in Fitting:', settingsWithBlank);
    console.log('Settings with Absorbance as Y:', settingsWithAbsorbanceY);
}

// 3.6 การคำนวณ Linear Regression แบบแยกส่วน
function exampleLinearRegression() {
    console.log('=== Linear Regression Example ===');
    
    const dataPoints = [
        { x: 0.1, y: 1.0 },
        { x: 0.2, y: 2.0 },
        { x: 0.3, y: 3.0 },
        { x: 0.4, y: 4.0 }
    ];
    
    if (window.PredictionSystem) {
        const result = window.PredictionSystem.performLinearRegression(dataPoints);
        console.log('Linear Regression Result:', result);
        
        // แสดงสมการ
        if (result.slope && result.intercept) {
            const sign = result.intercept >= 0 ? '+' : '';
            console.log(`Equation: y = ${result.slope.toFixed(4)}x ${sign}${result.intercept.toFixed(4)}`);
            console.log(`R² = ${result.rSquared.toFixed(4)}`);
            console.log(`RMSE = ${result.rmse.toFixed(4)}`);
        }
    }
}

// 4. ฟังก์ชันสำหรับการทดสอบทั้งหมด
function runAllExamples() {
    console.log('Starting Analysis Settings Examples...');
    
    exampleEnhancedRegression();
    exampleAbsorbanceRegression();
    exampleConcentrationRegression();
    exampleSettingsManagement();
    testDifferentSettings();
    exampleLinearRegression();
    
    console.log('All examples completed!');
}

// 5. การใช้งานในหน้าเว็บ
document.addEventListener('DOMContentLoaded', function() {
    // รอให้ PredictionSystem โหลดเสร็จ
    setTimeout(() => {
        if (window.PredictionSystem) {
            console.log('PredictionSystem is ready!');
            // รันตัวอย่าง (สามารถเปิด/ปิดได้)
            // runAllExamples();
        } else {
            console.warn('PredictionSystem not found. Make sure prediction-script.js is loaded.');
        }
    }, 1000);
});

// 6. ฟังก์ชันสำหรับการทดสอบการตั้งค่าใน UI
function testUISettings() {
    // ทดสอบการเปิด/ปิดการตั้งค่า
    const settingsBtn = document.getElementById('analysisSettingsBtn');
    if (settingsBtn) {
        settingsBtn.click();
        console.log('Analysis settings panel opened');
    }
    
    // ทดสอบการเปลี่ยนการตั้งค่า
    const blankFittingToggle = document.getElementById('includeBlankInFitting');
    if (blankFittingToggle) {
        blankFittingToggle.checked = true;
        console.log('Blank in fitting enabled');
    }
    
    const absorbanceYToggle = document.getElementById('includeAbsorbanceAsY');
    if (absorbanceYToggle) {
        absorbanceYToggle.checked = true;
        console.log('Absorbance as Y enabled');
    }
    
    // บันทึกการตั้งค่า
    const saveBtn = document.getElementById('saveAnalysisSettingsBtn');
    if (saveBtn) {
        saveBtn.click();
        console.log('Settings saved');
    }
}

// Export functions for external use
window.AnalysisExamples = {
    runAllExamples,
    testUISettings,
    exampleEnhancedRegression,
    exampleAbsorbanceRegression,
    exampleConcentrationRegression,
    exampleSettingsManagement,
    testDifferentSettings,
    exampleLinearRegression
};
