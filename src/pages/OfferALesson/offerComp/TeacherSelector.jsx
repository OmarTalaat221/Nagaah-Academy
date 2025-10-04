import React from "react";
import CustomDropdown from "./CustomDropdown";
import { Spin } from "antd";

const TeacherSelector = ({
  value,
  onChange,
  refTeacher,
  options,
  loading,
  onTeacherSelect,
}) => {
  return (
    <div ref={refTeacher}>
      <label className="py-[5px]">المدرس</label>
      <CustomDropdown
        options={options}
        placeholder="قم باختيار المدرس"
        value={value}
        width="100%"
        disabled={loading || options.length === 0}
        onChange={(v) => {
          console.log("v", v);
          onChange(v);
          if (onTeacherSelect) {
            onTeacherSelect(v);
          }
        }}
      />
      {loading && (
        <div className="mt-2">
          <Spin size="small" />
        </div>
      )}
    </div>
  );
};

export default TeacherSelector;
