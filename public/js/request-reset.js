// read flag from hash using the helper
const hash = window.parseHash();
if (hash.error_code === 'otp_expired') {
  document.getElementById('expired-msg').textContent =
    'Your link has expired. Please request a new one below.';
}

async function send() {
  const email = document.getElementById('email').value.trim();
  if (!email) return;

  const r = await fetch('/api/request-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then((r) => r.json());

  document.getElementById('msg').textContent =
    r.ok ? '✔ Check your inbox' : `✖ ${r.error}`;
}
window.send = send;
