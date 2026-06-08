const express = require('express');
const crypto = require('crypto');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
dotenv.config();

// ==== CONFIGURATION ====
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // ✅ Load from .env — never hardcode API keys
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/images',  express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// ==== MONGODB ====
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.log('❌ DB Error:', err));

// ==== SCHEMAS ====
const DailyIntakeSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  date:      { type: String, required: true },
  foodName:  String,
  calories:  Number,
  protein:   Number,
  timestamp: { type: Date, default: Date.now },
});
const DailyIntake = mongoose.model('DailyIntake', DailyIntakeSchema);

const FoodItemSchema = new mongoose.Schema({
  name:      { type: String, required: true, unique: true },
  calories:  { type: Number, required: true },
  protein:   { type: Number, required: true },
  createdBy: { type: String, default: 'system' },
});
const FoodItem = mongoose.model('FoodItem', FoodItemSchema);

const BmiSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  height:    { type: Number, required: true },
  weight:    { type: Number, required: true },
  bmi:       { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
const Bmi = mongoose.model('Bmi', BmiSchema);

const WorkoutSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  workout:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const Workout = mongoose.model('Workout', WorkoutSchema);

const CaloriesSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  calories:  { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
const Calories = mongoose.model('Calories', CaloriesSchema);

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: false
  },

  salt: {
    type: String,
    required: false
  },

  provider: {
    type: String,
    default: "credentials"
  },

  image: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  bio: {
    type: String
  }
});
const User = mongoose.model('User', UserSchema);

const NotificationSchema = new mongoose.Schema({
  email:     { type: String, required: false },
  message:   { type: String, required: true },
  read:      { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const Notification = mongoose.model('Notification', NotificationSchema);


const LoginLogSchema = new mongoose.Schema({
  userId: String,
  email: String,
  provider: String,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
bio : {type:String , required : false}
});

const LoginLog = mongoose.model("LoginLog", LoginLogSchema);
// ==== HELPERS ====
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

const foodDatabase = {
  'apple':          { calories: 52,  protein: 0.3 },
  'banana':         { calories: 89,  protein: 1.1 },
  'chicken breast': { calories: 165, protein: 31  },
  'rice':           { calories: 130, protein: 2.7 },
  'egg':            { calories: 155, protein: 13  },
  'milk':           { calories: 42,  protein: 3.4 },
  'bread':          { calories: 265, protein: 9   },
  'potato':         { calories: 77,  protein: 2   },
  'beef':           { calories: 250, protein: 26  },
  'fish':           { calories: 206, protein: 22  },
  'salad':          { calories: 33,  protein: 1.4 },
  'pizza':          { calories: 266, protein: 11  },
  'burger':         { calories: 295, protein: 17  },
  'pasta':          { calories: 131, protein: 5   },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ==========================================
//                  ROUTES
// ==========================================

// ==== NOTIFICATIONS ====

// GET /api/notifications — fetch notifications (filter by email if provided)
app.get('/api/notifications', async (req, res) => {
  try {
    const filter = req.query.email ? { email: req.query.email } : {};
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PUT /api/notifications/mark-read — mark all unread as read
app.put('/api/notifications/mark-read', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    await Notification.updateMany({ email, read: false }, { $set: { read: true } });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// ==== GEMINI CHATBOT ====
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
      }
    );
    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
    const data = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response received.';
    res.status(200).json({ reply: botReply });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ reply: 'Error communicating with AI.' });
  }
});

// ==== IMAGE UPLOAD & CALORIES CALCULATION ====
app.post('/caloriescalculator', upload.single('image'), async (req, res) => {
  try {
    const image = req.file;
    if (!image) return res.status(400).json({ error: 'Image is required' });

    const base64Image = fs.readFileSync(image.path).toString('base64');

    await sharp(image.path)
      .resize({ width: 720 })
      .jpeg({ quality: 80 })
      .toFile(`uploads/resized-${image.filename}`);

    fs.unlinkSync(image.path);

    const webhookURL = 'https://cloud.activepieces.com/api/v1/webhooks/SfbNicrtC0umtVrHAuxdP';
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:        req.body.name,
        email:       req.body.email,
        imageBase64: base64Image,
        mimeType:    image.mimetype,
      }),
    });

    if (!response.ok) return res.status(500).json({ error: 'Automation failed' });

    if (req.body.email) {
      await Notification.create({
        email:   req.body.email,
        message: 'Your meal photo was analysed and sent for calorie calculation successfully! 📸',
      });
    }

    res.status(200).json({ message: 'Image sent to automation successfully!', automationResponse: await response.text() });
  } catch (err) {
    console.error('Image processing error:', err);
    res.status(500).json({ error: 'Image processing failed' });
  }
});

