import React, { useState, useRef } from "react";
import {
  Flex,
  Button,
  Text,
  Box,
  VStack,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { FaChevronRight } from "react-icons/fa";
import ResponsiveEmbed from "react-responsive-embed";
const channels = {
  music: [
    {
      url: "https://www.9xm.in/livetv.php",
      name: "9xm music",
    },
    {
      url: "https://www.sonymix.tv/videos.php",
      name: "Sony Mix",
    },
  ],
  news: [
    {
      url: "https://feeds.intoday.in/livetv/ver-3-0/?id=livetv-at&amp;autostart=1",
      name: "Aaj Tak",
    },
    {
      url: "https://feeds.intoday.in/livetv/ver-3-0/?id=livetv-it&amp;autostart=1",
      name: "India Today",
    },
  ],
  cricket: [
    {
      url: "https://stream.crichd.vip/update/espn.php",
      name: "ESPN",
    },
    {
      url: "https://stream.crichd.vip/update/star1hi.php",
      name: "Star Sports Hindi 1",
    },
  ],
};

// channel stream
const StreamingPage = () => {
  const [currentSrcIndexes, setCurrentSrcIndexes] = useState({
    music: 0,
    news: 0,
    cricket: 0,
  });

  const iframeRef = useRef(null);

  const handleNextSource = async (category) => {
    setCurrentSrcIndexes((prevIndexes) => ({
      ...prevIndexes,
      [category]: (prevIndexes[category] + 1) % channels[category].length,
    }));
  };

  const handleDoubleClick = (iframe) => {
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" p={6} minH="70vh">
      <Box bg="white" boxShadow="lg" rounded="lg" p={4}>
        <Heading size="lg" textAlign="center" mb={4}>
          Professional Streaming Channel
        </Heading>

        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            {Object.keys(channels).map((category) => (
              <Tab key={category}>{category}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {Object.keys(channels).map((category) => (
              <TabPanel key={category}>
                <VStack align="center" spacing={4} position="relative">
                  <Text fontSize="lg">Currently Playing:</Text>
                  <Text fontSize="xl" fontWeight={"bold"}>
                    {channels[category][currentSrcIndexes[category]].name}
                  </Text>
                  <Box
                    bg="gray.100"
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="lg"
                    width="100%"
                    maxW="800px"
                    position="relative"
                  >
                    <ResponsiveEmbed
                      src={channels[category][currentSrcIndexes[category]].url}
                      allowFullScreen
                      ratio="16:9"
                      onDoubleClick={() => handleDoubleClick(iframeRef.current)}
                    />
                  </Box>
                  {channels[category].length > 1 && (
                    <Button
                      rightIcon={<FaChevronRight />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => handleNextSource(category)}
                    >
                      Next Source
                    </Button>
                  )}
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default StreamingPage;
