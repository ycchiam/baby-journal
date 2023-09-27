const functions = require("firebase-functions");
const admin = require("firebase-admin");
const dayjs = require("dayjs");

admin.initializeApp();

exports.createQueueEntryOnPointChange = functions.firestore
  .document("points/{pointId}")
  .onWrite(async (change) => {
    let dateString;
    if (change.after.exists) {
      dateString = change.after.data().date; // If it's an add or update
    } else if (change.before.exists) {
      dateString = change.before.data().date; // If it's a delete
    } else {
      return null;
    }

    const date = dayjs(dateString);

    // Daily
    const dailyKey = `daily:${date.format("YYYY-MM-DD")}`;
    const dailyData = {
      type: "daily",
      dateStart: date.format("YYYY-MM-DD"),
      dateEnd: date.format("YYYY-MM-DD"),
    };

    // Weekly
    const startOfWeek = date.startOf("week");
    const endOfWeek = date.endOf("week");
    const weeklyKey = `weekly:${startOfWeek.format(
      "YYYY-MM-DD"
    )}:${endOfWeek.format("YYYY-MM-DD")}`;
    const weeklyData = {
      type: "weekly",
      dateStart: startOfWeek.format("YYYY-MM-DD"),
      dateEnd: endOfWeek.format("YYYY-MM-DD"),
    };

    // Monthly
    const startOfMonth = date.startOf("month");
    const endOfMonth = date.endOf("month");
    const monthlyKey = `monthly:${startOfMonth.format(
      "YYYY-MM-DD"
    )}:${endOfMonth.format("YYYY-MM-DD")}`;
    const monthlyData = {
      type: "monthly",
      dateStart: startOfMonth.format("YYYY-MM-DD"),
      dateEnd: endOfMonth.format("YYYY-MM-DD"),
    };

    // Yearly
    const startOfYear = date.startOf("year");
    const endOfYear = date.endOf("year");
    const yearlyKey = `yearly:${startOfYear.format(
      "YYYY-MM-DD"
    )}:${endOfYear.format("YYYY-MM-DD")}`;
    const yearlyData = {
      type: "yearly",
      dateStart: startOfYear.format("YYYY-MM-DD"),
      dateEnd: endOfYear.format("YYYY-MM-DD"),
    };

    const db = admin.firestore();

    // Write to Firestore
    const batch = db.batch();
    batch.set(db.collection("queue").doc(dailyKey), dailyData, { merge: true });
    batch.set(db.collection("queue").doc(weeklyKey), weeklyData, {
      merge: true,
    });
    batch.set(db.collection("queue").doc(monthlyKey), monthlyData, {
      merge: true,
    });
    batch.set(db.collection("queue").doc(yearlyKey), yearlyData, {
      merge: true,
    });
    return batch.commit();
  });
