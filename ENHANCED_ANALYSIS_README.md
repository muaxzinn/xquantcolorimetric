# XQuant Enhanced Analysis Features

## ฟีเจอร์ใหม่ที่เพิ่มเข้ามา

### 1. การตั้งค่าการวิเคราะห์ (Analysis Settings)

ระบบได้เพิ่มส่วนการตั้งค่าการวิเคราะห์ที่สามารถเปิด/ปิดได้ตามต้องการ:

#### 1.1 รวม Blank ในการฟิต (Include Blank in Fitting)
- **ฟังก์ชัน**: รวมข้อมูล Blank ในการคำนวณเส้นฟิต
- **การใช้งาน**: เปิด/ปิดได้ผ่าน toggle switch
- **ประโยชน์**: ช่วยให้การคำนวณแม่นยำขึ้นเมื่อมีข้อมูล Blank ที่เชื่อถือได้

#### 1.2 รวม Blank ในการคำนวณสมการถดถอย (Include Blank in Regression)
- **ฟังก์ชัน**: รวมจุดข้อมูล Blank ในการคำนวณสมการถดถอย
- **คำเตือน**: ⚠️ **ไม่แนะนำ** - อาจทำให้ผลลัพธ์ไม่แม่นยำ
- **การใช้งาน**: เปิด/ปิดได้ผ่าน toggle switch (สีแดงเพื่อเตือน)

#### 1.3 ใช้ Absorbance เป็นแกน Y (Use Absorbance as Y-axis)
- **ฟังก์ชัน**: เปลี่ยนจาก Concentration เป็น Absorbance ในการแสดงผล
- **การใช้งาน**: เปิด/ปิดได้ผ่าน toggle switch
- **ประโยชน์**: เหมาะสำหรับการวิเคราะห์ที่ต้องการดูความสัมพันธ์ของ Absorbance

#### 1.4 ใช้ Absorbance เป็นตัวแปรตาม (Use Absorbance as Dependent Variable)
- **ฟังก์ชัน**: เพิ่ม Absorbance เป็นตัวแปรในการวิเคราะห์
- **การใช้งาน**: เปิด/ปิดได้ผ่าน toggle switch
- **ประโยชน์**: เพิ่มความยืดหยุ่นในการวิเคราะห์ข้อมูล

### 2. การแก้ไข Bug และ Error

#### 2.1 การแสดงผล Equation
- แก้ไขปัญหา `[object Object]` ในการแสดงผลสมการ
- รองรับทั้ง equation แบบ object และ string
- เพิ่ม error handling สำหรับข้อมูลที่ไม่สมบูรณ์

#### 2.2 การโหลดข้อมูล
- แก้ไข bug ในการแสดงผลข้อมูลที่บันทึกไว้
- เพิ่มการตรวจสอบข้อมูลก่อนแสดงผล
- ปรับปรุงการจัดการ error เมื่อข้อมูลไม่ถูกต้อง

#### 2.3 การจัดการข้อมูล
- เพิ่มการตรวจสอบ null/undefined values
- ปรับปรุงการแสดงผลวันที่และเวลา
- เพิ่ม fallback values สำหรับข้อมูลที่ขาดหาย

### 3. ฟังก์ชันการวิเคราะห์ที่เพิ่มขึ้น

#### 3.1 Enhanced Regression Functions
```javascript
// ฟังก์ชันหลักสำหรับการคำนวณ regression
calculateEnhancedRegression(samples, options)

// ฟังก์ชันสำหรับการคำนวณ regression แบบ Absorbance
calculateAbsorbanceRegression(samples, options)

// ฟังก์ชันสำหรับการคำนวณ regression แบบ Concentration
calculateConcentrationRegression(samples, options)

// ฟังก์ชันสำหรับการคำนวณ linear regression
performLinearRegression(dataPoints)
```

#### 3.2 Analysis Settings Management
```javascript
// เปิด/ปิดการตั้งค่าการวิเคราะห์
toggleAnalysisSettings()

// บันทึกการตั้งค่า
saveAnalysisSettings()

// โหลดการตั้งค่าที่บันทึกไว้
initializeAnalysisSettings()

// ดึงการตั้งค่าปัจจุบัน
getAnalysisSettings()
```

### 4. การใช้งาน

#### 4.1 การเข้าถึงการตั้งค่า
1. เปิดหน้า Prediction System
2. คลิกปุ่ม "ตั้งค่า" ในส่วน "การตั้งค่าการวิเคราะห์"
3. ปรับแต่งการตั้งค่าตามต้องการ
4. คลิก "บันทึกการตั้งค่า"

#### 4.2 การตั้งค่าจะถูกบันทึกใน localStorage
- ชื่อ key: `xquant_analysis_settings`
- ข้อมูลจะถูกโหลดอัตโนมัติเมื่อเปิดหน้าใหม่

#### 4.3 การใช้งานฟังก์ชันใหม่
```javascript
// ตัวอย่างการใช้งาน
const samples = [
    { concentration: 1.0, absorbance: 0.1 },
    { concentration: 2.0, absorbance: 0.2 },
    { concentration: 3.0, absorbance: 0.3 }
];

const options = {
    blankData: { concentration: 0, absorbance: 0 }
};

const result = calculateEnhancedRegression(samples, options);
console.log(result);
```

### 5. ข้อควรระวัง

1. **การรวม Blank ในการคำนวณสมการถดถอย**: ไม่แนะนำเพราะอาจทำให้ผลลัพธ์ไม่แม่นยำ
2. **การเปลี่ยนแกน Y**: ควรเข้าใจผลกระทบต่อการแสดงผลก่อนใช้งาน
3. **การบันทึกการตั้งค่า**: ควรบันทึกการตั้งค่าหลังจากปรับแต่งเสร็จ

### 6. การอัปเดตในอนาคต

- เพิ่มการตั้งค่าเพิ่มเติมสำหรับการวิเคราะห์
- ปรับปรุง UI/UX ของการตั้งค่า
- เพิ่มการส่งออก/นำเข้าการตั้งค่า
- เพิ่มการตรวจสอบความถูกต้องของการตั้งค่า

---

**หมายเหตุ**: ฟีเจอร์เหล่านี้ถูกออกแบบมาเพื่อเพิ่มความยืดหยุ่นและความแม่นยำในการวิเคราะห์ข้อมูล แต่ควรใช้อย่างระมัดระวังและเข้าใจผลกระทบต่อผลลัพธ์
