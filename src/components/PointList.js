import { CloseOutlined, SendOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, List, Space } from "antd";
import dayjs from "dayjs";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, toFirestoreTimestamp } from "../firebase";

function PointList() {
  const { TextArea } = Input;
  const { date } = useParams();
  const [points, setPoints] = useState([]);
  const [newPointText, setNewPointText] = useState("");
  const [editedPointId, setEditedPointId] = useState(null);
  const [editedPointText, setEditedPointText] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs(date));

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

  const addPoint = async () => {
    if (newPointText.trim() === "") return;

    const pointsCollection = collection(db, "points");
    await addDoc(pointsCollection, {
      text: newPointText,
      date: toFirestoreTimestamp(selectedDate),
    });

    setNewPointText("");
  };

  const updatePoint = async (id) => {
    const pointRef = doc(db, "points", id);
    await updateDoc(pointRef, { text: editedPointText });
    setEditedPointId(null);
    setEditedPointText("");
  };

  const deletePoint = async (id) => {
    const pointRef = doc(db, "points", id);
    await deleteDoc(pointRef);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
        flex: 1,
      }}
    >
      <DatePicker
        allowClear={false}
        style={{ marginBottom: 16 }}
        defaultValue={selectedDate}
        onChange={(date) => setSelectedDate(date)}
      />
      <List
        bordered
        dataSource={points}
        renderItem={(point, index) => {
          let style = {};
          if (editedPointId === point.id) {
            style = {
              padding: 12,
              backgroundColor: "white",
            };

            if (points.length === 1) {
              style.borderRadius = "8px"; // All corners rounded for only item
            } else if (index === 0) {
              style.borderTopLeftRadius = "8px"; // Top-left corner rounded for first item
              style.borderTopRightRadius = "8px"; // Top-right corner rounded for first item
            } else if (index === points.length - 1) {
              style.borderBottomLeftRadius = "8px"; // Bottom-left corner rounded for last item
              style.borderBottomRightRadius = "8px"; // Bottom-right corner rounded for last item
            }
          }

          return (
            <List.Item style={style}>
              {editedPointId === point.id ? (
                <div style={{ flex: 1, position: "relative" }}>
                  <TextArea
                    bordered={false}
                    paddingInline={40}
                    className="custom-scrollbar"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    style={{ paddingRight: "42px" }}
                    placeholder="Edit point..."
                    value={editedPointText}
                    onChange={(e) => setEditedPointText(e.target.value)}
                    onPressEnter={() => updatePoint(point.id)}
                  />
                  <Space direction="vertical">
                    <Space.Compact>
                      <Button
                        icon={<CloseOutlined />}
                        style={{
                          position: "absolute",
                          bottom: "-28px",
                          right: "44px",
                        }}
                        onClick={() => {
                          setEditedPointId(null);
                          setEditedPointText("");
                        }}
                      />
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        style={{
                          position: "absolute",
                          bottom: "-28px",
                          right: "10px",
                        }}
                        onClick={() => updatePoint(point.id)}
                      />
                    </Space.Compact>
                  </Space>
                </div>
              ) : (
                <div
                  style={{ width: "100%" }}
                  onClick={() => {
                    setEditedPointId(point.id);
                    setEditedPointText(point.text);
                  }}
                >
                  {point.text}
                </div>
              )}
            </List.Item>
          );
        }}
      />
      <div style={{ flex: 1 }}></div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <TextArea
            className="custom-scrollbar"
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ paddingRight: "42px" }} // Space for the button
            placeholder="Enter a new point..."
            value={newPointText}
            onChange={(e) => setNewPointText(e.target.value)}
            onPressEnter={addPoint}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            style={{
              position: "absolute", // Absolutely position the button
              bottom: "10px", // Position it 10px from the bottom
              right: "10px", // Position it 10px from the right
            }}
            onClick={addPoint}
          />
        </div>
      </div>
    </div>
  );
}

export default PointList;
