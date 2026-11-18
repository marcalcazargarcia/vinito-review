/* Cellar web push service worker.
 * Firebase JS SDK 13.3.0 (the version firebase_core_web 4.2.0 is tested with).
 * The config below is public identifiers, copied from lib/firebase_options.dart. */

// Registered before the Firebase scripts so that it runs first and wins the
// click (the SDK has its own handler, which we do not want to double up with).
self.addEventListener('notificationclick', (event) => {
  event.stopImmediatePropagation();
  event.notification.close();

  const data = event.notification.data || {};
  const fcm = data.FCM_MSG || {};
  const postId = (fcm.data && fcm.data.postId) || data.postId;
  const target = new URL(
    postId ? './#/post/' + encodeURIComponent(postId) : './',
    self.location.href,
  ).href;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });
    const origin = new URL(target).origin;
    for (const client of windows) {
      if (new URL(client.url).origin !== origin) continue;
      try {
        await client.focus();
        if ('navigate' in client) await client.navigate(target);
        return;
      } catch (_) {
        // fall through and open a new window
      }
    }
    await self.clients.openWindow(target);
  })());
});

importScripts('https://www.gstatic.com/firebasejs/13.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/13.3.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC6v4zHZgTTzAoSuCs7VkpdetVxWcpJDv0',
  appId: '1:1036030142154:web:33153568e60391f7eaf633',
  messagingSenderId: '1036030142154',
  projectId: 'cellar-49c04',
  authDomain: 'cellar-49c04.firebaseapp.com',
  storageBucket: 'cellar-49c04.firebasestorage.app',
});

// Notification messages are displayed by the SDK automatically.
firebase.messaging();
