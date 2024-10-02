// backend -> controllers -> usercontroller.js


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import { db } from '../db.js';

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, membershipId } = req.body;

  if (!name || !email || !password || !membershipId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery = 'INSERT INTO users (name, email, password, membership_id) VALUES (?, ?, ?, ?)';

    db.query(insertUserQuery, [name, email, hashedPassword, membershipId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error registering user', error: err });

      const userId = result.insertId;
      const qrData = JSON.stringify({ userId });

      QRCode.toString(qrData, { type: 'svg' }, (err, qrCode) => {
        if (err) return res.status(500).json({ message: 'Error generating QR code', error: err });

        const insertQrQuery = 'INSERT INTO qr_codes (user_id, qr_code) VALUES (?, ?)';
        db.query(insertQrQuery, [userId, qrCode], (err) => {
          if (err) return res.status(500).json({ message: 'Error saving QR code', error: err });
          return res.status(201).json({ message: 'User registered successfully', qrCode });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during registration', error });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }


  if (email === 'admin@gmail.com' && password === 'admin') {
    const adminToken = jwt.sign({ id: 'admin', isAdmin: true }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    return res.status(200).json({
      message: 'Admin login successful',
      token: adminToken,
      user: { id: 'admin', email: 'admin@gmail.com', isAdmin: true },
    });
  }


  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, isAdmin: false }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, isAdmin: false },
      });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login', error });
  }
};


// Admin Login (hardcoded)
// Admin Login (hardcoded)
export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin credentials
  if (email === 'admin@gmail.com' && password === 'admin') {
    const adminToken = jwt.sign({ id: 'admin', isAdmin: true }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    return res.status(200).json({
      message: 'Admin login successful',
      token: adminToken,
      user: { id: 'admin', email: 'admin@gmail.com', isAdmin: true },
    });
  } else {
    // Return error if credentials do not match
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
};


// Fetch QR Code
export const getQrCode = (req, res) => {
  const userId = req.userId;
  const query = 'SELECT qr_code FROM qr_codes WHERE user_id = ?';

  db.query(query, [userId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    return res.status(200).json({ qrCode: result[0].qr_code });
  });
};
