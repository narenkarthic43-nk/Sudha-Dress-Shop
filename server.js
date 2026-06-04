const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so client can upload when opening site via file:// or different port
app.use(cors());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique name: timestamp + original extension
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${basename}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload API endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the relative path of the file
  const relativePath = `uploads/${req.file.filename}`;
  res.json({ url: relativePath });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Sudha Dress Shop local server is running!`);
  console.log(`Access the website: http://localhost:${PORT}`);
  console.log(`Upload folder: ${uploadDir}`);
  console.log(`==================================================`);
});
