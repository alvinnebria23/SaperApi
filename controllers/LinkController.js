import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
import { OK } from "../constants/HttpCodes.js";
import { saveLink, getLinks } from "../service/LinkService.js";
import { getShopeeApiByAppId } from "../service/ShopeeApiService.js";
import { getGenerateShortLinkQuery } from "../util/QueryStringUtil.js";

const generateAndSaveLink = async (req, res) => {
  try {
    const generatedLinks = [];
    const links = [];
    const { appId, secretKey, originalUrl, subIds } = req.body;
    for(const link of originalUrl){
      const query = getGenerateShortLinkQuery(link, subIds);
      const response = await ShopeeRequestCLient(appId, secretKey, query)
      .then((response) => {
        if(response.errors){
          return { error: true, message: response.errors[0].message };
        }
        return response?.data?.generateShortLink?.shortLink;
      });
      if(response.error){
        res.status(OK).json(response);
        break;
      }
      links.push({ originalUrl: link, shortLink: response });
      generatedLinks.push(response);
    }
    const shopeeApi = await getShopeeApiByAppId(appId);
    for(const link of links){
      await saveLink(link.originalUrl, link.shortLink, subIds, shopeeApi.userId);
    }
    res.status(OK).json({ shopeeLinks: generatedLinks })
  } catch (error) {
    throw error;
  }
};

const retrieveGeneratedLinks = async (req, res) => {
  try{
    const { userId } = req.body;
    const generatedLinks = await getLinks(userId);
    res.status(OK).json({ shopeeLinks: generatedLinks })
  }catch(error){
    throw error;
  }
};

export { generateAndSaveLink, retrieveGeneratedLinks };
