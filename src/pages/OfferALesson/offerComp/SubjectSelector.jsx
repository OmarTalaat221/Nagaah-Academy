import React from "react";
import CustomDropdown from "./CustomDropdown";
import { Spin } from "antd";

const SubjectSelector = ({
  value,
  onChange,
  refSubject,
  options,
  loading,
  disabled,
  teacherId = "0",
  placeholder = "قم باختيار الماده",
}) => {
  return (
    <div className="subject-select" ref={refSubject}>
      <label className="py-[5px]">الماده</label>
      <CustomDropdown
        options={options}
        placeholder={teacherId ? placeholder : "يجب عليك اختيار المدرس اولا"}
        value={value}
        width="100%"
        disabled={disabled || options.length === 0}
        onChange={(v) => onChange(v)}
      />
      {loading && (
        <div className="mt-2">
          <Spin size="small" />
        </div>
      )}
    </div>
  );
};

export default SubjectSelector;
