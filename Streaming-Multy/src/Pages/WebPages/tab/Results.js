import React from "react";
import { Box, Text, Button, Image, Divider, Center } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa";
import { message } from "antd";
const BaseUrl = process.env.REACT_APP_BACKEND_BASE;

// result page video
const ResultVideo = ({ fileDetails }) => {
  const { title, author, thumbnail, formats, url } = fileDetails;

  // Filter formats to unique formats based on qualityLabel and container
  let uniqueFormats = [];
  const filteredFormats = formats.filter((format) => {
    if (
      format.qualityLabel &&
      format.container &&
      !uniqueFormats.includes(format.qualityLabel)
    ) {
      uniqueFormats.push(format.qualityLabel);
      return true;
    }
    return false;
  });

  // Sort filtered formats by quality in descending order
  filteredFormats.sort((a, b) => b.quality - a.quality);

  const openDownloadWindow = (url) => {
    const downloadWindow = window.open(url, "_blank");
    message.success("Downloading Start....");
    if (!downloadWindow) {
      message.error(
        "Download popup blocked. Please allow popups and try again."
      );
    }
  };

  const handleDownload = async (format) => {
    const itag = format.itag;
    try {
      const downloadUrl = `${BaseUrl}/youtube/download-video?format=${itag}&url=${url}`;
      openDownloadWindow(downloadUrl);
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        {title}
      </Text>
      <Text fontSize="md" color="gray.600" mb={2}>
        {author}
      </Text>
      <Center>
        <Box>
          <Image src={thumbnail} alt={title} maxH="100%" mb={2} />
        </Box>
      </Center>
      <Divider my={2} />
      {filteredFormats.map((format, index) => (
        <Box key={index} mb={2}>
          <Text fontSize="md" fontWeight="bold" mb={1}>
            {format.qualityLabel}
          </Text>
          <Button
            leftIcon={<FaDownload />}
            colorScheme="blue"
            size="sm"
            width="100%"
            onClick={(e) => {
              e.preventDefault();
              handleDownload(format);
            }}
          >
            Download
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default ResultVideo;
