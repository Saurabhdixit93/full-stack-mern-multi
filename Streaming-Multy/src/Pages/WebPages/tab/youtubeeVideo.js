import React, { useState } from "react";
import {
  Input,
  Button,
  Box,
  FormControl,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";
import makeRequest from "../../../axiosHandle/axiosRequests";
import { Alert, message } from "antd";
import ResultVideo from "./Results";

// youtube video convert
const YoutubeVideoDownloadPage = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [resultLoading, setResultLoading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    setIsValidUrl(true);
  };

  const handleConvert = async (e) => {
    e.preventDefault();

    setLoading(true);
    await makeRequest("/youtube/convert-video", "POST", null, { videoUrl: url })
      .then((data) => {
        if (data.success) {
          setLoading(false);
          message.success(data.message);
          setResultLoading(true);
          setTimeout(() => {
            setResult(data.fileDetails);
            setResultLoading(false);
          }, 3000);
          setUrl("");
          return;
        } else {
          message.error(data.message);
          setLoading(false);
          setResult("");
          return;
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
        setResult("");
        return;
      });
  };

  return (
    <Box borderRadius="md" marginBottom={"5px"}>
      <h4
        className="text-2xl md:text-2xl font-bold mb-4"
        style={{ textAlign: "center" }}
      >
        YouTube Video Downloader
      </h4>
      <form onSubmit={handleConvert}>
        <FormControl>
          <FormLabel>Enter YouTube video URL</FormLabel>
          <Input
            placeholder="Enter YouTube video URL"
            value={url}
            onChange={handleUrlChange}
            mb={4}
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
          loadingText="Converting..."
        >
          Convert
        </Button>
      </form>

      {resultLoading ? (
        <Box
          p={4}
          bg="gray.100"
          borderRadius="md"
          marginBottom={"5px"}
          textAlign={"center"}
          mt={"10px"}
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        result && (
          <Box
            p={4}
            bg="gray.100"
            borderRadius="md"
            marginBottom={"5px"}
            textAlign={"center"}
            mt={"10px"}
          >
            {result && (
              <ResultVideo fileDetails={result} />
              // <Text>Suces </Text>
            )}
          </Box>
        )
      )}
    </Box>
  );
};

export default YoutubeVideoDownloadPage;
