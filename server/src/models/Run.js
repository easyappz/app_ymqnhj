const mongoose = require('mongoose');

const RunSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true, index: true },
    distanceKm: { type: Number, required: true, min: 0 },
    durationMin: { type: Number, required: true, min: 0 },
    pace: { type: Number, default: null }, // minutes per km
    calories: { type: Number, default: null },
    notes: { type: String, default: '' },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', default: null },
  },
  { timestamps: true }
);

RunSchema.index({ user: 1, date: -1 });

function computePace(distanceKm, durationMin) {
  if (typeof distanceKm !== 'number' || typeof durationMin !== 'number') return null;
  if (!distanceKm || distanceKm <= 0) return null;
  if (durationMin < 0) return null;
  const pace = durationMin / distanceKm;
  return Math.round(pace * 100) / 100; // 2 decimals
}

RunSchema.pre('save', function (next) {
  try {
    this.pace = computePace(this.distanceKm, this.durationMin);
    next();
  } catch (err) {
    next(err);
  }
});

RunSchema.pre('findOneAndUpdate', function (next) {
  try {
    const update = this.getUpdate() || {};
    const $set = update.$set || update;

    const distance = $set.distanceKm;
    const duration = $set.durationMin;

    if (typeof distance !== 'undefined' || typeof duration !== 'undefined') {
      // Need current values if one of them not provided
      this.model.findOne(this.getQuery()).then((doc) => {
        if (!doc) return next();
        const d = typeof distance !== 'undefined' ? distance : doc.distanceKm;
        const t = typeof duration !== 'undefined' ? duration : doc.durationMin;
        const newPace = computePace(d, t);
        if (update.$set) {
          update.$set.pace = newPace;
        } else {
          update.pace = newPace;
        }
        next();
      }).catch(next);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Run', RunSchema);
