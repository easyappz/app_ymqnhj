const User = require('@src/models/User');

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

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found', details: `User ${req.user.id} not found` } });
    }
    return res.status(200).json({ user: buildUserResponse(user) });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to fetch profile', details: err.message } });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const allowed = ['name', 'age', 'weight', 'height'];
    const data = {};
    allowed.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) {
        data[key] = req.body[key];
      }
    });

    const updated = await User.findByIdAndUpdate(req.user.id, data, { new: true, runValidators: true });

    if (!updated) {
      return res.status(404).json({ error: { message: 'User not found', details: `User ${req.user.id} not found` } });
    }

    return res.status(200).json({ user: buildUserResponse(updated) });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to update profile', details: err.message } });
  }
};
