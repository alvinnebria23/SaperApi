import axios from "axios";
import crypto from 'crypto';
import { SHOPEE_API_ENDPOINT } from "../constants/ShopeeConstants.js";
const ShopeeRequestCLient = async (appId, secretKey, query) => {
  try {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const payload =  {
      "query": query
    };
    const signature = getSignature(appId + timestamp + JSON.stringify(payload) + secretKey);
    const authorizationHeader = getAuthorizationHeader(appId, timestamp, signature);
    const config = getConfig(authorizationHeader);
    const response = await axios.post(SHOPEE_API_ENDPOINT, payload, config);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getSignature = (value) => {
    return crypto.createHash('sha256').update(value).digest('hex');
}
const getAuthorizationHeader = (appId, timestamp, signature) => {
    return `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`;
};
const getConfig = (authorizationHeader) => {
    return {
        headers: {
          'Authorization': authorizationHeader,
          'Content-Type': 'application/json'
        },
    }
}
export {
    ShopeeRequestCLient,
};
