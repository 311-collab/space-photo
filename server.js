const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// เก็บรูปไว้ในหน่วยความจำ
const photos = [];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// หน้าเว็บและไฟล์ต่าง ๆ
app.use(express.static(__dirname));

// หน้าแรก
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// หน้าอัปโหลด
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "upload.html"));
});

// รับรูป
app.post("/api/upload", upload.single("photo"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      error: "ไม่พบรูปภาพ"
    });
  }

  const photo = {
    id: Date.now(),
    name: req.file.originalname,
    type: req.file.mimetype,
    data: `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
  };

  photos.push(photo);

  // เก็บไม่เกิน 30 รูป
  if (photos.length > 30) {
    photos.shift();
  }

  res.json({
    success: true,
    photo
  });
});

// ส่งรายการรูปทั้งหมด
app.get("/api/photos", (req, res) => {
  res.json(photos);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SPACE PHOTO running on port ${PORT}`);
});
