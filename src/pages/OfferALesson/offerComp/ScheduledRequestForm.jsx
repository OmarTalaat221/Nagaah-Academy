import React from "react";
import CustomDropdown from "./CustomDropdown";
import TeacherSelector from "./TeacherSelector";
import SubjectSelector from "./SubjectSelector";
import GroupSelector from "./GroupSelector";
import DateTimeSelectors from "./DateTimeSelectors";
import ExperienceSelector from "./ExperienceSelector";

const ScheduledRequestForm = ({
  newOfferData,
  onExperienceChange,
  onGroupTypeChange,
  onTeacherChange,
  onSubjectChange,
  onGroupChange,
  onGroupClassChange,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onTeacherSelect,
  refType,
  refExperience,
  refTeacher,
  refSubject,
  refGroup,
  refClassGroup,
  refDate,
  refTime,
  refEndTime,
  lessonTypeOptions,
  teacherOptions,
  teacherObj,
  groupsClasses,
  days,
  loadingTeachers,
  subjectOptions,
  experienceOptions,
  loadingExperiences,
}) => {
  return (
    <>
      <div ref={refType}>
        <label className="py-[5px]">نوع الحصه</label>
        <CustomDropdown
          options={lessonTypeOptions}
          placeholder="نوع الحصه"
          value={newOfferData?.group_type}
          width="100%"
          onChange={onGroupTypeChange}
        />
      </div>

      <ExperienceSelector
        value={newOfferData?.experience_id}
        onChange={onExperienceChange}
        refExperience={refExperience}
        loading={loadingExperiences}
        options={experienceOptions}
      />

      <TeacherSelector
        value={newOfferData?.teacher_id}
        onChange={onTeacherChange}
        refTeacher={refTeacher}
        options={teacherOptions}
        loading={loadingTeachers}
        onTeacherSelect={onTeacherSelect}
      />

      <SubjectSelector
        value={newOfferData?.subject_id}
        onChange={onSubjectChange}
        refSubject={refSubject}
        options={
          newOfferData?.teacher_id === "0" &&
          newOfferData?.request_type === "scheduled"
            ? []
            : subjectOptions
        }
        disabled={newOfferData?.teacher_id === "0"}
        teacherId={newOfferData?.teacher_id}
        placeholder="قم باختيار الماده"
      />

      {newOfferData?.group_type !== "individual" ? (
        <GroupSelector
          groupId={newOfferData?.group_id}
          groupClassesId={newOfferData?.group_classes_id}
          teacherId={newOfferData?.teacher_id}
          subjectId={newOfferData?.subject_id}
          groups={teacherObj?.groups || []}
          groupsClasses={groupsClasses}
          days={days}
          onGroupChange={onGroupChange}
          onGroupClassChange={onGroupClassChange}
          refGroup={refGroup}
          refClassGroup={refClassGroup}
          group_type={newOfferData?.group_type}
        />
      ) : (
        <DateTimeSelectors
          scheduledDate={newOfferData?.scheduled_date}
          scheduledTime={newOfferData?.scheduled_time}
          endTime={newOfferData?.end_time}
          onDateChange={onDateChange}
          onStartTimeChange={onStartTimeChange}
          onEndTimeChange={onEndTimeChange}
          refDate={refDate}
          refTime={refTime}
          refEndTime={refEndTime}
        />
      )}
    </>
  );
};

export default ScheduledRequestForm;
