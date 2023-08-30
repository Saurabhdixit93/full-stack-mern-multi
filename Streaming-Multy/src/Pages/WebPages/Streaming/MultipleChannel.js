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
      url: "blob:https://www.watcho.com/206f5285-05ca-498a-bbdb-bca0b37e2d24",
      name: "music India",
    },
    {
      url: "blob:https://www.watcho.com/542229b8-9186-4f55-bee2-67b61ae42a5e",
      name: "9x Jalva",
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
    {
      url: "https://www.youtube.com/embed/nyd-xznCpJc",
      name: "Abp news",
    },
    {
      url: "blob:https://www.watcho.com/f0b28588-5232-4df4-9962-a3c8cde207af",
      name: "India Tv",
    },
    {
      url: "blob:https://cdn.jwplayer.com/d5020922-1a77-48ce-9670-906960209095",
      name: "India Tv 2",
    },
    {
      url: "http://play4you.icu/e/46a3a514a5",
      name: "News 24",
    },
  ],
  Entertainment: [
    {
      url: "blob:https://www.watcho.com/2f2bae3f-b796-4bcf-b651-2ba74729cbf7",
      name: "DD National",
    },
    {
      url: "blob:https://www.yupptv.com/3ac18d37-fba7-4812-8e27-a10b850c345b",
      name: "DD India",
    },
    {
      url: "http://play4you.icu/e/1894c68b9d",
      name: "Cartoon Network",
    },
    {
      url: "http://desistreams.tv/embed/pogo.php",
      name: "Pogo Tv",
    },
    {
      url: "http://play4you.icu/e/ff37785958",
      name: "B4U Plus",
    },
    {
      url: "http://play4you.icu/e/06310c0bfb",
      name: "B4U Movies",
    },
    {
      url: "http://desistreams.tv/embed/sony_tv.php",
      name: "Sony Tv",
    },
    {
      url: "http://desistreams.tv/embed/star_plus.php'",
      name: "Star Plus",
    },

    {
      url: "http://desistreams.tv/embed/star_gold2.php",
      name: "Star Gold",
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

const StreamingPage = () => {
  const [currentSrcIndexes, setCurrentSrcIndexes] = useState({
    music: 0,
    news: 0,
    cricket: 0,
    Entertainment: 0,
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
                    ref={iframeRef} // Add this ref
                  >
                    <ResponsiveEmbed
                      src={channels[category][currentSrcIndexes[category]].url}
                      allowFullScreen
                      ratio="16:9"
                      onDoubleClick={handleDoubleClick}
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
