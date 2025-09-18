const User = require('@src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, TOKEN_EXPIRES_IN } = require('@src/config/constants');

const buildUserResponse = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  age: user.age,
  weight: user.weight,
  height: user.height,
  avatarUrl: user.avatarUrl || '',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

exports.register = async (req, res) => {
  try {
    const { email, password, name, age, weight, height } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: name || '',
      age: typeof age === 'number' ? age : null,
      weight: typeof weight === 'number' ? weight : null,
      height: typeof height === 'number' ? height : null,
    });

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    return res.status(201).json({ user: buildUserResponse(user), token });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    const safeUser = await User.findById(user._id);
    return res.status(200).json({ user: buildUserResponse(safeUser), token });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
};
