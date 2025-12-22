const express = require('express');
const crypto = require('crypto');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
// Try to use native fetch (Node 18+), otherwise require node-fetch
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Initialize App
const app = express();
dotenv.config();

// ==== CONFIGURATION ====
const GEMINI_API_KEY = "AIzaSyCwvH5HmOBUcD1yuhQljdgrQPVzrLT7u_8"; // ⚠️ SECURITY WARNING: Don't share this publicly
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// ==== MONGODB CONNECTION ====
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.log('❌ DB Error:', err));

// ==== SCHEMAS ====
const DailyIntakeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: String, required: true },
  foodName: String,
  calories: Number,
  protein: Number,
  timestamp: { type: Date, default: Date.now }
});
const DailyIntake = mongoose.model('DailyIntake', DailyIntakeSchema);

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  createdBy: { type: String, default: 'system' }
});
const FoodItem = mongoose.model('FoodItem', FoodItemSchema);

const BmiSchema = new mongoose.Schema({
  email: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  bmi: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});
const Bmi = mongoose.model('Bmi', BmiSchema);

const workoutSchema = new mongoose.Schema({
  email: { type: String, required: true },
  workout: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});
const Workout = mongoose.model('Workout', workoutSchema);

const CaloriesSchema = new mongoose.Schema({
  email: { type: String, required: true },
  calories: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});
const Calories = mongoose.model('Calories', CaloriesSchema);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

// ==== HELPER DATA & FUNCTIONS ====
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

const foodDatabase = {
  "apple": { calories: 52, protein: 0.3 },
  "banana": { calories: 89, protein: 1.1 },
  "chicken breast": { calories: 165, protein: 31 },
  "rice": { calories: 130, protein: 2.7 },
  "egg": { calories: 155, protein: 13 },
  "milk": { calories: 42, protein: 3.4 },
  "bread": { calories: 265, protein: 9 },
  "potato": { calories: 77, protein: 2 },
  "beef": { calories: 250, protein: 26 },
  "fish": { calories: 206, protein: 22 },
  "salad": { calories: 33, protein: 1.4 },
  "pizza": { calories: 266, protein: 11 },
  "burger": { calories: 295, protein: 17 },
  "pasta": { calories: 131, protein: 5 }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ==========================================
//              ROUTES
// ==========================================

// 1. GEMINI CHATBOT ROUTE (Updated)
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log("💬 Incoming user message:", message);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error details:", errorText);
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found.";

    console.log("🤖 Gemini replied:", botReply);
    return res.status(200).json({ reply: botReply });

  } catch (err) {
    console.log("❌ Error:", err);
    return res.status(500).json({ reply: "Error communicating with AI" });
  }
});

// 2. IMAGE UPLOAD & AUTOMATION
app.post("/caloriescalculator", upload.single("image"), async (req, res) => {
  try {
    const image = req.file;
    if (!image) return res.status(400).json({ error: "Image is required" });

    // Read and Process Image
    const fileData = fs.readFileSync(image.path);
    const base64Image = fileData.toString("base64");

    await sharp(req.file.path)
      .resize({ width: 720 })
      .jpeg({ quality: 80 })
      .toFile('uploads/resized-' + req.file.filename);

    // Delete original
    fs.unlinkSync(image.path);
    console.log("🗑️ Deleted image from server:", image.path);

    // Send to ActivePieces Webhook
    const webhookURL = "https://cloud.activepieces.com/api/v1/webhooks/SfbNicrtC0umtVrHAuxdP";
    const response = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: req.body.name,
        email: req.body.email,
        imageBase64: base64Image,
        mimeType: image.mimetype,
      }),
    });

    const text = await response.text();
    console.log("📡 Automation Response:", text);

    if (!response.ok) return res.status(500).json({ error: "Automation failed" });

    res.status(200).json({
      message: "Image sent to automation successfully!",
      automationResponse: text
    });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Image processing failed" });
  }
});

// 3. FOOD DATABASE ROUTES
app.post("/api/food/create", async (req, res) => {
  const { name, calories, protein, email } = req.body;
  if (!name || calories === undefined || protein === undefined) {
    return res.status(400).json({ error: "Name, calories, and protein are required" });
  }

  try {
    const existing = await FoodItem.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) return res.status(400).json({ error: "Food already exists" });

    const newFood = new FoodItem({ name, calories, protein, createdBy: email || 'system' });
    await newFood.save();
    res.json({ message: "Food created successfully", food: newFood });
  } catch (err) {
    console.error("Error creating food:", err);
    res.status(500).json({ error: "Failed to create food" });
  }
});

