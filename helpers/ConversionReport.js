import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
import { identifyErrorMessage } from "../helpers/ShopeeErrorRequest.js";

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
        conversionReportArray = [ ...conversionReportArray, ...response.data.conversionReport.nodes];
      }
    }while(response?.data?.conversionReport?.pageInfo?.hasNextPage)
    return conversionReportArray;
};

const getConversionReportQuery = (parameters) => {
  return `{
    conversionReport(${parameters}){ 
      nodes{
        totalCommission
        shopeeCommissionCapped
        sellerCommission
        utmContent
        orders{
          orderStatus
          items {
            itemPrice
            qty
          }
        }
      }
      pageInfo {
        hasNextPage
        scrollId
      }
    }
  }`;
};

const processDashboard = async (conversionReportArray) => {
  if(!conversionReportArray.length){
    return { totals: [] };
  }
  if(conversionReportArray.errors){
    const errorObject =  identifyErrorMessage(conversionReportArray.errors[0]);
    return errorObject;
  }
  const uniqueSubIds = [...new Set(conversionReportArray.map(conversionNode => conversionNode.utmContent))];
  const {
    totalCommission,
    totalAmountOrder,
    totalShopeeCommission,
    totalSellerCommission,
    totalUnpaid,
    totalCompleted,
    totalPending,
    totalOrder,
  } = conversionReportArray.reduce((totals, conversionNode) => {
    totals.totalCommission += parseFloat(conversionNode.totalCommission);
    totals.totalShopeeCommission += parseFloat(conversionNode.shopeeCommissionCapped);
    totals.totalSellerCommission += parseFloat(conversionNode.sellerCommission);
  
    if(conversionNode.orders){
      for (const order of conversionNode.orders) {
        totals.totalOrder += order.items.length;
        
        switch (order.orderStatus) {
          case "UNPAID":
            totals.totalUnpaid += parseFloat(conversionNode.totalCommission);
            break;
          case "COMPLETED":
            totals.totalCompleted += parseFloat(conversionNode.totalCommission);
            break;
          case "PENDING":
            totals.totalPending += parseFloat(conversionNode.totalCommission);
            break;
        }

        for (const item of order.items) {
          totals.totalAmountOrder += parseFloat(item.itemPrice) * item.qty;
        }
      }
    }
    return totals;
  }, { totalCommission: 0, totalAmountOrder: 0, totalShopeeCommission: 0, totalSellerCommission: 0, totalUnpaid: 0, totalCompleted: 0, totalPending: 0,  totalOrder: 0});
  const totalCommissionOfSubIds = uniqueSubIds.map((subId) => {
    const total = conversionReportArray.reduce((sum, conversionNode) => {
      if (conversionNode.utmContent === subId) {
        sum += parseFloat(conversionNode.totalCommission);
      }
      return sum;
    }, 0);
    
    return { subId, totalCommission: Math.round(total) };
  });
  totalCommissionOfSubIds.sort((a, b) => b.totalCommission - a.totalCommission);
  const topFiveSubIds = totalCommissionOfSubIds.slice(0, 5).map(subId => {
    return {
      ...subId,
      totalCommission: subId.totalCommission.toLocaleString()
    };
  });
  return { totals: [
          { type: 'amount', id: 1, name: "Total Commission", value: totalCommission.toLocaleString()},
          { type: 'number', id: 2, name: "Total Order", value: totalOrder.toLocaleString()},
          { type: 'amount', id: 3, name: "Total Amount Order", value: totalAmountOrder.toLocaleString()},
          { type: 'amount', id: 4, name: "Shopee Commission", value: totalShopeeCommission.toLocaleString()},
          { type: 'amount', id: 5, name: "Seller Commission", value: totalSellerCommission.toLocaleString()},
          { type: 'amount', id: 6, name: "Unpaid", value: totalUnpaid.toLocaleString()},
          { type: 'amount', id: 7, name: "Completed", value: totalCompleted.toLocaleString()},
          { type: 'amount', id: 8, name: "Pending", value: totalPending.toLocaleString()},
      ], topFiveSubIds: topFiveSubIds, 
  };
};

const processConversion = async (conversionReportArray) => {
  if(conversionReportArray.errors){
    const errorObject =  identifyErrorMessage(conversionReportArray.errors[0]);
    return errorObject;
  }
  const result = [];
  let grandTotal = 0;
  let totalCommission = 0;
  let blankTotalCommission = 0;
  for(const outerNode of conversionReportArray){
    if(outerNode.utmContent === "----"){
      totalCommission += parseFloat(outerNode.totalCommission);
    }
  }
  for(const outerNode of conversionReportArray){
    grandTotal += parseFloat(outerNode.totalCommission);
    const { utmContent } = outerNode;
    if (utmContent !== "----"){
      const formattedUtmContent = utmContent.replace(/-{2,}/g, '');
      const subIds = formattedUtmContent.split('-');
      let currentNode = result;

      for(let subId of subIds){
        totalCommission = 0;
        for(const innerNode of conversionReportArray){
          if(innerNode.utmContent.includes(subId)){
            totalCommission += parseFloat(innerNode.totalCommission);
          }
        }
        let existingNode = currentNode.find(n => n.name === subId);
        if (!existingNode) {
          const newNode = {
            name: subId,
            id:  subId,
            totalCommission: totalCommission,
            children: []
          };
          currentNode.push(newNode);
          currentNode = newNode.children;
        } else {
          currentNode.totalCommission += totalCommission;
          currentNode = existingNode.children;
        }
      }
    }else{
      blankTotalCommission += parseFloat(outerNode.totalCommission);
    }
  }
  const blank = { 
    name: "(blank)",
    id: "(blank)",
    totalCommission: blankTotalCommission
  };
  result.push(blank);
  return  { conversionReport: { conversionReport: result, grandTotal: grandTotal }};
};

export { getConversionReport, getConversionReportQuery, processDashboard, processConversion };
