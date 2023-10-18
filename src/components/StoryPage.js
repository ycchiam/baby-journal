import { Typography } from "antd";
import dayjs from "dayjs";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import QueueCreationButton from "./CreateQueueButton";

const { Title, Text, Paragraph } = Typography;

const StoryPage = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    const storyDoc = doc(db, "stories", storyId);

    const unsubscribe = onSnapshot(storyDoc, (storySnapshot) => {
      if (storySnapshot.exists()) {
        setStory(storySnapshot.data());
      }
    });

    return () => unsubscribe();
  }, [storyId]);

  if (!story) return <div>Loading...</div>;

  const formatDate = (type, startDate, endDate) => {
    switch (type) {
      case "weekly":
        return `${dayjs(startDate).format("YYYY年 M月 D日")} 至 ${dayjs(
          endDate
        ).format("YYYY年 M月 D日")}`;
      case "monthly":
        return dayjs(startDate).format("YYYY年 M月");
      case "yearly":
        return dayjs(startDate).format("YYYY年");
      default:
        return dayjs(startDate).format("YYYY年 M月 D日");
    }
  };
  const formattedDate = formatDate(story.type, story.dateStart, story.dateEnd);

  if (!story)
    return (
      <div style={{ padding: "12px" }}>
        <div>Loading...</div>
      </div>
    );

  return (
    <div style={{ padding: "12px" }}>
      <div style={{ textAlign: "right" }}>
        <Text type="secondary">{formattedDate}</Text>
      </div>
      <Title level={2}>{story.title}</Title>
      <Paragraph>{story.content}</Paragraph>
      <QueueCreationButton />
    </div>
  );
};

export default StoryPage;
