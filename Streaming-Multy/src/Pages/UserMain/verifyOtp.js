import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import makeRequest from "../../axiosHandle/axiosRequests";

import { Button } from "@chakra-ui/react";

// otp verify form
const VerifyOtpForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await makeRequest("/user/verify-otp", "POST", null, formData)
      .then(async (data) => {
        if (data.success) {
          setIsLoading(false);
          const token = data.token;
          try {
            if (!token) {
              message.error("Token Not Available !");
              return;
            }
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);
            Cookies.set("USER_SESSION_COOKIE", token, { expires });
          } catch (error) {
            message.error(error.message);
          }
          message.success(data.message);
          setTimeout(() => {
            navigate("/");
            window.location.reload();
          }, 4000);
          return;
        } else {
          setIsLoading(false);
          message.error(`${data.message}`);
          return;
        }
      })
      .catch((error) => {
        setIsLoading(false);
        message.error(`${error}`);
        console.log(error);
        return;
      });
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-semibold">Verify OTP</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto formPage">
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email <span className="text-red-700"> * </span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border rounded-md border focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            required
            placeholder="Enter your Email"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            OTP <span className="text-red-700"> * </span>
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border rounded-md border focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            required
            maxLength={6}
            placeholder="Enter OTP"
          />
        </div>
        <div className="text-center">
          <Button
            type="submit"
            colorScheme="blue"
            width={"100%"}
            isLoading={isLoading}
            loadingText="verifying...."
          >
            verify otp
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtpForm;
