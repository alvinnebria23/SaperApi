import jwt from "jsonwebtoken";
import { INVALID, UNAUTHORIZED } from "../constants/HttpCodes.js";
import logger from "../loggers/logger.js";

const checkToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(UNAUTHORIZED);

    jwt.verify(token, process.env.API_KEY + process.env.API_SECRET, (error) => {
      if(error){
        logger.error(`ERROR_NAME=${error.name} APP_ID=${req.body.appId}`);
        return res.sendStatus(UNAUTHORIZED);
      };
      next();
    });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error.message);
  }
};

export default checkToken;
