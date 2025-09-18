const Run = require('@src/models/Run');

function parseDate(value) {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

exports.summary = async (req, res) => {
  try {
    const from = req.query.from ? parseDate(req.query.from) : null;
    const to = req.query.to ? parseDate(req.query.to) : null;

    const match = { user: req.user.id };
    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = from;
      if (to) match.date.$lte = to;
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: null,
          totalDistanceKm: { $sum: '$distanceKm' },
          totalDurationMin: { $sum: '$durationMin' },
          totalRuns: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalDistanceKm: 1,
          totalDurationMin: 1,
          totalRuns: 1,
          avgPace: {
            $cond: [
              { $gt: ['$totalDistanceKm', 0] },
              { $divide: ['$totalDurationMin', '$totalDistanceKm'] },
              null,
            ],
          },
        },
      },
    ];

    const result = await Run.aggregate(pipeline);
    const summary = result[0] || { totalDistanceKm: 0, totalDurationMin: 0, totalRuns: 0, avgPace: null };

    return res.status(200).json({ summary });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to get summary stats', details: err.message } });
  }
};

exports.weekly = async (req, res) => {
  try {
    const n = Math.min(52, Math.max(1, parseInt(req.query.n, 10) || 12));
    const from = req.query.from ? parseDate(req.query.from) : null;
    const to = req.query.to ? parseDate(req.query.to) : null;

    const match = { user: req.user.id };
    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = from;
      if (to) match.date.$lte = to;
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: { year: { $isoWeekYear: '$date' }, week: { $isoWeek: '$date' } },
          totalDistanceKm: { $sum: '$distanceKm' },
          totalDurationMin: { $sum: '$durationMin' },
          totalRuns: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.week': -1 } },
      { $limit: n },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          week: '$_id.week',
          totalDistanceKm: 1,
          totalDurationMin: 1,
          totalRuns: 1,
          avgPace: {
            $cond: [
              { $gt: ['$totalDistanceKm', 0] },
              { $divide: ['$totalDurationMin', '$totalDistanceKm'] },
              null,
            ],
          },
        },
      },
    ];

    const items = await Run.aggregate(pipeline);
    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to get weekly stats', details: err.message } });
  }
};

exports.monthly = async (req, res) => {
  try {
    const n = Math.min(36, Math.max(1, parseInt(req.query.n, 10) || 12));
    const from = req.query.from ? parseDate(req.query.from) : null;
    const to = req.query.to ? parseDate(req.query.to) : null;

    const match = { user: req.user.id };
    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = from;
      if (to) match.date.$lte = to;
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          totalDistanceKm: { $sum: '$distanceKm' },
          totalDurationMin: { $sum: '$durationMin' },
          totalRuns: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: n },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalDistanceKm: 1,
          totalDurationMin: 1,
          totalRuns: 1,
          avgPace: {
            $cond: [
              { $gt: ['$totalDistanceKm', 0] },
              { $divide: ['$totalDurationMin', '$totalDistanceKm'] },
              null,
            ],
          },
        },
      },
    ];

    const items = await Run.aggregate(pipeline);
    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to get monthly stats', details: err.message } });
  }
};
