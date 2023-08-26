import React from "react";
import {
  Container,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Link,
} from "@chakra-ui/react";

// about paage
const About = () => {
  return (
    <Container maxW="xl" mt={8} color="white" padding="5px">
      <Heading size="xl" fontWeight="semibold" mb={4}>
        About Us
      </Heading>
      <Text color="whiteAlpha.700">
        Welcome to our video downloader website! At Video Downloader, we are
        committed to providing a convenient and reliable solution for
        downloading videos from popular platforms like YouTube and Instagram.
        Our platform is designed to help you access your favorite videos offline
        so you can enjoy them anytime, anywhere.
      </Text>
      <Text color="whiteAlpha.700" mt={4}>
        Our mission is to empower users with the ability to download videos for
        personal use, educational purposes, or entertainment. Whether you're a
        student looking to save educational content, a content creator archiving
        your work, or simply someone who wants to keep their favorite videos,
        Video Downloader has got you covered.
      </Text>
      <Text color="whiteAlpha.700" mt={4}>
        Key Features:
        <UnorderedList
          color="whiteAlpha.700"
          mt={2}
          listStyleType="disc"
          listStylePosition="inside"
        >
          <ListItem>
            Supports downloading videos from YouTube and Instagram
          </ListItem>
          <ListItem>Easy-to-use interface for quick video URL input</ListItem>
          <ListItem>Multiple download formats and quality options</ListItem>
          <ListItem>Fast and reliable download speeds</ListItem>
        </UnorderedList>
      </Text>
      <Text color="whiteAlpha.700" mt={4}>
        We value copyright and privacy considerations, and we encourage users to
        respect the terms of use of the platforms they download videos from. Our
        service is intended for personal use, and users are responsible for
        complying with relevant copyright laws and regulations.
      </Text>
      <Text color="whiteAlpha.700" mt={4}>
        Contact Us:
        <br />
        Have questions, suggestions, or feedback? Reach out to our team at{" "}
        <Link
          href="mailto:smartds2550@gmail.com"
          color="blue.500"
          _hover={{ textDecoration: "underline", color: "white" }}
        >
          smartds2550@gmail.com
        </Link>{" "}
        for assistance and support.
      </Text>
    </Container>
  );
};

export default About;
