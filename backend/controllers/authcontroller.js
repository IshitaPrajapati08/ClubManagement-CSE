import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function signup(req, res) {
  try {
    const { name, email, password, role = 'student', department } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, email, and password are required' });
    }

    // Normalize email
    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ success: false, error: 'Email already exists' });

    const hashed = await bcrypt.hash(String(password), 10);
    const user = new User({ name: String(name).trim(), email: normalizedEmail, password: hashed, role, department });
    await user.save();

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const userObj = { id: user._id.toString(), name: user.name, email: user.email, role: user.role, department: user.department };

    res.status(201).json({ success: true, user: userObj, token });
  } catch (err) {
    console.error('signup error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, error: 'Missing credentials' });

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });

    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) return res.status(400).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const userObj = { id: user._id.toString(), name: user.name, email: user.email, role: user.role, department: user.department };

    res.json({ success: true, user: userObj, token });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// Development helper: list users (no passwords)
export async function listUsers(req, res) {
  try {
    const users = await User.find().select('-password -__v').lean();
    res.json({ success: true, users });
  } catch (err) {
    console.error('listUsers error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}
