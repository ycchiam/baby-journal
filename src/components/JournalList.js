import { Card, Col, Row } from "antd";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import AddJournalModal from "./AddJournalModal";
import RemoveDocModal from "./RemovePointModal";

function JournalList() {
  const [journals, setJournals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "journals"));
    onSnapshot(q, (snapshot) => {
      setJournals(snapshot.docs.map((doc) => ({ date: doc.id })));
    });
  }, []);

  return (
    <div>
      <AddJournalModal />
      <Row gutter={16}>
        {journals.map((journal) => (
          <Col span={8} key={journal.date}>
            <Card
              title={journal.date}
              onClick={() => navigate(`/points/${journal.date}`)}
              actions={[<RemoveDocModal pointId={journal.date} />]}
            >
              Click to see points
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default JournalList;
