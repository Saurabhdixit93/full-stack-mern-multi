import React from "react";
import { Box, Image, Text, Button } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa";

// /insta page
const InstagramDownloadResult = ({ fileDetails }) => {
  return (
    <Box>
      <Image src={fileDetails?.image} alt="Video Thumbnail" />
      <Text mt={2}>Video Thumbnail</Text>
      <a href={fileDetails?.video} download>
        <Button
          leftIcon={<FaDownload />}
          colorScheme="green"
          size="lg"
          width="100%"
        >
          Download Video
        </Button>
      </a>
    </Box>
  );
};

export default InstagramDownloadResult;
