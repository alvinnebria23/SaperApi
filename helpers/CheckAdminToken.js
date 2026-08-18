import jwt from "jsonwebtoken";
import logger from "../loggers/logger.js";

const checkAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.API_KEY + process.env.API_SECRET, (err, user) => {
      if (err) {
        logger.error("ERROR MESSAGE: " + err?.message);
        return res.sendStatus(403);
      }
      if(user.type === "admin"){
        next();
      }else {
        return res.sendStatus(403);
      }
    });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
  }
};

export default checkAdminToken;
