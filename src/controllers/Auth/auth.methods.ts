import jwt from "jsonwebtoken";
const promisify = require("util").promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

const authMethod = {
  generateToken: async (payload: object, secretSignature: any, tokenLife: any) => {
    try {
      return await sign(
        {
          payload,
        },
        secretSignature,
        {
          algorithm: "HS256",
          expiresIn: tokenLife,
        }
      );
    } catch (error) {
      if (error instanceof TypeError) {
        console.error("Type Error occurred:", error.message);
      } else if (error instanceof ReferenceError) {
        console.error("Reference error occurred:", error.message);
      } else {
        console.error("Not create accessToken");
      }
      return null;
    }
  },

  verifyToken: async (token: any, secretKey: any) => {
    try {
      return await verify(token, secretKey,{
        ignoreExpiration: false,
      });
    } catch (error) {
      if (error instanceof TypeError) {
        console.error("Type Error occurred:", error.message);
      } else if (error instanceof ReferenceError) {
        console.error("Reference error occurred:", error.message);
      } else {
        console.error("Error in verifying access token:", error);
      }
      return null;
    }
  },

  decodeToken: async (token: any, secretKey: any) => {
    try {
      return await verify(token, secretKey, {
        ignoreExpiration: false,
      });
    } catch (error) {
      if (error instanceof TypeError) {
        console.error("Type Error occurred:", error.message);
      } else if (error instanceof ReferenceError) {
        console.error("Reference error occurred:", error.message);
      } else {
        console.error(`Error in decode access token: ${error}`);
      }
      return null;
    }
  },
}

export default authMethod;