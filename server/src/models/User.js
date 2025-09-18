const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, default: '' },
    age: { type: Number, default: null },
    weight: { type: Number, default: null },
    height: { type: Number, default: null },
    avatarUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model('User', UserSchema);
