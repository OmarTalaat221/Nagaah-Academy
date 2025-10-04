import React from "react";
import CustomDropdown from "./CustomDropdown";
import { Spin } from "antd";

const ExperienceSelector = ({
  value,
  onChange,
  refExperience,
  options,
  loading,
}) => {
  return (
    <div ref={refExperience}>
      <label className="py-[5px]">مستوى الخبرة</label>
      <CustomDropdown
        options={options}
        placeholder="قم باختيار مستوى الخبرة"
        value={value}
        width="100%"
        disabled={loading || options.length === 0}
        onChange={(v) => {
          console.log("experience_id", v);
          onChange(v);
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

export default ExperienceSelector;
