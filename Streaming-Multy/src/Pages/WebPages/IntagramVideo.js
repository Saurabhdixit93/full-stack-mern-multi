import React, { useState } from "react";
import { Box, Center, Heading, Input, Button, VStack } from "@chakra-ui/react";
import { Alert } from "antd";
import makeRequest from "../../axiosHandle/axiosRequests";
import InstagramDownloadResult from "./InstagraResults";
// insta page
const InstagramDownloadForm = () => {
  const [url, setUrl] = useState("");
  const [fileDetails, setFileDetails] = useState("");

  const [isFetching, setIsFetching] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isServiceDown, setIsServiceDown] = useState(false);

  const instagramUrlPattern =
    /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel)\/[a-zA-Z0-9_-]+\/?/;

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    if (instagramUrlPattern.test(newUrl)) {
      setIsValidUrl(true);
    } else {
      setIsValidUrl(false);
    }
  };

  const handleFetchVideo = async () => {
    setIsServiceDown(true);
    if (!url) {
      setIsValidUrl(true);
      return;
    }

    if (!isValidUrl) {
      return;
    }

    setIsFetching(true);

    await makeRequest("/insta/convert-video", "POST", null, { videoUrl: url })
      .then((data) => {
        console.log(data);
        setFileDetails(data.fileDetails);
        setIsFetching(false);
      })
      .catch((error) => {
        console.error("Error fetching video:", error);
        setIsFetching(false);
        return;
      });
  };

  return (
    <Center minHeight="70vh">
      <Box
        p={4}
        borderWidth={1}
        borderRadius="md"
        marginBottom={"5px"}
        width={{ base: "90%", md: "50%" }}
      >
        <Heading mb={4} textAlign="center">
          Instagram Video Downloader
        </Heading>
        {/* <VStack spacing={4} align="stretch">
          <Input
            placeholder="Enter Instagram video URL"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            size="lg"
            isInvalid={!isValidUrl}
          />
          {!isValidUrl && (
            <Alert
              type="error"
              message="  Please enter a valid Instagram video URL."
              showIcon
            />
          )}
          <Button
            colorScheme="blue"
            onClick={handleFetchVideo}
            isLoading={isFetching}
            loadingText="Getting..."
            size="lg"
          >
            Get Video
          </Button>

          {fileDetails && <InstagramDownloadResult fileDetails={fileDetails} />}
        </VStack> */}
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Enter Instagram video URL"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            size="lg"
            isInvalid={!isValidUrl}
            disabled={isServiceDown}
          />
          {!isValidUrl && (
            <Alert
              type="error"
              message="Please enter a valid Instagram video URL."
              showIcon
            />
          )}

          {isServiceDown && (
            <Alert
              type="warning"
              message="This service is temporarily down for maintenance."
              showIcon
            />
          )}

          <Button
            colorScheme="blue"
            onClick={handleFetchVideo}
            isLoading={isFetching}
            loadingText="Getting..."
            size="lg"
            disabled={isServiceDown || !isValidUrl}
          >
            Get Video
          </Button>

          {fileDetails && <InstagramDownloadResult fileDetails={fileDetails} />}
        </VStack>
      </Box>
    </Center>
  );
};

export default InstagramDownloadForm;
