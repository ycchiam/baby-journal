const functions = require("firebase-functions");

exports.generateDiary = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be signed in to call this function"
    );
  }

  // Extract the date (default to today if not provided)
  const date = data.date || new Date().toISOString().split("T")[0];

  // Fetch the points for the given date from Firestore
  const pointsSnapshot = await admin
    .firestore()
    .collection("points")
    .where("date", "==", date)
    .get();

  if (pointsSnapshot.empty) {
    throw new functions.https.HttpsError(
      "not-found",
      "No points found for the provided date"
    );
  }

  // Convert points into a format suitable for your OpenAI prompt
  const points = pointsSnapshot.docs.map((doc) => doc.data().text).join(", ");
  const prompt = `Based on the following points for the day: ${points}, write a diary entry.`;

  // Make a call to OpenAI API
  const response = await axios.post(
    "https://api.openai.com/v1/engines/davinci/completions",
    {
      prompt: prompt,
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${functions.config().openai.key}`,
        "Content-Type": "application/json",
      },
    }
  );

  // Extract the diary entry from the response
  const diaryEntry = response.data.choices[0].text.trim();

  // Optionally: Save the diary entry to Firestore or another database

  // Return the generated diary entry
  return { title: "Generated Diary Title", diary: diaryEntry }; // Modify as per your needs
});
