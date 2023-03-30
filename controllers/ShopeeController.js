import axios from "axios";
import crypto from 'crypto';
import { OK, ERROR } from "../constants/HttpCodes.js"
import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
const checkApi = async (req, res) => {

  try {
    const { appId, secretKey } = req.body;
    let isValid = false;
    const query = `{
          conversionReport(limit:1){ 
            nodes{ 
              grossCommission 
            }
          }
        }`;
    const { conversionReport } = await ShopeeRequestCLient(appId, secretKey, query);
    res.status(OK).send();
  } catch (error) {
    res.status(ERROR).json(error);
  }
};

export {
  checkApi,
};
