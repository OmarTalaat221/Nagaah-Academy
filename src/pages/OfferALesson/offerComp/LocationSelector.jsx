import React from "react";
import CustomDropdown from "./CustomDropdown";

const LocationSelector = ({ value, onChange, refPlace }) => {
  const locationOptions = [
    { label: "اونلاين", value: "online" },
    { label: "حضوري", value: "offline" },
  ];

  return (
    <div ref={refPlace}>
      <label className="py-[5px]">مكان الحصه</label>
      <CustomDropdown
        options={locationOptions}
        placeholder="قم باختيار مكان الحصه"
        value={value}
        width="100%"
        onChange={(v) => onChange(v)}
      />
    </div>
  );
};

export default LocationSelector;
