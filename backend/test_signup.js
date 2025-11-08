const fetch = globalThis.fetch || (await import('node-fetch')).default;

const url = 'http://localhost:5000/api/auth/signup';
const payload = { name: 'Test Student', email: 'student@example.com', password: 'password123', role: 'student' };

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
  .then(r => r.json())
  .then(console.log)
  .catch(err => console.error('ERROR', err));
