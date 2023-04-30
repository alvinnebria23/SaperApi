import axios from "axios";
import crypto from 'crypto';
import { SHOPEE_API_ENDPOINT } from "../constants/ShopeeConstants.js";
const ShopeeRequestCLient = async (appId, secretKey, query) => {
  try {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const payload =  {
      "query": query
    };
    const signature = crypto.createHash('sha256').update(appId + timestamp + JSON.stringify(payload) + secretKey).digest('hex');
    const authorizationHeader =  `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`;
    const config = {
      headers: {
        'Authorization': authorizationHeader,
        'Content-Type': 'application/json'
      },
    }
    const response = await axios.post(SHOPEE_API_ENDPOINT, payload, config);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export {
    ShopeeRequestCLient,
};
