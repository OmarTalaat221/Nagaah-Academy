import React from "react";
import CustomDropdown from "./CustomDropdown";

const UserInfoForm = ({ 
  universityId, 
  gradeId, 
  universities, 
  grades, 
  onUniversityChange, 
  onGradeChange 
}) => {
  return (
    <>
      <div>
        <label className="py-[5px]">المرحله</label>
        <CustomDropdown
          options={universities.map((u) => ({
            label: u.university_name,
            value: u.university_id,
          }))}
          placeholder="قم باختيار المرحله"
          value={universityId}
          width="100%"
          onChange={(v) => onUniversityChange(v)}
        />
      </div>
      <div>
        <label className="py-[5px]">الصف</label>
        <CustomDropdown
          disabled={!universityId}
          options={grades.map((g) => ({
            label: g.grade_name,
            value: g.grade_id,
          }))}
          placeholder={
            universityId
              ? "قم باختيار الصف"
              : "يجب عليك اختيار المرحله اولا"
          }
          value={gradeId}
          width="100%"
          onChange={(v) => onGradeChange(v)}
        />
      </div>
    </>
  );
};

export default UserInfoForm;
