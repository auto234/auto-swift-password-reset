import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY,
  REDIRECT_URL
} = process.env;

const PORT = process.env.PORT || 3000;
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false } }
);

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/api/request-reset', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
    console.log(REDIRECT_URL);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: REDIRECT_URL
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

// ───────────────────────────────────────────────────────────
// Finish-reset: token + new password
// ───────────────────────────────────────────────────────────
app.post('/api/finish-reset', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token & password required' });
  }

  try {
    // 1️⃣ Decode the JWT payload (middle part) to grab the user id (sub)
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
    );
    const userId = payload.sub;
    if (!userId) throw new Error('Unable to extract user id from token');

    // 2️⃣ Use a service-role client for Admin API
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 3️⃣ Update that user’s password
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password
    });
    if (error) throw error;

    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});


app.listen(PORT, () =>
  console.log(`⬢  Supabase reset server listening on http://localhost:${PORT}`)
);
