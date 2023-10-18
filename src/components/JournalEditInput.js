import {
  CloseOutlined,
  DeleteOutlined,
  LoadingOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, message } from "antd";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";

const { TextArea } = Input;

function JournalEditInput({
  selectedDate,
  selectedJournal,
  setSelectedJournal,
}) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formattedDate = selectedDate.format("YYYY-MM-DD");

  useEffect(() => {
    setInputText(selectedJournal ? selectedJournal.text : "");
  }, [selectedJournal]);

  const handleAddOrUpdateJournal = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);

    const userId = auth.currentUser.uid;

    try {
      if (selectedJournal) {
        // Update existing journal
        await updateDoc(doc(db, "journals", selectedJournal.id), {
          text: inputText,
          date: formattedDate,
          updatedBy: userId,
          updatedAt: Timestamp.now(),
        });
        setSelectedJournal(null);
      } else {
        // Add a new journal
        await addDoc(collection(db, "journals"), {
          text: inputText,
          date: formattedDate,
          createdBy: userId,
          createdAt: Timestamp.now(),
          updatedBy: userId,
          updatedAt: Timestamp.now(),
        });
      }
      setInputText("");
    } catch (error) {
      console.error("Error updating/adding journal:", error);
      message.error("There was an error processing your request.");
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    const journalRef = doc(db, "journals", selectedJournal.id);
    await deleteDoc(journalRef);
    message.success("Journal deleted successfully!");
    setSelectedJournal(null);
    setInputText("");
  };

  return (
    <>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "end",
          alignSelf: "flex-end",
          gap: "8px",
        }}
      >
        {(selectedJournal || inputText) && (
          <Button
            icon={<CloseOutlined />}
            onClick={() => {
              setSelectedJournal(null);
              setInputText("");
            }}
          />
        )}
        {selectedJournal && (
          <Popconfirm
            title="Are you sure you want to delete this journal?"
            onConfirm={() => handleDelete()}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button
              danger
              type="primary"
              icon={isLoading ? <LoadingOutlined /> : <DeleteOutlined />}
              disabled={isLoading}
            />
          </Popconfirm>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <TextArea
            className="custom-scrollbar"
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ paddingRight: "42px" }}
            placeholder={
              selectedJournal ? "Edit journal..." : "Enter a new journal..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPressEnter={handleAddOrUpdateJournal}
          />
          <Button
            type="primary"
            icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
            disabled={isLoading}
            style={{ position: "absolute", bottom: "10px", right: "10px" }}
            onClick={handleAddOrUpdateJournal}
          />
        </div>
      </div>
    </>
  );
}

export default JournalEditInput;
