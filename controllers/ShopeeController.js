import axios from "axios";
import crypto from 'crypto';
import { OK, ERROR, UNAUTHORIZED } from "../constants/HttpCodes.js"
import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
const checkApi = async (req, res) => {
  try {
    const { appId, secretKey } = req.body;
    const query = `{
          conversionReport(limit:1){ 
            nodes{ 
              grossCommission 
            }
          }
        }`;
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

const conversionReport = async (req, res) => {
  try {
    const { parameters, appId, secretKey } = req.body;
    const query = getConversionReportQuery(parameters);
    const response = await ShopeeRequestCLient(appId, secretKey, query);
    res.status(OK).json(response);
  } catch (error) {
    res.status(OK).json({ data: null })
  }
};

const getConversionReportQuery = (parameters) => {
  return `{
    conversionReport(${parameters}){ 
      nodes{ 
        totalCommission
        totalBrandCommission
        shopeeCommissionCapped
        sellerCommission
        conversionStatus 
      }
    }
  }`;
}
export {
  checkApi,
  conversionReport,
};
