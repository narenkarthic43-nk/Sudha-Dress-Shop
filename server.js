const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so client can upload when opening site via file:// or different port
app.use(cors());

// Parse JSON bodies (limit 50MB for large payloads/sync data)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the root directory
app.use(express.static(__dirname));

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ── Database File Setup ──
const dataFilePath = path.join(__dirname, 'data.json');

function readDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    const initialData = {
      users: [],
      images: {},
      orders: [],
      sales: [],
      offers: {},
      content: {},
      pricing: [],
      services: [],
      collections: {}
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading data.json, returning empty structure:', e);
    return {};
  }
}

function writeDataFile(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing data.json:', e);
  }
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

// Database API endpoints
app.get('/api/data', (req, res) => {
  res.json(readDataFile());
});

app.post('/api/data', (req, res) => {
  const current = readDataFile();
  // Merge the top-level keys
  const updated = { ...current };
  for (const key of Object.keys(req.body)) {
    if (typeof req.body[key] === 'object' && req.body[key] !== null && !Array.isArray(req.body[key])) {
      updated[key] = { ...updated[key], ...req.body[key] };
    } else {
      updated[key] = req.body[key];
    }
  }
  writeDataFile(updated);
  res.json({ success: true, data: updated });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Sudha Dress Shop local server is running!`);
  console.log(`Access the website: http://localhost:${PORT}`);
  console.log(`Upload folder: ${uploadDir}`);
  console.log(`Database file: ${dataFilePath}`);
  console.log(`==================================================`);
});