// ==== FOOD DATABASE ====
app.post('/api/food/create', async (req, res) => {
  const { name, calories, protein, email } = req.body;
  if (!name || calories === undefined || protein === undefined) {
    return res.status(400).json({ error: 'Name, calories, and protein are required' });
  }
  try {
    const existing = await FoodItem.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) return res.status(400).json({ error: 'Food item already exists' });

    const newFood = await FoodItem.create({ name, calories, protein, createdBy: email ?? 'system' });
    res.json({ message: 'Food item created successfully', food: newFood });
  } catch (err) {
    console.error('Food create error:', err);
    res.status(500).json({ error: 'Failed to create food item' });
  }
});

app.post('/api/food/calculate', async (req, res) => {
  const { foodName, weight } = req.body;
  if (!foodName) return res.status(400).json({ error: 'Food name is required' });

  const lowerName  = foodName.toLowerCase().trim();
  const multiplier = weight ? parseFloat(weight) / 100 : 1;

  try {
    const dbFood = await FoodItem.findOne({ name: { $regex: new RegExp(lowerName, 'i') } });
    if (dbFood) {
      return res.json({
        foodName: dbFood.name,
        calories: Math.round(dbFood.calories * multiplier),
        protein:  Math.round(dbFood.protein  * multiplier),
        per100g:  { calories: dbFood.calories, protein: dbFood.protein },
        weight:   weight ?? 100,
        found:    true,
        source:   'database',
      });
    }

    const match = Object.keys(foodDatabase).find(key => lowerName.includes(key));
    if (match) {
      const data = foodDatabase[match];
      return res.json({
        foodName: match,
        calories: Math.round(data.calories * multiplier),
        protein:  Math.round(data.protein  * multiplier),
        per100g:  { calories: data.calories, protein: data.protein },
        weight:   weight ?? 100,
        found:    true,
        source:   'mock',
      });
    }

    return res.json({
      foodName, weight: weight ?? 100, found: false,
      calories: Math.round(100 * multiplier),
      protein:  Math.round(5   * multiplier),
      message:  'Food not found — using default estimation.',
    });
  } catch (err) {
    console.error('Food calculate error:', err);
    res.status(500).json({ error: 'Calculation failed' });
  }
});

