const express = require('express');
const crypto = require('crypto');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// ⚠️ 1. أول حاجة: تحميل المتغيرات البيئية
dotenv.config();

// ⚠️ 2. قراءة المتغيرات
const BACKEND_JWT_SECRET = process.env.BACKEND_JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || "HealthyLife_Super_Secret_JWT_Key_2026";

// ⚠️ 3. تأكيد تحميل المتغيرات
console.log("🔧 Environment Check:");
console.log("   BACKEND_JWT_SECRET:", BACKEND_JWT_SECRET ? "✅ Loaded" : "❌ Missing");
console.log("   GEMINI_API_KEY:", GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing");
console.log("   PORT:", PORT);

// إعداد fetch لـ CommonJS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

// ==========================================
//           MIDDLEWARE SETUP
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log("📁 Created uploads directory");
}

// ==========================================
//           MONGODB CONNECTION
// ==========================================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ DB Error:', err));

// ==========================================
//           SCHEMAS & MODELS
// ==========================================

const DailyIntakeSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  foodName: String,
  calories: Number,
  protein: Number,
  timestamp: { type: Date, default: Date.now },
});
const DailyIntake = mongoose.model('DailyIntake', DailyIntakeSchema);

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, lowercase: true },
  displayName: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  createdBy: { type: String, default: 'system' },
});
const FoodItem = mongoose.model('FoodItem', FoodItemSchema);

const BmiSchema = new mongoose.Schema({
  email: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  bmi: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
const Bmi = mongoose.model('Bmi', BmiSchema);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  salt: { type: String },
  provider: { type: String, default: "credentials" },
  image: { type: String },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  createdAt: { type: Date, default: Date.now },
  bio: { type: String }
});
const User = mongoose.model('User', UserSchema);

const NotificationSchema = new mongoose.Schema({
  email: { type: String, index: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const Notification = mongoose.model('Notification', NotificationSchema);

const LoginLogSchema = new mongoose.Schema({
  userId: String,
  email: String,
  provider: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
});
const LoginLog = mongoose.model("LoginLog", LoginLogSchema);

const AIScanLogSchema = new mongoose.Schema({
  email: { type: String, required: true },
  imageUrl: String,
  predictedFood: String,
  estimatedCalories: Number,
  estimatedProtein: Number,
  timestamp: { type: Date, default: Date.now }
});
const AIScanLog = mongoose.model("AIScanLog", AIScanLogSchema);

// ==========================================
//           HELPERS
// ==========================================

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

const foodDatabase = {
  'apple': { calories: 52, protein: 0.3 },
  'banana': { calories: 89, protein: 1.1 },
  'chicken breast': { calories: 165, protein: 31 },
  'rice': { calories: 130, protein: 2.7 },
  'egg': { calories: 155, protein: 13 },
  'milk': { calories: 42, protein: 3.4 },
  'bread': { calories: 265, protein: 9 },
  'potato': { calories: 77, protein: 2 },
  'beef': { calories: 250, protein: 26 },
  'fish': { calories: 206, protein: 22 },
  'salad': { calories: 33, protein: 1.4 },
  'pizza': { calories: 266, protein: 11 },
  'burger': { calories: 295, protein: 17 },
  'pasta': { calories: 131, protein: 5 },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ==========================================
//       ADMIN EMAILS CONFIGURATION
// ==========================================

const ADMIN_EMAILS = [
  "aethefifthofjuly@gmail.com",
];

const SUPER_ADMINS = [
  "aethefifthofjuly@gmail.com",
];

// ==========================================
//           MIDDLEWARE
// ==========================================

async function isAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Unauthorized: No session token found.',
      message: 'يجب تسجيل الدخول للوصول إلى هذه الصفحة'
    });
  }

  try {
    const decoded = jwt.verify(token, BACKEND_JWT_SECRET);
    
    let user = null;
    
    if (mongoose.Types.ObjectId.isValid(decoded.id)) {
      user = await User.findById(decoded.id);
    } else {
      user = await User.findOne({ email: decoded.email?.toLowerCase() });
    }
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized: User not found.',
        message: 'المستخدم غير موجود'
      });
    }

    // ترقية تلقائية للإيميلات المسموح بها
    if (ADMIN_EMAILS.includes(user.email) && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log(`✅ Promoted to admin: ${user.email}`);
    }

    // تنزيل الأدمنز الغير مصرح لهم
    if (user.role === 'admin' && !ADMIN_EMAILS.includes(user.email)) {
      user.role = 'user';
      await user.save();
      console.log(`❌ Demoted unauthorized admin: ${user.email}`);
    }

    // التحقق النهائي
    if (user.role !== 'admin' || !ADMIN_EMAILS.includes(user.email)) {
      return res.status(403).json({ 
        error: 'Forbidden: Access denied.',
        message: 'هذا الحساب غير مصرح له بالدخول إلى لوحة التحكم'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', message: 'انتهت الجلسة' });
    }
    return res.status(401).json({ error: 'Unauthorized', message: 'خطأ في التحقق' });
  }
}

