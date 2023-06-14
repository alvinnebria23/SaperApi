import jwt from "jsonwebtoken";
import { INVALID, UNAUTHORIZED } from "../constants/HttpCodes.js";

const checkToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(UNAUTHORIZED);

  jwt.verify(token, process.env.API_KEY + process.env.API_SECRET, (error) => {
    if(error){
      if(error.name === 'TokenExpiredError'){
        res.sendStatus(UNAUTHORIZED);
      }else {
        res.sendStatus(INVALID);
      }
    };
    next();
  });
};

export default checkToken;
