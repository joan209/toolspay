rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public, read-only config the dashboard needs before auth
    match /rates/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /giftcardRates/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /walletRates/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /wallets/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /announcements/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /processingTimes/{doc} { allow read: if true; allow write: if request.auth != null; }

    // Users: each user can read/write their own doc
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // Trades: user can create & read their own trades
    match /trades/{tradeId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && request.resource.data.uid == request.auth.uid;
    }

    // Withdrawals: user can create & read their own
    match /withdrawals/{wdId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && request.resource.data.uid == request.auth.uid;
    }

    // Chat
    match /chats/{uid}/messages/{msgId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
      }
