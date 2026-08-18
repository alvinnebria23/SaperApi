import { ERROR, OK } from "../constants/HttpCodes.js"
import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
import { getShopeeApiByAppId, updateShopeeApi, updateToken, findApiCredentials }  from "../service/ShopeeApiService.js"
import { getConversionReport, processDashboard, processSubid, processClickTime } from "../helpers/ConversionReport.js";
import { CLICKTIME_QUERY_VARIABLES, DASHBOARD_QUERY_VARIABLES, SUBID_QUERY_VARIABLES } from "../constants/ShopeeConstants.js";
import { getConversionReportQuery } from "../util/QueryStringUtil.js";
import { insertSubscriptionHistory } from "../service/SubscriptionHistoryService.js";
import logger from "../loggers/logger.js";
const checkApi = async (req, res) => {
  const { appId, secretKey, isUpdate, id } = req.body;
  try {
    if(!isUpdate){
      const apiCredentials = await getShopeeApiByAppId(appId);
      if(apiCredentials){
          res.status(OK).json({ success: false, message: 'The App ID have already been registered by another user.'});
          return;
      }
    }
    const query = getConversionReportQuery('limit:1', SUBID_QUERY_VARIABLES);
    const response = await ShopeeRequestCLient(appId, secretKey, query);
    if(response.errors){
      const { code } = response.errors[0].extensions;
      if(code === 10020){
        res.status(OK).json({ success: false, message: 'App Id and Secret key is invalid or does not match.'});
      }else{
        logger.info(`CODE=${code} APPID=${appId} SECRETKEY=${secretKey}`);
        res.status(OK).json({ success: false, message: 'There was an error. Please try again later.'});
      }
      return;
    }
    if(isUpdate){
      await updateShopeeApi(id, appId, secretKey);
    }
    res.status(OK).json({ success: true, message: 'success'});
    return;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

const dashboard = async (req, res) => {
  try {
    const { appId, secretKey, parameters} = req.body;
    const conversionReportArray = await getConversionReport(appId, secretKey, parameters, DASHBOARD_QUERY_VARIABLES);
    if(conversionReportArray.fail){
      res.status(OK).json(conversionReportArray);
      return;
    }
    const dashboardData = await processDashboard(conversionReportArray);
    res.status(OK).json(dashboardData);
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

const subIdTree = async (req, res) => {
  try {
    const { appId, secretKey, parameters} = req.body;
    const conversionReportArray = await getConversionReport(appId, secretKey, parameters, SUBID_QUERY_VARIABLES);
    if(conversionReportArray.fail){
      res.status(OK).json(conversionReportArray);
      return;
    }
    const conversionData = await processSubid(conversionReportArray);
    res.status(OK).json(conversionData);
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
}

const clickTimeTree = async (req, res) => {
  try {
    const { appId, secretKey, parameters} = req.body;
    const conversionReportArray = await getConversionReport(appId, secretKey, parameters, CLICKTIME_QUERY_VARIABLES);
    if(conversionReportArray.fail){
      res.status(OK).json(conversionReportArray);
      return;
    }
    const conversionData = await processClickTime(conversionReportArray);
    res.status(OK).json(conversionData);
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
}

const updateUserToken = async (req, res) => {
  try {
    const { type, appId, userId, numberOfDays } = req.body;
    const response = await updateToken(type, appId, numberOfDays);
    if(response) {
      await insertSubscriptionHistory(userId, type);
    }
    logger.info(`[SUBSCRIPTION HISTORY] USER_ID=${userId} APP_ID=${appId} TYPE=${type} NUMBER_OF_DAYS=${parseInt(numberOfDays)} SUCCESS=${response}`);
    res.status(OK).json({ success: response });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

const getApiCredentials = async (req, res) => {
  try {
    const { appId } = req.body;
    const apiCredential = await findApiCredentials(appId);
    res.status(OK).json(apiCredential);
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({});
  }
}
export {
  checkApi,
  dashboard,
  subIdTree,
  clickTimeTree,
  updateUserToken,
  getApiCredentials
};
