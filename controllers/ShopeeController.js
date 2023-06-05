import { ERROR, OK } from "../constants/HttpCodes.js"
import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
import { getShopeeApi, getShopeeApiByAppId, updateShopeeApi, updateToken }  from "../service/ShopeeApiService.js"
import { getConversionReport, processDashboard, processSubid, processClickTime } from "../helpers/ConversionReport.js";
import { CLICKTIME_QUERY_VARIABLES, DASHBOARD_QUERY_VARIABLES, SUBID_QUERY_VARIABLES } from "../constants/ShopeeConstants.js";
import { getConversionReportQuery } from "../util/QueryStringUtil.js";
import { findUserById } from "../service/UserService.js";
import logger from "../loggers/logger.js";
const checkApi = async (req, res) => {
  try {
    const { appId, secretKey, isUpdate, id } = req.body;
    const apiCredentials = await getShopeeApiByAppId(appId);
    if(!isUpdate){
      if(apiCredentials.secretKey === secretKey){
        res.status(OK).json({ success: false, message: 'The App ID and Secret key have already been registered by another user.'});
        return;
      }
    }
    const query = getConversionReportQuery('limit:1', DASHBOARD_QUERY_VARIABLES);
    const response = await ShopeeRequestCLient(appId, secretKey, query);
    if(response.errors){
      const { code } = response.errors[0].extensions;
      if(code === 10020){
        res.status(OK).json({ success: false, message: 'App Id and Secret key does not match.'});
      }else{
        res.status(OK).json({ success: false, message: 'There was an error. Please try again later.'});
      }
      return;
    }
    if(isUpdate){
      await updateShopeeApi(id, appId, secretKey);
      const user = await findUserById(id);
      const apiCredentials = await getShopeeApi(id);
      user.appId = apiCredentials.appId;
      user.secretKey = apiCredentials.secretKey;
      user.success = true;
      res.status(OK).json(user);
      return;
    }
    res.status(OK).json({ success: true, message: 'success'});
    return;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

const initial = async (req, res) => {
  try {
    const { appId, secretKey, parameters } = req.body;
    const conversionReportArray = await getConversionReport(appId, secretKey, parameters, DASHBOARD_QUERY_VARIABLES);
    const dashboardData = await processDashboard(conversionReportArray);
    const conversionData = await processSubid(conversionReportArray);
    dashboardData.conversionReport = conversionData;
    res.status(OK).json(dashboardData)
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

const dashboard = async (req, res) => {
  try {
    const { appId, secretKey, parameters} = req.body;
    const conversionReportArray = await getConversionReport(appId, secretKey, parameters, DASHBOARD_QUERY_VARIABLES);
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
    const conversionData = await processClickTime(conversionReportArray);
    res.status(OK).json(conversionData);
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
}

const updateUserToken = async (req, res) => {
  try {
    const { type, appId } = req.body;
    const response = await updateToken(type, appId);
    res.status(OK).json({ success: response });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

export {
  checkApi,
  dashboard,
  subIdTree,
  initial,
  clickTimeTree,
  updateUserToken,
};
