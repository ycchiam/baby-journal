import { FireOutlined, LoadingOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { httpsCallable } from "firebase/functions";
import React, { useState } from "react";
import { functions } from "../firebase";

function SchedulerButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRunScheduler = async () => {
    setIsLoading(true);

    try {
      const invokeSchedulerManuallyFunction = httpsCallable(
        functions,
        "invokeSchedulerManually"
      );
      const result = await invokeSchedulerManuallyFunction();
      console.log("Scheduler executed:", result.data);
    } catch (error) {
      console.error("Error executing scheduler:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FloatButton
      type="primary"
      onClick={handleRunScheduler}
      icon={isLoading ? <LoadingOutlined /> : <FireOutlined />}
      disabled={isLoading}
    />
  );
}

export default SchedulerButton;
