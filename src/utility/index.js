const jwt = require("jsonwebtoken");

let JWTSecret =
  "5Cg+Y1famL4prJkzA3zo9SGHIaxtYwKbM65dXP1IACVHhD4gnP02UoA6/P+KfiviLifW4FaLwxq6f8RLFftX4Q==";

function responseObject(message, type, data) {
  return {
    message,
    success: type,
    data,
  };
}

function isTokenValid(token, JWTtoken = JWTSecret) {
  // Check if token is valid
  try {
    const decodedToken = jwt.decode(token, { complete: true }); // this decodes the JWT token
    const expirationTime = decodedToken.payload.exp; // this is to check if the access token has expired
    //compare with current time
    const currentTime = Math.floor(Date.now() / 1000);

    if (expirationTime > currentTime) {
      if (JWTtoken) {
        jwt.verify(token, JWTtoken);
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

module.exports = { responseObject, isTokenValid };
