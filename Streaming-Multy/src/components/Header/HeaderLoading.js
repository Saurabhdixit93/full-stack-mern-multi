import React, { useState, useEffect } from "react";
import { Box, Progress } from "@chakra-ui/react";

const HeaderLoader = () => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finishLoading = () => {
      setProgress(100);
      setLoading(false);
    };

    // Add an event listener for the window's load event
    window.addEventListener("load", finishLoading);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 10;
        }
        clearInterval(interval);
        setLoading(false);
        return prevProgress;
      });
    }, 500);

    return () => {
      window.removeEventListener("load", finishLoading);
      clearInterval(interval);
    };
  }, []);

  if (!loading) return null;

  return (
    <Box position="fixed" top="0" left="0" width="100%" zIndex="9999">
      <Progress size="xs" colorScheme="red" value={progress} />
    </Box>
  );
};

export default HeaderLoader;
