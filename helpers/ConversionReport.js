import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";

const getConversionReport = async (appId, secretKey, parameters) => {
    let response;
    let conversionReportArray = [];
    let query = getConversionReportQuery(parameters);
    do{
      if(response?.data?.conversionReport?.pageInfo?.scrollId){
        query = getConversionReportQuery(`${parameters}, scrollId: "${response.data.conversionReport.pageInfo.scrollId}"`)
      }
      response = await ShopeeRequestCLient(appId, secretKey, query);
      if(response?.errors){
        return response;
      }
      if(response?.data?.conversionReport?.nodes){
        conversionReportArray = [ ...conversionReportArray, ...response.data.conversionReport.nodes]
      }
    }while(response?.data?.conversionReport?.pageInfo?.hasNextPage)
    return conversionReportArray;
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
        utmContent
      }
      pageInfo {
        hasNextPage
        scrollId
      }
    }
  }`;
}

export { getConversionReport, getConversionReportQuery };
