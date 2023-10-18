import {
  ArrowLeftOutlined,
  MenuOutlined,
  SwitcherOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Layout, Typography } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import JournalEdit from "./components/JournalEdit";
import JournalTimeLine from "./components/JournalTimeLine";
import Login from "./components/Login";
import StoryPage from "./components/StoryPage";
import StoryTimeLine from "./components/StoryTimeLine";
import { auth } from "./firebase";

const { Header, Content } = Layout;
const { Title } = Typography;

function RedirectToJournals() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/journals");
  }, [navigate]);

  return null;
}

function App() {
  const [user, setUser] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const showDrawer = () => setIsDrawerVisible(true);
  const hideDrawer = () => setIsDrawerVisible(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isOnJournalTimeline = location.pathname === "/journals";
  const isOnStoryTimeline = location.pathname === "/stories";

  const handleButtonClick = () => {
    if (isOnJournalTimeline) {
      navigate("/stories");
    } else if (isOnStoryTimeline) {
      navigate("/journals");
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Login />;
  }

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          position: "fixed",
          zIndex: 10,
          width: "100%",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          icon={
            isOnJournalTimeline || isOnStoryTimeline ? (
              <SwitcherOutlined />
            ) : (
              <ArrowLeftOutlined />
            )
          }
          onClick={handleButtonClick}
          ghost={true}
        />
        <Title level={2} style={{ color: "white" }}>
          Journal
        </Title>
        <Button icon={<MenuOutlined />} onClick={showDrawer} ghost={true} />
        <Drawer
          title="Menu"
          placement="right"
          closable={true}
          onClose={hideDrawer}
          open={isDrawerVisible}
        >
          <p>Place Holder ...</p>
          <p>Place Holder ...</p>
        </Drawer>
      </Header>

      <Content style={{ padding: "64px 50px 24px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Routes>
            <Route path="/" element={<RedirectToJournals />} />
            <Route path="/stories" element={<StoryTimeLine />} />
            <Route path="/journals" element={<JournalTimeLine />} />
            <Route path="/journals/:date" element={<JournalEdit />} />
            <Route path="/stories/:storyId" element={<StoryPage />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
