import React, { useState } from "react";
import {
  Input,
  Button,
  Center,
  Box,
  FormControl,
  FormLabel,
  Spinner,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Alert, message } from "antd";
import Result from "./result";
import makeRequest from "../../axiosHandle/axiosRequests";
import YoutubeVideoDownloadPage from "./tab/youtubeeVideo";

// utube convert form for auido
const YoutubeDownloadPage = () => {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("320");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;

    setUrl(inputUrl);
    setIsValidUrl(true);
  };

  const handleConvert = async (e) => {
    e.preventDefault();

    const formData = {
      videoUrl: url,
      quality: quality,
    };

    if (!formData.videoUrl || !formData.quality) {
      message.error("URL and Quality are required *");
      return;
    }
    setLoading(true);
    await makeRequest("/youtube/convert-audio", "POST", null, formData)
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
        }
        setLoading(false);
        message.error(data.message);
        setUrl("");
        return;
      })
      .catch((error) => {
        message.success(error.message);
        setUrl("");
        setLoading(false);
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
        <Tabs index={selectedTab} onChange={(index) => setSelectedTab(index)}>
          <TabList
            backgroundColor="white"
            borderBottom="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            padding={2}
            marginBottom={4}
            display="flex"
            justifyContent="center"
            _hover={{ cursor: "pointer" }}
            _active={{ backgroundColor: "blue.50" }}
            _focus={{ outline: "none" }}
          >
            <Tab
              fontSize="md"
              fontWeight="medium"
              color="gray.600"
              paddingX={4}
              paddingY={2}
              _selected={{
                color: "blue.500",
                borderBottom: "2px solid",
                borderColor: "blue.500",
              }}
            >
              YouTube Audio
            </Tab>
            <Tab
              fontSize="md"
              fontWeight="medium"
              color="gray.600"
              paddingX={4}
              paddingY={2}
              _selected={{
                color: "blue.500",
                borderBottom: "2px solid",
                borderColor: "blue.500",
              }}
            >
              YouTube Video
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <h4
                className="text-2xl md:text-2xl font-bold mb-4"
                style={{ textAlign: "center" }}
              >
                YouTube Audio Downloader
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
                </FormControl>
                <FormControl>
                  <FormLabel>Select Quality</FormLabel>
                  <Select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    mb={4}
                  >
                    <option value="320">320</option>
                    <option value="192">192</option>
                    <option value="256">256</option>
                    <option value="128">128</option>
                    <option value="64">64</option>
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={loading}
                  loadingText="converting..."
                  size="lg"
                  width={"100%"}
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
                    {result && <Result fileDetails={result} />}
                  </Box>
                )
              )}
            </TabPanel>
            <TabPanel>
              <YoutubeVideoDownloadPage />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Center>
  );
};

export default YoutubeDownloadPage;
