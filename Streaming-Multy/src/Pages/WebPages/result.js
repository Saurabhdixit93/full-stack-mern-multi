import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  Center,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { FaDownload, FaCheckCircle } from "react-icons/fa";

// audio result
const Result = ({ fileDetails }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      const downloadLink = document.createElement("a");
      downloadLink.href = fileDetails.link;
      downloadLink.download = fileDetails.title + ".mp3";
      downloadLink.click();
    }, 3000);
  };

  return (
    <Box p={4} bg="gray.100" borderRadius="md">
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {fileDetails.title}
      </Text>
      <Text fontSize="md" mb={2}>
        Size: {fileDetails.size}
      </Text>
      {downloaded ? (
        <Center flexDirection="column" alignItems="center">
          <Box as={FaCheckCircle} size="50px" color="green.500" mb={2} />
          <Text fontSize="lg" fontWeight="bold" color="green.500">
            Downloaded
          </Text>
        </Center>
      ) : (
        <Center flexDirection="column">
          {downloading ? (
            <Box>
              <CircularProgress
                value={downloading ? 100 : 0}
                size="80px"
                color="blue.500"
                trackColor="gray.200"
                thickness="8px"
              >
                <CircularProgressLabel>
                  {downloading ? (
                    <CircularProgress
                      isIndeterminate
                      size="20px"
                      color="blue.500"
                    />
                  ) : (
                    ""
                  )}
                </CircularProgressLabel>
              </CircularProgress>
            </Box>
          ) : (
            <Button
              colorScheme="blue"
              mt={2}
              leftIcon={<FaDownload />}
              onClick={handleDownload}
              _hover={{ backgroundColor: "blue.600" }}
              _active={{ backgroundColor: "blue.700" }}
              _focus={{ outline: "none" }}
              _disabled={{ backgroundColor: "blue.300", cursor: "not-allowed" }} // Customize disabled state
              width="100%"
              isLoading={downloading}
            >
              {downloading ? "Downloading..." : "Download"}
            </Button>
          )}
        </Center>
      )}
    </Box>
  );
};

export default Result;
