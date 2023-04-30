import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
import { getGenerateShortLinkQuery } from "../util/QueryStringUtil.js";

const generateAndSaveLink = async (req, res) => {
  try {
    const { appId, secretKey, originalUrl, subIds } = req.body;
      const query = getGenerateShortLinkQuery(originalUrl, subIds);
    const response = await ShopeeRequestCLient(appId, secretKey, query);
    console.log(response);
    res.status(OK).json(response);
    return response;
  } catch (error) {
    throw error;
  }
};

export { generateAndSaveLink };
