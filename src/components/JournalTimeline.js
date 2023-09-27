import { EditOutlined } from "@ant-design/icons";
import { Button, Timeline } from "antd";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import GenerateDiaryButton from "./GenerateDiaryButton";

const JournalTimeline = ({ journals }) => {
  const timelineItems = journals.map((journal) => ({
    color: "blue",
    // dot: <StarOutlined />,
    label: <>{journal.date}</>,
    children: (
      <Link to={`/points/${journal.date}`}>
        {journal.title || "Journal Entry"}
      </Link>
    ),
  }));

  const newJournalButton = (
    <Link to={`/points/${dayjs().format("YYYY-MM-DD")}`}>
      <Button type="primary" shape="circle" icon={<EditOutlined />} />
    </Link>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <Timeline
        mode="alternate"
        pending={true}
        pendingDot={newJournalButton}
        style={{ width: "100%" }}
        items={timelineItems}
      />
      <GenerateDiaryButton />
    </div>
  );
};

export default JournalTimeline;
