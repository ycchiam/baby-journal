// src/components/AddPointModal.js
import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal } from "antd";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { db, toFirestoreTimestamp } from "../firebase";

function AddPointModal({ date: date }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detail, setDetail] = useState("");

  const addPoint = async () => {
    if (detail.trim()) {
      await addDoc(collection(db, "points"), {
        text: detail,
        date: toFirestoreTimestamp(date),
      });
      setDetail(""); // clear the input field
      setIsModalVisible(false); // close the modal
    }
  };

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999,
        }}
      />

      <Modal
        title="Add a New Point"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={addPoint}>
            Add
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter a point"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
      </Modal>
    </>
  );
}

export default AddPointModal;
