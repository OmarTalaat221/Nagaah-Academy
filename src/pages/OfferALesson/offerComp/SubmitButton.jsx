import React from "react";

const SubmitButton = ({ onClick, submitting, refSubmit }) => {
  return (
    <div className="add-offer" ref={refSubmit}>
      <button onClick={onClick} disabled={submitting}>
        {submitting ? "جاري الإرسال..." : "تقديم العرض"}
      </button>
    </div>
  );
};

export default SubmitButton;
