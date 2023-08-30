import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/UserMain/Login";
import SignupPage from "./Pages/UserMain/Signup";
import VerifyOtpForm from "./Pages/UserMain/verifyOtp";
import Header from "./components/Header/NavBar";
import Footer from "./components/Header/Footer";
import { getTokenCookie } from "./Authentication/AuthContext";
import { getUserFromToken } from "./Authentication/isUser";
import axios from "axios";
import ForgotPasswordPage from "./Pages/UserMain/ForgotPassword";
import PasswordUpdateForm from "./Pages/UserMain/UpdatePassword";
import HomePage from "./Pages/HomePage";
import NotFound from "./Pages/UserMain/404";
import { ChakraProvider, CSSReset, Center, Text, Box } from "@chakra-ui/react";
import About from "./Pages/WebPages/about";
import YoutubeDownloadPage from "./Pages/WebPages/youtubeDownload";
import { useEffect, useState } from "react";
import InstagramDownloadForm from "./Pages/WebPages/IntagramVideo";

import StreamingPage from "./Pages/WebPages/Streaming/MultipleChannel";
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_BASE;

function PageLoading() {
  return (
    <Center minH="50vh" flexDirection="column">
      <Box className="loading-container">
        <Box className="shimmer"></Box>
      </Box>
      <Text mt="4" fontWeight="bold" color="white">
        Loading...
      </Text>
    </Center>
  );
}

// main app
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const token = getTokenCookie();
  if (token) {
    var user = getUserFromToken(token);
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  }, []);

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Header />

        <div className="mt-24">
          {isLoading ? (
            <PageLoading />
          ) : (
            <Routes>
              <Route
                index
                path="/"
                element={user ? <HomePage /> : <LoginPage />}
              />
              <Route
                path="/signup"
                element={user ? <HomePage /> : <SignupPage />}
              />
              <Route
                path="/login"
                element={user ? <HomePage /> : <LoginPage />}
              />
              <Route
                path="/verify-otp"
                element={user ? <HomePage /> : <VerifyOtpForm />}
              />
              <Route
                path="/youtube-download"
                element={user ? <YoutubeDownloadPage /> : <LoginPage />}
              />
              <Route
                path="/instagram-download"
                element={user ? <InstagramDownloadForm /> : <LoginPage />}
              />
              <Route
                path="/video-stream"
                element={user ? <StreamingPage /> : <LoginPage />}
              />

              <Route path="/reset-password" element={<ForgotPasswordPage />} />
              <Route path="/update-password" element={<PasswordUpdateForm />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </div>
        <Footer />
      </BrowserRouter>
      <CSSReset />
    </ChakraProvider>
  );
}

export default App;
