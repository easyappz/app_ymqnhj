const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    targetType: { type: String, enum: ['distance', 'duration', 'pace', 'frequency'], required: true },
    targetValue: { type: Number, required: true, min: 0 },
    period: { type: String, enum: ['week', 'month', 'custom'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    progressValue: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['active', 'completed', 'failed'], default: 'active', index: true },
  },
  { timestamps: true }
);

GoalSchema.index({ user: 1, startDate: 1, endDate: 1 });

function determineStatus(doc) {
  try {
    const { targetType, targetValue, progressValue, endDate } = doc;
    const now = new Date();
    if (typeof targetValue !== 'number') return 'active';
    if (typeof progressValue === 'number' && progressValue >= targetValue) return 'completed';
    if (endDate && now > new Date(endDate)) return 'failed';
    return 'active';
  } catch (e) {
    return 'active';
  }
}

GoalSchema.pre('save', function (next) {
  try {
    this.status = determineStatus(this);
    next();
  } catch (err) {
    next(err);
  }
});

GoalSchema.pre('findOneAndUpdate', function (next) {
  try {
    const update = this.getUpdate() || {};
    const apply = (doc) => {
      const merged = { ...doc.toObject(), ...(update.$set || update) };
      const newStatus = determineStatus(merged);
      if (update.$set) {
        update.$set.status = newStatus;
      } else {
        update.status = newStatus;
      }
      next();
    };

    this.model.findOne(this.getQuery()).then((doc) => {
      if (!doc) return next();
      apply(doc);
    }).catch(next);
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Goal', GoalSchema);
