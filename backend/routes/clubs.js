import express from 'express';
import Club from '../models/Club.js';

const router = express.Router();

// Get all clubs
router.get('/', async (req, res) => {
  const clubs = await Club.find().lean();
  res.json({ success: true, clubs });
});

// Create club
router.post('/', async (req, res) => {
  try {
    const c = new Club(req.body);
    await c.save();
    res.json({ success: true, club: c });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update club
router.put('/:id', async (req, res) => {
  try {
    const c = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, club: c });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete club
router.delete('/:id', async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
