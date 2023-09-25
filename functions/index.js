/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.createQueueEntryOnPointChange = functions.firestore
  .document("points/{pointId}")
  .onWrite(async (change, context) => {
    // Get the current and previous value
    const newValue = change.after.data();
    const previousValue = change.before.data();

    // Determine if it's a new point or an updated point
    if (!previousValue && newValue) {
      // This is a new point
      // ... Add your logic for a new point here if needed ...
    } else if (previousValue && newValue) {
      // This is an updated point
      // ... Add your logic for an updated point here if needed ...
    } else {
      // This point was deleted
      return null;
    }

    // Create the queue entry in /queue
    const queueData = {
      type: "daily", // Update this according to your business logic
      dateStart: admin.firestore.Timestamp.now(), // Modify this according to your needs
      dateEnd: admin.firestore.Timestamp.now(), // Modify this according to your needs
    };

    return admin.firestore().collection("queue").add(queueData);
  });
