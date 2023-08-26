import jwt_decode from "jwt-decode";

// get-userid from token
export const getUserFromToken = (token) => {
  try {
    const decodedToken = jwt_decode(token);

    const user = {
      userId: decodedToken.userid || null,
    };

    return user;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
