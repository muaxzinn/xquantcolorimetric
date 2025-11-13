# Enhanced Prediction System - Updated Structure

## Overview
หน้า prediction ได้รับการปรับปรุงให้มีโครงสร้างการคำนวณและสูตร log ต่างๆ ตามที่อยู่ใน index.html รวมถึงการกรอกข้อมูล blank ก่อนและสูตรคำนวณตามที่อยู่ใน index.html เลย

## การเปลี่ยนแปลงหลัก

### 1. เพิ่มส่วน Blank Reference Setup
- **ตำแหน่ง**: ส่วนแรกของหน้า (ก่อนเลือกโหมด)
- **ฟีเจอร์**:
  - กรอก Blank Reference RGB Values (R, G, B)
  - ตั้งค่า Extinction Coefficient (ε)
  - ตั้งค่า Path Length (l)
  - เลือก X-axis Type (C, log(C), ln(C))
  - แสดงสูตรการคำนวณ Beer-Lambert Law

### 2. โครงสร้างการคำนวณตาม index.html

#### สูตร Beer-Lambert Law:
```
A = -log₁₀(T) = -log₁₀(I/I₀)
T = I/I₀ (Transmittance)
A = ε × l × C (Absorbance)
```

#### การคำนวณตาม X-axis Type:
- **C (linear)**: ใช้ความเข้มข้นปกติ
- **log(C)**: ใช้ log base 10 ของความเข้มข้น
- **ln(C)**: ใช้ natural log ของความเข้มข้น

### 3. การคำนวณ Absorbance จาก RGB
```javascript
// Calculate transmittance (T = I/I₀)
const T_r = r / blankR;
const T_g = g / blankG;
const T_b = b / blankB;

// Calculate absorbance (A = -log₁₀(T))
const A_r = T_r > 0 ? -Math.log10(T_r) : 0;
const A_g = T_g > 0 ? -Math.log10(T_g) : 0;
const A_b = T_b > 0 ? -Math.log10(T_b) : 0;

// Use average absorbance
return (A_r + A_g + A_b) / 3;
```

### 4. การคำนวณ Transmittance
```javascript
// T = 10^(-A)
const transmittance = Math.pow(10, -absorbance);
```

## ขั้นตอนการใช้งาน

### 1. ตั้งค่า Blank Reference
1. กรอก RGB values ของ Blank Reference
2. ตั้งค่า Extinction Coefficient (ถ้ามี)
3. ตั้งค่า Path Length
4. เลือก X-axis Type
5. กดปุ่ม "ตั้งค่า Blank Reference"

### 2. เลือกโหมดการทำงาน
- **Real Time Analysis**: วัดแบบ Real Time พร้อมแสดงสถานะสี
- **Normal Prediction**: ทำนายความเข้มข้นแบบปกติ

### 3. โหลดข้อมูล (เลือกใช้)
- ข้อมูลในเครื่อง
- ข้อมูลบน Server
- ข้อมูลชั่วคราว

### 4. การทำนาย
- **ป้อน Absorbance**: กรอกค่า Absorbance โดยตรง
- **ป้อน RGB Values**: กรอกค่า RGB แล้วคำนวณ Absorbance

## การแสดงผล

### Real Time Analysis
- **Absorbance**: ค่า Absorbance ปัจจุบัน
- **Concentration**: ความเข้มข้นที่คำนวณได้
- **Transmittance**: ค่า Transmittance (ใหม่)
- **Status**: สถานะการวัด (รอ/กำลังวัด/เป้าหมาย/เกินเป้าหมาย)

### Normal Prediction
- **Predicted Concentration**: ความเข้มข้นที่ทำนายได้
- **Absorbance**: ค่า Absorbance ที่ใช้
- **Transmittance**: ค่า Transmittance ที่คำนวณได้ (ใหม่)
- **ความแม่นยำ**: เปอร์เซ็นต์ความแม่นยำ

## ฟีเจอร์ใหม่

### 1. Blank Reference Management
- การตั้งค่า Blank Reference แยกต่างหาก
- การแสดงสี preview ของ Blank Reference
- การบันทึกการตั้งค่าในหน่วยความจำ

### 2. การคำนวณ Transmittance
- แสดงค่า Transmittance ในทุกโหมด
- การคำนวณตามสูตร T = 10^(-A)

### 3. การใช้ Blank Reference ปัจจุบัน
- ใช้ Blank Reference ที่ตั้งค่าไว้แทนการดึงจากข้อมูลที่โหลด
- การคำนวณที่สอดคล้องกับ index.html

## การเชื่อมต่อกับ index.html

### 1. โครงสร้างข้อมูล
- ใช้โครงสร้างข้อมูลเดียวกับ index.html
- รองรับการโหลดข้อมูลจาก index.html

### 2. สูตรการคำนวณ
- ใช้สูตรการคำนวณเดียวกันกับ index.html
- รองรับ X-axis Type ทั้ง 3 แบบ

### 3. การจัดการ Blank Reference
- ใช้วิธีการเดียวกับ index.html
- รองรับการตั้งค่า Extinction Coefficient และ Path Length

## ข้อดีของการปรับปรุง

### 1. ความสอดคล้อง
- โครงสร้างการคำนวณตรงกับ index.html
- สูตรและวิธีการเดียวกัน

### 2. ความยืดหยุ่น
- สามารถตั้งค่า Blank Reference ได้อิสระ
- รองรับการคำนวณหลายแบบ

### 3. ความแม่นยำ
- การคำนวณที่ถูกต้องตามหลัก Beer-Lambert Law
- การแสดงผลที่ครบถ้วน (Absorbance, Transmittance, Concentration)

### 4. ความสะดวก
- การตั้งค่าที่เป็นขั้นตอน
- การแสดงผลที่เข้าใจง่าย

## การใช้งานจริง

### ตัวอย่างการตั้งค่า Blank Reference:
1. **RGB Values**: R=255, G=255, B=255 (สีขาว)
2. **Extinction Coefficient**: 1000 (ถ้ามี)
3. **Path Length**: 1.0 cm
4. **X-axis Type**: C (linear)

### ตัวอย่างการทำนาย:
1. กรอก RGB ของตัวอย่าง: R=200, G=180, B=160
2. ระบบจะคำนวณ:
   - Transmittance: T = I/I₀
   - Absorbance: A = -log₁₀(T)
   - Concentration: จากสมการที่โหลดมา

## สรุป
หน้า prediction ได้รับการปรับปรุงให้มีโครงสร้างการคำนวณและสูตร log ต่างๆ ตามที่อยู่ใน index.html อย่างครบถ้วน รวมถึงการกรอกข้อมูล blank ก่อนและสูตรคำนวณที่ถูกต้องตามหลัก Beer-Lambert Law
