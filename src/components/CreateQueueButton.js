import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { FloatButton, message } from "antd";
import dayjs from "dayjs";
import { httpsCallable } from "firebase/functions";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { functions } from "../firebase";

const QueueCreationButton = () => {
  const location = useLocation();

  const type = location.pathname.split(":")[0].split("/")[2];
  const dateStart = location.pathname.split(":")[1];
  const dateEnd = location.pathname.split(":")[2];

  const [isLoading, setIsLoading] = useState(false);

  const invokeStoryGeneration = async () => {
    setIsLoading(true);

    const inputData = {
      daily: {
        type: "daily",
        dateStart: dayjs(dateStart).format("YYYY-MM-DD"),
        dateEnd: dayjs(dateEnd).format("YYYY-MM-DD"),
      },
      weekly: {
        type: "weekly",
        dateStart: dayjs(dateStart).startOf("week").format("YYYY-MM-DD"),
        dateEnd: dayjs(dateEnd).endOf("week").format("YYYY-MM-DD"),
      },
      monthly: {
        type: "monthly",
        dateStart: dayjs(dateStart).startOf("month").format("YYYY-MM-DD"),
        dateEnd: dayjs(dateEnd).endOf("month").format("YYYY-MM-DD"),
      },
      yearly: {
        type: "yearly",
        dateStart: dayjs(dateStart).startOf("year").format("YYYY-MM-DD"),
        dateEnd: dayjs(dateEnd).endOf("year").format("YYYY-MM-DD"),
      },
    };

    const dataToSend = inputData[type];

    try {
      const invokeGenerateStoryManuallyFunction = httpsCallable(
        functions,
        "invokeGenerateStoryManually"
      );
      const result = await invokeGenerateStoryManuallyFunction(dataToSend);
      console.log("Story generation result:", result.data);

      if (result.data.success) {
        message.success(result.data.message);
      } else {
        message.error("Failed to generate the story.");
      }
    } catch (error) {
      console.error("Error generating story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FloatButton
      type="primary"
      icon={isLoading ? <LoadingOutlined /> : <ReloadOutlined />}
      onClick={invokeStoryGeneration}
      disabled={isLoading}
    />
  );
};

export default QueueCreationButton;
