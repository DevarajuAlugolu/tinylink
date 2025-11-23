import { query } from '../../../lib/db.js';
import { isValidUrl, isValidCode, randomCode } from '../../../lib/validators.js';

export async function GET() {
  try {
    const r = await query('SELECT code, url, clicks, created_at, last_clicked FROM links ORDER BY created_at DESC');
    return new Response(JSON.stringify(r.rows), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, code } = body || {};
    if (!url || !isValidUrl(url)) return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400 });

    let finalCode = code;
    if (finalCode) {
      if (!isValidCode(finalCode)) return new Response(JSON.stringify({ error: 'Invalid code format' }), { status: 400 });
    } else {
      // try generate unique code
      let exists = true;
      let tries = 0;
      while (exists && tries < 10) {
        finalCode = randomCode(6 + Math.floor(Math.random() * 3));
        const e = await query('SELECT 1 FROM links WHERE code=$1', [finalCode]);
        exists = e.rowCount > 0;
        tries++;
      }
      if (exists) return new Response(JSON.stringify({ error: 'Unable to generate unique code' }), { status: 500 });
    }

    try {
      const r = await query('INSERT INTO links (code, url) VALUES ($1, $2) RETURNING code, url, clicks, created_at, last_clicked', [finalCode, url]);
      return new Response(JSON.stringify(r.rows[0]), { status: 201 });
    } catch (e) {
      if (e.code === '23505') return new Response(JSON.stringify({ error: 'Code already exists' }), { status: 409 });
      console.error(e);
      return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
  }
}
