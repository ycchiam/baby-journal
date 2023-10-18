const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: functions.config().openai.key });

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const fetchJournalsFromFirestore = async (dateStart, dateEnd) => {
  const journalsRef = admin.firestore().collection("journals");
  const snapshot = await journalsRef
    .where("date", ">=", dateStart)
    .where("date", "<=", dateEnd)
    .get();

  if (snapshot.empty) {
    console.log(`No journals found for the given date range.`);
    return null;
  }

  return snapshot;
};

const generateStoryWithOpenAI = async (content, type) => {
  const typeToPrompMapping = {
    daily: `你是个专业的作家，请根据以下这些点用中文写篇日记，只要核心内容部分，不需要开场白和收尾。这篇文章是为了记录过去的一天所发生的有趣的事情。给你的点是从爸妈的视角写的，但你要小宝宝的视角写文章，且带幽默感。`,
    weekly: `你是个专业的作家，请根据以下这些点用中文写文章，只要核心内容部分，不需要开场白和收尾。这篇文章是为了记录过去一周所发生的有趣的事情。给你的点是从爸妈的视角写的，但你要小宝宝的视角写文章，且带幽默感。`,
    monthly: `你是个专业的作家，请根据以下这些点用中文写篇文章，只要核心内容部分，不需要开场白和收尾。这篇文章是为了总结过去一个月所发生的有趣的事情。给你的点是从爸妈的视角写的，但你要小宝宝的视角写文章，且带幽默感。`,
    yearly: `你是个专业的作家，请根据以下这些点用中文写篇文章，只要核心内容部分，不需要开场白和收尾。这篇文章是为了总结过去的一年所发生的有趣的事情。给你的点是从爸妈的视角写的，但你要小宝宝的视角写文章，且带幽默感。`,
  };

  const summaryResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: typeToPrompMapping[type],
      },
      { role: "user", content },
    ],
  });

  return summaryResponse.choices[0].message.content;
};

const generateTitleWithOpenAI = async (content) => {
  const titleResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "你是个专业的作家，给这篇文章写个简单的标题，只要核心内容部分。写作的第一人视角是个小宝宝，且带幽默感。",
      },
      { role: "user", content },
    ],
  });

  return titleResponse.choices[0].message.content;
};

const generateStory = async (data) => {
  const type = data.type;
  if (!type || !["daily", "weekly", "monthly", "yearly"].includes(type)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid or missing type provided."
    );
  }

  const dateStart = data.dateStart;
  const dateEnd = data.dateEnd;

  if (!dateStart || !dateEnd) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Both dateStart and dateEnd must be provided."
    );
  }

  const snapshot = await fetchJournalsFromFirestore(dateStart, dateEnd);
  if (!snapshot) return null;

  const allJournalsContent = snapshot.docs
    .map((doc) => doc.data().text)
    .join("\n");

  const associatedUids = new Set();
  snapshot.forEach((doc) => {
    const journalData = doc.data();
    if (journalData.associatedUsers && journalData.associatedUsers.length) {
      journalData.associatedUsers.forEach((uid) => associatedUids.add(uid));
    }
  });
  const uidsArray = [...associatedUids];

  const storyContent = await generateStoryWithOpenAI(allJournalsContent, type);
  const storyTitle = await generateTitleWithOpenAI(storyContent);

  // Save the summarized story entry to Firestore
  const storyKey = `stories/${type}:${dateStart}:${dateEnd}`;
  const storyData = {
    type: type,
    dateStart: dateStart,
    dateEnd: dateEnd,
    title: storyTitle,
    content: storyContent,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    viewableBy: uidsArray,
  };

  await admin.firestore().doc(storyKey).set(storyData);

  return {
    success: true,
    message: `${
      type.charAt(0).toUpperCase() + type.slice(1)
    } story generated and saved successfully.`,
  };
};

const processItems = async (type) => {
  const queueRef = admin.firestore().collection("/queue");
  const snapshot = await queueRef.where("type", "==", type).get();

  if (snapshot.empty) {
    console.log(`No items found for type ${type}`);
    return;
  }

  let promises = snapshot.docs.map(async (doc) => {
    const queueData = doc.data();
    let data = {
      type: type,
      dateStart: queueData.dateStart,
      dateEnd: queueData.dateEnd,
    };

    try {
      await generateStory(data);
      await doc.ref.delete();
    } catch (error) {
      console.error(
        `Failed to generate story for type ${type}. Error: ${error.message}`
      );
    }
  });

  return Promise.all(promises);
};

const processAllItems = async () => {
  return Promise.all([
    processItems("daily"),
    processItems("weekly"),
    processItems("monthly"),
    processItems("yearly"),
  ]);
};

exports.writerScheduler = functions
  .runWith({ timeoutSeconds: 300 })
  .pubsub.schedule("every 24 hours")
  .timeZone("UTC")
  .onRun(async () => {
    await processAllItems();
  });

exports.invokeSchedulerManually = functions
  .runWith({ timeoutSeconds: 300 })
  .https.onCall(async (data) => {
    await processAllItems();
    return { success: true, message: "Scheduler logic executed successfully." };
  });

exports.invokeGenerateStoryManually = functions
  .runWith({ timeoutSeconds: 300 })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    if (
      !data.type ||
      !["daily", "weekly", "monthly", "yearly"].includes(data.type) ||
      !data.dateStart ||
      !data.dateEnd
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Valid type, dateStart, and dateEnd must be provided."
      );
    }

    try {
      const response = await generateStory(data);
      return response;
    } catch (error) {
      console.error(`Error generating story manually: ${error.message}`);
      throw new functions.https.HttpsError(
        "internal",
        "An error occurred while generating the story."
      );
    }
  });
