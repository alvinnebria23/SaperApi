import jwt from "jsonwebtoken";
import { OK, UNAUTHORIZED } from "../constants/HttpCodes.js";
import { getShopeeApiByAppId, updateTypeByAppId } from "../service/ShopeeApiService.js";
import logger from "../loggers/logger.js";
import dotenv from 'dotenv';
dotenv.config();

const checkToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const appVersion = req.headers['x-saper-version'];   
    const token = authHeader && authHeader.split(' ')[1];
    if (appVersion === null || appVersion === undefined || parseInt(appVersion) < parseInt(process.env.APP_VERSION)) {
      return res.status(OK).json({ 
        fail: true, 
        message: "We updated the app as of (August 21, 2023), Please close and update the application on Google Play Store first. Thank you for your patience.",
        isOutdated: true 
      });
    }
    if (token == null) return res.sendStatus(UNAUTHORIZED);

    jwt.verify(token, process.env.API_KEY + process.env.API_SECRET, async (error) => {
      if(error){
        if(error.name === "TokenExpiredError"){
          const { appId } = req.body;
          const apiCredentials = await getShopeeApiByAppId(appId);
          if(apiCredentials.token){
            if(token === apiCredentials.token){
              await updateTypeByAppId(appId)
            }else{
              return res.status(OK).json({ 
                fail: true, 
                message: "Please relogin your account first to update subscription plan successfully.",
              });
            }
          }else{
            await updateTypeByAppId(appId, "trial");
          }
        }
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
