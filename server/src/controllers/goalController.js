const mongoose = require('mongoose');
const Goal = require('@src/models/Goal');

function parseDate(value) {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function toNumber(n) {
  if (typeof n === 'number') return n;
  if (typeof n === 'string') {
    const v = Number(n);
    return Number.isNaN(v) ? null : v;
  }
  return null;
}

exports.create = async (req, res) => {
  try {
    const { title, targetType, targetValue, period, startDate, endDate, progressValue } = req.body || {};

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: { message: 'Invalid title', details: 'title is required and must be string' } });
    }
    if (!['distance', 'duration', 'pace', 'frequency'].includes(targetType)) {
      return res.status(400).json({ error: { message: 'Invalid targetType', details: "Must be one of 'distance'|'duration'|'pace'|'frequency'" } });
    }
    const targetVal = toNumber(targetValue);
    if (targetVal === null || targetVal < 0) {
      return res.status(400).json({ error: { message: 'Invalid targetValue', details: 'targetValue must be a non-negative number' } });
    }
    if (!['week', 'month', 'custom'].includes(period)) {
      return res.status(400).json({ error: { message: 'Invalid period', details: "Must be one of 'week'|'month'|'custom'" } });
    }
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (!start || !end) {
      return res.status(400).json({ error: { message: 'Invalid dates', details: 'startDate and endDate must be valid ISO dates' } });
    }
    if (start > end) {
      return res.status(400).json({ error: { message: 'Invalid date range', details: 'startDate must be before endDate' } });
    }

    const goal = await Goal.create({
      user: req.user.id,
      title: title.trim(),
      targetType,
      targetValue: targetVal,
      period,
      startDate: start,
      endDate: end,
      progressValue: typeof progressValue === 'number' ? progressValue : toNumber(progressValue) || 0,
    });

    return res.status(201).json({ goal });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to create goal', details: err.message } });
  }
};

exports.list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const status = req.query.status;

    const filter = { user: req.user.id };
    if (status && ['active', 'completed', 'failed'].includes(status)) {
      filter.status = status;
    }

    const total = await Goal.countDocuments(filter);
    const items = await Goal.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({ items, page, limit, total, hasMore: page * limit < total });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to list goals', details: err.message } });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid goal id', details: 'id must be a valid ObjectId' } });
    }

    const goal = await Goal.findOne({ _id: id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ error: { message: 'Goal not found', details: `Goal ${id} not found or not owned by user` } });
    }

    return res.status(200).json({ goal });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to get goal', details: err.message } });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid goal id', details: 'id must be a valid ObjectId' } });
    }

    const allowed = ['title', 'targetType', 'targetValue', 'period', 'startDate', 'endDate', 'progressValue'];
    const data = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) {
        data[key] = req.body[key];
      }
    }

    if (typeof data.title !== 'undefined' && (!data.title || typeof data.title !== 'string')) {
      return res.status(400).json({ error: { message: 'Invalid title', details: 'title must be string' } });
    }
    if (typeof data.targetType !== 'undefined' && !['distance', 'duration', 'pace', 'frequency'].includes(data.targetType)) {
      return res.status(400).json({ error: { message: 'Invalid targetType', details: "Must be one of 'distance'|'duration'|'pace'|'frequency'" } });
    }
    if (typeof data.targetValue !== 'undefined') {
      const v = toNumber(data.targetValue);
      if (v === null || v < 0) return res.status(400).json({ error: { message: 'Invalid targetValue', details: 'targetValue must be a non-negative number' } });
      data.targetValue = v;
    }
    if (typeof data.period !== 'undefined' && !['week', 'month', 'custom'].includes(data.period)) {
      return res.status(400).json({ error: { message: 'Invalid period', details: "Must be one of 'week'|'month'|'custom'" } });
    }
    if (typeof data.startDate !== 'undefined') {
      const v = parseDate(data.startDate);
      if (!v) return res.status(400).json({ error: { message: 'Invalid startDate', details: 'Must be a valid ISO date' } });
      data.startDate = v;
    }
    if (typeof data.endDate !== 'undefined') {
      const v = parseDate(data.endDate);
      if (!v) return res.status(400).json({ error: { message: 'Invalid endDate', details: 'Must be a valid ISO date' } });
      data.endDate = v;
    }
    if (typeof data.startDate !== 'undefined' && typeof data.endDate !== 'undefined' && data.startDate > data.endDate) {
      return res.status(400).json({ error: { message: 'Invalid date range', details: 'startDate must be before endDate' } });
    }
    if (typeof data.progressValue !== 'undefined') {
      const v = toNumber(data.progressValue);
      if (v === null || v < 0) return res.status(400).json({ error: { message: 'Invalid progressValue', details: 'progressValue must be a non-negative number' } });
      data.progressValue = v;
    }

    const goal = await Goal.findOneAndUpdate({ _id: id, user: req.user.id }, data, { new: true, runValidators: true });
    if (!goal) {
      return res.status(404).json({ error: { message: 'Goal not found', details: `Goal ${id} not found or not owned by user` } });
    }

    return res.status(200).json({ goal });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to update goal', details: err.message } });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid goal id', details: 'id must be a valid ObjectId' } });
    }

    const deleted = await Goal.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Goal not found', details: `Goal ${id} not found or not owned by user` } });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to delete goal', details: err.message } });
  }
};
