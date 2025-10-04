import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FormContainer,
  FormGroup,
  SubmitButton,
  BackButton,
} from "./LoginFormStyles";
import { toast } from "react-toastify";
import axios from "axios";

function NewPassword() {
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const navigate = useNavigate();
  const { email } = useParams();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPasswordData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPasswordData?.newPassword != newPasswordData?.confirmNewPassword) {
      toast.error("Password Not Match");
      return;
    }
    axios
      .post(
        "https://medicotoon.com/medicotoon/backend/user/auth/reset_password.php",
        {
          email: email,
          new_password: newPasswordData?.newPassword,
        }
      )
      .then((res) => {
        if (res?.data?.status) {
          toast.success("Successfully Change - Log in again");
          navigate("/login");
        } else {
          toast.error(res?.data?.message);
        }
      });
  };

  return (
    <FormContainer>
      <BackButton onClick={() => navigate(-1)}>&larr; Back</BackButton>
      <h2>Set New Password</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPasswordData.newPassword}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={newPasswordData.confirmNewPassword}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <SubmitButton type="submit">Set Password</SubmitButton>
      </form>
    </FormContainer>
  );
}

export default NewPassword;
