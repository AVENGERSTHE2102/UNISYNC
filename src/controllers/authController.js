const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
/**
 * SIGNUP CONTROLLER
 * Triggered after Firebase creates the user on the frontend.
 * This saves the user's details and role directly into your DB.
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, userType, year, branch, company, role, interests } = req.body;

    // 1. Check if the user already exists in your DB
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User profile already exists in database' });
    }

    // 2. Create the user profile row in your DB
    // Note: Password field is set as a placeholder because Firebase Auth handles credentials securely!
    const user = await User.create({
      name,
      email,
      password: 'MANAGED_BY_FIREBASE', 
      userType, // 'student', 'mentor', or 'admin'
      year: year || null,
      branch: branch || null,
      company: company || null,
      role: role || null,
      interests: interests || []
    });

    res.status(201).json({ message: 'User profile synced and created successfully', userId: user.id });
  } catch (error) {
    console.error('Backend Signup Sync Error:', error);
    res.status(500).json({ message: 'Error syncing user profile to database', error });
  }
};

/**
 * LOGIN CONTROLLER
 * Triggered after a successful Firebase login on the frontend.
 * This looks up the user's role from your DB and passes it back to the frontend app.js.
 */
exports.login = async (req, res) => {
  try {
    const { email, firebaseToken } = req.body;

    // 1. Basic check to make sure the request has data
    if (!email) {
      return res.status(400).json({ message: 'Email identifier is required' });
    }

    // 2. Find the user inside your DB records to check their userType role
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User profile record not found in database' });
    }

    // 3. Create a local Express session token for your backend route protections (Protect Middleware)
    // We use the 'your_jwt_secret' variable just like your original architecture
    const token = jwt.sign(
      { id: user.id, userType: user.userType }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '2h' }
    );

    // 4. Send the session token and userType (Admin/Student) back to the browser app.js
    res.status(200).json({ 
      message: 'Login session approved and synced', 
      token, 
      userType: user.userType // This allows app.js to hide/show buttons!
    });
  } catch (error) {
    console.error('Backend Login Sync Error:', error);
    res.status(500).json({ message: 'Internal server error logging in', error });
  }
};