export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const PISTON_ENDPOINTS = [
    'https://emkc.org/api/v2/piston/execute',
    'https://piston.engineering/api/v2/piston/execute',
    'https://piston.emkc.org/api/v2/piston/execute',
    'https://piston.jgscripts.com/api/v2/piston/execute',
    'https://piston-api.tough-dev.com/api/v2/piston/execute',
  ];

  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});

  let lastError = 'Execution service unavailable';

  for (const endpoint of PISTON_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      } else {
        lastError = `Piston API (${endpoint}) responded with HTTP ${response.status}`;
      }
    } catch (err) {
      lastError = err?.message || String(err);
    }
  }

  return res.status(502).json({
    error: 'All backend code execution instances failed or timed out.',
    details: lastError,
  });
}
