import React from "react";
import CustomDropdown from "./CustomDropdown";

const GroupSelector = ({
  groupId,
  groupClassesId,
  teacherId,
  subjectId,
  groups,
  groupsClasses,
  days,
  onGroupChange,
  onGroupClassChange,
  refGroup,
  refClassGroup,
  group_type,
}) => {
  return (
    <>
      <div ref={refGroup}>
        <label className="py-[5px]">المجموعه</label>
        <CustomDropdown
          disabled={!teacherId || !subjectId}
          options={groups
            .filter((group) => {
              const belongsToSubject =
                String(group?.course_id) === String(subjectId);
              if (!belongsToSubject) return false;

              switch (group_type) {
                case "small_group":
                  return group.max_students < 6;
                case "large_group":
                  return group.max_students >= 6;
                default:
                  return true;
              }
            })
            .map((group) => ({
              label: `${group?.group_name} - ${group?.max_students} طالب`,
              value: group?.group_id,
            }))}
          placeholder={
            teacherId ? "قم باختيار المجموعه" : "يجب عليك اختيار المدرس اولا"
          }
          value={groupId}
          width="100%"
          onChange={(v) => onGroupChange(v)}
          emptyMessage="لا يوجد مجموعات متاحه لهذا المدرس"
        />
      </div>
      <div ref={refClassGroup}>
        <label className="py-[5px]">معاد المجموعه</label>
        <CustomDropdown
          disabled={!teacherId || !subjectId || !groupId}
          options={groupsClasses.map((g) => ({
            label: `${
              days.find(
                (d) => d.value?.toLowerCase() == g?.day_of_week?.toLowerCase()
              )?.label
            } - ${g?.start_time} => ${g?.end_time} => ${g?.lesson_date}`,
            value: g?.group_classes_id,
          }))}
          placeholder={
            teacherId
              ? "قم باختيار معاد المجموعه"
              : "يجب عليك اختيار المدرس و المجموعه اولا"
          }
          value={groupClassesId}
          width="100%"
          onChange={(v) => onGroupClassChange(v)}
        />
      </div>
    </>
  );
};

export default GroupSelector;
