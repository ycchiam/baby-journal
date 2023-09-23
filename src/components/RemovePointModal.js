// src/components/RemovePointButton.js
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons"; // <-- Add the DeleteOutlined import
import { Button, Modal } from "antd";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db } from "../firebase";

function RemoveDocModal({ pointId }) {
  const handleDelete = async () => {
    const pointRef = doc(db, "points", pointId);
    await deleteDoc(pointRef);
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this point?",
      icon: <ExclamationCircleOutlined />,
      content: "This action is irreversible.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete();
      },
    });
  };

  return (
    <Button
      type="link"
      icon={<DeleteOutlined />}
      onClick={showDeleteConfirm}
    ></Button>
    // Changed "Delete" text to <DeleteOutlined /> icon
  );
}

export default RemoveDocModal;
