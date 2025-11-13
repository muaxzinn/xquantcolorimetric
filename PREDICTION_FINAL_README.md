# Prediction System - Final Update

## Overview
หน้า prediction ได้รับการปรับปรุงให้มีโครงสร้างเหมือนกับ index.html โดยแก้ไขปัญหา [object Object] และเพิ่ม Color Input Method ตามที่ต้องการ

## การแก้ไขหลัก

### 1. แก้ไขปัญหา [object Object]
- **ปัญหา**: แสดง [object Object] แทนที่จะแสดงสมการ
- **การแก้ไข**: เพิ่มการตรวจสอบประเภทของ equation และแสดงผลตามประเภท
  - ถ้าเป็น object: แสดง `y = slope x + intercept`
  - ถ้าเป็น string: แสดงตามปกติ

### 2. ลบ Extinction Coefficient และ Path Length
- **ลบออก**: Extinction Coefficient (ε) และ Path Length (l)
- **เหลือ**: เฉพาะ X-axis Type และ Blank Reference

### 3. เพิ่ม Color Input Method
- **Manual RGB**: กรอกค่า R, G, B แยกกัน
- **HEX Code**: กรอกโค้ดสี HEX (#RRGGBB)
- **Upload Image**: อัปโหลดรูปภาพและดึงสีจากจุดกลาง

### 4. เพิ่มปุ่ม Clear และ Add blank
- **Clear**: ล้างข้อมูลทั้งหมดในฟอร์ม
- **Add blank**: เพิ่ม Blank Reference ลงในระบบ

## โครงสร้างใหม่

### Blank Reference Setup Section
```
1. Color Input Method
   ├── Manual RGB (active)
   ├── HEX Code
   └── Upload Image

2. RGB Values (0-255)
   ├── R: [input]
   ├── G: [input]
   └── B: [input]

3. Color Preview
   └── [color box]

4. Buttons
   ├── Clear
   └── Add blank

5. X-axis Type
   ├── C (linear concentration)
   ├── log(C) (log base 10)
   └── ln(C) (natural log)

6. สูตรการคำนวณ
   └── Beer-Lambert Law

7. ตั้งค่า Blank Reference
```

## ฟังก์ชันใหม่

### 1. switchBlankInputMethod(method)
- สลับระหว่าง Manual RGB, HEX Code, Upload Image
- อัปเดตสถานะปุ่มและแสดง/ซ่อนส่วนที่เกี่ยวข้อง

### 2. updateBlankHexColorPreview()
- แปลง HEX เป็น RGB
- อัปเดต preview และค่า RGB

### 3. handleBlankImageUpload(event)
- อัปโหลดรูปภาพ
- ดึงสีเฉลี่ยจากจุดกลาง 20x20 pixels
- อัปเดตค่า RGB

### 4. clearBlankInputs()
- ล้างข้อมูลทั้งหมดในฟอร์ม
- รีเซ็ต preview

### 5. addBlankReference()
- เพิ่ม Blank Reference ลงในระบบ
- แสดงข้อความยืนยัน

## การแก้ไขปัญหา [object Object]

### ในฟังก์ชัน loadRegressionData()
```javascript
if (typeof data.equation === 'object' && data.equation !== null) {
    // ถ้า equation เป็น object ให้แสดง slope และ intercept
    const eq = data.equation;
    if (eq.slope !== undefined && eq.intercept !== undefined) {
        const sign = eq.intercept >= 0 ? '+' : '';
        currentEquation.textContent = `y = ${eq.slope.toFixed(4)}x ${sign}${eq.intercept.toFixed(4)}`;
    } else {
        currentEquation.textContent = 'y = mx + b';
    }
} else {
    // ถ้า equation เป็น string ให้แสดงตามปกติ
    currentEquation.textContent = data.equation || 'y = mx + b';
}
```

### ในฟังก์ชัน absorbanceToConcentration() และ concentrationToAbsorbance()
```javascript
if (typeof currentData.equation === 'object' && currentData.equation !== null) {
    // ถ้า equation เป็น object
    slope = currentData.equation.slope || 1;
    intercept = currentData.equation.intercept || 0;
} else {
    // ถ้า equation เป็น string
    // ... parse จาก string
}
```

## การใช้งาน

### 1. ตั้งค่า Blank Reference
1. เลือก Color Input Method
2. กรอกข้อมูลสี (RGB, HEX, หรืออัปโหลดรูป)
3. กด "Add blank" เพื่อเพิ่ม Blank Reference
4. เลือก X-axis Type
5. กด "ตั้งค่า Blank Reference"

### 2. เลือกโหมดการทำงาน
- **Real Time Analysis**: วัดแบบ Real Time
- **Normal Prediction**: ทำนายความเข้มข้น

### 3. โหลดข้อมูล (เลือกใช้)
- ข้อมูลในเครื่อง
- ข้อมูลบน Server
- ข้อมูลชั่วคราว

### 4. การทำนาย
- **ป้อน Absorbance**: กรอกค่าโดยตรง
- **ป้อน RGB Values**: กรอกค่า RGB แล้วคำนวณ

## ข้อดีของการปรับปรุง

### 1. แก้ไขปัญหา [object Object]
- แสดงสมการได้ถูกต้องทั้ง object และ string
- การคำนวณทำงานได้ถูกต้องทั้งสองประเภท

### 2. โครงสร้างเหมือน index.html
- Color Input Method เดียวกัน
- การจัดการ Blank Reference เดียวกัน
- ลบส่วนที่ไม่จำเป็นออก

### 3. ความสะดวกในการใช้งาน
- ปุ่ม Clear สำหรับล้างข้อมูล
- ปุ่ม Add blank สำหรับเพิ่ม Blank Reference
- การแสดงผลที่เข้าใจง่าย

### 4. ความยืดหยุ่น
- รองรับการป้อนสีหลายวิธี
- รองรับ equation ทั้ง object และ string
- การคำนวณที่ถูกต้องตามหลัก Beer-Lambert Law

## สรุป
หน้า prediction ได้รับการปรับปรุงให้มีโครงสร้างเหมือนกับ index.html อย่างครบถ้วน แก้ไขปัญหา [object Object] และเพิ่มฟีเจอร์ที่จำเป็นตามที่ต้องการ ทำให้ระบบทำงานได้อย่างถูกต้องและสะดวกในการใช้งาน
