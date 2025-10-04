import React from "react";
import SubjectSelector from "./SubjectSelector";

const ImmediateRequestForm = ({
  subjectId,
  onSubjectChange,
  refSubject,
  subjectOptions,
  loading,
}) => {
  return (
    <SubjectSelector
      value={subjectId}
      onChange={onSubjectChange}
      refSubject={refSubject}
      options={subjectOptions}
      loading={loading}
      disabled={subjectOptions.length === 0}
      placeholder="قم باختيار الماده"
    />
  );
};

export default ImmediateRequestForm;
