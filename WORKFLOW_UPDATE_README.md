# XQuant Workflow Update

## การเปลี่ยนแปลงหลัก

### 1. **ย้ายการตั้งค่าการวิเคราะห์ไปที่ Index Page**

#### ✅ **ก่อนหน้า (Old Workflow)**
- การตั้งค่าการวิเคราะห์อยู่ในหน้า Prediction
- ต้องไปหน้า Prediction ก่อนถึงจะตั้งค่าได้
- ไม่สามารถเทรนโมเดลก่อนได้

#### ✅ **หลังการอัปเดต (New Workflow)**
- การตั้งค่าการวิเคราะห์อยู่ในหน้า Index
- สามารถเทรนโมเดลและตั้งค่าก่อนได้
- ไม่จำเป็นต้องสร้างกราฟก่อนไปหน้า Prediction

### 2. **ฟีเจอร์ใหม่ที่เพิ่มเข้ามา**

#### 2.1 **การเทรนโมเดลในหน้า Index**
```javascript
// ฟังก์ชันการเทรนโมเดลแบบปรับแต่งได้
calculateEnhancedRegression(samples, options)

// ฟังก์ชันการคำนวณ regression แบบ Absorbance
calculateAbsorbanceRegression(samples, options)

// ฟังก์ชันการคำนวณ regression แบบ Concentration
calculateConcentrationRegression(samples, options)
```

#### 2.2 **การโหลดโมเดลอัตโนมัติ**
- เมื่อสร้างกราฟในหน้า Index แล้วไปหน้า Prediction
- ระบบจะโหลดโมเดลอัตโนมัติพร้อมค่า Blank
- ไม่ต้องกรอกค่า Blank ใหม่

#### 2.3 **การตั้งค่าการวิเคราะห์**
- **รวม Blank ในการฟิต** - เปิด/ปิดได้
- **รวม Blank ในการคำนวณสมการถดถอย** - เปิด/ปิดได้ (ไม่แนะนำ)
- **ใช้ Absorbance เป็นแกน Y** - เปิด/ปิดได้
- **ใช้ Absorbance เป็นตัวแปรตาม** - เปิด/ปิดได้

### 3. **Workflow ใหม่**

#### 3.1 **Workflow แบบมีกราฟ (Recommended)**
```
1. เปิดหน้า Index
2. ตั้งค่าการวิเคราะห์ (ถ้าต้องการ)
3. เพิ่มข้อมูลตัวอย่าง
4. สร้างกราฟ (Run Regression Analysis)
5. คลิก "ไปหน้า Prediction"
6. ระบบโหลดโมเดลอัตโนมัติพร้อมค่า Blank
7. ใช้งาน Prediction ได้ทันที
```

#### 3.2 **Workflow แบบไม่มีกราฟ**
```
1. เปิดหน้า Prediction โดยตรง
2. โหลดข้อมูลที่บันทึกไว้
3. กรอกค่า Blank ใหม่
4. ใช้งาน Prediction
```

### 4. **การทำงานของระบบ**

#### 4.1 **การบันทึกข้อมูลจาก Index ไป Prediction**
```javascript
// เมื่อคลิก "ไปหน้า Prediction" ในหน้า Index
function goToPredictionPage() {
    // บันทึกการตั้งค่าการวิเคราะห์
    localStorage.setItem('xquant_analysis_settings', JSON.stringify(analysisSettings));
    
    // บันทึกข้อมูล regression สำหรับ auto-loading
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
    
    sessionStorage.setItem('xquant_auto_prediction_data', JSON.stringify(predictionData));
    
    // ไปหน้า Prediction
    window.location.href = 'prediction.html';
}
```

#### 4.2 **การโหลดข้อมูลอัตโนมัติในหน้า Prediction**
```javascript
// เมื่อเปิดหน้า Prediction
function checkAutoLoadedData() {
    const autoData = sessionStorage.getItem('xquant_auto_prediction_data');
    if (autoData) {
        const data = JSON.parse(autoData);
        
        // โหลดข้อมูล regression อัตโนมัติ
        loadRegressionData(data);
        
        // ตั้งค่า Blank reference อัตโนมัติ
        if (data.blankReference) {
            blankReference = data.blankReference;
            updateBlankColorPreview();
        }
        
        // ตั้งค่า x-axis type อัตโนมัติ
        if (data.xAxisType) {
            xAxisType = data.xAxisType;
        }
        
        // ลบข้อมูลจาก session storage
        sessionStorage.removeItem('xquant_auto_prediction_data');
    }
}
```

### 5. **ข้อดีของ Workflow ใหม่**

#### 5.1 **ความสะดวก**
- ไม่ต้องสร้างกราฟก่อนไปหน้า Prediction
- โหลดโมเดลอัตโนมัติเมื่อสร้างกราฟแล้ว
- ไม่ต้องกรอกค่า Blank ใหม่

#### 5.2 **ความยืดหยุ่น**
- สามารถเทรนโมเดลและตั้งค่าก่อนได้
- รองรับการใช้งานแบบไม่มีกราฟ
- การตั้งค่าถูกบันทึกและโหลดอัตโนมัติ

#### 5.3 **ความแม่นยำ**
- ใช้การตั้งค่าการวิเคราะห์ที่ตั้งไว้ในหน้า Index
- รองรับการรวม Blank ในการฟิต
- รองรับการใช้ Absorbance เป็นตัวแปรตาม

### 6. **การใช้งาน**

#### 6.1 **สำหรับผู้ใช้ใหม่**
1. เปิดหน้า Index
2. เพิ่มข้อมูลตัวอย่าง
3. คลิก "Run Regression Analysis"
4. คลิก "ไปหน้า Prediction"
5. ใช้งาน Prediction ได้ทันที

#### 6.2 **สำหรับผู้ใช้ที่มีข้อมูลอยู่แล้ว**
1. เปิดหน้า Prediction โดยตรง
2. คลิก "ข้อมูลในเครื่อง" หรือ "ข้อมูลบน Server"
3. เลือกข้อมูลที่ต้องการ
4. กรอกค่า Blank ใหม่
5. ใช้งาน Prediction

### 7. **การตั้งค่าการวิเคราะห์**

#### 7.1 **การเข้าถึงการตั้งค่า**
1. เปิดหน้า Index
2. คลิกปุ่ม "ตั้งค่า" ในส่วน "การตั้งค่าการวิเคราะห์"
3. ปรับแต่งการตั้งค่าตามต้องการ
4. คลิก "บันทึกการตั้งค่า"

#### 7.2 **การตั้งค่าที่มี**
- ✅ **รวม Blank ในการฟิต** - ช่วยให้การคำนวณแม่นยำขึ้น
- ⚠️ **รวม Blank ในการคำนวณสมการถดถอย** - ไม่แนะนำ
- ✅ **ใช้ Absorbance เป็นแกน Y** - เปลี่ยนจาก Concentration
- ✅ **ใช้ Absorbance เป็นตัวแปรตาม** - เพิ่มความยืดหยุ่น

---

**หมายเหตุ**: การเปลี่ยนแปลงนี้ทำให้ระบบมีความยืดหยุ่นและสะดวกในการใช้งานมากขึ้น โดยผู้ใช้สามารถเลือกได้ว่าจะสร้างกราฟก่อนหรือไม่ก่อนไปหน้า Prediction
