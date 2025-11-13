# XQuant Colorimetric Analysis System

ระบบวิเคราะห์ความเข้มข้นทางเคมีแบบ Colorimetric ที่ใช้กฎของ Beer-Lambert และการวิเคราะห์การถดถอยเชิงเส้น

## ไฟล์ในระบบ

### 1. `index.html` - ระบบ Calibration และ Regression Analysis
- **การป้อนข้อมูลตัวอย่าง**: Blank, Standard, Unknown
- **การวิเคราะห์การถดถอย**: คำนวณ R², RMSE สำหรับแต่ละช่องสี (R, G, B, Average)
- **การทำนายความเข้มข้น**: ใช้สมการการถดถอยที่ดีที่สุด
- **การบันทึกข้อมูล**: บันทึก regression ที่มี rank สูงสุด

### 2. `realtime.html` - ระบบ Real-time Monitoring
- **การติดตามแบบเรียลไทม์**: บันทึกข้อมูลตามช่วงเวลาที่กำหนด
- **การคำนวณความเข้มข้น**: ใช้ข้อมูล regression ที่บันทึกไว้ หรือกฎของ Beer-Lambert
- **การแสดงผลแบบสด**: กราฟและสถิติแบบเรียลไทม์
- **การส่งออกข้อมูล**: บันทึกเป็นไฟล์ CSV

## วิธีการใช้งาน

### ขั้นตอนที่ 1: การ Calibration (ใช้ index.html)

1. **ป้อนข้อมูล Blank Reference**
   - เลือกวิธีการป้อนสี (Manual RGB, HEX, หรือ Image)
   - ป้อนค่าสีของตัวอย่าง blank
   - เลือกเป็น "Blank" ใน Sample Type

2. **ป้อนข้อมูล Standard Samples**
   - ป้อนค่าสีและความเข้มข้นของตัวอย่างมาตรฐาน
   - เลือกเป็น "Standard" ใน Sample Type
   - ควรมีอย่างน้อย 2 ตัวอย่างมาตรฐาน

3. **ป้อนข้อมูล Unknown Samples** (ถ้ามี)
   - ป้อนค่าสีของตัวอย่างที่ไม่ทราบความเข้มข้น
   - เลือกเป็น "Unknown" ใน Sample Type

4. **รัน Regression Analysis**
   - คลิกปุ่ม "Run Regression Analysis"
   - ระบบจะแสดงผลการวิเคราะห์เรียงตาม R² และ RMSE

5. **บันทึก Best Regression**
   - ดูข้อมูล regression ที่มี rank สูงสุด
   - คลิกปุ่ม "Save Best Regression"
   - ข้อมูลจะถูกบันทึกใน localStorage

### ขั้นตอนที่ 2: การ Real-time Monitoring (ใช้ realtime.html)

1. **ตรวจสอบข้อมูล Regression ที่โหลด**
   - ระบบจะแสดงข้อมูล regression ที่บันทึกไว้จาก index.html
   - หากไม่มีข้อมูล จะใช้กฎของ Beer-Lambert

2. **ตั้งค่าการติดตาม**
   - กำหนดช่วงเวลาการวัด (1-60 วินาที)
   - ตั้งค่าพารามิเตอร์อื่นๆ (ถ้าจำเป็น)

3. **เริ่มการติดตาม**
   - คลิกปุ่ม "Start Monitoring"
   - ระบบจะเริ่มบันทึกข้อมูลตามช่วงเวลาที่กำหนด

4. **ดูผลลัพธ์**
   - กราฟแบบเรียลไทม์
   - ตารางข้อมูล
   - สถิติต่างๆ

## การคำนวณ

### กฎของ Beer-Lambert
```
A = ε × c × L
```
โดย:
- A = Absorbance
- ε = Extinction coefficient
- c = Concentration
- L = Path length

### การคำนวณ Absorbance
```
A = -log₁₀(T) = -log₁₀(I/I₀)
```
โดย:
- T = Transmittance
- I = Intensity ของตัวอย่าง
- I₀ = Intensity ของ blank

### การคำนวณจาก Regression
```
c = (A - b) / m
```
โดย:
- A = Absorbance ที่วัดได้
- m = slope ของสมการการถดถอย
- b = intercept ของสมการการถดถอย

## คุณสมบัติพิเศษ

### การบันทึกข้อมูล
- **localStorage**: ข้อมูลจะถูกบันทึกในเบราว์เซอร์
- **CSV Export**: สามารถส่งออกข้อมูลเป็นไฟล์ CSV
- **Auto-save**: ข้อมูลจะถูกบันทึกอัตโนมัติ

### การแสดงผล
- **Real-time Chart**: กราฟแบบสด
- **Statistics**: ค่าเฉลี่ย, สูงสุด, ต่ำสุด, ส่วนเบี่ยงเบนมาตรฐาน
- **Color Preview**: แสดงสีที่วัดได้
- **Status Dashboard**: แสดงสถานะระบบ

### การคำนวณ
- **Multiple Regression**: วิเคราะห์ทุกช่องสี
- **Ranking System**: เรียงลำดับตาม R² และ RMSE
- **Fallback Method**: ใช้ Beer-Lambert หากไม่มี regression data

## ข้อกำหนดระบบ

- **เบราว์เซอร์**: Chrome, Firefox, Safari, Edge (เวอร์ชันใหม่)
- **JavaScript**: ต้องเปิดใช้งาน
- **Local Storage**: ต้องเปิดใช้งาน
- **File API**: สำหรับการอัปโหลดรูปภาพ

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **ไม่สามารถบันทึกข้อมูลได้**
   - ตรวจสอบว่า localStorage เปิดใช้งาน
   - ลองล้าง cache ของเบราว์เซอร์

2. **กราฟไม่แสดง**
   - ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต (สำหรับ Chart.js CDN)
   - ลองรีเฟรชหน้าเว็บ

3. **การคำนวณไม่ถูกต้อง**
   - ตรวจสอบข้อมูล blank reference
   - ตรวจสอบค่าสีที่ป้อน

### การล้างข้อมูล

- **Clear Data**: ล้างข้อมูลการวัดทั้งหมด
- **Clear Regression**: ล้างข้อมูล regression ที่บันทึกไว้
- **Clear Log**: ล้างประวัติการวัด

## การพัฒนาเพิ่มเติม

ระบบนี้สามารถพัฒนาต่อได้ในหลายด้าน:

1. **การเชื่อมต่อกับ Hardware**: เชื่อมต่อกับเครื่องวัดจริง
2. **Database Integration**: บันทึกข้อมูลในฐานข้อมูล
3. **Machine Learning**: เพิ่มอัลกอริทึม ML สำหรับการวิเคราะห์
4. **Mobile App**: พัฒนาเป็นแอปมือถือ
5. **Cloud Integration**: บันทึกข้อมูลในระบบ Cloud
