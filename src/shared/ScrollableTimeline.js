import { VerticalAlignTopOutlined } from "@ant-design/icons";
import { ConfigProvider, FloatButton, Timeline } from "antd";
import React, { useRef, useState } from "react";

const ScrollableTimeline = ({ navbarHeight, items, onNearBottom }) => {
  const containerStyle = {
    paddingTop: 48,
    paddingLeft: 4,
    paddingRight: 4,
    height: `calc(100vh - ${navbarHeight}px)`,
    overflowY: "auto",
  };

  const timelineContainerRef = useRef(null);
  const [atTop, setAtTop] = useState(true);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const scrollHeight = e.target.scrollHeight;
    const clientHeight = e.target.clientHeight;

    setAtTop(scrollTop === 0);

    const nearBottom = scrollHeight - scrollTop <= clientHeight + 200; // 200px from the bottom
    if (nearBottom && onNearBottom) {
      onNearBottom();
    }
  };

  const scrollToTop = () => {
    if (timelineContainerRef.current) {
      timelineContainerRef.current.scrollTop = 0;
    }
  };

  return (
    <>
      <div
        className="timeline-container"
        ref={timelineContainerRef}
        onScroll={handleScroll}
        style={containerStyle}
      >
        <ConfigProvider
          theme={{
            components: {
              Timeline: {
                dotBg: "#F5F5F5",
              },
            },
          }}
        >
          <Timeline mode="left" items={items} />
        </ConfigProvider>
      </div>

      <FloatButton
        style={{ top: 94 }}
        className={`fade-button ${!atTop ? "visible" : ""}`}
        icon={<VerticalAlignTopOutlined />}
        onClick={() => scrollToTop()}
      />
    </>
  );
};

export default ScrollableTimeline;
