🛡️ Privacy Policy Template: Qbit Link Sender Extension
Effective Date: 11th Oct 2025

1. Introduction
The Qbit Link Sender Chrome Extension ("the Extension") is designed to provide users with a quick and seamless way to send magnet links and torrent file URLs directly to their self-hosted qBittorrent instance. We are committed to protecting your privacy and ensuring transparency regarding the limited data handled by this Extension.

2. Data Collection and Handling
The Extension operates with a principle of data minimization and does not collect, store, or transmit any user data to the Extension developer. All sensitive data handling occurs solely between the user's browser and the user's private qBittorrent server.

A. Information Accessed by the Extension
Data Type	How Data is Used	Developer Access
User Provided Configuration	The user's self-hosted qBittorrent server address, port, and authentication credentials (username/password).	Stored locally in the user's browser storage. Never transmitted to the Extension developer.
Link Data	The specific URL or Magnet Link the user right-clicks on. This is accessed via the contextMenus API.	Processed instantaneously to formulate the fetch request to the user's qBittorrent server. Not stored by the Extension.
Web Browser Activity	The URL/link sent to the qBittorrent server is derived from the user's browsing activity (the link they clicked).	Processed solely for the Extension's primary function: initiating a download on the user's private server.

Export to Sheets
B. Purpose of Data Handling
The data mentioned above is handled exclusively for the following purpose, which constitutes the single purpose of the Extension:

To enable the core functionality of the Extension: facilitating the secure transfer of magnet links and torrent URLs to a qBittorrent server specified and managed by the user.

3. Data Storage and Security
Storage Location: All user-provided configuration data (server address, credentials) is stored locally within the user's browser, utilizing Chrome's built-in storage mechanisms.

Security of Transmission: The Extension uses the fetch API to communicate with the user's qBittorrent server. It is the user's responsibility to ensure their qBittorrent server is configured to use HTTPS (encrypted connection) to protect their credentials and link data during transmission. The Extension supports and is designed to enforce secure connections where possible.

4. Third-Party Sharing and Disclosure
The Extension does not share or disclose any user data, personal or otherwise, with any third parties or advertisers.

The only external service the Extension communicates with is the qBittorrent server address provided by the user. This communication is entirely controlled by the user and is essential for the functionality of the Extension.

5. Compliance with Laws
We are committed to complying with all applicable privacy laws and Chrome Web Store policies. By using the Extension, you acknowledge that you are responsible for the privacy practices of your self-hosted qBittorrent instance.

6. User Rights
Since the Extension does not store any persistent user data (except local configuration), the right to access, modify, or delete data primarily relates to the configuration stored locally in your browser:

Access/Modification: You can view and change your stored qBittorrent configuration via the Extension's settings page (if provided) or by reloading the Extension.

Deletion: Deleting or uninstalling the Extension will automatically remove all locally stored configuration data.

7. Contact Information
If you have any questions or concerns about this Privacy Policy or the data practices of the Qbit Link Sender Extension, please contact the developer at:

Developer: Vasanth T T
Email: vasanth.tt@gmail.com