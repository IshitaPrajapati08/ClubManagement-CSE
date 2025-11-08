import express from 'express';
import { signup, login, listUsers } from '../controllers/authcontroller.js';

const router = express.Router();

router.post('/login', login);

// Signup route
router.post('/signup', signup);

// Dev-only: list users (helpful for debugging duplicate emails)
router.get('/users', listUsers);

export default router;
