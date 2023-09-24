import { Layout, Typography } from "antd";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import JournalTimeline from "./components/JournalTimeline";
import PointList from "./components/PointList";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const journals = [
    { id: 1, date: "2023-09-20", title: "First Journal" },
    { id: 2, date: "2023-09-21", title: "Second Journal" },
    // ... more journal entries
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "white", display: "flex", alignItems: "center" }}>
        <Title level={2} style={{ color: "white" }}>
          Journal
        </Title>
      </Header>
      <Content style={{ padding: "20px 50px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Router>
            <Routes>
              <Route path="/" element={<JournalTimeline journals={journals}/>} />
              <Route path="/points/:date" element={<PointList />} />
            </Routes>
          </Router>
          {/* <Routes>
              <Route path="/" element={<PointList />} />
              <Route path="/journals" element={<JournalList />} />
            </Routes> */}
        </div>
      </Content>
    </Layout>
  );
}

export default App;
