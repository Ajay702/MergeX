// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017';

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // or whatever your frontend URL is
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(mongoURI, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User schema and model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  role: { type: String, required: true },
  emailVerified: { type: Boolean, required: false },
  mobileVerified: { type: Boolean, default: false }, // Added mobileVerified field
  profilePic: String
});

UserSchema.pre('remove', async function(next) {
  try {
    await Record.deleteMany({ user: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', UserSchema);

// Column schema
const ColumnSchema = new mongoose.Schema({
  name: { type: String, },
  type: { type: String, enum: ['string', 'number', 'boolean', 'date'] }
}, { _id: false });

// Record schema
const RecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  columns: [ColumnSchema],
  rows: { type: [mongoose.Schema.Types.Mixed], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Record = mongoose.model('Record', RecordSchema);

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, email, password, contact, role } = req.body;

  // Validate required fields
  if (!username || !email || !password || !contact || !role) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with this username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      contact,
      role,
      emailVerified: false,
      mobileVerified: false
    });

    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/records', async (req, res) => {
  console.log('Received record creation request:', req.body);
  const { userId, name, description, columns, rows } = req.body;
  try {
    console.log('Searching for user with ID:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('User found:', user);
    console.log('Creating new record with data:', { userId, name, description, columns, rows });
    const newRecord = new Record({
      user: userId,
      name,
      description,
      columns,
      rows
    });
    console.log('New record object:', newRecord);
    const savedRecord = await newRecord.save();
    console.log('Saved record:', savedRecord);
    res.status(201).json({ msg: 'Record created successfully', record: savedRecord });
  } catch (err) {
    console.error('Error creating record:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update the parameter name to match the intended usage
app.get('/records/:userId/:recordId', async (req, res) => {
  const { recordId } = req.params;
  try {
    const record = await Record.findById(recordId); // Fetch by recordId
    if (!record) {
      return res.status(404).json({ msg: 'Record not found' });
    }
    res.json(record);
  } catch (err) {
    console.error('Error fetching record:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


app.delete('/records/:userId/:recordId', async (req, res) => {
  const { recordId } = req.params;
  console.log('Received delete request for record:', recordId);
  try {
    if (!mongoose.Types.ObjectId.isValid(recordId)) {
      console.log('Invalid record ID:', recordId);
      return res.status(400).json({ msg: 'Invalid record ID' });
    }
    const deletedRecord = await Record.findByIdAndDelete(recordId);
    if (!deletedRecord) {
      console.log('Record not found:', recordId);
      return res.status(404).json({ msg: 'Record not found' });
    }
    console.log('Record deleted successfully:', recordId);
    res.status(200).json({ msg: 'Record deleted successfully' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update record endpoint
app.put('/records/:userId/:recordId', async (req, res) => {
  const { recordId } = req.params;
  const { columns, rows } = req.body;

  try {
    const updatedRecord = await Record.findByIdAndUpdate(
      recordId,
      { 
        $set: { 
          columns: columns,
          rows: rows,
          updatedAt: Date.now()
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    console.log('Updated record:', updatedRecord);
    res.status(200).json({ msg: 'Record updated successfully', record: updatedRecord });
  } catch (err) {
    console.error('Error updating record:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get record endpoint
app.get('/records/:userId/:recordId', async (req, res) => {
  const { recordId } = req.params;
  try {
    const record = await Record.findById(recordId);
    if (!record) {
      return res.status(404).json({ msg: 'Record not found' });
    }
    console.log('Retrieved record:', record);
    res.json(record);
  } catch (err) {
    console.error('Error fetching record:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


app.get('/user/records/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('Fetching records for user:', userId);

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user ID:', userId);
      return res.status(400).json({ msg: 'Invalid user ID' });
    }

    const userRecords = await Record.find({ user: userId });
    console.log(`Found ${userRecords.length} records for user:`, userId);
    res.json(userRecords);
  } catch (err) {
    console.error('Error fetching user records:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


app.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFormats = ['.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedFormats.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only jpg, jpeg, png, and gif are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.put('/user/:userId', upload.single('profilePic'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, contact, role, emailVerified, mobileVerified } = req.body;

    const updateData = {
      username,
      email,
      contact,
      role,
      emailVerified,
      mobileVerified
    };

    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the full URL for the profile picture
    const userResponse = updatedUser.toObject();
    if (userResponse.profilePic) {
      userResponse.profilePic = `${req.protocol}://${req.get('host')}${userResponse.profilePic}`;
    }

    res.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new route to fetch user data
app.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResponse = user.toObject();
    if (userResponse.profilePic) {
      userResponse.profilePic = `${req.protocol}://${req.get('host')}${userResponse.profilePic}`;
    }

    res.json(userResponse);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


