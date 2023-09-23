import { Button, DatePicker, Modal, message } from "antd";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";

function AddJournalModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const createJournal = async () => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const journalRef = doc(db, "journals", formattedDate);

    const existingJournal = await getDoc(journalRef);
    console.log(existingJournal);
    if (existingJournal.exists) {
      message.error("Journal for this date already exists.");
      return;
    }

    await addDoc(collection(db, "journals"), { date: formattedDate });
    setIsModalVisible(false);
  };

  return (
    <>
      <Button onClick={() => setIsModalVisible(true)}>Create Journal</Button>
      <Modal
        title="New Journal Entry"
        open={isModalVisible}
        onOk={createJournal}
        onCancel={() => setIsModalVisible(false)}
      >
        <DatePicker onChange={(date) => setSelectedDate(date)} />
      </Modal>
    </>
  );
}

export default AddJournalModal;
