(async () => {
  try {
    const fetch = globalThis.fetch;
    const fs = await import('fs');
    const path = 'c:/Users/ishit/OneDrive/Desktop/New folder/clubflow-blue/backend/test_user.json';
    const raw = fs.readFileSync(path, { encoding: 'utf8' });
    const payload = JSON.parse(raw);

    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', body);
  } catch (err) {
    console.error(err);
  }
})();
