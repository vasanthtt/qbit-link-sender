// options.js
const browser = globalThis.browser || globalThis.chrome;
// Saves options to browser.storage.local.
function save_options() {
  const host = document.getElementById('host').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // We use a Promise-based API for storage access, which is the modern approach.
  browser.storage.local.set(
    {
      qbitHost: host,
      qbitUsername: username,
      qbitPassword: password,
    },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Settings saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
}

// Restores form state using the settings stored in browser.storage.
function restore_options() {
  browser.storage.local.get(
    ['qbitHost', 'qbitUsername', 'qbitPassword'],
    (items) => {
      document.getElementById('host').value = items.qbitHost || 'https://dl.vasanthtt.com';
      document.getElementById('username').value = items.qbitUsername || '';
      document.getElementById('password').value = items.qbitPassword || '';
    }
  );
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);