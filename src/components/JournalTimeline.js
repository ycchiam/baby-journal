import React from "react";
import { Timeline } from "antd";
import { Link } from "react-router-dom";
import { StarOutlined } from "@ant-design/icons";

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
        pendingDot={<StarOutlined />}
        style={{ width: "100%" }}
        items={timelineItems}
        reverse={true}
      />
    </div>
  );
};

export default JournalTimeline;
