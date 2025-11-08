import express from 'express';
import JoinRequest from '../models/JoinRequest.js';
import Club from '../models/Club.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const reqs = await JoinRequest.find().lean();
  res.json({ success: true, joinRequests: reqs });
});

router.post('/', async (req, res) => {
  try {
    const jr = new JoinRequest(req.body);
    await jr.save();
    res.json({ success: true, joinRequest: jr });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const jr = await JoinRequest.findByIdAndUpdate(req.params.id, { status, updatedAt: new Date() }, { new: true });

    // If approved, add to club members (use _id)
    if (status === 'approved' && jr) {
      await Club.findByIdAndUpdate(jr.clubId, { $push: { members: { id: jr.studentId, name: jr.studentName, email: jr.studentEmail } } });
    }

    res.json({ success: true, joinRequest: jr });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
