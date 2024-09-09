// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(mongoURI, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User schema and model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, required: false },
  role: { type: String, required: false },
  emailVerified: { type: Boolean, required: false },
  MobileVerified: { type: Boolean, required: false }
});

const ColumnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['string', 'number', 'boolean', 'date'] }
}, { _id: false });

const CellSchema = new mongoose.Schema({
  columnId: { type: mongoose.Schema.Types.ObjectId, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { _id: false });

const RowSchema = new mongoose.Schema({
  cells: [CellSchema]
}, { _id: false });

const TableSchema = new mongoose.Schema({
  columns: [ColumnSchema],
  rows: [RowSchema]
});

const RecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  table: TableSchema
});

const Record = mongoose.model('Record', RecordSchema);

const User = mongoose.model('User', UserSchema);

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
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

    res.json({ token, userId: user._id});
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
