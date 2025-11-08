import express from 'express';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const regs = await Registration.find().lean();
  res.json({ success: true, registrations: regs });
});

router.post('/', async (req, res) => {
  try {
    const reg = new Registration(req.body);
    await reg.save();

    // add participant to Event
    await Event.findByIdAndUpdate(reg.eventId, { $push: { participants: { id: reg.studentId, name: reg.studentName, email: reg.studentEmail } } });

    res.json({ success: true, registration: reg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
