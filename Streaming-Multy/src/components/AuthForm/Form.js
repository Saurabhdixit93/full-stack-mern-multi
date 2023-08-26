import React, { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import makeRequest from "../../axiosHandle/axiosRequests";
import { Button } from "@chakra-ui/react";

// reusable form for login signup
const AuthForm = ({ isSignup }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prevData) => ({
          ...prevData,
          profilePic: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    // Check password match for signup form
    if (isSignup && name === "confirmPassword") {
      setPasswordsMatch(value === formData.password);
    }
  };

  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignup && formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      message.error("Passwords do not match");
      return;
    }

    if (isSignup) {
      await makeRequest("/user/sign_up", "POST", null, formData)
        .then((data) => {
          if (data.success) {
            setIsLoading(false);
            message.success(data.message);
            setTimeout(() => {
              navigate("/login");
            }, 4000);
            return;
          } else {
            setIsLoading(false);
            message.error(data.message);
            return;
          }
        })
        .catch((error) => {
          setIsLoading(false);
          message.error(`${error}`);
          return;
        });
    } else {
      await makeRequest("/user/login", "POST", null, formData)
        .then((data) => {
          if (data.success) {
            setIsLoading(false);
            message.success(data.message);
            setTimeout(() => {
              navigate("/verify-otp");
            }, 4000);
            return;
          } else {
            setIsLoading(false);
            message.error(data.message);
            return;
          }
        })
        .catch((error) => {
          setIsLoading(false);
          message.error(`${error}`);
          return;
        });
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4 ">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-semibold">
          {isSignup ? "Signup Form " : "Login Form"}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto formPage">
        {isSignup && (
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name <span className="text-red-700"> * </span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              required
              placeholder="Enter your name ."
            />
          </div>
        )}
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
            className="mt-1 p-2 block w-full rounded-md border focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            required
            placeholder="Enter your Email ."
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password <span className="text-red-700"> * </span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              required
              placeholder="Enter your password ."
            />
            <button
              type="button"
              onClick={handleShowPassword}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </button>
          </div>
        </div>
        {isSignup && (
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 "
            >
              Confirm Password <span className="text-red-700"> * </span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`mt-1 p-2 block w-full border rounded-md ${
                passwordsMatch ? "border-gray-300" : "border-red-500"
              } focus:border-indigo-500 focus:ring focus:ring-indigo-200`}
              required
              placeholder="Enter your confirm password ."
            />
            {!passwordsMatch && (
              <p className="text-red-500 text-xs mt-1">
                Passwords do not match
              </p>
            )}
          </div>
        )}
        {isSignup && (
          <div className="mb-4">
            <label
              htmlFor="profilePic"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture <span className="text-red-700"> * </span>
            </label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              accept="image/*"
              onChange={handleInputChange}
              required
              className="mt-1 p-2 block w-full border rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
            {formData.profilePic && (
              <div className="mt-2">
                <img
                  src={formData.profilePic}
                  alt="Preview"
                  className="max-w-xs max-h-40 w-full"
                />
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          width={"100%"}
          isLoading={isLoading}
          loadingText={isSignup ? "Creating ..." : "Login..."}
        >
          {isSignup ? "Sign Up" : "Log In"}
        </Button>
        <div className="flex justify-center px-4 py-2">
          {!isSignup && (
            <div className="mb-4">
              <Link to="/reset-password" className="text-indigo-900">
                Forgot your password?
              </Link>
            </div>
          )}
        </div>
        <div className="or-container">
          <div className="or-line"></div>
          <div className="or-text">OR</div>
          <div className="or-line"></div>
        </div>

        <div className="mb-4 text-center">
          {isSignup ? (
            <p>
              Already have an account ?{" "}
              <Link to="/login" className="text-blue-500 ">
                Log In
              </Link>
            </p>
          ) : (
            <p>
              Don't have an account ?{" "}
              <Link to="/signup" className="text-indigo-500 ">
                Sign Up
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
