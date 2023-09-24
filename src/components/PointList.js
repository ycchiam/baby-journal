import { CloseOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
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
    const q = query(
      collection(db, "points"),
      where("date", "==", toFirestoreTimestamp(selectedDate))
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

    if (editedPointId) {
      // Update existing point
      await updateDoc(doc(db, "points", editedPointId), {
        text: inputText,
      });
      setEditedPointId(null);
    } else {
      // Add a new point
      await addDoc(collection(db, "points"), {
        text: inputText,
        date: toFirestoreTimestamp(selectedDate),
      });
    }
    setInputText(""); // Clear the input box after adding/updating
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

  // const startEditingPoint = (point) => {
  //   setEditedPointId(point.id);
  //   setEditedPointText(point.text);

  //   // If there's a small delay in rendering, the focus might not work instantly.
  //   // Hence, use a timeout to ensure the element is available to be focused on.
  //   setTimeout(() => {
  //     editTextAreaRef.current && editTextAreaRef.current.focus();
  //   }, 0);
  // };

  const cancelEditingPoint = (event) => {
    // Check if the related target is the submit button, if so, don't cancel the editing

    if (event.relatedTarget && event.relatedTarget.type === "button") {
      return;
    }
    setEditedPointId(null);
    setInputText("");
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
      <DatePicker
        allowClear={false}
        style={{ marginBottom: 16 }}
        defaultValue={selectedDate}
        onChange={setSelectedDate}
      />

      {/* Points List */}
      <List
        bordered
        dataSource={points}
        renderItem={(point) => (
          <List.Item>
            <div
              style={{ width: "100%", cursor: "pointer" }} // added cursor style for better UX
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
            } // Conditional placeholder
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
