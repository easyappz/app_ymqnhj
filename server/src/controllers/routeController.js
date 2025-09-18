const mongoose = require('mongoose');
const Route = require('@src/models/Route');

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
    const { name, description, points, totalDistanceKm } = req.body || {};

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: { message: 'Invalid name', details: 'name is required and must be string' } });
    }

    let pts = Array.isArray(points) ? points : [];
    pts = pts
      .filter((p) => p && typeof p.lat !== 'undefined' && typeof p.lng !== 'undefined')
      .map((p) => ({ lat: Number(p.lat), lng: Number(p.lng) }))
      .filter((p) => !Number.isNaN(p.lat) && !Number.isNaN(p.lng));

    const total = typeof totalDistanceKm !== 'undefined' ? toNumber(totalDistanceKm) : 0;
    if (total !== null && total < 0) {
      return res.status(400).json({ error: { message: 'Invalid totalDistanceKm', details: 'Must be non-negative number' } });
    }

    const route = await Route.create({
      user: req.user.id,
      name: name.trim(),
      description: typeof description === 'string' ? description : '',
      points: pts,
      totalDistanceKm: total || 0,
    });

    return res.status(201).json({ route });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to create route', details: err.message } });
  }
};

exports.list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const filter = { user: req.user.id };
    const total = await Route.countDocuments(filter);
    const items = await Route.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({ items, page, limit, total, hasMore: page * limit < total });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to list routes', details: err.message } });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid route id', details: 'id must be a valid ObjectId' } });
    }

    const route = await Route.findOne({ _id: id, user: req.user.id });
    if (!route) {
      return res.status(404).json({ error: { message: 'Route not found', details: `Route ${id} not found or not owned by user` } });
    }

    return res.status(200).json({ route });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to get route', details: err.message } });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid route id', details: 'id must be a valid ObjectId' } });
    }

    const allowed = ['name', 'description', 'points', 'totalDistanceKm'];
    const data = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) {
        data[key] = req.body[key];
      }
    }

    if (typeof data.name !== 'undefined' && (!data.name || typeof data.name !== 'string')) {
      return res.status(400).json({ error: { message: 'Invalid name', details: 'name must be string' } });
    }

    if (typeof data.points !== 'undefined') {
      let pts = Array.isArray(data.points) ? data.points : [];
      pts = pts
        .filter((p) => p && typeof p.lat !== 'undefined' && typeof p.lng !== 'undefined')
        .map((p) => ({ lat: Number(p.lat), lng: Number(p.lng) }))
        .filter((p) => !Number.isNaN(p.lat) && !Number.isNaN(p.lng));
      data.points = pts;
    }

    if (typeof data.totalDistanceKm !== 'undefined') {
      const v = toNumber(data.totalDistanceKm);
      if (v === null || v < 0) return res.status(400).json({ error: { message: 'Invalid totalDistanceKm', details: 'Must be non-negative number' } });
      data.totalDistanceKm = v;
    }

    const route = await Route.findOneAndUpdate({ _id: id, user: req.user.id }, data, { new: true, runValidators: true });
    if (!route) {
      return res.status(404).json({ error: { message: 'Route not found', details: `Route ${id} not found or not owned by user` } });
    }

    return res.status(200).json({ route });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to update route', details: err.message } });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid route id', details: 'id must be a valid ObjectId' } });
    }

    const deleted = await Route.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Route not found', details: `Route ${id} not found or not owned by user` } });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to delete route', details: err.message } });
  }
};
