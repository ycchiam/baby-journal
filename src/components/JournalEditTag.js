import React, { useState } from "react";
import { Segmented, Tooltip } from "antd";
import {
  TrophyOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
} from "@ant-design/icons";

function JournalEditTag() {
  const [selectedTag, setSelectedTag] = useState(null);

  const segmentStyle = {
    padding: "8px 4px 4px",
  };

  const iconColor = (tag) => (selectedTag === tag ? "#1890ff" : undefined);
  const iconSize = "24px";

  return (
    <div style={{ alignSelf: "center", marginBottom: 8 }}>
      <Segmented
        options={[
          {
            label: (
              <Tooltip title="Achievement">
                <div style={segmentStyle}>
                  <TrophyOutlined
                    style={{
                      fontSize: iconSize,
                      color: iconColor("achievement"),
                    }}
                  />
                </div>
              </Tooltip>
            ),
            value: "achievement",
          },
          {
            label: (
              <Tooltip title="Happy">
                <div style={segmentStyle}>
                  <SmileOutlined
                    style={{ fontSize: iconSize, color: iconColor("happy") }}
                  />
                </div>
              </Tooltip>
            ),
            value: "happy",
          },
          {
            label: (
              <Tooltip title="Neutral">
                <div style={segmentStyle}>
                  <MehOutlined
                    style={{ fontSize: iconSize, color: iconColor("neutral") }}
                  />
                </div>
              </Tooltip>
            ),
            value: "neutral",
          },
          {
            label: (
              <Tooltip title="Sad">
                <div style={segmentStyle}>
                  <FrownOutlined
                    style={{ fontSize: iconSize, color: iconColor("sad") }}
                  />
                </div>
              </Tooltip>
            ),
            value: "sad",
          },
        ]}
        onChange={(value) => setSelectedTag(value)}
      />
    </div>
  );
}

export default JournalEditTag;
