import React, { useState } from "react";
import {
  Input,
  Button,
  Box,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import { Alert, message } from "antd";
import axios from "axios";

const YoutubeVideoDownloadPage = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isValidUrl, setIsValidUrl] = useState(true);

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    setIsValidUrl(true);
  };

  function isValidYoutubeUrl(inputUrl) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/i;
    return pattern.test(inputUrl);
  }

  const handleDownload = async (e) => {
    e.preventDefault();
    onOpen();
  };

  const handleConfirmDownload = async () => {
    onClose();
    setLoading(true);

    const videoUrl = url;

    if (!isValidYoutubeUrl(url)) {
      message.error("Please enter a valid YouTube URL.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/download?url=${videoUrl}`, {
        responseType: "blob",
      });

      if (response.data.success !== false) {
        message.success("Downloading Started...");
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", "video.mp4");
        document.body.appendChild(link);
        link.click();
        setLoading(false);
        setUrl("");
      } else {
        message.error(response.data.message || "An error occurred.");
        setLoading(false);
        return;
      }
    } catch (error) {
      message.error("An error occurred.");
      setLoading(false);
      return;
    }
  };

  return (
    <Box borderRadius="md" marginBottom={"5px"}>
      <h4
        className="text-2xl md:text-2xl font-bold mb-4"
        style={{ textAlign: "center" }}
      >
        YouTube Video Downloader
      </h4>
      <form onSubmit={handleDownload}>
        <FormControl>
          <FormLabel>Enter YouTube video URL</FormLabel>
          <Input
            placeholder="Enter YouTube video URL"
            value={url}
            onChange={handleUrlChange}
            mb={4}
            required
            isInvalid={!isValidUrl}
          />
          {!isValidUrl && (
            <Alert
              type="error"
              message="Please enter a valid YouTube URL."
              showIcon
            />
          )}
          <br />
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          width={"100%"}
          isLoading={loading}
          loadingText="Downloading..."
        >
          Download now
        </Button>
      </form>
      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Download</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to start the download?</ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleConfirmDownload}>
              Download
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default YoutubeVideoDownloadPage;
