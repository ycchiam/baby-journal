import { List } from "antd";
import dayjs from "dayjs";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import JournalEditDatePicker from "./JournalEditDatePicker";
import JournalEditInput from "./JournalEditInput";
import JournalEditTag from "./JournalEditTag";

function JournalEdit() {
  const { date } = useParams();

  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs(date));

  useEffect(() => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const q = query(
      collection(db, "journals"),
      where("date", "==", formattedDate)
    );

    onSnapshot(q, (snapshot) => {
      setJournals(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
        }))
      );
    });

    setSelectedJournal(null);
  }, [selectedDate]);

  return (
    <div
      style={{
        paddingTop: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
        flex: 1,
      }}
    >
      <JournalEditDatePicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <JournalEditTag />

      <List
        bordered
        dataSource={journals}
        renderItem={(journal) => (
          <List.Item>
            <div
              style={{ width: "100%", cursor: "pointer" }}
              onClick={() => setSelectedJournal(journal)}
            >
              {journal.text}
            </div>
          </List.Item>
        )}
      />

      <JournalEditInput
        selectedDate={selectedDate}
        selectedJournal={selectedJournal}
        setSelectedJournal={setSelectedJournal}
      />
    </div>
  );
}

export default JournalEdit;
