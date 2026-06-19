// background.js

// A global variable to store the qBittorrent session cookie
// Service Workers are designed to be short-lived, so we should re-login if needed.
let qbitSessionCookie = null;
const browser = globalThis.browser || globalThis.chrome;

// --- Context Menu Creation ---
// Runs when the extension is installed/updated.
browser.runtime.onInstalled.addListener(() => {
  // Create a context menu item.
  // The unique ID is 'qbit_sender'
  browser.contextMenus.create({
    id: "qbit_sender",
    title: "Send to qBittorrent",
    contexts: ["link"], // Only show the menu item on hyperlinks
    // Only show on links ending in .torrent OR starting with magnet:
    // targetUrlPatterns: [
    //   '*://*/*.torrent*',
    //   'magnet:?*'
    // ]
  });
});

// --- API Utility Functions ---
async function notify(title, message) {
  try {
    browser.notifications.create({
      type: "basic",
      iconUrl: "icon48.png",
      title: title,
      message: message,
    });
  } catch (error) {
    console.error("alert failed:", error);
    return false;
  }
}
/**
 * Handles the login process to get a session cookie.
 * @param {string} host - qBittorrent host URL.
 * @param {string} username - Username.
 * @param {string} password - Password.
 * @returns {Promise<boolean>} - True if login was successful, false otherwise.
 */
async function login(host, username, password) {
  if (!host) {
    throw new Error("qBittorrent Host is not set in options.");
  }

  // qBittorrent API v2 uses /api/v2/auth/login with POST application/x-www-form-urlencoded
  const loginUrl = `${host}/api/v2/auth/login`;

  const formData = {
    username: username,
    password: password,
  };

  // Convert the data to x-www-form-urlencoded format
  const urlAuthParams = new URLSearchParams();
  for (const key in formData) {
    urlAuthParams.append(key, formData[key]);
  }

  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      // Send credentials as URL-encoded form data
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlAuthParams,
    });

    if (response.status === 200) {
      // Retrieve the session cookie from the response headers (this is tricky for a Service Worker)
      // For a Chrome Service Worker, we can't directly read the 'Set-Cookie' header
      // in the 'fetch' response due to security restrictions.
      // A more reliable way is to let the browser handle it *if* the API is on the same domain
      // or if we rely on a long-lived connection, which is not great for Service Workers.
      //
      // The simplest workaround: we trust the browser will automatically include the cookie
      // in subsequent requests to the same origin after a successful login.
      // However, since Service Workers are non-persistent, this is not guaranteed.

      // *Self-Correction/Educational Point:*
      // In Manifest V3 Service Workers, the standard method is to rely on the browser's
      // automatic cookie handling for same-site/same-origin. For cross-origin, it is
      // complex. Since qBittorrent is typically local, we assume the browser sets the cookie
      // and we rely on the successful 'Ok.' message as a sign that the next request will work.
      qbitSessionCookie = "DUMMY_OK"; // Mark as "logged in" state
      return true;
    } else {
      const responseText = await response.text();
      console.error("qBittorrent Login Failed:", responseText);
      return false;
    }
  } catch (error) {
    console.error("Login request failed:", error);
    return false;
  }
}

/**
 * Sends the torrent/magnet link to the qBittorrent API.
 * @param {string} host - qBittorrent host URL.
 * @param {string} linkUrl - The magnet or torrent URL.
 * @returns {Promise<boolean>} - True if add was successful.
 */
async function addTorrent(host, linkUrl) {
  // API to add links: /api/v2/torrents/add
  const addUrl = `${host}/api/v2/torrents/add`;

  // The API expects a POST request, with the URL(s) in the 'urls' field of the form data.
  const formData = new FormData();
  formData.append("urls", linkUrl);

  try {
    const response = await fetch(addUrl, {
      method: "POST",
      body: formData, // Using FormData automatically sets the correct 'Content-Type: multipart/form-data'
    });

    if (response.status === 200) {
      return true;
    } else {
      const responseText = await response.text();
      throw new Error(`qBittorrent API Error: ${responseText}`);
    }
  } catch (error) {
    console.error("Add Torrent request failed:", error);
    return false;
  }
}

// --- Context Menu Click Listener (Main Logic) ---

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  // Check if the clicked item is our 'qbit_sender'
  if (info.menuItemId === "qbit_sender") {
    const linkUrl = info.linkUrl; // This contains the URL of the clicked link (magnet or .torrent)

    // 1. Get saved credentials from storage
    const { qbitHost, qbitUsername, qbitPassword } =
      await browser.storage.local.get([
        "qbitHost",
        "qbitUsername",
        "qbitPassword",
      ]);

    if (!qbitHost || !qbitUsername || !qbitPassword) {
      notify(
        "Qbit Link Sender Error",
        "Please set your qBittorrent Host, Username, and Password in the extension options."
      );
      return;
    }

    let success = false;

    // 2. Perform Login
    const loggedIn = await login(qbitHost, qbitUsername, qbitPassword);

    if (loggedIn) {
      // 3. Send the link
      success = await addTorrent(qbitHost, linkUrl);
    } else {
      // Handle login failure
      notify(
        "qBittorrent Login Failed",
        "Could not log into qBittorrent. Check your credentials in the extension options."
      );
      return;
    }

    // 4. Send Notification Feedback
    if (success) {
      notify(
        "✅ Torrent Sent Successfully",
        `The link has been sent to qBittorrent: ${linkUrl.substring(0, 50)}...`
      );
    } else {
      notify(
        "❌ Failed to Add Torrent",
        "An error occurred while communicating with the qBittorrent API. Check console for details."
      );
    }
  }
});
