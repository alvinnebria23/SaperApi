import { OK } from "../constants/HttpCodes.js"
import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
import { getConversionReport, getConversionReportQuery, processDashboard, processConversion } from "../helpers/ConversionReport.js";
const checkApi = async (req, res) => {
  try {
    const { appId, secretKey } = req.body;
    const query = getConversionReportQuery('limit:1');
    const response = await ShopeeRequestCLient(appId, secretKey, query);
    if(response.errors){
      const { code } = response.errors[0].extensions;
      if(code === 10020){
        res.status(OK).json({ success: false, message: 'App Id and Secret key does not match.'})
      }else{
        res.status(OK).json({ success: false, message: 'There was an error. Please try again later.'})
      }
      return;
    }
    res.status(OK).json({ success: true, message: 'success'});
  } catch (error) {
    res.status(OK).json({ success: false, message: 'There was an error. Please try again later.'})
  }
};

const initial = async (req, res) => {
  const { appId, secretKey, parameters } = req.body;
  const conversionReportArray = await getConversionReport(appId, secretKey, parameters);
  const dashboardData = await processDashboard(conversionReportArray);
  const conversionData = await processConversion(conversionReportArray);
  dashboardData.conversionReport = conversionData;
  res.status(OK).json(dashboardData)
};

const dashboard = async (req, res) => {
  const { appId, secretKey, parameters} = req.body;
  const conversionReportArray = await getConversionReport(appId, secretKey, parameters);
  const dashboardData = await processDashboard(conversionReportArray);
  res.status(OK).json(dashboardData);
};

const conversion = async (req, res) => {
  const { appId, secretKey, parameters} = req.body;
  const conversionReportArray = await getConversionReport(appId, secretKey, parameters);
  const conversionData = await processConversion(conversionReportArray);
  res.status(OK).json(conversionData);
}

export {
  checkApi,
  dashboard,
  conversion,
  initial
};