// ==========================================
//           AUTH ROUTES
// ==========================================

// تسجيل مستخدم جديد
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  try {
    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });
    
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(password, salt);

    // ✅ تحديد الدور بناءً على القائمة
    const role = ADMIN_EMAILS.includes(cleanEmail) ? "admin" : "user";

    const newUser = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      salt,
      provider: "credentials",
      role: role,
    });

    await Notification.create({
      email: cleanEmail,
      message: `Welcome ${name}! 🎉`,
    });

    return res.status(201).json({
      message: 'Account created successfully',
      user: { 
        id: newUser._id.toString(), 
        name: newUser.name, 
        email: newUser.email,
        role: newUser.role
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// تسجيل الدخول
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const hashedPassword = hashPassword(password, user.salt);
    if (hashedPassword !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ✅ تصحيح الدور حسب القائمة
    if (ADMIN_EMAILS.includes(user.email) && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log(`✅ Promoted: ${user.email}`);
    } else if (!ADMIN_EMAILS.includes(user.email) && user.role === 'admin') {
      user.role = 'user';
      await user.save();
      console.log(`❌ Demoted: ${user.email}`);
    }

    await LoginLog.create({
      userId: user._id,
      email: user.email,
      provider: "credentials",
      status: "success",
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      BACKEND_JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.cookie('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    return res.json({
      message: 'Login successful!',
      token: token,
      user: { 
        id: user._id.toString(),
        name: user.name, 
        email: user.email, 
        role: user.role,
        image: user.image
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// OAuth
// OAuth تسجيل الدخول عن طريق
app.post("/api/auth/oauth", async (req, res) => {
  const { name, email, image, provider } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }
  
  try {
    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });
    
    if (!user) {
      // ✅ مستخدم جديد: إذا كان الإيميل في قائمة الأدمنز → admin
      const role = ADMIN_EMAILS.includes(cleanEmail) ? "admin" : "user";
      
     user = await User.create({ 
  name, 
  email: cleanEmail, 
  image, 
  provider, 
  role: role  // "admin" أو "user"
}); 
console.log(`✅ New OAuth user: ${user._id} (${role})`);
    } else {
      // ✅ مستخدم موجود: نصحح الدور إذا كان غلط
      if (ADMIN_EMAILS.includes(cleanEmail) && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
        console.log(`✅ Promoted to admin: ${cleanEmail}`);
      } else if (!ADMIN_EMAILS.includes(cleanEmail) && user.role === 'admin') {
        user.role = 'user';
        await user.save();
        console.log(`❌ Demoted unauthorized admin: ${cleanEmail}`);
      } else {
        console.log(`✅ Existing user role unchanged: ${cleanEmail} (${user.role})`);
      }
    } 

    await LoginLog.create({
      userId: user._id,
      email: cleanEmail,
      provider,
      status: "success",
    });

    return res.json({
      user: { 
        id: user._id.toString(),
        name: user.name, 
        email: user.email, 
        image: user.image, 
        role: user.role 
      },
    });
  } catch (err) {
    console.error("OAuth error:", err);
    return res.status(500).json({ error: "OAuth failed" });
  }
});

// تسجيل الخروج
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('admin_session');
  return res.json({ message: 'Logged out!' });
});

// ==========================================
//         ADMIN DASHBOARD ROUTES
// ==========================================

// إحصائيات
app.get('/api/admin/stats', isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalScans = await AIScanLog.countDocuments({});
    const totalBMIs = await Bmi.countDocuments({});
    const totalLogins = await LoginLog.countDocuments({ status: 'success' });

    res.json({ success: true, data: { totalUsers, totalScans, totalBMIs, totalLogins } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// رسم بياني
app.get('/api/admin/charts/activity', isAdmin, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activityData = await LoginLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: 'success' } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const formattedData = activityData.map(item => ({ date: item._id, logins: item.count }));
    res.json({ success: true, data: formattedData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// قائمة المستخدمين
app.get('/api/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, salt: 0 }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ترقية أدمن
app.post('/api/admin/promote', isAdmin, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ error: 'Already admin' });
    
    user.role = 'admin';
    await user.save();
    
    res.json({ success: true, message: `${user.email} is now admin` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to promote' });
  }
});

// تنزيل أدمن
app.post('/api/admin/demote', isAdmin, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  
  if (SUPER_ADMINS.includes(email.toLowerCase().trim())) {
    return res.status(403).json({ error: 'Cannot demote super admin' });
  }
  
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.role = 'user';
    await user.save();
    
    res.json({ success: true, message: `${user.email} is no longer admin` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to demote' });
  }
});

// ==========================================
//           FOOD SCANNER
// ==========================================

app.post('/api/food/scan', upload.single('image'), async (req, res) => {
  try {
    const image = req.file;
    const { email } = req.body;

    if (!image) return res.status(400).json({ error: 'Please upload an image' });
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const resizedPath = path.join('uploads', `resized-${image.filename}`);
    await sharp(image.path).resize({ width: 640 }).jpeg({ quality: 75 }).toFile(resizedPath);

    const base64Image = fs.readFileSync(resizedPath).toString('base64');

    if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
    if (fs.existsSync(resizedPath)) fs.unlinkSync(resizedPath);

    const aiPrompt = `Analyze this food image. Return ONLY a JSON object with keys: "foodName", "calories", "protein". No markdown.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: aiPrompt }, { inlineData: { mimeType: "image/jpeg", data: base64Image } }] }]
        })
      }
    );

    const geminiData = await geminiRes.json();
    let rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(rawText);

    await AIScanLog.create({ 
      email: email.toLowerCase(),
      imageUrl: resizedPath,
      predictedFood: result.foodName || "Unknown",
      estimatedCalories: Number(result.calories) || 0,
      estimatedProtein: Number(result.protein) || 0
    });

    await Notification.create({
      email: email.toLowerCase(),
      message: `AI Scan: ${result.foodName || 'Meal'} 📸`
    });

    return res.json({ success: true, result });
  } catch (err) {
    console.error('Scanner error:', err);
    return res.status(500).json({ error: 'AI analysis failed' });
  }
});

// ==========================================
//           OTHER ROUTES (موجودة)
// ==========================================

// Food Database
app.post('/api/food/create', async (req, res) => { /* ... */ });
app.post('/api/food/calculate', async (req, res) => { /* ... */ });

// Daily Intake
app.post('/api/daily-intake/add', async (req, res) => { /* ... */ });
app.get('/api/daily-intake/today', async (req, res) => { /* ... */ });
app.get('/api/daily-intake/weekly', async (req, res) => { /* ... */ });

// Health Trackers
app.post('/save/bmi', async (req, res) => { /* ... */ });
app.post('/save/calories', async (req, res) => { /* ... */ });

// Notifications
app.get('/api/notifications', async (req, res) => { /* ... */ });
app.put('/api/notifications/mark-read', async (req, res) => { /* ... */ });

// User Bio
app.get("/api/user/bio", async (req, res) => { /* ... */ });
app.post("/api/user/bio", async (req, res) => { /* ... */ });

// Gemini Chat
app.post('/chat', async (req, res) => { /* ... */ });

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Home
app.get('/', (req, res) => {
  res.json({ message: "Healthy Life API 🚀", version: "2.0.0" });
});
// راوت مؤقت لتثبيت الأدمن (شغله مرة واحدة وبعدين احذفه)
app.get('/api/fix-admin', async (req, res) => {
  try {
    const result = await User.updateOne(
      { email: "aethefifthofjuly@gmail.com" },
      { $set: { role: "admin" } }
    );
    res.json({ success: true, result });
  } catch (err) {
    res.json({ error: err.message });
  }
});
// في server.js، قبل app.listen
app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    const decoded = jwt.verify(token, BACKEND_JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // ✅ تأكد من تصحيح الدور
    if (ADMIN_EMAILS.includes(user.email) && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }
    
    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
app.get('/api/debug/users', async (req, res) => {
  const users = await User.find({}, { password: 0, salt: 0 });
  res.json(users);
});
// ==========================================
//           START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`\n🚀 Server: http://localhost:${PORT}`);
  console.log(`🔑 Admin emails: ${ADMIN_EMAILS.join(', ')}\n`);
});

module.exports = app;