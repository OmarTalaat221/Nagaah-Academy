import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FormContainer,
  FormGroup,
  SubmitButton,
  BackButton,
} from "./LoginFormStyles";
import axios from "axios";
import { toast } from "react-toastify";

function ConfirmCode() {
  const { email } = useParams();
  const location = useLocation();
  const [codeData, setCodeData] = useState({ code: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCodeData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(location?.state?.code, codeData);
    if (codeData?.code == location?.state?.code) {
      toast.success("Type New Password");
      navigate("/new-password/" + email);
    } else {
      toast.error("Code Not Correct");
    }
  };
  return (
    <FormContainer>
      <BackButton onClick={() => navigate(-1)}>&larr; Back</BackButton>
      <h2>Confirm Code</h2>
      <span style={{ fontSize: "13px" }}>
        A 6-digit code has been sent to your register email{" "}
        <span style={{ color: "red" }}>"{email}"</span>
        <p>
          <i style={{ fontSize: "12px", color: "darkgray" }}>
            If You Don't Find The Code In Your Email Inbox - Just Check{" "}
            <span style={{ color: "red" }}> " Spam " </span>
            Inbox
          </i>
        </p>
      </span>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="code">Enter Code:</label>
          <input
            type="text"
            id="code"
            name="code"
            value={codeData.code}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <SubmitButton type="submit">Confirm Code</SubmitButton>
      </form>
    </FormContainer>
  );
}

export default ConfirmCode;
