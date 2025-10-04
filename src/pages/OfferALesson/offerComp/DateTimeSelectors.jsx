import React from "react";
import { DatePicker, TimePicker } from "antd";
import { FaClock } from "react-icons/fa";
import dayjs from "dayjs";

const DateTimeSelectors = ({
  scheduledDate,
  scheduledTime,
  endTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  refDate,
  refTime,
  refEndTime,
}) => {
  const disabledDate = (current) => {
    if (!current) return false;
    return current.isBefore(dayjs(), "day");
  };

  return (
    <>
      <div ref={refDate}>
        <label className="py-[5px]">تاريخ الحصه</label>
        <DatePicker
          format="YYYY-MM-DD"
          style={{ width: "100%", direction: "rtl" }}
          onChange={(d) => onDateChange(d)}
          placeholder="اختر تاريخ الحصه"
          value={scheduledDate}
          className="p-[8px_10px] course-input"
          disabledDate={disabledDate}
        />
      </div>

      <div ref={refTime}>
        <label className="py-[5px]">وقت بداية الحصه</label>
        <TimePicker
          format="HH:mm"
          style={{ width: "100%", direction: "rtl" }}
          onChange={(t) => onStartTimeChange(t)}
          placeholder="اختر وقت بداية الحصه"
          className="p-[8px_10px] course-input"
          prefix={<FaClock className="text-white" />}
          value={scheduledTime}
        />
      </div>
      <div ref={refEndTime}>
        <label className="py-[5px]">وقت نهاية الحصه</label>
        <TimePicker
          format="HH:mm"
          style={{ width: "100%", direction: "rtl" }}
          onChange={(t) => onEndTimeChange(t)}
          placeholder="اختر وقت نهاية الحصه"
          className="p-[8px_10px] course-input"
          prefix={<FaClock className="text-white" />}
          value={endTime}
        />
      </div>
    </>
  );
};

export default DateTimeSelectors;
