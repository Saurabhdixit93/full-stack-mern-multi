import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import makeRequest from "../../axiosHandle/axiosRequests";
import { Button } from "@chakra-ui/react";

// forgot pass
const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    const data = {
      email: email,
    };
    e.preventDefault();
    setIsLoading(true);
    await makeRequest("/auth/send-link", "POST", null, data)
      .then((data) => {
        if (data.success) {
          setIsLoading(false);
          setEmail("");
          message.success(data.message);
          setTimeout(() => {
            navigate("/update-password");
            window.location.reload();
          }, 4000);
          return;
        } else {
          setIsLoading(false);
          setEmail("");
          message.error(data.message);
          return;
        }
      })
      .catch((error) => {
        message.error(`${error}`);
        setEmail("");
        setIsLoading(false);
        return;
      });
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="w-full max-w-md p-6  rounded shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="formPage">
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email <span className="text-red-700"> * </span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 block w-full border rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              required
              placeholder="Enter your valid email ."
            />
          </div>
          <div className="text-center">
            <Button
              type="submit"
              colorScheme="blue"
              width={"100%"}
              isLoading={isLoading}
              loadingText="Sending Reset Email...."
            >
              Send Reset Email
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
