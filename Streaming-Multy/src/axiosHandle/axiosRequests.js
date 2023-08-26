import axios from "axios";

// reusable axios
const makeRequest = async (url, method, authToken = null, data = null) => {
  try {
    const config = {
      method: method,
      url: url,
      data: data,
    };

    if (authToken) {
      config.headers = {
        Authorization: `Bearer ${authToken}`,
      };
    }

    const response = await axios(config);

    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export default makeRequest;
