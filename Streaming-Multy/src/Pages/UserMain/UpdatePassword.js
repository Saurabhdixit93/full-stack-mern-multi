import { message } from "antd";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import makeRequest from "../../axiosHandle/axiosRequests";
import { Button } from "@chakra-ui/react";

// update password form
const PasswordUpdateForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Ensure that token is always controlled
    if (name === "token" && value === "") {
      setFormData((prevData) => ({ ...prevData, token: "" }));
    }
    // Check if passwords match
    if (name === "confirmPassword") {
      setPasswordsMatch(value === formData.password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    await makeRequest("/auth/update-password", "POST", null, formData)
      .then((data) => {
        if (data.success) {
          setIsLoading(false);
          message.success(data.message);
          setFormData({ password: "", confirmPassword: "", token: "" });
          setTimeout(() => {
            navigate("/login");
            window.location.reload();
          }, 4000);
          return;
        } else {
          setIsLoading(false);
          message.error(data.message);
          setFormData({ password: "", confirmPassword: "", token: "" });
          return;
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setFormData({ password: "", confirmPassword: "", token: "" });
        return message.error(error);
      });
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold mb-4">Password Update</h2>
      </div>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto formPage">
        <div className="mb-4">
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700"
          >
            Your valid token <span className="text-red-700"> * </span>
          </label>
          <input
            type="text"
            id="token"
            name="token"
            value={formData.token}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full rounded-md border focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            required
            placeholder="Enter valid token."
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password <span className="text-red-700"> * </span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full rounded-md border focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            required
            placeholder="Enter your new password."
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password <span className="text-red-700"> * </span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`mt-1 p-2 block w-full rounded-md border focus:border-indigo-500 focus:ring focus:ring-indigo-200 ${
              passwordsMatch ? "" : "border-red-500"
            }`}
            required
            placeholder="Confirm your new password."
          />
          {!passwordsMatch && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
        </div>
        <div className="text-center">
          <Button
            type="submit"
            colorScheme="blue"
            width={"100%"}
            isLoading={isLoading}
            loadingText="Updating Password...."
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordUpdateForm;
