// rely on window.parseHash provided by hash.js
const hash      = window.parseHash();
const token     = hash.access_token;
const errorCode = hash.error_code;

/* ---------- Link expired or invalid ---------- */
if (errorCode === 'otp_expired' || errorCode === 'invalid_link') {
  location.href = '/reset.html#expired=1';
  throw new Error('Redirecting because link is expired/invalid');
}

/* ---------- Missing token ---------- */
if (!token) {
  show('⚠ Link is invalid or missing.');
} else {
  /* ---------- Handle password–change form ---------- */
  // document.getElementById('form').addEventListener('submit', async (e) => {
  //   e.preventDefault();
  //   const password = document.getElementById('pwd').value;

  //   const r = await fetch('/api/finish-reset', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ token, password }),
  //   }).then((r) => r.json());

  //   show(r.ok ? '✔ Password updated. You may log in.' : `✖ ${r.error}`);
  // });
  document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();

    const password  = document.getElementById('pwd').value.trim();
    const password2 = document.getElementById('pwd2').value.trim();

    if (password !== password2) {
      show('⚠ Passwords do not match.');
      return;
    }

    const r = await fetch('/api/finish-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    }).then(r => r.json());

    if (r.ok) {
      // redirect to success page
      location.href = '/success.html';
    } else {
      show(`✖ ${r.error}`);
    }
  });
}

function show(msg) {
  document.getElementById('msg').textContent = msg;
}
