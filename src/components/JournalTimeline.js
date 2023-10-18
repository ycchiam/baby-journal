import { EditOutlined, MehOutlined } from "@ant-design/icons";
import { FloatButton, Typography } from "antd";
import dayjs from "dayjs";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import ScrollableTimeline from "../shared/ScrollableTimeline";

const { Text } = Typography;

const JournalTimeline = () => {
  const [stories, setStories] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJournalsQuery = (afterDoc) => {
    const itemsPerPage = 16;
    return afterDoc
      ? query(
          collection(db, "journals"),
          orderBy("date", "desc"),
          startAfter(afterDoc),
          limit(itemsPerPage)
        )
      : query(
          collection(db, "journals"),
          orderBy("date", "desc"),
          limit(itemsPerPage)
        );
  };

  const processSnapshot = (snapshot) => {
    const journals = snapshot.docs.map((doc) => doc.data());
    const lastSnapshotDoc = snapshot.docs[snapshot.docs.length - 1];

    if (lastSnapshotDoc) {
      setLastDoc(lastSnapshotDoc);
    }

    const storiesByDate = journals.reduce((acc, journal) => {
      if (!acc[journal.date]) {
        acc[journal.date] = [];
      }
      acc[journal.date].push(journal.text);
      return acc;
    }, {});

    setStories((prevStories) => ({
      ...prevStories,
      ...storiesByDate,
    }));
  };

  const loadMoreJournals = useCallback(() => {
    if (loading) return;
    setLoading(true);

    const q = fetchJournalsQuery(lastDoc);

    onSnapshot(q, (snapshot) => {
      processSnapshot(snapshot);
      setLoading(false);
    });
  }, [loading, lastDoc]);

  useEffect(() => {
    loadMoreJournals();
  }, [loadMoreJournals]);

  const timelineItems = Object.entries(stories).map(([date, texts]) => {
    let label = dayjs(date).format("YYYY年 M月 D日");

    return {
      key: date,
      color: "blue",
      dot: <MehOutlined />,
      position: "right",
      children: (
        <Link to={`/journals/${date}`}>
          <Text type="secondary">{label}</Text>
          <br />
          {texts.map((text, index) => (
            <Text key={index} className="truncate-text">
              {text}
            </Text>
          ))}
        </Link>
      ),
    };
  });

  return (
    <div style={{ width: "100%" }}>
      <ScrollableTimeline
        navbarHeight={64}
        items={timelineItems}
        onNearBottom={loadMoreJournals}
      />
      <Link to={`/journals/${dayjs().format("YYYY-MM-DD")}`}>
        <FloatButton type="primary" icon={<EditOutlined />} />
      </Link>
    </div>
  );
};

export default JournalTimeline;
