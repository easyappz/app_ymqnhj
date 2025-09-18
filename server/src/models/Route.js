const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const RouteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    points: { type: [PointSchema], default: [] },
    totalDistanceKm: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

RouteSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Route', RouteSchema);
