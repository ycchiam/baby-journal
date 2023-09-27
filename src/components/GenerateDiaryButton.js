import { getApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const app = getApp();
const functions = getFunctions(app);

function GenerateDiaryButton() {
  const handleGenerateDiary = async () => {
    try {
      const generateDiaryFunction = httpsCallable(functions, "generateDiary");
      const result = await generateDiaryFunction({ date: "2023-09-21" }); // Example date
      console.log("Generated diary:", result.data);
    } catch (error) {
      console.error("Error generating diary:", error);
    }
  };

  return <button onClick={handleGenerateDiary}>Generate Diary</button>;
}

export default GenerateDiaryButton;
