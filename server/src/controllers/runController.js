const mongoose = require('mongoose');
const Run = require('@src/models/Run');

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
    const { date, distanceKm, durationMin, calories, notes, route } = req.body || {};

    const parsedDate = parseDate(date);
    const dist = toNumber(distanceKm);
    const dur = toNumber(durationMin);

    if (!parsedDate) {
      return res.status(400).json({ error: { message: 'Invalid or missing date', details: 'Provide valid ISO date' } });
    }
    if (dist === null || dist < 0) {
      return res.status(400).json({ error: { message: 'Invalid distanceKm', details: 'distanceKm must be a non-negative number' } });
    }
    if (dur === null || dur < 0) {
      return res.status(400).json({ error: { message: 'Invalid durationMin', details: 'durationMin must be a non-negative number' } });
    }

    let routeId = null;
    if (route) {
      if (!mongoose.Types.ObjectId.isValid(route)) {
        return res.status(400).json({ error: { message: 'Invalid route id', details: 'route must be a valid ObjectId' } });
      }
      routeId = route;
    }

    const run = await Run.create({
      user: req.user.id,
      date: parsedDate,
      distanceKm: dist,
      durationMin: dur,
      calories: typeof calories === 'number' ? calories : toNumber(calories),
      notes: typeof notes === 'string' ? notes : '',
      route: routeId,
    });

    return res.status(201).json({ run });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to create run', details: err.message } });
  }
};

exports.list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const from = req.query.from ? parseDate(req.query.from) : null;
    const to = req.query.to ? parseDate(req.query.to) : null;

    const filter = { user: req.user.id };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }

    const total = await Run.countDocuments(filter);
    const items = await Run.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({ items, page, limit, total, hasMore: page * limit < total });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to list runs', details: err.message } });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid run id', details: 'id must be a valid ObjectId' } });
    }

    const run = await Run.findOne({ _id: id, user: req.user.id });
    if (!run) {
      return res.status(404).json({ error: { message: 'Run not found', details: `Run ${id} not found or not owned by user` } });
    }

    return res.status(200).json({ run });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to get run', details: err.message } });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid run id', details: 'id must be a valid ObjectId' } });
    }

    const allowed = ['date', 'distanceKm', 'durationMin', 'calories', 'notes', 'route'];
    const data = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) {
        data[key] = req.body[key];
      }
    }

    if (data.date) {
      const d = parseDate(data.date);
      if (!d) return res.status(400).json({ error: { message: 'Invalid date', details: 'Provide valid ISO date' } });
      data.date = d;
    }

    if (typeof data.distanceKm !== 'undefined') {
      const v = toNumber(data.distanceKm);
      if (v === null || v < 0) return res.status(400).json({ error: { message: 'Invalid distanceKm', details: 'distanceKm must be a non-negative number' } });
      data.distanceKm = v;
    }

    if (typeof data.durationMin !== 'undefined') {
      const v = toNumber(data.durationMin);
      if (v === null || v < 0) return res.status(400).json({ error: { message: 'Invalid durationMin', details: 'durationMin must be a non-negative number' } });
      data.durationMin = v;
    }

    if (typeof data.calories !== 'undefined') {
      const v = toNumber(data.calories);
      if (v !== null && v < 0) return res.status(400).json({ error: { message: 'Invalid calories', details: 'calories must be a non-negative number' } });
      data.calories = v;
    }

    if (typeof data.route !== 'undefined' && data.route) {
      if (!mongoose.Types.ObjectId.isValid(data.route)) {
        return res.status(400).json({ error: { message: 'Invalid route id', details: 'route must be a valid ObjectId' } });
      }
    }

    const run = await Run.findOneAndUpdate({ _id: id, user: req.user.id }, data, { new: true, runValidators: true });

    if (!run) {
      return res.status(404).json({ error: { message: 'Run not found', details: `Run ${id} not found or not owned by user` } });
    }

    return res.status(200).json({ run });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to update run', details: err.message } });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid run id', details: 'id must be a valid ObjectId' } });
    }

    const deleted = await Run.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Run not found', details: `Run ${id} not found or not owned by user` } });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to delete run', details: err.message } });
  }
};
