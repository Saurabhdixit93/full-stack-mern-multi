import { Button } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom"; // If you're using React Router
// home page
const HomePage = () => {
  return (
    <div className="bg-gray-100 " style={{ minHeight: "70vh" }}>
      <section className="bg-blue-700 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Seamless Content Downloading
          </h1>
          <p className="text-lg md:text-xl mb-4">
            Unlock the power of our platform, offering not only YouTube video
            and audio downloads, but also Instagram video downloading
            capabilities. Stay connected to your favorite content with our
            stylish and responsive service.
          </p>
          {/* <Link to="/learn-more" className="btn btn-primary">
            Explore Features
          </Link> */}
        </div>
      </section>
      <section className="py-12 min-h-features" style={{ paddingLeft: "5px" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* YouTube Download */}
            <div className="p-6 border border-gray-300 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">YouTube Download</h3>
              <p className="text-gray-700">
                Access and download your favorite YouTube videos and audio
                tracks effortlessly. Stay inspired and informed with your
                personalized collection.
              </p>
              <Button
                as={Link}
                to="/youtube-download"
                colorScheme="blue"
                mt={4}
              >
                Download YouTube Content
              </Button>
            </div>

            {/* Instagram Download */}
            <div className="p-6 border border-gray-300 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Instagram Download</h3>
              <p className="text-gray-700">
                Elevate your Instagram experience by downloading videos that
                resonate with you. Save and share moments with our seamless
                download feature.
              </p>
              <Button
                as={Link}
                to="/instagram-download"
                colorScheme="pink"
                mt={4}
              >
                Download Instagram Content
              </Button>
            </div>

            <div className="p-6 border border-gray-300 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                Live Channels Streaming
              </h3>
              <p className="text-gray-700">
                Enhance your live TV channel streaming experience by accessing
                and enjoying videos that captivate your interest. Seamlessly
                access and share your favorite moments with our convenient
                streaming feature.
              </p>
              <Button as={Link} to="/video-stream" colorScheme="green" mt={4}>
                Open Streaming
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
