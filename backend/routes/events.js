import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const events = await Event.find().lean();
  res.json({ success: true, events });
});

router.post('/', async (req, res) => {
  try {
    const e = new Event(req.body);
    await e.save();
    res.json({ success: true, event: e });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const e = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, event: e });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
