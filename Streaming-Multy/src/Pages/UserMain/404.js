import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as NotFoundSvg } from "./404 Page Not Found.svg";

// page not found
const NotFound = () => {
  return (
    <div
      style={{ minHeight: "60vh", marginBottom: "10px" }}
      className="flex flex-col items-center justify-center bg-gray-900 text-white"
    >
      <div className="text-center">
        <NotFoundSvg className="w-48 h-48 mx-auto mb-6" />{" "}
        <h1 className="text-6xl font-semibold">404</h1>
        <p className="text-gray-400 mt-4 text-lg">Oops! Page not found.</p>
        <Link
          to="/"
          className="mt-8 text-blue-400 hover:text-blue-600 underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
