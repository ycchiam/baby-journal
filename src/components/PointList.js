import { DatePicker, List } from "antd";
import dayjs from "dayjs";
import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, toFirestoreTimestamp } from "../firebase";
import AddPointModal from "./AddPointModal";
import RemoveDocModal from "./RemovePointModal";

function PointList() {
  const [points, setPoints] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    const q = query(
      collection(db, "points"),
      where("date", "==", toFirestoreTimestamp(selectedDate))
    );

    onSnapshot(q, (snapshot) => {
      const fetchedPoints = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
      }));
      setPoints(fetchedPoints);
    });
  }, [selectedDate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
      }}
    >
      <DatePicker
        allowClear={false}
        style={{ marginBottom: 16 }}
        defaultValue={selectedDate}
        onChange={(date) => setSelectedDate(date)}
      />
      <AddPointModal date={selectedDate} />
      <List
        style={{ flex: 1 }}
        bordered
        dataSource={points}
        renderItem={(point) => (
          <List.Item actions={[<RemoveDocModal pointId={point.id} />]}>
            {point.text}
          </List.Item>
        )}
      />
    </div>
  );
}

export default PointList;
