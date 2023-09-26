import {
  CloseOutlined,
  DeleteOutlined,
  SendOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Input, List, Popconfirm, message } from "antd";
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
  const [editedPointId, setEditedPointId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs(date));

  useEffect(() => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const q = query(
      collection(db, "points"),
      where("date", "==", formattedDate)
    );

    onSnapshot(q, (snapshot) => {
      setPoints(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
        }))
      );
    });
  }, [selectedDate]);

  const handleAddOrUpdatePoint = async () => {
    if (!inputText.trim()) return;

    const formattedDate = selectedDate.format("YYYY-MM-DD");

    if (editedPointId) {
      // Update existing point
      await updateDoc(doc(db, "points", editedPointId), {
        text: inputText,
        date: formattedDate,
      });
      setEditedPointId(null);
    } else {
      // Add a new point
      await addDoc(collection(db, "points"), {
        text: inputText,
        date: formattedDate,
      });
    }
    setInputText("");
  };

  const handleDelete = async () => {
    const pointRef = doc(db, "points", editedPointId);
    await deleteDoc(pointRef);
    message.success("Point deleted successfully!");
    setEditedPointId(null);
    setInputText("");
  };

  const handleClickListItem = (point) => {
    setInputText(point.text);
    setEditedPointId(point.id);
  };

  const cancelEditingPoint = (event) => {
    // Check if the related target is the submit button, if so, don't cancel the editing
    if (event.relatedTarget && event.relatedTarget.type === "button") {
      return;
    }

    setEditedPointId(null);
    setInputText("");
  };

  const handlePrevDate = () => {
    setSelectedDate(selectedDate.subtract(1, "day"));
  };

  const handleNextDate = () => {
    setSelectedDate(selectedDate.add(1, "day"));
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
      {/* Date Picker */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Button icon={<LeftOutlined />} onClick={handlePrevDate}></Button>
        <DatePicker
          inputReadOnly={true}
          allowClear={false}
          style={{ margin: "0 8px", flexGrow: 1 }}
          value={selectedDate}
          onChange={setSelectedDate}
        />
        <Button icon={<RightOutlined />} onClick={handleNextDate}></Button>
      </div>

      {/* Points List */}
      <List
        bordered
        dataSource={points}
        renderItem={(point) => (
          <List.Item>
            <div
              style={{ width: "100%", cursor: "pointer" }}
              onClick={() => handleClickListItem(point)}
            >
              {point.text}
            </div>
          </List.Item>
        )}
      />

      {/* Space filler to push the input box to bottom */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "end",
          alignSelf: "flex-end",
          gap: "8px",
        }}
      >
        {(editedPointId || inputText) && (
          <Button icon={<CloseOutlined />} onClick={cancelEditingPoint} />
        )}
        {editedPointId && (
          <Popconfirm
            title="Are you sure you want to delete this point?"
            onConfirm={() => handleDelete()}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button danger type="primary" icon={<DeleteOutlined />} />
          </Popconfirm>
        )}
      </div>

      {/* Add New Point */}
      <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <TextArea
            className="custom-scrollbar"
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ paddingRight: "42px" }}
            placeholder={
              editedPointId ? "Edit point..." : "Enter a new point..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPressEnter={handleAddOrUpdatePoint}
          />

          <Button
            type="primary"
            icon={<SendOutlined />}
            style={{ position: "absolute", bottom: "10px", right: "10px" }}
            onClick={handleAddOrUpdatePoint}
          />
        </div>
      </div>
    </div>
  );
}

export default PointList;