// ==== DAILY INTAKE ====
app.post('/api/daily-intake/add', async (req, res) => {
  const { email, foodName, calories, protein } = req.body;
  if (!email || !foodName || calories === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const today    = new Date().toISOString().split('T')[0];
    const newEntry = await DailyIntake.create({ email, date: today, foodName, calories, protein: protein ?? 0 });

    await Notification.create({
      email,
      message: `New meal logged: ${foodName} (+${calories} kcal) 🍽️`,
    });

    res.json({ message: 'Meal added to daily intake', entry: newEntry });
  } catch (err) {
    console.error('Daily intake error:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.get('/api/daily-intake/today', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const today   = new Date().toISOString().split('T')[0];
    const entries = await DailyIntake.find({ email, date: today });
    res.json({
      date:           today,
      totalCalories:  entries.reduce((sum, e) => sum + e.calories, 0),
      totalProtein:   entries.reduce((sum, e) => sum + e.protein,  0),
      entries,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/api/daily-intake/weekly', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const today    = new Date();
    const last7    = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    const entries  = await DailyIntake.find({ email, date: { $in: last7 } });
    const weeklyData = last7.map(date => ({
      date,
      calories: entries.filter(e => e.date === date).reduce((sum, e) => sum + e.calories, 0),
    }));
    res.json({ weeklyData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weekly data' });
  }
});

// ==== WORKOUT REGISTRATION ====
app.post('/register', async (req, res) => {
  const { name, email, age, gender, goal, level, daysPerWeek, sessionMinutes, equipment, notes } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  try {
    const webhookURL = 'https://cloud.activepieces.com/api/v1/webhooks/SdYPrCVeXToOiEwQJdtyG';
    const response   = await fetch(webhookURL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, age, gender, goal, level, daysPerWeek, sessionMinutes, equipment, notes }),
    });
    if (!response.ok) return res.status(500).json({ error: 'Webhook failed' });

    await Notification.create({
      email,
      message: `Welcome, ${name}! Your workout plan registration was successful. Your personalised plan is being prepared 🏋️`,
    });

    res.status(200).json({ message: 'User registered and data sent successfully!' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ==== HEALTH TRACKERS ====
app.post('/save/bmi', async (req, res) => {
  const { email, height, weight, bmi } = req.body;
  if (!height || !weight || !bmi) return res.status(400).json({ error: 'All fields are required' });
  try {
    const newBmi = await Bmi.create({ email, height, weight, bmi });

    await Notification.create({
      email,
      message: `Your BMI was calculated successfully! Current BMI: ${bmi} ⚖️`,
    });

    res.status(200).json({ message: 'BMI saved successfully', Data: newBmi });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save BMI data' });
  }
});

app.get('/bmi', async (req, res) => {
  try {
    res.status(200).json(await Bmi.find({}));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch BMI data' });
  }
});

app.get('/workout', async (req, res) => {
  try {
    res.status(200).json(await Workout.find({}));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workout data' });
  }
});

app.post('/save/calories', async (req, res) => {
  const { email, calories } = req.body;
  if (!calories) return res.status(400).json({ error: 'Calories value is required' });
  try {
    const newCalories = await Calories.create({ email, calories });

    await Notification.create({
      email,
      message: `Your daily calorie goal has been updated to ${calories} kcal 🎯`,
    });

    res.status(200).json({ message: 'Calories saved successfully', Data: newCalories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save calories data' });
  }
});

app.get('/calories', async (req, res) => {
  try {
    res.status(200).json(await Calories.find({}));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch calories data' });
  }
});

// ==== AUTHENTICATION ====
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      salt,
      provider: "credentials",
    });

    await Notification.create({
      email,
      message: `Welcome ${name}! 🎉 Your account was created successfully.`,
    });

    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
});
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const hashedPassword = hashPassword(password, user.salt);

    if (hashedPassword !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 🔥 Save login log
    await LoginLog.create({
      userId: user._id,
      email: user.email,
      provider: "credentials",
      status: "success",
    });

    return res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
});
app.post("/api/auth/oauth", async (req, res) => {
  const { name, email, image, provider } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image,
        provider,
      });
    }

    // 🔥 Save login log
    await LoginLog.create({
      userId: user._id,
      email,
      provider,
      status: "success",
    });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });

  } catch (err) {
    return res.status(500).json({ error: "OAuth failed" });
  }
});
// GET BIO
app.get("/api/user/bio", async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ bio: user.bio || "" });
});

// SAVE BIO
app.post("/api/user/bio", async (req, res) => {
  const { email, bio } = req.body;

  await User.updateOne(
    { email },
    { $set: { bio } }
  );

  res.json({ success: true });
});
// ==== START ====
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));