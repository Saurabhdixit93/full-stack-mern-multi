import React, { useState } from "react";
import { FiChevronUp } from "react-icons/fi";
import makeRequest from "../../axiosHandle/axiosRequests";
import { message } from "antd";
import { Button } from "@chakra-ui/react";

// footer
const Footer = () => {
  const [email, setEmail] = useState("");
  const formData = {
    email: email,
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await makeRequest("/news/subscribe", "POST", null, formData).then(
        (data) => {
          if (data.success) {
            setIsLoading(false);
            setEmail("");
            message.success(data.message);
            return;
          } else {
            setIsLoading(false);
            setEmail("");
            message.error(data.message);
            return;
          }
        }
      );
    } catch (error) {
      setIsLoading(false);
      setEmail("");
      message.error(error);
      return;
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-0">
              Subscribe to our newsletter
            </h2>
            <form
              className="flex mt-2 md:mt-0"
              onSubmit={handleSubscribe}
              style={{ marginLeft: "5px" }}
            >
              <input
                type="email"
                placeholder="Enter your email..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-l bg-gray-700 text-white focus:outline-none w-full md:w-auto"
              />

              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isLoading}
                loadingText="Subscribing..."
                size="md"
                marginRight={"10px"}
              >
                Subscribe
              </Button>
            </form>
          </div>
          <button
            title="back to top"
            onClick={handleScrollToTop}
            className="bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300 text-white px-2 py-2 rounded-lg flex items-center mt-4 md:mt-0"
          >
            <FiChevronUp className="mr-0" />
          </button>
        </div>
        <p className="text-center mt-8 text-sm">
          &copy; {new Date().getFullYear()} Saurabh Dixit . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
