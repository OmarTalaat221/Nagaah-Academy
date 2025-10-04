import React from "react";
import CustomDropdown from "./CustomDropdown";

const RequestTypeSelector = ({ value, onChange, refWhen }) => {
  const requestTimeOptions = [
    { label: "الان", value: "immediate" },
    { label: "لاحقا", value: "scheduled" },
  ];

  return (
    <div ref={refWhen}>
      <label className="py-[5px]">وقت تقديم العرض</label>
      <CustomDropdown
        options={requestTimeOptions}
        placeholder="قم باختيار وقت تقديم العرض"
        value={value}
        width="100%"
        onChange={(v) => onChange(v)}
      />
    </div>
  );
};

export default RequestTypeSelector;
