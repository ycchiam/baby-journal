import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, DatePicker } from "antd";

function JournalEditDatePicker({ selectedDate, setSelectedDate }) {
  const handlePrevDate = () => {
    setSelectedDate(selectedDate.subtract(1, "day"));
  };

  const handleNextDate = () => {
    setSelectedDate(selectedDate.add(1, "day"));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <Button icon={<LeftOutlined />} onClick={handlePrevDate}></Button>
      <DatePicker
        inputReadOnly={true}
        allowClear={false}
        style={{ margin: "0 8px", flexGrow: 1 }}
        value={selectedDate}
        onChange={setSelectedDate}
      />
      <Button icon={<RightOutlined />} onClick={handleNextDate}></Button>
    </div>
  );
}

export default JournalEditDatePicker;
