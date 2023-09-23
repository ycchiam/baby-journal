import { Layout, Typography } from "antd";
import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom"; // Change Switch to Routes
import "./App.css";
import JournalList from "./components/JournalList";
import PointList from "./components/PointList";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{ color: "white", display: "flex", alignItems: "center" }}
        >
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
            <Routes>
              <Route path="/" element={<PointList />} />
              <Route path="/journals" element={<JournalList />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
