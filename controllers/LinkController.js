import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
import { ERROR, OK } from "../constants/HttpCodes.js";
import logger from "../loggers/logger.js";
import { saveLink, getLinks, update, remove, removeExpiredLinks } from "../service/LinkService.js";
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
          logger.error("ERROR MESSAGE: " + JSON.stringify(response.errors));
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
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

const retrieveGeneratedLinks = async (req, res) => {
  try{
    const { userId } = req.body;
    const generatedLinks = await getLinks(userId);
    res.status(OK).json({ shopeeLinks: generatedLinks })
  }catch(error){
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

const updateLink = async(req, res) => {
  try {
    const { data, where } = req.body
    const updatedLink = await update(data, where);
    res.status(OK).json(updatedLink)
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
}

const removeLinks = async(req, res) => {
  try {
    const { where } = req.body
    const response = await remove(where);
    res.status(OK).json(response)
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
}

const deleteExpiredLinks = async (_, res) => {
  try {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 90);
    const response = await removeExpiredLinks(expiredDate); 
    logger.info(`EXPIRED_DATE=${expiredDate} DELETED_ROWS=${response}`);
    res.status(OK).json(response)
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
}
export { generateAndSaveLink, retrieveGeneratedLinks, updateLink, removeLinks, deleteExpiredLinks };
