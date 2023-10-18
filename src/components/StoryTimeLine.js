import { MehOutlined } from "@ant-design/icons";
import { ConfigProvider, Segmented, Typography } from "antd";
import dayjs from "dayjs";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import ScrollableTimeline from "../shared/ScrollableTimeline";
import SchedulerButton from "./SchedulerButton";

const { Text } = Typography;

const StoryTimeLine = () => {
  const [stories, setStories] = useState([]);
  const [selectedType, setSelectedType] = useState("daily");
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStories = useCallback(
    (afterDoc) => {
      const itemsPerPage = 16;
      let q = query(
        collection(db, "stories"),
        where("type", "==", selectedType),
        orderBy("dateStart", "desc"),
        limit(itemsPerPage)
      );

      if (afterDoc) {
        q = query(
          collection(db, "stories"),
          where("type", "==", selectedType),
          orderBy("dateStart", "desc"),
          startAfter(afterDoc),
          limit(itemsPerPage)
        );
      }
      return q;
    },
    [selectedType]
  );

  const handleSnapshot = (snapshot) => {
    const newStories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setStories((prevStories) => {
      const uniqueStories = newStories.filter(
        (newStory) =>
          !prevStories.some((existingStory) => existingStory.id === newStory.id)
      );
      return [...prevStories, ...uniqueStories];
    });

    setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
  };

  const loadMoreStories = useCallback(() => {
    if (loading) return;
    setLoading(true);
    const q = fetchStories(lastDoc);
    onSnapshot(q, (snapshot) => {
      handleSnapshot(snapshot);
      setLoading(false);
    });
  }, [loading, lastDoc, fetchStories]);

  useEffect(() => {
    setStories([]);
    setLastDoc(null);
    setLoading(true);
    const q = fetchStories();
    const unsubscribe = onSnapshot(q, (snapshot) => {
      handleSnapshot(snapshot);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [fetchStories, selectedType]);

  const timelineItems = stories.map((story) => {
    let label;

    switch (selectedType) {
      case "daily":
        label = dayjs(story.dateStart).format("YYYY年 M月 D日");
        break;
      case "weekly":
        label = `${dayjs(story.dateStart).format("YYYY年 M月 D日")} 至 ${dayjs(
          story.dateEnd
        ).format("YYYY年 M月 D日")}`;
        break;
      case "monthly":
        label = dayjs(story.dateStart).format("YYYY年 M月");
        break;
      case "yearly":
        label = dayjs(story.dateStart).format("YYYY年");
        break;
      default:
        label = `${story.dateStart} \n ${story.dateEnd}`;
        break;
    }

    return {
      color: "blue",
      dot: <MehOutlined />,
      position: "right",
      children: (
        <>
          <Text type="secondary">{label}</Text>
          <br />
          <Link to={`/stories/${story.id}`}>
            <Text>{story.title}</Text>
          </Link>
        </>
      ),
    };
  });

  return (
    <div style={{ width: "100%" }}>
      <Segmented
        style={{ margin: "24px 0px" }}
        block={true}
        options={["daily", "weekly", "monthly", "yearly"]}
        onChange={setSelectedType}
        value={selectedType}
      />
      <ConfigProvider
        theme={{
          components: {
            Timeline: {
              dotBg: "#F5F5F5",
            },
          },
        }}
      >
        <ScrollableTimeline
          navbarHeight={144}
          items={timelineItems}
          onNearBottom={loadMoreStories}
        />
      </ConfigProvider>
      <SchedulerButton />
    </div>
  );
};

export default StoryTimeLine;