app.post("/api/food/calculate", async (req, res) => {
  const { foodName, weight } = req.body;
  if (!foodName) return res.status(400).json({ error: "Food name is required" });

  const lowerName = foodName.toLowerCase().trim();
  const multiplier = weight ? (parseFloat(weight) / 100) : 1;

  try {
    const dbFood = await FoodItem.findOne({ name: { $regex: new RegExp(lowerName, 'i') } });

    if (dbFood) {
      return res.json({
        foodName: dbFood.name,
        calories: Math.round(dbFood.calories * multiplier),
        protein: Math.round(dbFood.protein * multiplier),
        per100g: { calories: dbFood.calories, protein: dbFood.protein },
        weight: weight || 100,
        found: true,
        source: 'database'
      });
    }

    const match = Object.keys(foodDatabase).find(key => lowerName.includes(key));
    if (match) {
      const data = foodDatabase[match];
      return res.json({
        foodName: match,
        calories: Math.round(data.calories * multiplier),
        protein: Math.round(data.protein * multiplier),
        per100g: { calories: data.calories, protein: data.protein },
        weight: weight || 100,
        found: true,
        source: 'mock'
      });
    } else {
      return res.json({
        foodName: foodName,
        calories: Math.round(100 * multiplier),
        protein: Math.round(5 * multiplier),
        weight: weight || 100,
        found: false,
        message: "Food not found, using default estimation."
      });
    }
  } catch (err) {
    console.error("Error calculating food:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

// 4. DAILY INTAKE ROUTES
app.post("/api/daily-intake/add", async (req, res) => {
  const { email, foodName, calories, protein } = req.body;
  if (!email || !foodName || calories === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = new DailyIntake({ email, date: today, foodName, calories, protein: protein || 0 });
    await newEntry.save();
    res.json({ message: "Added to daily intake", entry: newEntry });
  } catch (err) {
    console.error("Error saving intake:", err);
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.get("/api/daily-intake/today", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const today = new Date().toISOString().split('T')[0];
    const entries = await DailyIntake.find({ email, date: today });
    const totalCalories = entries.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = entries.reduce((sum, item) => sum + item.protein, 0);

    res.json({ date: today, totalCalories, totalProtein, entries });
  } catch (err) {
    console.error("Error fetching intake:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/daily-intake/weekly", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    const entries = await DailyIntake.find({ email, date: { $in: last7Days } });
    const weeklyData = last7Days.map(date => {
      const dayEntries = entries.filter(e => e.date === date);
      return { date, calories: dayEntries.reduce((sum, e) => sum + e.calories, 0) };
    });

    res.json({ weeklyData });
  } catch (err) {
    console.error("Error fetching weekly data:", err);
    res.status(500).json({ error: "Failed to fetch weekly data" });
  }
});

// 5. REGISTRATION (Academy/Course)
app.post('/register', async (req, res) => {
  const { name, email, age, gender, goal, level, daysPerWeek, sessionMinutes, equipment, notes } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and Email are required' });

  try {
    const webhookURL = "https://cloud.activepieces.com/api/v1/webhooks/SdYPrCVeXToOiEwQJdtyG";
    const response = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, age, gender, goal, level, daysPerWeek, sessionMinutes, equipment, notes }),
    });

    const text = await response.text();
    if (!response.ok) return res.status(500).json({ error: 'Webhook failed' });
    res.status(200).json({ message: '✅ User registered and data sent successfully!' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 6. HEALTH TRACKERS (BMI, Workout, Calories)
app.post('/save/bmi', async (req, res) => {
  const { email, height, weight, bmi } = req.body;
  if (!height || !weight || !bmi) return res.status(400).json({ error: 'All fields are required' });
  try {
    const newBmi = new Bmi({ email, height, weight, bmi });
    await newBmi.save();
    res.status(200).json({ message: 'BMI saved successfully', Data: newBmi });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save BMI data' });
  }
});

app.get('/bmi', async (req, res) => {
  try {
    const bmi = await Bmi.find({});
    res.status(200).json(bmi);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch BMI data' });
  }
});

app.get('/workout', async (req, res) => {
  try {
    const workout = await Workout.find({});
    res.status(200).json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workout data' });
  }
});

app.post('/save/calories', async (req, res) => {
  const { email, calories } = req.body;
  if (!calories) return res.status(400).json({ error: 'All fields are required' });
  try {
    const newCalories = new Calories({ email, calories });
    await newCalories.save();
    res.status(200).json({ message: 'Calories saved successfully', Data: newCalories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save calories data' });
  }
});

app.get('/calories', async (req, res) => {
  try {
    const calories = await Calories.find({});
    res.status(200).json(calories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch calories data' });
  }
});

// 7. AUTHENTICATION (User Login/Register)
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, salt });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: { name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const hashedPassword = hashPassword(password, user.salt);
    if (hashedPassword !== user.password) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ==== START SERVER ====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});